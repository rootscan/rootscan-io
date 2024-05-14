import ethereumAddresses from '@/constants/ethereumAddresses';
import knownAddresses from '@/constants/knownAddresses';
import validatorAddresses from '@/constants/knownValidators';
import DB from '@/database';
import logger from '@/logger';
import { substrateClient } from '@/rpc';
import { IBulkWriteUpdateOp } from '@/types';
import { getTokenDetails } from '@/utils/tokenInformation';
import queue from '@/workerpool';
import '@therootnetwork/api-types';
import { assetIdToERC20Address, collectionIdToERC721Address, collectionIdToERC1155Address } from '@therootnetwork/evm';
import { Address, getAddress } from 'viem';

export const findAllKnownAddresses = async (): Promise<void> => {
  // @dev - Parse all known tags
  const ops: IBulkWriteUpdateOp[] = [];
  for (const { address, nameTag } of knownAddresses) {
    ops.push({
      updateOne: {
        filter: {
          address: getAddress(address),
        },
        update: {
          $set: {
            address: getAddress(address),
            rns: null,
            nameTag,
            isContract: true,
          },
        },
        upsert: true,
      },
    });
  }

  await DB.Address.bulkWrite(ops);
};

export const findAllEthereumBridgeContractAddresses = async (): Promise<void> => {
  const ops: IBulkWriteUpdateOp[] = [];
  for (const { contractAddress, nativeId, type } of ethereumAddresses) {
    const query =
      type === 'ERC20'
        ? {
            assetId: Number(nativeId),
          }
        : type === 'ERC721'
        ? {
            collectionId: Number(nativeId),
          }
        : null;

    if (!query) continue;

    ops.push({
      updateOne: {
        filter: query,
        update: {
          $set: {
            ...query,
            ethereumContractAddress: getAddress(contractAddress),
          },
        },
        upsert: true,
      },
    });
  }

  await DB.Token.bulkWrite(ops);
};

export const createFindPrecompiledTokensTasks = async (): Promise<void> => {
  const batchSize = 100;
  const maxBatchSupply = 100_000;
  const batches = Math.ceil(maxBatchSupply / batchSize);
  for (let i = 0; i < batches; i++) {
    const from = i * batchSize;
    const to = from + batchSize;
    await queue.add(
      'FIND_PRECOMPILE_TOKENS',
      { from, to },
      {
        jobId: `PRECOMPILE_TASK_${from}_${to}`,
      },
    );
  }
};

export const findPrecompiledTokens = async (from: number, to: number): Promise<void> => {
  for (let i = from; i < to; i++) {
    try {
      const CONTRACT_ADDRESS_ERC721 = collectionIdToERC721Address(i);
      const CONTRACT_ADDRESS_ERC1155 = collectionIdToERC1155Address(i);
      const CONTRACT_ADDRESS_ERC20 = assetIdToERC20Address(i);

      logger.info(`Scanning for nativeId ${i}`);

      await Promise.all([
        getTokenDetails(CONTRACT_ADDRESS_ERC721 as Address, true),
        getTokenDetails(CONTRACT_ADDRESS_ERC1155 as Address, true),
        getTokenDetails(CONTRACT_ADDRESS_ERC20 as Address, true),
      ]);
    } catch {
      /*eslint no-empty: "error"*/
    }
  }
};

export const updateStakingValidators = async () => {
  const api = await substrateClient();
  const activeEra: any = await api.query.staking.activeEra();
  const activeEraIndex = activeEra.toPrimitive()?.index;
  const exposures = await api.query.staking.erasStakers.entries(activeEra.unwrap().index);

  const validatorsOps: IBulkWriteUpdateOp[] = [];

  exposures.forEach(([key, exposure]) => {
    const keyArgs = key?.args?.map((k) => k.toHuman());
    const era = Number(keyArgs?.[0]);
    const validator = keyArgs?.[1] as Address;
    const data: any = exposure.toPrimitive();
    const nominators = data?.others?.length;
    const totalRootNominated = data?.total;
    const isOversubscribed = nominators > 256 ? true : false;

    const parsedData = {
      era,
      validatorName: validatorAddresses[getAddress(String(validator))] || '',
      validator: getAddress(String(validator)),
      nominators,
      totalRootNominated,
      isOversubscribed,
    };
    validatorsOps.push({
      updateOne: {
        filter: {
          era: parsedData.era,
          validator: parsedData.validator,
        },
        update: {
          $set: parsedData,
        },
        upsert: true,
      },
    });
  });
  if (validatorsOps?.length) {
    await DB.StakingValidator.bulkWrite(validatorsOps);
  }

  await DB.StakingValidator.deleteMany({ era: { $ne: Number(activeEraIndex) } });

  return true;
};

export const findMissingBlocks = async () => {
  const missingBlocks = await DB.Block.aggregate(
    [
      {
        $sort: {
          number: -1,
        },
      },
      {
        $limit: 100_000,
      },
      {
        $group: {
          _id: '_',
          mbs: {
            $push: '$number',
          },
          first: {
            $last: '$number',
          },
          last: {
            $first: '$number',
          },
        },
      },
      {
        $project: {
          numbers: {
            $setDifference: [
              {
                $range: ['$first', '$last'],
              },
              '$mbs',
            ],
          },
        },
      },
    ],
    {
      allowDiskUse: true,
    },
  );

  const misBlocks = missingBlocks?.[0]?.numbers || [];

  for (const missingBlock of misBlocks) {
    const blockNumber = Number(missingBlock);
    logger.info(`Detected missing block => ${blockNumber}`);
    await queue.add(
      'PROCESS_BLOCK',
      { blocknumber: blockNumber },
      {
        priority: 1,
        jobId: `BLOCK_${blockNumber}`,
      },
    );
  }

  return true;
};
