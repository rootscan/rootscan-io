/** THIS FILE IS FOR TEST PURPOSES AND WILL BE REMOVED FURTHER DOWN THE ROAD */
import DB from '@/database';
import { NftOwnersIndexer } from '@/nft-indexer/nft-owners-indexer';
import { evmClient } from '@/rpc';
// import { getTokenDetails } from '@/utils/tokenInformation';
import '@therootnetwork/api-types';

// import { Address } from 'viem';

const run = async () => {
  // const api = await substrateClient();

  // const indexer = new Indexer(evmClient, api, DB);

  // await DB.NftOwner.updateMany({ _metadataProcessed: true }, { _metadataProcessed: null });
  // const nftTokenData = new NftTokenData(evmClient);
  // const r = await nftTokenData.getTokenMetadata('ERC721', '0xaaaaAaAA00013864000000000000000000000000', 0);
  // console.log(r);
  // await nftTokenData.test();
  // await findAllEthereumBridgeContractAddresses();
  const indexer = new NftOwnersIndexer(DB, evmClient);
  await indexer.processNftOwnersMetadata();
  // await indexer.refetchAllBalances();
  // await indexer.processTransactions(['0x01f399bfc1b832b0169c9fe0002e0733abaa69c132a96cfc8309d1ac8cbca43d']);
  // await indexer.processBlock(BigInt(13130069));

  // const nftIndexer = new NftIndexer(evmClient, api, DB);

  // // await getTokenDetails('0x6E04447B6Cd7DA93f30f2096989c37f367cf11b9', true);
  // await getTokenDetails('0xea5E3c6887aA148aF41267662235Bc8D6b7E4f90', true);
  // // await nftIndexer.fetchMetadataOfToken('0xAAAaaAaA00014464000000000000000000000000', 3384);
  // // await nftIndexer.createNftHolderRefreshTasks();
  // await nftIndexer.fetchHoldersOfCollection('0xBBbbbBbb00004864000000000000000000000000' as Address);

  // // await updateStakingValidators();

  // // await indexer.checkFinalizedBlocks();
  console.log('FINISH');
};

run();
