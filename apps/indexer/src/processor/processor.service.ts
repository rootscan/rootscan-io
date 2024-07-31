import { Injectable } from '@nestjs/common';
import { SubstrateService } from '@rootscan/substrate';
import { BlockHash, EventRecord } from '@polkadot/types/interfaces';
import { Hash } from 'viem';
import { BlockResponse, IEvent, RuntimeVersion } from './types';
import { extraArgsFromEvent } from './utils';
import { parseExtrinsic } from './parsers';
import { assetIdToERC20Address, collectionIdToERC1155Address, collectionIdToERC721Address } from '@therootnetwork/evm';

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

  async getBlockData(blockNumber: number): Promise<BlockResponse> {
    await this.init();
    const blockHash = await this.getBlockHash(blockNumber);

    const [evmBlock, substrateBlock, { events, spec, timestamp }] = await Promise.all([
      this.substrateService.evmClient.getBlock({
        blockNumber: BigInt(blockNumber),
      }),
      this.substrateService.api.rpc.chain.getBlock(blockHash),
      this.getBlockHistoryAtInfo(blockHash, blockNumber),
    ]);

    const block = {
      ...evmBlock,
      number: Number(evmBlock.number),
      // timestamp: Number(evmBlock.timestamp),
      spec,
      timestamp,
    };

    return {
      block,
      header: substrateBlock.block.header.toJSON(),
      extrinsics: await Promise.all(
        substrateBlock.block.extrinsics?.map((extrinsic, index) => {
          const extrinsicEvents = events.filter((e) => e.extrinsicId === `${blockNumber}-${index}`);
          return parseExtrinsic(extrinsic, index, block, extrinsicEvents, this.substrateService.api);
        }),
      ),
    } as undefined as BlockResponse;
  }

  async getBlockHistoryAtInfo(
    blockHash: Hash,
    blockNumber_?: number,
  ): Promise<{ events: IEvent[]; timestamp: number; spec: string }> {
    await this.init();

    const at = await this.substrateService.api.at(blockHash);
    const [chainEvents, runtimeVersion, timestamp, blockNumber] = await Promise.all([
      at.query.system.events() as Promise<unknown> as Promise<EventRecord[]>,
      at.query.system.lastRuntimeUpgrade(),
      at.query.timestamp.now().then(Number),
      blockNumber_ || at.query.system.number().then(Number),
    ]);
    const version = runtimeVersion.toHuman() as RuntimeVersion;

    const events: IEvent[] = [];
    let eventIndex = 0;
    for (const record of chainEvents) {
      const { event, phase } = record;

      const extrinsicId = phase?.isApplyExtrinsic ? `${blockNumber}-${phase?.asApplyExtrinsic}` : undefined;

      const { method, section, meta } = event;

      const args = extraArgsFromEvent(event, this.substrateService.api) || {};

      if (this.substrateService.api.events.system.ExtrinsicFailed.is(event)) {
        // extract the data for this event
        const [dispatchError, _dispatchInfo] = event.data as any;
        if (dispatchError?.isModule) {
          const decoded = this.substrateService.api.registry.findMetaError(dispatchError.asModule);
          args.errorInfo = `${decoded.section}.${decoded.name}`;
        } else {
          args.errorInfo = dispatchError?.toString();
        }
      }

      if (section === 'nft' && method === 'CollectionCreate') {
        args.collectionAddress = collectionIdToERC721Address(args?.collectionUuid);
      } else if (section === 'sft' && method === 'CollectionCreate') {
        args.collectionAddress = collectionIdToERC721Address(args?.collectionId);
      } else if (section === 'assets' && method === 'ForceCreated') {
        args.assetAddress = assetIdToERC20Address(args?.assetId);
      } else if (section === 'assets' && method === 'MetadataSet') {
        args.assetAddress = assetIdToERC20Address(args?.assetId);
      } else if (section === 'sft' && method === 'BaseUriSet') {
        args.collectionAddress = collectionIdToERC1155Address(args?.collectionId);
      } else if (section === 'sft' && method === 'TokenCreate' && args?.tokenId?.[0]) {
        args.collectionAddress = collectionIdToERC1155Address(args?.tokenId?.[0]);
      } else if (section === 'nft' && method === 'BaseUriSet') {
        args.collectionAddress = await collectionIdToERC721Address(args?.collectionId);
      }

      const parsedEvent: IEvent = {
        hash: event.hash.toString() as Hash,
        eventId: `${blockNumber}-${eventIndex}`,
        extrinsicId,
        blockNumber: blockNumber,
        // timestamp: block?.timestamp,
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
