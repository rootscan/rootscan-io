import DB from '@/database';
import logger from '@/logger';
import { createTransactionsJobs } from '@/utils';
import dotenv from 'dotenv';
import { Hash, getAddress } from 'viem';

dotenv.config();

export const checkForNewlyVerifiedContracts = async () => {
  if (!process?.env?.CHAIN_ID) {
    logger.error(`Missing CHAIN_ID in .env`);
    throw new Error('Missing CHAIN_ID in .env');
  }
  const chainId = Number(process?.env?.CHAIN_ID);
  const verifiedContracts = await fetch(`https://sourcify.dev/server/files/contracts/${chainId}`).then(async (resp) => {
    if (resp.ok) {
      return await resp.json();
    }
  });

  if (verifiedContracts) {
    const contractAddresses = verifiedContracts?.full?.map((a) => getAddress(a)) || [];
    const alreadyVerifiedList = await DB.VerifiedContract.find({ address: { $in: contractAddresses } }).lean();
    for (const contractAddress of contractAddresses) {
      const alreadyVerified = alreadyVerifiedList.find((a) => getAddress(a.address) === getAddress(contractAddress));
      if (alreadyVerified) continue;
      // @dev look up abi and create record
      const lookUpAbi = await fetch(
        `https://repo.sourcify.dev/contracts/full_match/${chainId}/${getAddress(contractAddress)}/metadata.json`,
      )
        .then(async (resp) => {
          if (!resp.ok) {
            return null;
          } else {
            return await resp.json();
          }
        })
        .catch(() => {
          return null;
        });
      if (!lookUpAbi) continue;
      const verifiedAbi = lookUpAbi?.output?.abi;
      const contractName =
        lookUpAbi?.settings?.compilationTarget?.[Object.keys(lookUpAbi?.settings?.compilationTarget)?.[0]];
      await DB.VerifiedContract.updateOne(
        {
          address: getAddress(contractAddress),
        },
        {
          address: getAddress(contractAddress),
          contractName,
          abi: verifiedAbi,
        },
        { upsert: true },
      );

      // @dev - reindex all transactions that ever happened to and from this contract
      const allTxs: Hash[] = await DB.EvmTransaction.find({ to: getAddress(contractAddress) }).distinct('hash');

      await createTransactionsJobs(allTxs);
      logger.info(`Contractaddress ${contractAddress} is now verified, reindexing all transactions.`);
    }
  }
};
