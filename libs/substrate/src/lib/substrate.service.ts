import { Injectable, OnApplicationShutdown } from '@nestjs/common';

import { ApiPromise, HttpProvider, WsProvider } from '@polkadot/api';
import { getApiOptions } from '@therootnetwork/api';

@Injectable()
export class SubstrateService implements OnApplicationShutdown {
  private api?: ApiPromise = undefined;

  async init(): Promise<ApiPromise> {
    if (this.api) {
      return this.api;
    }

    const url = process?.env?.['RPC_PROVIDER'] === 'ws' ? process.env?.['RPC_WS_URL'] : process.env?.['RPC_HTTP_URL'];
    const provider = process?.env?.['RPC_PROVIDER'] === 'ws' ? new WsProvider(url, 1000) : new HttpProvider(url);

    this.api = await ApiPromise.create({
      ...getApiOptions(),

      provider,
    });

    this.api.on('connected', () => {
      console.log(`Substrate Client connected.`);
    });

    return this.api;
  }

  // See at https://github.com/liaoliaots/nestjs-redis/blob/fc697638af9ecf80ad2992a923047c626f2bf95b/packages/redis/lib/redis/common/redis.utils.ts#L50
  async onApplicationShutdown(): Promise<void> {
    console.log('!');
    // debug('RedisService() destroy, status: %s', this.status);
    // if (this.status === 'end') {
    //   return;
    // }
    // if (this.status === 'ready') {
    //   await this.quit();
    //   return;
    // }
    // this.disconnect(false);
  }
}
