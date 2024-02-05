import ABIs from '@/constants/abi';
import logger from '@/logger';
import { IBulkWriteDeleteOp, IBulkWriteUpdateOp, INFT, IToken } from '@/types';
import { contractAddressToNativeId, isValidHttpUrl } from '@/utils';
import queue from '@/workerpool';
import { ApiPromise } from '@polkadot/api';
import { Models } from 'mongoose';
import { Abi, Address, MulticallResults, PublicClient, getAddress, isAddress } from 'viem';
export default class NftIndexer {
  client: PublicClient;
  api: ApiPromise;
  DB: Models;

  constructor(client: PublicClient, api: ApiPromise, DB: Models) {
    if (!client) throw new Error('EVM Client parameter missing');
    this.client = client;
    if (!api) throw new Error('API parameter missing');
    this.api = api;
    if (!DB) throw new Error('Database models parameter missing');
    this.DB = DB;
  }

  async fetchHoldersOfCollection(contractAddress: Address) {
    const collection: IToken | null = await this.DB.Token.findOne({
      contractAddress: getAddress(contractAddress),
      type: { $in: ['ERC721', 'ERC1155'] },
      totalSupply: { $gt: 0 }
    }).lean();

    logger.info(`Refreshing holders for ${collection?.name || '-'} ${contractAddress} [Total Supply: ${collection?.totalSupply}]`);

    if (!collection) throw new Error('Collection does not exist.');

    if (collection?.type === 'ERC1155') {
      const nativeId = contractAddressToNativeId(contractAddress);
      const addresses = new Set();
      const totalSupply = Number(collection?.totalSupply);

      // We only have to check the SFT pallet is there is a nativeId for this collection
      if (nativeId) {
        const sftEvents = await this.DB.Event.find({
          $or: [
            { section: 'sft', method: 'Transfer', 'args.collectionId': nativeId },
            { section: 'sft', method: 'Mint', 'args.collectionId': nativeId },
            { section: 'sft', method: 'CollectionCreate', 'args.collectionId': nativeId },
            { section: 'sft', method: 'TokenCreate', 'args.tokenId[0]': nativeId }
          ]
        })
          .select('args')
          .lean();

        for (const event of sftEvents) {
          const address = event?.args?.owner || event?.args?.tokenOwner || event?.args?.newOwner || event?.args?.collectionOwner;
          if (isAddress(address)) {
            addresses.add(getAddress(address));
          }
        }
      }

      const evmEvents = await this.DB.EvmTransaction.find({
        $or: [
          { 'events.eventName': 'Transfer', 'events.type': 'ERC1155', 'events.address': getAddress(contractAddress) },
          { 'events.eventName': 'TransferSingle', 'events.type': 'ERC1155', 'events.address': getAddress(contractAddress) },
          { 'events.eventName': 'TransferBatch', 'events.type': 'ERC1155', 'events.address': getAddress(contractAddress) }
        ]
      })
        .select('events')
        .lean();

      for (const evmEvent of evmEvents) {
        const event = evmEvent?.events?.find((a) => ['Transfer', 'TransferSingle', 'TransferBatch'].includes(a.eventName));
        if (event?.from) {
          addresses.add(getAddress(event.from));
        }
        if (event?.to) {
          addresses.add(getAddress(event.to));
        }
        if (event?.operator) {
          addresses.add(getAddress(event.operator));
        }
      }

      // Create multicall calls
      const q = Array(totalSupply)
        .fill('x')
        .map((x, _) => _);
      const calls: { address: Address; abi: Abi; functionName: string; args: [Address[], number[]] }[] = [];
      const addressesArray = Array.from(addresses);
      for (const address of addressesArray) {
        const a = Array(totalSupply).fill(address);
        calls.push({
          address: getAddress(contractAddress),
          abi: ABIs.ERC1155_ORIGINAL as Abi,
          functionName: 'balanceOfBatch',
          args: [a, q]
        });
      }

      const multicall: MulticallResults = await this.client.multicall({
        contracts: calls,
        allowFailure: true
      });

      const ops: (IBulkWriteUpdateOp | IBulkWriteDeleteOp)[] = [];
      const currentBalances = await this.DB.Nft.find({ contractAddress: getAddress(contractAddress) }).lean();
      let index = 0;
      for (const result of multicall) {
        if (result?.status === 'success') {
          const address = addressesArray[index] as Address;
          if (!isAddress(address)) continue;
          const data = result?.result as bigint[];
          let tokenId = 0;
          for (const quantity of data) {
            if (Number(quantity) > 0) {
              ops.push({
                updateOne: {
                  filter: {
                    tokenId: Number(tokenId),
                    contractAddress: getAddress(contractAddress),
                    owner: getAddress(address)
                  },
                  update: {
                    $set: {
                      tokenId: Number(tokenId),
                      contractAddress: getAddress(contractAddress),
                      owner: getAddress(address),
                      amount: Number(quantity)
                    }
                  },
                  upsert: true
                }
              });
            } else if (Number(quantity) === 0) {
              const hadBalance = currentBalances.find((a) => getAddress(a?.owner) === getAddress(address));
              if (hadBalance) {
                ops.push({
                  deleteOne: {
                    filter: {
                      contractAddress: getAddress(contractAddress),
                      tokenId: Number(tokenId),
                      owner: getAddress(address)
                    }
                  }
                });
              }
            }
            tokenId++;
          }
        }
        index++;
      }

      await this.DB.Nft.bulkWrite(ops);

      for (let i = 0; i < totalSupply; i++) {
        await queue.add(
          'FIND_NFT_METADATA',
          {
            contractAddress: getAddress(contractAddress),
            tokenId: Number(i)
          },
          {
            priority: 7,
            jobId: `FIND_NFT_METADATA_${contractAddress}_${i}`
          }
        );
      }
    }
    if (collection?.type === 'ERC721') {
      let lookUpMetadata = false;
      const amount = await this.DB.Nft.find({ contractAddress: getAddress(contractAddress) })
        .limit(1)
        .countDocuments();
      if (amount === 0) {
        lookUpMetadata = true;
      }

      let current = 0;
      const end = Number(collection?.totalSupply);
      const maxBatch = 1000;

      while (current < end) {
        const currentEnd = current + maxBatch >= end ? end : current + maxBatch;
        console.log(`${collection?.contractAddress} [BatchSize: ${maxBatch}] => FROM: ${current} -> ${currentEnd}`);
        const calls: { address: Address; abi: Abi; functionName: string; args: number[] }[] = [];
        for (let i = current; i < currentEnd; i++) {
          calls.push({
            address: getAddress(contractAddress),
            abi: ABIs.ERC721_ORIGINAL as Abi,
            functionName: 'ownerOf',
            args: [i]
          });
        }

        const multicall: MulticallResults = await this.client.multicall({
          contracts: calls,
          allowFailure: true
        });

        const ops: IBulkWriteUpdateOp[] = [];
        let tokenId = current;
        for (const result of multicall) {
          if (result?.status === 'success') {
            if (isAddress(result?.result as string)) {
              const owner: Address = getAddress(result?.result as string);
              ops.push({
                updateOne: {
                  filter: {
                    tokenId: Number(tokenId),
                    contractAddress: getAddress(contractAddress)
                  },
                  update: {
                    $set: {
                      contractAddress: getAddress(contractAddress),
                      tokenId: Number(tokenId),
                      owner
                    }
                  },
                  upsert: true
                }
              });
            }
            /** Create task to lookup the metadata of this NFT */
            if (lookUpMetadata) {
              logger.info(`Creating FIND_NFT_METADATA task for ${contractAddress}/${tokenId}`);
              await queue.add(
                'FIND_NFT_METADATA',
                {
                  contractAddress: getAddress(contractAddress),
                  tokenId: Number(tokenId)
                },
                {
                  priority: 7,
                  jobId: `FIND_NFT_METADATA_${contractAddress}_${tokenId}`
                }
              );
            }
          }
          tokenId++;
        }

        await this.DB.Nft.bulkWrite(ops);
        current = currentEnd;
      }
    }

    return true;
  }

  async fetchMetadataOfToken(contractAddress: Address, tokenId: number) {
    logger.info(`Looking up metadata for ${contractAddress} tokenId: ${tokenId}`);
    const lookUpUri: IToken | null = await this.DB.Token.findOne({ contractAddress: getAddress(contractAddress) }).lean();
    if (lookUpUri?.uri && isValidHttpUrl(lookUpUri?.uri)) {
      const metadataUri = `${lookUpUri.uri}${tokenId}`;
      const res = await fetch(metadataUri);
      if (res?.ok) {
        let jsonData: INFT | undefined = undefined;
        try {
          jsonData = await res.json();
        } catch {
          /* eslint no-empty: "error" */
        }
        if (!jsonData) return true;
        const animation_url = jsonData?.animation_url;
        const image = jsonData?.image;

        if (!animation_url || !image) return true;

        await this.DB.Nft.updateMany(
          { contractAddress: getAddress(contractAddress), tokenId: Number(tokenId) },
          {
            $set: {
              contractAddress: getAddress(contractAddress),
              tokenId: Number(tokenId),
              animation_url,
              image
            }
          },
          {
            upsert: true
          }
        );
      } else if (res?.status === 429 || res?.status === 500) {
        throw new Error(`Request got rate limited or failed on server end with response => ${res?.status}, should true again.`);
      } else {
        logger.warn(`Failed to fetch metadata with code ${res?.status}, no need to retry.`);
      }
    }
    return true;
  }

  async createNftHolderRefreshTasks() {
    logger.info(`Creating Nft Holder refresh tasks`);
    const collections = await this.DB.Token.find({ type: { $in: ['ERC721', 'ERC1155'] } }).distinct('contractAddress');
    for (const contractAddress of collections) {
      logger.info(`Creating REFETCH_NFT_HOLDERS task for ${contractAddress}`);
      await queue.add(
        'REFETCH_NFT_HOLDERS',
        {
          contractAddress: getAddress(contractAddress)
        },
        {
          priority: 6,
          jobId: `REFETCH_NFT_HOLDERS_${contractAddress}`
        }
      );
    }
  }
}
