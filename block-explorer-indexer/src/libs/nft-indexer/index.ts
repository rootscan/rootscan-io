import ABIs from '@/constants/abi';
import logger from '@/logger';
import { getTokenMetadata } from '@/token-data';
import { IBulkWriteDeleteOp, IBulkWriteUpdateOp, IToken } from '@/types';
import { contractAddressToNativeId } from '@/utils';
import { getTokenDetails } from '@/utils/tokenInformation';
import queue from '@/workerpool';
import { ApiPromise } from '@polkadot/api';
import { Job } from 'bullmq';
import moment from 'moment';
import { Models } from 'mongoose';
import { Abi, Address, MulticallResults, PublicClient, getAddress, isAddress } from 'viem';

const C_MAX_BATCH = 1000;

export default class NftIndexer {
  client: PublicClient;
  api: ApiPromise;
  DB: Models;
  job?: Job;

  constructor(client: PublicClient, api: ApiPromise, DB: Models, job?: Job) {
    if (!client) {
      throw new Error('EVM Client parameter missing');
    }
    this.client = client;

    if (!api) {
      throw new Error('API parameter missing');
    }
    this.api = api;

    if (!DB) {
      throw new Error('Database models parameter missing');
    }
    this.DB = DB;
    this.job = job;
  }

  private async logInfo(message) {
    this.job?.log(moment().format('YYYY-MM-DD HH:mm:ss') + ': ' + message);
    await logger.info(message);
  }

  async fetchHoldersOfCollection(contractAddressRaw: Address) {
    const contractAddress = getAddress(contractAddressRaw);
    await getTokenDetails(contractAddress, true);

    const collection: IToken | null = await this.DB.Token.findOne({
      contractAddress,
      type: { $in: ['ERC721', 'ERC1155'] },
    }).lean();

    await this.logInfo(
      `Refreshing holders for ${collection?.name || '-'} ${contractAddress} [Total Supply: ${collection?.totalSupply}]`,
    );

    if (!collection) {
      throw new Error('Collection does not exist.');
    }
    if (!collection.totalSupply) {
      return true;
    }

    if (collection.type === 'ERC1155') {
      await this.fetchHoldersOfCollection_ERC1155(collection);
    }

    if (collection.type === 'ERC721') {
      await this.fetchHoldersOfCollection_ERC721(collection);
    }

    return true;
  }

  async fetchHoldersOfCollection_ERC1155(collection: IToken) {
    this.logInfo('Prepare initial data...');
    const currentChainId = await this.client.getChainId();
    const totalSupply = Number(collection.totalSupply);
    const addresses = await this.getPotentialERC1155TokenAddressesForContract(collection.contractAddress);
    this.logInfo(`Addresses: ${addresses.length}, totalSupply: ${totalSupply}`);

    // Get current token balances
    const currentBalancesRaw = await this.DB.Nft.find({
      contractAddress: getAddress(collection.contractAddress),
      amount: { $gt: 0 },
    })
      .select('owner tokenId amount')
      .lean();

    let currentBalances: Record<Address, number> = {};
    for (const bal of currentBalancesRaw) {
      currentBalances[`${getAddress(bal.owner)}_${bal.tokenId}`] = Number(bal.amount);
    }
    this.logInfo(`Loaded current balances, total items: ${Object.keys(currentBalances).length}`);

    const allTokensArray = Array(totalSupply)
      .fill('x')
      .map((_x, _) => _);

    await this.processBulk({
      total: addresses.length,
      maxBatch: 100,
      callback: async (from, to) => {
        const calls: { address: Address; abi: Abi; functionName: string; args: [Address[], number[]] }[] = [];
        const addressesPack = addresses.slice(from, to);

        for (const address of addressesPack) {
          const addressForTokensArray = Array(totalSupply).fill(address);
          calls.push({
            address: collection.contractAddress,
            abi: ABIs.ERC1155_ORIGINAL as Abi,
            functionName: 'balanceOfBatch',
            args: [addressForTokensArray, allTokensArray],
          });
        }

        const multicall: MulticallResults = await this.client.multicall({
          contracts: calls,
          allowFailure: true,
        });

        const ops: (IBulkWriteUpdateOp | IBulkWriteDeleteOp)[] = [];
        let same = 0;
        let updated = 0;
        let deleted = 0;

        for (const index in multicall) {
          const { status, result } = multicall[index] as { status: string; result: bigint[] };

          if (status !== 'success') {
            continue;
          }
          const address = getAddress(addressesPack[index] as Address);

          for (const tokenId in result) {
            const quantity = Number(result[tokenId]);
            const currentBalance = currentBalances[`${address}_${tokenId}`];
            if (quantity > 0) {
              if (currentBalance === quantity) {
                same++;
                // continue; TODO: do we need to skip the same values?
              }

              updated++;
              const metadata = await getTokenMetadata(
                collection.contractAddress,
                Number(tokenId),
                Number(currentChainId) === 7668 ? 'root' : 'porcini',
              );

              ops.push({
                updateOne: {
                  filter: {
                    tokenId: Number(tokenId),
                    contractAddress: collection.contractAddress,
                    owner: address,
                  },
                  update: {
                    $set: {
                      tokenId: Number(tokenId),
                      contractAddress: collection.contractAddress,
                      owner: address,
                      amount: Number(quantity),
                      attributes: metadata?.attributes,
                      image: metadata?.image || null,
                      animation_url: metadata?.animation_url || null,
                    },
                  },
                  upsert: true,
                },
              });
            } else if (quantity === 0 && currentBalance > 0) {
              deleted++;
              ops.push({
                deleteOne: {
                  filter: {
                    contractAddress: collection.contractAddress,
                    tokenId: Number(tokenId),
                    owner: address,
                  },
                },
              });
            }
          }
        }

        await this.DB.Nft.bulkWrite(ops);
        await this.logInfo(`result: same: ${same}; updated: ${updated}; deleted: ${deleted}`);
      },
    });
  }

  async fetchHoldersOfCollection_ERC721(collection: IToken) {
    const currentChainId = await this.client.getChainId();
    await this.processBulk({
      total: Number(collection?.totalSupply),
      maxBatch: 1000,
      callback: async (from, to) => {
        const calls: { address: Address; abi: Abi; functionName: string; args: number[] }[] = [];
        for (let i = from; i < to; i++) {
          calls.push({
            address: collection.contractAddress,
            abi: ABIs.ERC721_ORIGINAL as Abi,
            functionName: 'ownerOf',
            args: [i],
          });
        }

        const multicall: MulticallResults = await this.client.multicall({
          contracts: calls,
          allowFailure: true,
        });

        const ops: IBulkWriteUpdateOp[] = [];
        let tokenId = from;
        for (const result of multicall) {
          if (result?.status === 'success') {
            if (isAddress(result?.result as string)) {
              const metadata = await getTokenMetadata(
                collection.contractAddress,
                Number(tokenId),
                Number(currentChainId) === 7668 ? 'root' : 'porcini',
              );
              const owner: Address = getAddress(result?.result as string);
              ops.push({
                updateOne: {
                  filter: {
                    tokenId: Number(tokenId),
                    contractAddress: collection.contractAddress,
                  },
                  update: {
                    $set: {
                      contractAddress: collection.contractAddress,
                      tokenId: Number(tokenId),
                      owner,
                      attributes: metadata?.attributes,
                      image: metadata?.image || null,
                      animation_url: metadata?.animation_url || null,
                    },
                  },
                  upsert: true,
                },
              });
            }
          }
          tokenId++;
        }
        await this.DB.Nft.bulkWrite(ops);
      },
    });
  }

  async processBulk({
    total,
    callback,
    maxBatch,
  }: {
    total: number;
    callback: (from: number, to: number) => Promise<void>;
    maxBatch: number;
  }) {
    let current = this.job?.data?.current || 0;
    const timeStart = new Date().getTime();

    while (current < total) {
      const currentEnd = current + maxBatch >= total ? total : current + maxBatch;

      await this.logInfo(`Processing: ${current} -> ${currentEnd} ...`);
      await this.job?.updateProgress(total && Math.floor((current / total) * 100));
      await this.job?.updateData({
        ...this.job?.data,
        current,
        workTimeInSec: (new Date().getTime() - timeStart) / 1000,
      });

      await callback(current, currentEnd);
      current = currentEnd;
    }
  }

  private async getPotentialERC1155TokenAddressesForContract(contractAddress: Address): Promise<string[]> {
    const nativeId = contractAddressToNativeId(contractAddress);
    const addresses = new Set();

    // We only have to check the SFT pallet is there is a nativeId for this collection
    if (nativeId) {
      const sftEvents = await this.DB.Event.find({
        $or: [
          { section: 'sft', method: 'Transfer', 'args.collectionId': nativeId },
          { section: 'sft', method: 'Mint', 'args.collectionId': nativeId },
          { section: 'sft', method: 'CollectionCreate', 'args.collectionId': nativeId },
          { section: 'sft', method: 'TokenCreate', 'args.tokenId[0]': nativeId },
        ],
      })
        .select('args')
        .lean();

      for (const event of sftEvents) {
        const address =
          event?.args?.owner || event?.args?.tokenOwner || event?.args?.newOwner || event?.args?.collectionOwner;
        if (isAddress(address)) {
          addresses.add(getAddress(address));
        }
      }
    }

    const evmEvents = await this.DB.EvmTransaction.aggregate([
      {
        $match: {
          'events.eventName': { $in: ['Transfer', 'TransferSingle', 'TransferBatch'] },
          'events.type': 'ERC1155',
          'events.address': contractAddress,
        },
      },
      {
        $unwind: '$events',
      },
      {
        $match: {
          'events.address': contractAddress,
        },
      },
      {
        $replaceRoot: {
          newRoot: '$events',
        },
      },
      {
        $project: {
          from: 1,
          to: 1,
          operator: 1,
        },
      },
    ]);

    for (const event of evmEvents) {
      if (isAddress(event?.from)) {
        addresses.add(getAddress(event.from));
      }
      if (isAddress(event?.to)) {
        addresses.add(getAddress(event.to));
      }
      if (isAddress(event?.operator)) {
        addresses.add(getAddress(event.operator));
      }
    }

    return Array.from(addresses.keys()) as string[];
  }

  async fetchMetadataOfToken() {
    return true;
  }

  async createNftHolderRefreshTasks() {
    logger.info(`Creating Nft Holder refresh tasks`);
    const collections = await this.DB.Token.find({ type: { $in: ['ERC721', 'ERC1155'] } }).lean();
    for (const collection of collections) {
      logger.info(`Creating REFETCH_NFT_HOLDERS task for ${collection.contractAddress}`);
      await queue.add(
        'REFETCH_NFT_HOLDERS',
        {
          contractAddress: getAddress(collection.contractAddress),
          totalSupply: collection.totalSupply,
        },
        {
          priority: 6,
          jobId: `REFETCH_NFT_HOLDERS_${collection.contractAddress}`,
        },
      );
    }
  }
}
