import DB from '@/database';
import logger from '@/logger';
import { evmClient, substrateClient } from '@/rpc';
import queue from '@/workerpool';
import '@therootnetwork/api-types';
import express from 'express';

const scheduler = async () => {
  const api = await substrateClient();

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

  if (process.env.REFETCH_NFT_HOLDERS_PERIOD) {
    await queue.add(
      'REFETCH_NFT_HOLDERS_GEN_TASKS',
      {},
      {
        jobId: 'REFETCH_NFT_HOLDERS_GEN_TASKS',
        repeat: {
          every: 60_000 * parseInt(process.env.REFETCH_NFT_HOLDERS_PERIOD),
          immediately: true,
        },
      },
    );
  }

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

  /** @dev - Figure out where scheduler has stalled and recreate tasks for missed blocks */
  const currentBlockLookUp = await DB.Block.findOne().sort('-number').lean();
  const currentDBBlock = currentBlockLookUp?.number ? currentBlockLookUp?.number - 250 : 0;
  const currentChainBlock: bigint = await evmClient.getBlockNumber();

  if (currentDBBlock === 0) {
    await queue.add(
      'CREATE_FIND_PRECOMPILE_TOKENS_TASKS',
      {},
      {
        jobId: 'CREATE_FIND_PRECOMPILE_TOKENS_TASKS',
      },
    );
  }

  for (let block = Number(currentDBBlock); block < Number(currentChainBlock); block++) {
    const blockNumber = Number(block);
    await queue.add(
      'PROCESS_BLOCK',
      { blocknumber: blockNumber },
      {
        priority: 1,
        jobId: `BLOCK_${blockNumber}`,
      },
    );
  }

  /** Start listening to new blocks */
  evmClient.watchBlockNumber({
    emitMissed: true,
    emitOnBegin: true,
    onBlockNumber: async (blockNumber) => {
      logger.info(`Chain is on block ${Number(blockNumber)}`);
      await queue.add(
        'PROCESS_BLOCK',
        { blocknumber: Number(blockNumber) },
        {
          priority: 1,
          jobId: `BLOCK_${Number(blockNumber)}`,
        },
      );
    },
  });
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
