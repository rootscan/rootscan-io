import ABIs from '@/constants/abi';
import { ethereumClient } from '@/rpc';
import { INftOwner, TNftTokenType } from '@/types';
import { noop } from 'lodash';
import pLimit from 'p-limit';
import { Address, PublicClient, getAddress } from 'viem';

const limiter = pLimit(100);
const skipDomains = ['example.com', 'localhost', '{}'];
const skipDomainsRegex = new RegExp(skipDomains.map((domain) => `(${domain})`).join('|'), 'i');

interface TokenMetadata {
  image: string;
  animation_url?: string;
  tokenId: number | string;
  description?: string;
  name: string;
  image_png?: string;
  attributes: { value: string; trait_type: string }[];
}

interface NftTokenParams {
  type: TNftTokenType;
  contractAddress: string;
  tokenId: number | string;
}

export class NftTokenData {
  constructor(private client: PublicClient) {}

  async getTokenMetadata(
    type: TNftTokenType,
    contractAddress: string,
    tokenId: number | string,
  ): Promise<TokenMetadata | undefined> {
    const uri = await this.#getTokenMetadataUrl(type, contractAddress, tokenId);
    if (!uri) {
      return;
    }
    let res;
    try {
      res = await fetch(uri, { signal: AbortSignal.timeout(5000) });
    } catch (e) {
      // noop
    }
    if (uri && !res) {
      console.log('BROKEN URL:', uri);
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

  async getBulkTokenMetadata(items: NftTokenParams[]): Promise<Array<TokenMetadata | undefined>> {
    const promises = await Promise.all(
      items.map((item) => {
        return limiter(() => this.getTokenMetadata(item.type, item.contractAddress, item.tokenId));
      }),
    );
    return promises;
  }

  async #getTokenMetadataUrl(
    type: TNftTokenType,
    contractAddress: string,
    tokenId: number | string,
  ): Promise<string | undefined> {
    let data;
    if (type === 'ERC721') {
      data = await this.client.readContract({
        address: contractAddress as Address,
        abi: ABIs.ERC721_ABI,
        functionName: 'tokenURI',
        args: [tokenId],
      });
      if (data?.startsWith('ethereum://')) {
        // get ethereum address from url string
        const parts = data.split(/[:/]/).filter((part) => part !== '');
        const ethereumContractAddress = getAddress(parts[1]?.slice(0, 42));
        data = await ethereumClient
          .readContract({
            address: ethereumContractAddress as Address,
            abi: ABIs.ERC721_ABI,
            functionName: 'tokenURI',
            args: [tokenId],
          })
          .catch(noop);
      }
    } else if (type === 'ERC1155') {
      data = await this.client.readContract({
        address: contractAddress as Address,
        abi: ABIs.ERC1155_ABI,
        functionName: 'uri',
        args: [tokenId],
      });
    }
    return prepareUrl(data);
  }

  async fillNftsMetadata(nfts: INftOwner[]) {
    const metadatas = await this.getBulkTokenMetadata(nfts);
    nfts.forEach((nft, index) => {
      nft.attributes = metadatas[index]?.attributes;
      nft.image = prepareUrl(metadatas[index]?.image);
      nft.animation_url = prepareUrl(metadatas[index]?.animation_url);
      nft._metadataProcessed = nft.image ? true : undefined;
    });
  }
}

function prepareUrl(link: string | undefined): string | undefined {
  if (!link) {
    return;
  }
  link = link.trim();

  if (link.toLowerCase().startsWith('ipfs://')) {
    // See https://docs.ipfs.tech/quickstart/retrieve/#fetching-the-cid-with-an-ipfs-gateway
    return link.replace(/^ipfs:\/\//i, 'https://ipfs.io/ipfs/');
  }
  if (!link.includes('://')) {
    return `https://${link}`;
  }
  if (skipDomainsRegex.test(link)) {
    return;
  }
  return link;
}
