import { LRUCache } from 'lru-cache';
import fs from 'node:fs/promises';
import path from 'node:path';
import { Address, getAddress } from 'viem';

interface NftTokenMetadata {
  name: string;
  image: string;
  animation_url: string;
  attributes: Record<string, string>[];
  tokenId: number;
}

const cache = new LRUCache<string, NftTokenMetadata[]>({
  ttl: 1000 * 60 * 5,
  ttlAutopurge: true,
});

export const getTokenMetadata = async (
  contractAddress: Address,
  tokenId: number | string,
  network: 'root' | 'porcini',
): Promise<NftTokenMetadata> => {
  const key = getAddress(contractAddress);

  if (!cache.has(key)) {
    const fileDir = path.resolve(__dirname, `blockchains`, network, `${getAddress(contractAddress)}.json`);
    const readData = await fs.readFile(fileDir, 'utf-8').catch((e) => {
      return null;
    });

    if (!readData) {
      // to avoid multiple disk access, when file not found
      cache.set(key, []);
      return {} as NftTokenMetadata;
    }
    cache.set(key, JSON.parse(readData));
  }

  const metadata = cache.get(key)?.find((a) => a?.tokenId == tokenId);

  return metadata || ({} as NftTokenMetadata);
};
