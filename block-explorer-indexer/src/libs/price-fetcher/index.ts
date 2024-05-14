import DB from '@/database';
import logger from '@/logger';
import { IBulkWriteUpdateOp } from '@/types';
import dotenv from 'dotenv';
import { getAddress } from 'viem';

dotenv.config();

export const updateTokenPricingDetails = async () => {
  if (!process.env.CMC_API_KEY) {
    throw new Error('CMC_API_KEY not defined in env.');
  }
  const tokens = [
    {
      name: 'Root',
      ucid: '28479',
      contractAddress: '0xcCcCCccC00000001000000000000000000000000',
    },
    {
      name: 'Sylo',
      ucid: '5662',
      contractAddress: '0xcCcCCCCc00000864000000000000000000000000',
    },
    {
      name: 'ASTO',
      ucid: '19164',
      contractAddress: '0xCccCccCc00001064000000000000000000000000',
    },
    {
      name: 'XRP',
      ucid: '52',
      contractAddress: '0xCCCCcCCc00000002000000000000000000000000',
    },
    {
      name: 'USDT',
      ucid: '825',
      contractAddress: '0xCCCccccc00001864000000000000000000000000',
    },
    {
      name: 'USDC',
      ucid: '3408',
      contractAddress: '0xCCcCCcCC00000C64000000000000000000000000',
    },
    {
      name: 'DAI',
      ucid: '4943',
      contractAddress: '0xcCCCcCcc00002464000000000000000000000000',
    },
    {
      name: 'ETH',
      ucid: '1027',
      contractAddress: '0xccCcCccC00000464000000000000000000000000',
    },
  ];

  const ucids = tokens.map((a) => a.ucid).join(',');
  const url = `https://pro-api.coinmarketcap.com/v2/cryptocurrency/quotes/latest?id=${ucids}&skip_invalid=true`;

  const res = await fetch(url, {
    headers: {
      'X-CMC_PRO_API_KEY': process.env.CMC_API_KEY,
    },
  });

  const ops: IBulkWriteUpdateOp[] = [];
  if (res.ok) {
    const jsonData = await res.json();
    for (const token of tokens) {
      const priceData = jsonData?.data?.[token.ucid];
      if (!priceData) continue;

      logger.info(`Updating price of ${token.name}`);
      ops.push({
        updateOne: {
          filter: {
            contractAddress: getAddress(token.contractAddress),
          },
          update: {
            $set: {
              contractAddress: getAddress(token.contractAddress),
              priceData: priceData?.quote?.USD,
            },
          },
          upsert: true,
        },
      });
    }
  }

  if (ops?.length) {
    await DB.Token.bulkWrite(ops);
  }

  return true;
};
