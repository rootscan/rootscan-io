import fs from 'node:fs/promises';
import { Address, getAddress } from 'viem';

let localCache: any = {};

export const getTokenMetadata = async (contractAddress: Address, tokenId: number, network: 'root' | 'porcini') => {
  if (!localCache[getAddress(contractAddress)]) {
    const fileDir = `./src/libs/token-data/blockchains/${network}/${getAddress(contractAddress)}.json`;
    const readData = await fs.readFile(fileDir, 'utf-8').catch(() => {
      return null;
    });

    if (!readData) {
      return {};
    }
    localCache[getAddress(contractAddress)] = JSON.parse(readData);
  }

  const metadata = localCache[getAddress(contractAddress)]?.find((a) => Number(a?.tokenId) === Number(tokenId));

  return metadata || {};
};
