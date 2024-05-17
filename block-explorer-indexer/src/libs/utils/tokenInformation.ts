import ABIs from '@/constants/abi';
import DB from '@/database';
import logger from '@/logger';
import { ethereumClient, evmClient, substrateClient } from '@/rpc';
import { IToken, TTokenType } from '@/types';
import { Abi, Address, formatUnits, getAddress, zeroAddress } from 'viem';

import { contractAddressToNativeId } from '.';

export const getTokenDetails = async (
  contractAddressRaw: Address,
  forceRefresh = false,
): Promise<Omit<IToken, 'contractAddress'> | null> => {
  const contractAddress = getAddress(contractAddressRaw);
  const tokenLookUp: IToken | null = await DB.Token.findOne({ contractAddress })
    .select('name symbol decimals type uri ethereumContractAddress')
    .lean();

  if (!forceRefresh) {
    if (tokenLookUp?.type && tokenLookUp?.name) {
      return tokenLookUp;
    }
  }

  if (forceRefresh || !tokenLookUp || !tokenLookUp?.type || !tokenLookUp?.name) {
    const erc20Contract = { address: contractAddress, abi: ABIs.ERC20_ORIGINAL as Abi };
    const erc721Contract = { address: contractAddress, abi: ABIs.ERC721_ORIGINAL as Abi };
    const erc1155Contract = { address: contractAddress, abi: ABIs.ERC1155_ORIGINAL as Abi };
    const multicall: any[] = await evmClient.multicall({
      contracts: [
        {
          ...erc20Contract,
          functionName: 'name',
        },
        {
          ...erc20Contract,
          functionName: 'symbol',
        },
        {
          ...erc20Contract,
          functionName: 'decimals',
        },
        {
          ...erc721Contract,
          functionName: 'tokenURI',
          args: [0],
        },
        {
          ...erc1155Contract,
          functionName: 'balanceOfBatch',
          args: [[zeroAddress], [0]],
        },
        {
          ...erc20Contract,
          functionName: 'totalSupply',
        },
      ],
      allowFailure: true,
    });

    const parseMulticallResult = (index: number) => {
      if (multicall[index]?.status === 'success') {
        return multicall[index].result;
      } else {
        return undefined;
      }
    };

    let tokenType: TTokenType | undefined = undefined;
    const name: string = parseMulticallResult(0);
    const symbol: string = parseMulticallResult(1);
    const decimals: number | undefined = parseMulticallResult(2);
    let tokenURI: string | undefined = parseMulticallResult(3);
    if (!tokenURI && multicall[3].error?.shortMessage?.includes('ERC721')) {
      tokenURI = 'ERC721';
    }
    let balanceOfBatch: number | undefined = parseMulticallResult(4);
    if (balanceOfBatch === undefined && multicall[4].error?.shortMessage?.includes('ERC1155')) {
      balanceOfBatch = 0;
    }
    let totalSupply: bigint | undefined = parseMulticallResult(5);
    const nativeId = contractAddressToNativeId(contractAddress);

    // Get real total supply from Ethereum if is bridged-collection
    if (tokenLookUp?.symbol === 'bridged-collection' && tokenLookUp?.type === 'ERC721') {
      if (!tokenLookUp?.ethereumContractAddress) {
        throw Error(`Ethereum contract not provided for contract address: ${contractAddress}`);
      }
      const totalSupplyRes = (await ethereumClient.readContract({
        address: tokenLookUp?.ethereumContractAddress as Address,
        abi: ABIs.ERC721_ORIGINAL,
        functionName: 'totalSupply',
      })) as string;

      if (totalSupplyRes) {
        totalSupply = BigInt(totalSupplyRes);
      }
    }

    const api = await substrateClient();

    const lowerCaseContractAddress = contractAddress?.toLowerCase();
    let palletData: any = undefined;

    // Assets Pallet
    if (lowerCaseContractAddress?.startsWith('0xcccccccc')) {
      try {
        palletData = (await api.query.assets.metadata(nativeId)).toHuman();
      } catch {
        /*eslint no-empty: "error"*/
      }
    }
    // NFT Pallet
    if (lowerCaseContractAddress?.startsWith('0xaaaaaaaa')) {
      try {
        palletData = (await api.query.nft.collectionInfo(nativeId)).toHuman();
      } catch {
        /*eslint no-empty: "error"*/
      }
    }
    // SFT Pallet
    if (lowerCaseContractAddress?.startsWith('0xbbbbbbbb')) {
      try {
        palletData = (await api.query.sft.sftCollectionInfo(nativeId)).toHuman();
      } catch {
        /*eslint no-empty: "error"*/
      }
    }

    if (decimals || palletData?.decimals) {
      tokenType = 'ERC20';
    }

    if (!tokenType) {
      if (tokenURI != undefined) {
        tokenType = 'ERC721';
      } else if (balanceOfBatch !== undefined) {
        tokenType = 'ERC1155';
      }
    }

    if (!tokenType) {
      return null;
    }

    const resolvedData: Omit<IToken, 'contractAddress'> = {
      name: palletData?.name ? palletData?.name : name,
      symbol: palletData?.symbol ? palletData?.symbol : symbol,
      type: tokenType,
    };

    if ((decimals || palletData?.decimals) && tokenType === 'ERC20') {
      resolvedData.decimals = palletData?.decimals ? Number(palletData?.decimals) : Number(decimals);
      if (nativeId) {
        resolvedData.assetId = Number(nativeId);
      }
    }

    if (tokenURI && tokenType === 'ERC721') {
      resolvedData.uri = tokenURI.substring(0, tokenURI.length - 1);
      if (nativeId) {
        resolvedData.collectionId = nativeId;
      }
    }

    if (tokenType === 'ERC1155') {
      if (nativeId) {
        resolvedData.collectionId = nativeId;

        const sftMetadata = await api.query.sft.sftCollectionInfo(Number(nativeId));

        if (sftMetadata) {
          const data = sftMetadata.value.toPrimitive();
          // Resolve Name
          if (data?.collectionName) {
            resolvedData.name = String(data?.collectionName);
          }
          // Resolve URI
          if (data?.metadataScheme) {
            resolvedData.uri = String(data?.metadataScheme);
          }
          // Resolve totalSupply
          if (data?.nextSerialNumber) {
            resolvedData.totalSupply = Number(data?.nextSerialNumber);
          }
        }
      }
    }

    if (totalSupply) {
      resolvedData.totalSupply = Number(totalSupply);
      if (tokenType === 'ERC20' && resolvedData?.decimals) {
        resolvedData.totalSupplyFormatted = Number(formatUnits(totalSupply, resolvedData.decimals));
      }
    }

    if (resolvedData?.name === undefined) return null;

    await DB.Token.updateOne(
      { contractAddress },
      {
        $set: {
          ...resolvedData,
          contractAddress,
          type: tokenType,
        },
      },
      {
        upsert: true,
      },
    );

    await DB.Address.updateOne(
      { address: contractAddress },
      {
        $set: {
          address: contractAddress,
          isContract: true,
        },
      },
      {
        upsert: true,
      },
    );

    logger.info(
      `Detected [${resolvedData?.type}] => NativeID: ${nativeId} | name: ${resolvedData?.name} | symbol: ${resolvedData?.symbol}`,
    );

    return resolvedData;
  }

  return null;
};
