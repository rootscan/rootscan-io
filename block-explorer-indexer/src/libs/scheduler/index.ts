import DB from '@/database';
import { getMissingBlocks } from '@/indexer/tasks/prepopulate';
import logger from '@/logger';
import { evmClient } from '@/rpc';
import queue from '@/workerpool';
import { TaskQueueLimiter } from '@/workerpool/task-queue-limiter';
import '@therootnetwork/api-types';
import express from 'express';
import { range } from 'lodash';

const scheduler = async () => {
  /** Create repeating jobs first */
  await queue.add(
    'FIND_FINALIZED_BLOCKS',
    {},
    {
      priority: 3,
      jobId: 'FIND_FINALIZED_BLOCKS',
      repeat: {
        every: 4000, // Every 4 seconds
        immediately: true,
      },
    },
  );

  await queue.add(
    'UPDATE_TOKEN_PRICING_DETAILS',
    {},
    {
      jobId: 'UPDATE_TOKEN_PRICING_DETAILS',
      repeat: {
        every: 60_000 * 60, // Every 1 hour
        immediately: true,
      },
    },
  );

  await queue.add(
    'CHECK_FOR_NEWLY_VERIFIED_CONTRACTS',
    {},
    {
      jobId: 'CHECK_FOR_NEWLY_VERIFIED_CONTRACTS',
      repeat: {
        every: 60_000 * 5, // Every 5 minutes
        immediately: true,
      },
    },
  );

  await queue.add(
    'UPDATE_STAKING_VALIDATORS',
    {},
    {
      jobId: 'UPDATE_STAKING_VALIDATORS',
      repeat: {
        every: 60_000 * 5, // Every 5 minutes
        immediately: true,
      },
    },
  );

  await queue.add(
    'FIND_MISSING_BLOCKS',
    {},
    {
      jobId: 'FIND_MISSING_BLOCKS',
      repeat: {
        every: 60_000 * 60 * 6, // Every 6 hours
        immediately: true,
      },
    },
  );

  await queue.add(
    'PROCESS_NFT_OWNERS',
    {},
    {
      jobId: 'PROCESS_NFT_OWNERS',
      priority: 6,
      attempts: 1,
      repeat: {
        every: 60_000 * 60, // Every 60 mins
        immediately: true,
      },
    },
  );

  await queue.add(
    'INGEST_KNOWN_ADDRESSES',
    {},
    {
      jobId: 'INGEST_KNOWN_ADDRESSES',
    },
  );

  await queue.add(
    'FIND_ETH_BRIDGE_CONTRACT_ADDRESSES',
    {},
    {
      jobId: 'FIND_ETH_BRIDGE_CONTRACT_ADDRESSES',
    },
  );

  const blocksQueue = new TaskQueueLimiter<number>(1000, (blocknumber) => ({
    name: 'PROCESS_BLOCK',
    data: { blocknumber },
    opts: {
      priority: 1,
      jobId: `BLOCK_${blocknumber}`,
    },
  }));

  /** @dev - Figure out where scheduler has stalled and recreate tasks for missed blocks */
  const currentBlockLookUp = await DB.Block.findOne().sort('-number').lean();
  const currentDBBlock = currentBlockLookUp ? currentBlockLookUp.number + 1 : 0;
  const currentChainBlock: bigint = await evmClient.getBlockNumber();

  // TODO: check is this need
  // if (currentDBBlock === 0) {
  //   await queue.add(
  //     'CREATE_FIND_PRECOMPILE_TOKENS_TASKS',
  //     {},
  //     {
  //       jobId: 'CREATE_FIND_PRECOMPILE_TOKENS_TASKS',
  //     },
  //   );
  // }

  // Add missing blocks to queue
  blocksQueue.addBulk(await getMissingBlocks());

  // Add not processed blocks to queue
  blocksQueue.addBulk(range(currentDBBlock, Number(currentChainBlock)));

  /** Start listening to new blocks */
  evmClient.watchBlockNumber({
    emitMissed: true,
    emitOnBegin: true,
    onBlockNumber: async (blockNumber) => {
      logger.info(`Chain is on block ${Number(blockNumber)}`);
      blocksQueue.add(Number(blockNumber));
    },
  });
  await blocksQueue.run();
};

const port = process?.env?.SCHEDULER_HEALTH_PORT;
if (!port) {
  logger.error(`Missing SCHEDULER_HEALTH_PORT in .env`);
  process.exit(1);
}
const app = express();
app.get('/', (req, res) => {
  res.send('ALIVE');
});
app.listen(port, () => {
  logger.info(`🚀 Health API at http://localhost:${port}/`);
});

scheduler();
