import logger from '@/logger';
import { IBulkWriteDeleteOp, IBulkWriteUpdateOp, INftOwner } from '@/types';
import { Job } from 'bullmq';
import { chunk } from 'lodash';
import moment from 'moment';
import { Models } from 'mongoose';
import { Hash, PublicClient } from 'viem';

import { NftTokenData } from './nft-token-data';
import { C_EVENT_PARSERS, C_EVM_TRANSACTIONS_EVENT_PARSERS } from './parsers';

const C_CHUNK_SIZE = 5000;
export class NftOwnersIndexer {
  #client: PublicClient;
  #currentChainId: number = 7668;
  #db: Models;
  #job?: Job;

  constructor(db: Models, client: PublicClient, job?: Job) {
    if (!client) {
      throw new Error('EVM Client parameter missing');
    }
    this.#client = client;

    if (!db) {
      throw new Error('Database models parameter missing');
    }
    this.#db = db;
    this.#job = job;
  }

  public async processMissed() {
    await this.processMissedEvents();
    await this.processMissedEvmTransactions();
  }

  public async processMissedEvents(requestLimit: number = 100000) {
    this.#currentChainId = Number(await this.#client.getChainId());

    let finished = false;
    while (!finished) {
      this.#log('load events...');
      const eventIds = await this.#getNotProcessedEventIds(requestLimit);

      this.#log(`got ${eventIds.length} events; ${eventIds[0]} - ${eventIds[eventIds.length - 1]}`);
      const chunks = chunk(eventIds, C_CHUNK_SIZE);
      for (const chunkedEventIds of chunks) {
        await this.processEvents(chunkedEventIds);
      }

      finished = eventIds.length < requestLimit;
    }
    this.#log('FINISHED parse events');
  }

  public async processMissedEvmTransactions(requestLimit: number = 100000) {
    this.#currentChainId = Number(await this.#client.getChainId());

    let finished = false;
    while (!finished) {
      this.#log('load evm transactions...');
      const hashes = await this.#getNotProcessedEvmTransactionHashes(requestLimit);

      this.#log(`got ${hashes.length} transaction hashes`);
      const chunks = chunk(hashes, C_CHUNK_SIZE);
      for (const chunkedHashes of chunks) {
        await this.processEvmTransactions(chunkedHashes);
      }

      finished = hashes.length < requestLimit;
    }
    this.#log('FINISHED parse evm transactions');
  }

  async processEvmTransactions(hashes: Hash[]): Promise<void> {
    const data = await this.#db.EvmTransaction.aggregate([
      {
        $match: {
          hash: { $in: hashes },
          $or: [
            { 'events.type': 'ERC721', 'events.eventName': 'Transfer' },
            { 'events.type': 'ERC1155', 'events.eventName': { $in: ['TransferSingle', 'TransferBatch'] } },
          ],
        },
      },
      {
        $project: {
          type: 0,
          accessList: 0,
          input: 0,
          from: 0,
          to: 0,
          value: 0,
          address: 0,
        },
      },
      {
        $unwind: '$events',
      },
      {
        $match: {
          $or: [
            { 'events.type': 'ERC721', 'events.eventName': 'Transfer' },
            { 'events.type': 'ERC1155', 'events.eventName': { $in: ['TransferSingle', 'TransferBatch'] } },
          ],
        },
      },
      {
        $replaceRoot: {
          newRoot: {
            $mergeObjects: ['$events', '$$ROOT'],
          },
        },
      },
      {
        $lookup: {
          from: 'tokens',
          localField: 'events.address',
          foreignField: 'contractAddress',
          as: 'contract',
        },
      },
      {
        $unwind: '$contract',
      },
      { $match: { 'contract.collectionId': { $exists: false } } },
      { $sort: { timestamp: 1 } },
    ]);

    this.#log(`Processing  ${hashes.length} evm transactions with ${data.length} events...`);
    const nftEvents: INftOwner[][] = [];
    for (const event of data) {
      const parserName = `${event.type}${event.eventName}`;
      if (!C_EVM_TRANSACTIONS_EVENT_PARSERS[parserName]) {
        throw new Error(`Parser ${parserName} not implemented`);
      }
      const res = C_EVM_TRANSACTIONS_EVENT_PARSERS[parserName].handler(event);
      nftEvents.push(res);
    }
    const nftOwners = nftEvents.filter(Boolean).flat(1);
    await this.#insertNftOwners(nftOwners);
    await this.#db.EvmTransaction.updateMany(
      {
        hash: { $in: hashes },
      },
      {
        $set: {
          _nftOwnersProcessed: true,
        },
      },
    );
  }

  async processEvents(eventIds: string[]): Promise<void> {
    const data = await this.#db.Event.aggregate([
      {
        $match: {
          eventId: { $in: eventIds },
          $or: [
            { section: 'nft', method: { $in: ['Mint', 'Transfer', 'BridgedMint'] } },
            { section: 'sft', method: { $in: ['Mint', 'Transfer', 'TokenCreate'] } },
          ],
        },
      },
      {
        $sort: { blockNumber: 1 },
      },
    ]);

    this.#log(`Processing ${eventIds.length} events, found ${data.length} transfers`);
    const nftEvents: INftOwner[][] = [];
    for (const event of data) {
      const parserName = `${event.section}${event.method}`;
      if (!C_EVENT_PARSERS[parserName]) {
        throw new Error(`Parser ${parserName} not implemented`);
      }
      const res = C_EVENT_PARSERS[parserName].handler(event);
      nftEvents.push(res);
    }
    const nftOwners = nftEvents.filter(Boolean).flat(1);

    await this.#insertNftOwners(nftOwners);
    await this.#db.Event.updateMany(
      {
        eventId: { $in: eventIds },
      },
      {
        $set: {
          _nftOwnersProcessed: true,
        },
      },
    );
  }

  async #log(message: string) {
    this.#job?.log(moment().format('YYYY-MM-DD HH:mm:ss') + ': ' + message);
    await logger.info(message);
  }

  async #insertNftOwners(nftOwners: INftOwner[]) {
    if (!nftOwners.length) {
      return;
    }
    const ops: (IBulkWriteUpdateOp | IBulkWriteDeleteOp)[] = [];

    const nftTokenData = new NftTokenData(this.#client);
    await nftTokenData.fillNftsMetadata(nftOwners);

    for (const item of nftOwners) {
      if (item.type === 'ERC721') {
        ops.push({
          updateOne: {
            filter: {
              tokenId: item.tokenId,
              contractAddress: item.contractAddress,
            },
            update: {
              $set: item,
            },
            upsert: true,
          },
        });
      } else if (item.type === 'ERC1155') {
        const { amount, ...rest } = item;
        ops.push({
          updateOne: {
            filter: {
              tokenId: item.tokenId,
              contractAddress: item.contractAddress,
              owner: item.owner,
            },
            update: {
              $set: rest,
              $inc: {
                amount,
              },
            },
            upsert: true,
          },
        });
      }
    }

    // Write tokens
    await this.#db.NftOwner.bulkWrite(ops);

    // Remove owners with 0 and less amount for ERC1155 protocol
    await this.#db.NftOwner.deleteMany({
      amount: { $lte: 0, $ne: null },
      type: 'ERC1155',
    });
  }

  async #getNotProcessedEventIds(limit: number) {
    const data = await this.#db.Event.aggregate([
      {
        $match: {
          _nftOwnersProcessed: { $ne: true },
        },
      },
      { $sort: { blockNumber: 1 } },
      { $limit: limit },
      {
        $project: {
          eventId: 1,
          eventNumberLong: 1,
        },
      },
    ]);
    return data.map((i) => i.eventId);
  }

  async #getNotProcessedEvmTransactionHashes(limit: number): Promise<Hash[]> {
    const data = await this.#db.EvmTransaction.aggregate([
      {
        $match: {
          _nftOwnersProcessed: { $ne: true },
        },
      },
      { $sort: { timestamp: 1 } },
      { $limit: limit },
      {
        $project: {
          hash: 1,
          timestamp: 1,
        },
      },
    ]);
    return data.map((i) => i.hash);
  }

  async processNftOwnersMetadata(requestLimit: number = 5000) {
    let finished = false;
    while (!finished) {
      const nfts = await this.#getNotProcessedNftOwnersMetadata(requestLimit);
      this.#log(`process ${nfts.length} nfts owners metadata. last block: ${nfts[nfts.length - 1].blockNumber}`);
      await this.processNftOwnersMetadataItems(nfts);
      this.#log(`processed ${nfts.length} nfts owners`);
      finished = nfts.length < requestLimit;
    }
    this.#log('FINISHED parse events');
  }

  async processNftOwnersMetadataItems(items: INftOwner[]) {
    const nftTokenData = new NftTokenData(this.#client);
    await nftTokenData.fillNftsMetadata(items);
    const ops: (IBulkWriteUpdateOp | IBulkWriteDeleteOp)[] = [];
    for (const item of items) {
      ops.push({
        updateOne: {
          filter: {
            tokenId: item.tokenId,
            contractAddress: item.contractAddress,
          },
          update: {
            $set: {
              image: item.image,
              animation_url: item.animation_url,
              attributes: item.attributes,
              _metadataProcessed: true,
            },
          },
        },
      });
    }
    await this.#db.NftOwner.bulkWrite(ops);
  }

  async #getNotProcessedNftOwnersMetadata(limit: number): Promise<INftOwner[]> {
    const data = await this.#db.NftOwner.aggregate([
      {
        $match: {
          _metadataProcessed: { $ne: true },
        },
      },
      { $sort: { blockNumber: 1 } },
      { $limit: limit },
    ]);
    return data;
  }
}
