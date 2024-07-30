import { Injectable, OnModuleDestroy } from '@nestjs/common';

import { ApiPromise, HttpProvider, WsProvider } from '@polkadot/api';
import { getApiOptions } from '@therootnetwork/api';
import Debug from 'debug';
import { noop } from 'lodash';

import { Chain, HttpTransport, PublicClient, createPublicClient, http } from 'viem';
import { porcini, root } from './chains';
const debug = Debug('rootscan:substrate.service.ts');
export function isRootChain(chainId: number) {
  return [7668, 17668].includes(Number(chainId));
}

@Injectable()
export class SubstrateService implements OnModuleDestroy {
  #api?: ApiPromise = undefined;
  #evmClient?: PublicClient<HttpTransport> = undefined;

  async init(): Promise<ApiPromise> {
    if (this.#api) {
      return this.#api;
    }

    const url = process?.env?.['RPC_PROVIDER'] === 'ws' ? process.env?.['RPC_WS_URL'] : process.env?.['RPC_HTTP_URL'];
    const provider = process?.env?.['RPC_PROVIDER'] === 'ws' ? new WsProvider(url, 1000) : new HttpProvider(url);

    debug('connect to %s', url);
    this.#api = await ApiPromise.create({
      ...getApiOptions(),
      provider,
    });

    this.#api.on('connected', () => {
      debug(`Substrate Client connected.`);
    });

    return this.#api;
  }

  get api(): ApiPromise {
    if (!this.#api) {
      throw new Error('App not initialized, please run init()');
    }
    return this.#api;
  }

  async onModuleDestroy(): Promise<void> {
    await this.#api?.disconnect().catch(noop);
  }

  get evmClient(): PublicClient<HttpTransport> {
    if (!this.#evmClient) {
      this.#evmClient = createPublicClient({
        chain: isRootChain(Number(process?.env?.['CHAIN_ID'])) ? root : porcini,
        transport: http(),
      }) as unknown as PublicClient<HttpTransport>;
    }
    return this.#evmClient;

    // export const ethereumClient: PublicClient = createPublicClient({
    //   chain: ethereum,
    //   transport: http(),
    // });

    // let api;
  }
}
