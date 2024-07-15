import { checkForNewlyVerifiedContracts } from '@/contract-verification';
import DB from '@/database';
import Indexer from '@/indexer';
import {
  createFindPrecompiledTokensTasks,
  findAllEthereumBridgeContractAddresses,
  findAllKnownAddresses,
  findMissingBlocks,
  findPrecompiledTokens,
  updateStakingValidators,
} from '@/indexer/tasks/prepopulate';
import logger from '@/logger';
import NftIndexer from '@/nft-indexer';
import { NftOwnersIndexer } from '@/nft-indexer/nft-owners-indexer';
import { updateTokenPricingDetails } from '@/price-fetcher';
import redisClient from '@/redis';
import { evmClient, substrateClient } from '@/rpc';
import { Job, Worker } from 'bullmq';
import dotenv from 'dotenv';
import express from 'express';
import Mongoose from 'mongoose';

dotenv.config();

const start = async () => {
  const api = await substrateClient();
  const evmApi = evmClient;

  const indexer = new Indexer(evmApi, api, DB);

  /** @dev: Task processor picks up task from the pool, and then verifies that we have a function to actually process it. */
  const handleTask = async (job: Job) => {
    switch (job.name) {
      case 'PROCESS_BLOCK':
        await indexer.processBlock(job.data.blocknumber);
        break;
      case 'PROCESS_TRANSACTION':
        await indexer.processTransactions([job.data.hash]);
        break;
      case 'FETCH_BALANCES':
        await indexer.refetchBalance(job.data.address);
        break;
      case 'CREATE_FIND_PRECOMPILE_TOKENS_TASKS':
        await createFindPrecompiledTokensTasks();
        break;
      case 'FIND_PRECOMPILE_TOKENS':
        await findPrecompiledTokens(job.data.from, job.data.to);
        break;
      case 'FIND_FINALIZED_BLOCKS':
        await indexer.checkFinalizedBlocks();
        break;
      case 'INGEST_KNOWN_ADDRESSES':
        await findAllKnownAddresses();
        break;
      case 'FIND_ETH_BRIDGE_CONTRACT_ADDRESSES':
        await findAllEthereumBridgeContractAddresses();
        break;
      case 'FIND_NFT_METADATA':
        await new NftIndexer(evmApi, api, DB, job).fetchMetadataOfToken();
        break;
      // case 'REFETCH_NFT_HOLDERS':
      //   await new NftIndexer(evmApi, api, DB, job).fetchHoldersOfCollection(job.data.contractAddress);
      //   break;
      case 'PROCESS_NFT_OWNERS':
        await new NftOwnersIndexer(DB, evmApi, job).processMissed();
        break;
      case 'INDEX_BLOCK_RANGES':
        await indexer.reindexBlockRange(job.data.from, job.data.to);
        break;
      case 'REFETCH_ALL_BALANCES':
        await indexer.refetchAllBalances();
        break;
      // case 'REFETCH_NFT_HOLDERS_GEN_TASKS':
      //   await new NftIndexer(evmApi, api, DB, job).createNftHolderRefreshTasks();
      //   break;
      case 'UPDATE_TOKEN_PRICING_DETAILS':
        await updateTokenPricingDetails();
        break;
      case 'CHECK_FOR_NEWLY_VERIFIED_CONTRACTS':
        await checkForNewlyVerifiedContracts();
        break;
      case 'UPDATE_STAKING_VALIDATORS':
        await updateStakingValidators();
        break;
      case 'FIND_MISSING_BLOCKS':
        await findMissingBlocks();
        break;
      default:
        throw new Error('NO PROCESSOR');
    }
  };

  if (!process.env.WORKERPOOL_QUEUE) {
    console.error('Missing WORKERPOOL_QUEUE from .env');
    process.exit(1);
  }

  const worker = new Worker(process.env.WORKERPOOL_QUEUE, handleTask, {
    connection: redisClient,
    removeOnComplete: { count: 100 },
    removeOnFail: { count: 5000 },
  });

  worker.on('completed', (job) => {
    logger.info(
      `[COMPLETED] ${job?.name} (ID: ${job?.id}) (${
        job?.finishedOn && job?.processedOn ? Number(job.finishedOn - job.processedOn) : '-'
      }ms)`,
    );
  });

  worker.on('failed', (job, err) => {
    logger.error(`[FAILED] ${job?.name} (ID: ${job?.id}) has failed with ${err.message}`);
  });

  Mongoose.connection.on('error', (err) => {
    server.close();
    worker.close().then(() => {
      process.exit(1);
    });
  });
};

const port = process?.env?.WORKER_HEALTH_PORT;
if (!port) {
  logger.error(`Missing WORKER_HEALTH_PORT in .env`);
  process.exit(1);
}
const app = express();
app.get('/', (req, res) => {
  res.send('ALIVE');
});
const server = app.listen(port, () => {
  logger.info(`🚀 Health API at http://localhost:${port}`);
});

start();
