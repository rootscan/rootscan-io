/** THIS FILE IS FOR TEST PURPOSES AND WILL BE REMOVED FURTHER DOWN THE ROAD */

import DB from '@/database';
import Indexer from '@/indexer';
import NftIndexer from '@/nft-indexer';
import { evmClient, substrateClient } from '@/rpc';
import { getTokenDetails } from '@/utils/tokenInformation';
import queue from '@/workerpool';
import '@therootnetwork/api-types';
import { Address } from 'viem';

const run = async () => {
  const api = await substrateClient();

  const indexer = new Indexer(evmClient, api, DB);

  // await findAllEthereumBridgeContractAddresses();
  // await indexer.refetchAllBalances();
  // await indexer.processTransactions(['0x70c62a6dd1e7faa9ac6302bea7e1578e4600260f9af547fd4c65266f5d70aef9']);
  // await indexer.processBlock(BigInt(9372055));

  const nftIndexer = new NftIndexer(evmClient, api, DB);

  await getTokenDetails('0xBBBbbBbB00007864000000000000000000000000', true);

  // await nftIndexer.fetchMetadataOfToken('0xAAAaaAaA00014464000000000000000000000000', 3384);
  // await nftIndexer.createNftHolderRefreshTasks();
  await nftIndexer.fetchHoldersOfCollection('0xBBBbbBbB00007864000000000000000000000000' as Address);

  // await updateStakingValidators();

  // await indexer.checkFinalizedBlocks();

  await api.rpc.chain.subscribeNewHeads(async (header) => {
    console.log(`Chain is at block: #${header.number}`);
    const blockNumber = Number(header.number);
    await queue.add(
      'PROCESS_BLOCK',
      { blocknumber: blockNumber },
      {
        priority: 1,
        jobId: `BLOCK_${blockNumber}`
      }
    );
  });
};

run();
