import { Injectable } from '@nestjs/common';
import { SubstrateService } from '@rootscan/substrate';
import { BlockHash, Extrinsic, EventRecord } from '@polkadot/types/interfaces';
import { Hash } from 'viem';
import { CodecClass } from '@polkadot/types/types';
import { IEvent, RuntimeVersion } from './types';
import { extraArgsFromEvent } from './utils';
import { ApiPromise } from '@polkadot/api';

@Injectable()
export class ProcessorService {
  constructor(private readonly substrateService: SubstrateService) {}

  async init(): Promise<void> {
    await this.substrateService.init();
  }

  async getBlockHash(blockNumber: number): Promise<Hash> {
    await this.init();
    const blockHash: BlockHash = await this.substrateService.api.rpc.chain.getBlockHash(blockNumber);
    return blockHash.toString() as Hash;
  }

  async processBlock(blockNumber: number): Promise<void> {
    await this.init();
    const blockHash = await this.getBlockHash(blockNumber);

    const [block, substrateBlock] = await Promise.all([
      this.substrateService.evmClient.getBlock({
        blockNumber: BigInt(blockNumber),
      }),
      this.substrateService.api.rpc.chain.getBlock(blockHash),
    ]);
    console.log(block, substrateBlock.toJSON());
    const blockExtrinsics = substrateBlock?.block?.extrinsics;
  }

  async getBlockHistoryAtInfo(blockHash: Hash): Promise<{ events: IEvent[]; timestamp: number; spec: string }> {
    await this.init();

    const at = await this.substrateService.api.at(blockHash);
    const [chainEvents, runtimeVersion, timestamp, blockNumber] = await Promise.all([
      at.query.system.events() as Promise<unknown> as Promise<EventRecord[]>,
      at.query.system.lastRuntimeUpgrade(),
      at.query.timestamp.now().then(Number),
      at.query.system.number().then(Number),
    ]);
    const version = runtimeVersion.toHuman() as RuntimeVersion;

    const events: IEvent[] = [];
    let eventIndex = 0;
    for (const record of chainEvents) {
      // extract the phase, event and the event types
      const { event, phase } = record;
      /** Determine the extrinsicId */
      let extrinsicId: string = undefined;
      let extrinsicIndex: number = 999;
      if (phase?.isApplyExtrinsic && phase?.asApplyExtrinsic) {
        extrinsicIndex = Number(phase?.asApplyExtrinsic);
        extrinsicId = `${blockNumber}-${phase?.asApplyExtrinsic}`;
      }

      const { method, section, meta } = event;

      const args = extraArgsFromEvent(event, this.substrateService.api);

      const parsedEvent: IEvent = {
        hash: event.hash.toString() as Hash,
        eventId: `${blockNumber}-${eventIndex}`,
        extrinsicId,
        blockNumber: Number(blockNumber),
        // timestamp: Number(block?.timestamp), TODO
        method,
        section,
        doc: meta?.docs?.[0]?.toString() || undefined,
        args,
      };
      events.push(parsedEvent);
      eventIndex++;
    }
    return {
      events,
      timestamp,
      spec: `${version.specName}/${version.specVersion}`,
    };
  }
}
