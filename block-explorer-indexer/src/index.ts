/** THIS FILE IS FOR TEST PURPOSES AND WILL BE REMOVED FURTHER DOWN THE ROAD */
import DB from '@/database';
import Indexer from '@/indexer';
import { findAllEthereumBridgeContractAddresses } from '@/indexer/tasks/prepopulate';
import NftIndexer from '@/nft-indexer';
import { evmClient, substrateClient } from '@/rpc';
import { getTokenDetails } from '@/utils/tokenInformation';
import '@therootnetwork/api-types';
import { Address } from 'viem';

const run = async () => {
  const api = await substrateClient();

  const indexer = new Indexer(evmClient, api, DB);

  await findAllEthereumBridgeContractAddresses();
  // await indexer.refetchAllBalances();
  // await indexer.processTransactions(['0x70c62a6dd1e7faa9ac6302bea7e1578e4600260f9af547fd4c65266f5d70aef9']);
  await indexer.processBlock(BigInt(10698563));

  const nftIndexer = new NftIndexer(evmClient, api, DB);

  // await getTokenDetails('0x6E04447B6Cd7DA93f30f2096989c37f367cf11b9', true);
  await getTokenDetails('0xea5E3c6887aA148aF41267662235Bc8D6b7E4f90', true);
  // await nftIndexer.fetchMetadataOfToken('0xAAAaaAaA00014464000000000000000000000000', 3384);
  // await nftIndexer.createNftHolderRefreshTasks();
  await nftIndexer.fetchHoldersOfCollection('0xBBbbbBbb00004864000000000000000000000000' as Address);

  // await updateStakingValidators();

  // await indexer.checkFinalizedBlocks();
};

run();
