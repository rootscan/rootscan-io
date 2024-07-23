import ABIs from '@/constants/abi';
import { ethereumClient } from '@/rpc';
import { Address, PublicClient, getAddress } from 'viem';

interface TokenMetadata {
  image: string;
  animation_url?: string;
  tokenId: number | string;
  description?: string;
  name: string;
  image_png?: string;
  attributes: { value: string; trait_type: string }[];
}

export class NftTokenData {
  constructor(private client: PublicClient) {}

  async getTokenMetadata(
    type: 'ERC721' | 'ERC1155',
    contractAddress: Address,
    tokenId: number | string,
  ): Promise<TokenMetadata | undefined> {
    const uri = await this.getTokenMetadataUrl(type, contractAddress, tokenId);
    console.log('uri', uri);

    let res;
    try {
      res = await fetch(uri, { signal: AbortSignal.timeout(5000) });
    } catch {
      // noop
    }
    if (res?.ok) {
      let jsonData: TokenMetadata | undefined = undefined;
      try {
        jsonData = await res.json();
      } catch {
        // noop
      }
      return jsonData;
    }
  }

  async getTokenMetadataUrl(
    type: 'ERC721' | 'ERC1155',
    contractAddress: Address,
    tokenId: number | string,
  ): Promise<string> {
    let data;
    if (type === 'ERC721') {
      data = (await this.client.readContract({
        address: contractAddress as Address,
        abi: ABIs.ERC721_ABI,
        functionName: 'tokenURI',
        args: [tokenId],
      })) as string;
      if (data?.startsWith('ethereum://')) {
        // get ethereum address from url string
        const parts = data.split(/[:/]/).filter((part) => part !== '');
        const ethereumContractAddress = getAddress(parts[1]);
        data = (await ethereumClient.readContract({
          address: ethereumContractAddress as Address,
          abi: ABIs.ERC721_ABI,
          functionName: 'tokenURI',
          args: [tokenId],
        })) as string;
      }
      return data;
    } else if (type === 'ERC1155') {
      data = (await this.client.readContract({
        address: contractAddress as Address,
        abi: ABIs.ERC1155_ABI,
        functionName: 'uri',
        args: [tokenId],
      })) as string;
    }
    if (!data) {
      throw new Error('Unable to determine uri for contract');
    }
    return data;
  }
}
