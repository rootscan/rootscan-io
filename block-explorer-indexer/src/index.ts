/** THIS FILE IS FOR TEST PURPOSES AND WILL BE REMOVED FURTHER DOWN THE ROAD */

import DB from '@/database';
import Indexer from '@/indexer';
import { evmClient, substrateClient } from '@/rpc';
import queue from '@/workerpool';
import '@therootnetwork/api-types';

const run = async () => {
  const api = await substrateClient();

  const indexer = new Indexer(evmClient, api, DB);

  // await findAllEthereumBridgeContractAddresses();
  // await indexer.refetchAllBalances();
  // await indexer.processTransactions(['0x70c62a6dd1e7faa9ac6302bea7e1578e4600260f9af547fd4c65266f5d70aef9']);
  await indexer.processBlock(BigInt(8149337));

  // const nftIndexer = new NftIndexer(evmClient, api, DB);

  // await nftIndexer.createNftHolderRefreshTasks();
  // await nftIndexer.fetchHoldersOfCollection('0xBbbbbBbB00008064000000000000000000000000' as Address);

  // await getTokenDetails('0xAaaAaAAa00003c64000000000000000000000000', true);

  // await updateStakingValidators();

  // await indexer.checkFinalizedBlocks();

  await api.rpc.chain.subscribeNewHeads(async (header) => {
    console.log(`Chain is at block: #${header.number}`);
    const blockNumber = Number(header.number);
    await queue.add(
      'PROCESS_BLOCK',
      { blocknumber: blockNumber },
      {
        jobId: `BLOCK_${blockNumber}`
      }
    );
  });
};

run();
