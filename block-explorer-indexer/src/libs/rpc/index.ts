import { ethereum, porcini, root } from '@/chains';
import { ApiPromise, WsProvider } from '@polkadot/api';
import { getApiOptions } from '@therootnetwork/api';
import '@therootnetwork/api-types';
import { PublicClient, createPublicClient, http } from 'viem';

export const evmClient: PublicClient = createPublicClient({
  chain: process?.env?.CHAIN_ID === '7668' ? root : porcini,
  transport: http(),
});

export const ethereumClient: PublicClient = createPublicClient({
  chain: ethereum,
  transport: http(),
});

let api;

export const substrateClient = async (): Promise<ApiPromise> => {
  if (api) return api;

  const url = process?.env?.RPC_WS_URL;
  api = await ApiPromise.create({
    ...getApiOptions(),
    provider: new WsProvider(url, 1000),
  });

  api.on('connected', () => {
    console.log(`Substrate Client connected.`);
  });

  return api;
};
