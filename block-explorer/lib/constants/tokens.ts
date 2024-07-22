import { IToken } from '@/types/models';

export const XRP_TOKEN: IToken = {
  contractAddress: '0xCCCCcCCc00000002000000000000000000000000',
  assetId: 2,
  decimals: 6,
  name: 'XRP',
  symbol: 'XRP',
};

export const ROOT_TOKEN: IToken = {
  contractAddress: '0xcCcCCccC00000001000000000000000000000000',
  assetId: 1,
  decimals: 6,
  name: 'Root',
  symbol: 'ROOT',
};

export const ETH_TOKEN: IToken = {
  contractAddress: '0xccCcCccC00000464000000000000000000000000',
  assetId: 1124,
  decimals: 18,
  name: 'ETH',
  symbol: 'ETH',
};
