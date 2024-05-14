import ABIs from '@/constants/abi';
import logger from '@/logger';
import { getTokenMetadata } from '@/token-data';
import { IBulkWriteDeleteOp, IBulkWriteUpdateOp, IToken } from '@/types';
import { contractAddressToNativeId } from '@/utils';
import { getTokenDetails } from '@/utils/tokenInformation';
import queue from '@/workerpool';
import { ApiPromise } from '@polkadot/api';
import { Models } from 'mongoose';
import { Abi, Address, MulticallResults, PublicClient, getAddress, isAddress } from 'viem';

export default class NftIndexer {
  client: PublicClient;
  api: ApiPromise;
  DB: Models;

  constructor(client: PublicClient, api: ApiPromise, DB: Models) {
    if (!client) throw new Error('EVM Client parameter missing');
    this.client = client;
    if (!api) throw new Error('API parameter missing');
    this.api = api;
    if (!DB) throw new Error('Database models parameter missing');
    this.DB = DB;
  }

  async fetchHoldersOfCollection(contractAddress: Address) {
    await getTokenDetails(getAddress(contractAddress), true);

    const collection: IToken | null = await this.DB.Token.findOne({
      contractAddress: getAddress(contractAddress),
      type: { $in: ['ERC721', 'ERC1155'] },
    }).lean();

    logger.info(
      `Refreshing holders for ${collection?.name || '-'} ${contractAddress} [Total Supply: ${collection?.totalSupply}]`,
    );

    if (!collection) throw new Error('Collection does not exist.');
    if (!collection?.totalSupply || collection?.totalSupply === 0) return true;
    const currentChainId = await this.client.getChainId();

    if (collection?.type === 'ERC1155') {
      const nativeId = contractAddressToNativeId(contractAddress);
      const addresses = new Set();
      const totalSupply = Number(collection?.totalSupply);

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
            $or: [
              {
                'events.eventName': 'Transfer',
                'events.type': 'ERC1155',
                'events.address': getAddress(contractAddress),
              },
              {
                'events.eventName': 'TransferSingle',
                'events.type': 'ERC1155',
                'events.address': getAddress(contractAddress),
              },
              {
                'events.eventName': 'TransferBatch',
                'events.type': 'ERC1155',
                'events.address': getAddress(contractAddress),
              },
            ],
          },
        },
        {
          $unwind: '$events',
        },
        {
          $match: {
            'events.address': getAddress(contractAddress),
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

      for (const evmEvent of evmEvents) {
        const event = evmEvent?.events;
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

      // Create multicall calls
      const q = Array(totalSupply)
        .fill('x')
        .map((x, _) => _);
      const calls: { address: Address; abi: Abi; functionName: string; args: [Address[], number[]] }[] = [];
      const addressesArray = Array.from(addresses);
      for (const address of addressesArray) {
        const a = Array(totalSupply).fill(address);
        calls.push({
          address: getAddress(contractAddress),
          abi: ABIs.ERC1155_ORIGINAL as Abi,
          functionName: 'balanceOfBatch',
          args: [a, q],
        });
      }

      const multicall: MulticallResults = await this.client.multicall({
        contracts: calls,
        allowFailure: true,
      });

      const ops: (IBulkWriteUpdateOp | IBulkWriteDeleteOp)[] = [];
      const currentBalances = await this.DB.Nft.find({
        contractAddress: getAddress(contractAddress),
        amount: { $gt: 0 },
      })
        .select('owner tokenId amount')
        .lean();

      let balCache: any = {};
      for (const bal of currentBalances) {
        if (!balCache[getAddress(bal?.owner)]) {
          balCache[getAddress(bal?.owner)] = [];
        }

        balCache[getAddress(bal?.owner)].push(Number(bal?.tokenId));
      }
      let index = 0;
      for (const result of multicall) {
        if (result?.status === 'success') {
          const address = addressesArray[index] as Address;
          const data = result?.result as bigint[];
          let tokenId = 0;
          for (const quantity of data) {
            if (Number(quantity) > 0) {
              const metadata = await getTokenMetadata(
                getAddress(contractAddress),
                Number(tokenId),
                Number(currentChainId) === 7668 ? 'root' : 'porcini',
              );
              ops.push({
                updateOne: {
                  filter: {
                    tokenId: Number(tokenId),
                    contractAddress: getAddress(contractAddress),
                    owner: getAddress(address),
                  },
                  update: {
                    $set: {
                      tokenId: Number(tokenId),
                      contractAddress: getAddress(contractAddress),
                      owner: getAddress(address),
                      amount: Number(quantity),
                      attributes: metadata?.attributes,
                      image: metadata?.image || null,
                      animation_url: metadata?.animation_url || null,
                    },
                  },
                  upsert: true,
                },
              });
            } else if (Number(quantity) === 0 && balCache?.[getAddress(address)]?.includes(Number(tokenId))) {
              ops.push({
                deleteOne: {
                  filter: {
                    contractAddress: getAddress(contractAddress),
                    tokenId: Number(tokenId),
                    owner: getAddress(address),
                  },
                },
              });
            }
            tokenId++;
          }
        }
        index++;
      }

      await this.DB.Nft.bulkWrite(ops);
    }
    if (collection?.type === 'ERC721') {
      let current = 0;
      const end = Number(collection?.totalSupply);
      const maxBatch = 1000;

      while (current < end) {
        const currentEnd = current + maxBatch >= end ? end : current + maxBatch;
        console.log(`${collection?.contractAddress} [BatchSize: ${maxBatch}] => FROM: ${current} -> ${currentEnd}`);
        const calls: { address: Address; abi: Abi; functionName: string; args: number[] }[] = [];
        for (let i = current; i < currentEnd; i++) {
          calls.push({
            address: getAddress(contractAddress),
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
        let tokenId = current;
        for (const result of multicall) {
          if (result?.status === 'success') {
            if (isAddress(result?.result as string)) {
              const metadata = await getTokenMetadata(
                getAddress(contractAddress),
                Number(tokenId),
                Number(currentChainId) === 7668 ? 'root' : 'porcini',
              );
              const owner: Address = getAddress(result?.result as string);
              ops.push({
                updateOne: {
                  filter: {
                    tokenId: Number(tokenId),
                    contractAddress: getAddress(contractAddress),
                  },
                  update: {
                    $set: {
                      contractAddress: getAddress(contractAddress),
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
        current = currentEnd;
      }
    }

    return true;
  }

  async fetchMetadataOfToken() {
    return true;
  }

  async createNftHolderRefreshTasks() {
    logger.info(`Creating Nft Holder refresh tasks`);
    const collections = await this.DB.Token.find({ type: { $in: ['ERC721', 'ERC1155'] } }).distinct('contractAddress');
    for (const contractAddress of collections) {
      logger.info(`Creating REFETCH_NFT_HOLDERS task for ${contractAddress}`);
      await queue.add(
        'REFETCH_NFT_HOLDERS',
        {
          contractAddress: getAddress(contractAddress),
        },
        {
          priority: 6,
          jobId: `REFETCH_NFT_HOLDERS_${contractAddress}`,
        },
      );
    }
  }
}
