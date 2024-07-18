import { ethereum, porcini, root } from '@/chains';
import { isRootChain } from '@/utils';
import { ApiPromise, HttpProvider, WsProvider } from '@polkadot/api';
import { getApiOptions } from '@therootnetwork/api';
import '@therootnetwork/api-types';
import { PublicClient, createPublicClient, http } from 'viem';

export const evmClient: PublicClient = createPublicClient({
  chain: isRootChain(Number(process?.env?.CHAIN_ID)) ? root : porcini,
  transport: http(),
});

export const ethereumClient: PublicClient = createPublicClient({
  chain: ethereum,
  transport: http(),
});

let api;

export const substrateClient = async (): Promise<ApiPromise> => {
  if (api) return api;

  const url = process?.env?.RPC_PROVIDER === 'ws' ? process.env?.RPC_WS_URL : process.env?.RPC_HTTP_URL;
  const provider = process?.env?.RPC_PROVIDER === 'ws' ? new WsProvider(url, 1000) : new HttpProvider(url);

  api = await ApiPromise.create({
    ...getApiOptions(),
    provider,
  });

  api.on('connected', () => {
    console.log(`Substrate Client connected.`);
  });

  return api;
};
