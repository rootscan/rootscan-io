import DB from '@/database';
import logger from '@/logger';
import {
  IAddress,
  IBalance,
  IEVMTransaction,
  IEvent,
  IExtrinsic,
  INftOwner,
  IStakingValidator,
  IToken,
  TTokenType,
} from '@/types';
import cors from 'cors';
import { ZeroAddress } from 'ethers';
import express, { NextFunction, Request, Response } from 'express';
import helmet from 'helmet';
import moment from 'moment';
import Mongoose, { FilterQuery, PaginateOptions } from 'mongoose';
import { Address, Hash, formatUnits, getAddress } from 'viem';

import { processError } from './utils';

function getPageAndLimit(body: Record<string, unknown>): { page: number; limit: number } {
  return {
    page: Number(body?.page) || 1,
    limit: Number(body?.limit) || 25,
  };
}

const app = express();

/** @dev Middlewares */
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cors('*'));
app.use(helmet());

app.use((req: Request, res: Response, next: NextFunction) => {
  res.on('finish', () => {
    logger.info(`[${req.method}] ${req.originalUrl} [${JSON.stringify(req.body)}]`);
  });

  next();
});

app.post('/getBlock', async (req: Request, res: Response) => {
  try {
    const number = Number(req.body.number) || undefined;
    const data = await DB.Block.findOne({ number }).lean();
    return res.json(data);
  } catch (e) {
    processError(e, res);
  }
});

app.post('/getBlocks', async (req: Request, res: Response) => {
  try {
    const options: PaginateOptions = {
      ...getPageAndLimit(req.body),
      sort: '-number',
      skipFullCount: true,
      allowDiskUse: true,
      lean: true,
    };
    const data = await DB.Block.paginate({}, options);
    return res.json(data);
  } catch (e) {
    processError(e, res);
  }
});

app.post('/getEvents', async (req: Request, res: Response) => {
  try {
    const query: { extrinsicId?: string; blockNumber?: string } = req.body.query;
    const filter: FilterQuery<IEvent> = {};

    if (query?.extrinsicId) {
      filter.extrinsicId = String(query.extrinsicId);
      // if sent retroExtrinsicId (0011766360-000001-2d9a4) - get real extrinsicId from retroExtrinsicId
      if (/^\d{10}-\d{6}-[0-9a-f]{5}$/gm.test(query.extrinsicId)) {
        const extrinsic: IExtrinsic | null = await DB.Extrinsic.findOne({
          retroExtrinsicId: filter.extrinsicId,
        }).lean();
        filter.extrinsicId = extrinsic?.extrinsicId || filter.extrinsicId;
      }
    }

    if (query?.blockNumber) {
      filter.blockNumber = Number(query.blockNumber) || undefined;
    }

    const options: PaginateOptions = {
      ...getPageAndLimit(req.body),
      allowDiskUse: true,
      skipFullCount: true,
    };

    if (query?.blockNumber || query?.extrinsicId) {
      const pipeline = DB.Event.aggregate([
        {
          $match: filter,
        },
        {
          $addFields: {
            numericPart: { $toInt: { $arrayElemAt: [{ $split: ['$eventId', '-'] }, 1] } },
          },
        },
        { $sort: { numericPart: 1 } },
      ]);
      // @ts-expect-error aggregatePipeline does exist
      const data = await DB.Event.aggregatePaginate(pipeline, options);
      return res.json(data);
    } else {
      const data = await DB.Event.paginate(filter, {
        ...options,
        sort: '-blockNumber',
        lean: true,
      });
      return res.json(data);
    }
  } catch (e) {
    processError(e, res);
  }
});

app.post('/getEvent', async (req: Request, res: Response) => {
  try {
    const eventId = String(req.body.eventId) || undefined;
    const data = await DB.Event.findOne({ eventId }).populate('token swapFromToken swapToToken nftCollection').lean();
    return res.json(data);
  } catch (e) {
    processError(e, res);
  }
});

app.post('/getExtrinsic', async (req: Request, res: Response) => {
  try {
    const { extrinsicId }: { extrinsicId: string } = req.body;
    const data: (IExtrinsic & { events?: IEvent[] }) | null = await DB.Extrinsic.findOne({
      $or: [{ extrinsicId: String(extrinsicId) }, { retroExtrinsicId: String(extrinsicId) }],
    })
      .populate('proxyFeeToken')
      .lean();

    const events = await DB.Event.find({ extrinsicId: String(data?.extrinsicId) })
      .populate('token swapFromToken swapToToken nftCollection')
      .lean();

    if (data && events) {
      data.events = events;
    }
    return res.json(data);
  } catch (e) {
    processError(e, res);
  }
});

app.post('/getToken', async (req: Request, res: Response) => {
  try {
    const contractAddress = getAddress(req.body.contractAddress).toString();

    const data: (IToken & { holders?: number }) | null = await DB.Token.findOne({
      contractAddress,
    }).lean();

    if (data) {
      if (data?.type === 'ERC20') {
        const holders = await DB.Balance.find({ contractAddress }).countDocuments();
        data.holders = holders;
      } else if (data?.type === 'ERC721' || data?.type === 'ERC1155') {
        const holders = await DB.NftOwner.find({ contractAddress }).distinct('owner');
        data.holders = holders?.length;
      }
    }
    return res.json(data);
  } catch (e) {
    processError(e, res);
  }
});

app.post('/getTokenHolders', async (req: Request, res: Response) => {
  const { page, limit } = getPageAndLimit(req.body);
  const contractAddress = getAddress(req.body.contractAddress).toString();
  try {
    const data: (IToken & { holders?: number }) | null = await DB.Token.findOne({
      contractAddress,
    }).lean();

    let holders: { docs?: (IBalance | INftOwner)[]; type?: TTokenType } = {};
    if (data) {
      if (data?.type === 'ERC20') {
        const options: PaginateOptions = {
          page,
          limit,
          sort: '-balance',
          populate: 'tokenDetails',
          allowDiskUse: true,
          skipFullCount: true,
          lean: true,
        };

        holders = await DB.Balance.paginate({ contractAddress }, options);
      } else if (data?.type === 'ERC721') {
        const pipeline = DB.NftOwner.aggregate([
          {
            $match: {
              contractAddress,
            },
          },
          {
            $group: {
              _id: '$owner',
              count: {
                $sum: 1,
              },
            },
          },
          {
            $sort: {
              count: -1,
            },
          },
          {
            $project: {
              _id: 0,
              owner: '$_id',
              count: 1,
            },
          },
        ]);
        // @ts-expect-error aggregatePipeline does exist
        holders = await DB.NftOwner.aggregatePaginate(pipeline, { page, limit });
      } else if (data?.type === 'ERC1155') {
        const pipeline = DB.NftOwner.aggregate([
          {
            $match: {
              contractAddress,
            },
          },
          {
            $group: {
              _id: '$owner',
              count: {
                $sum: '$amount',
              },
            },
          },
          {
            $sort: {
              count: -1,
            },
          },
          {
            $project: {
              _id: 0,
              owner: '$_id',
              count: 1,
            },
          },
        ]);
        // @ts-expect-error aggregatePipeline does exist
        holders = await DB.NftOwner.aggregatePaginate(pipeline, { page, limit });
      }
      if (holders) {
        holders.type = data?.type as TTokenType;
      }
    }
    return res.json(holders);
  } catch (e) {
    processError(e, res);
  }
});

app.post('/getExtrinsicsInBlock', async (req: Request, res: Response) => {
  try {
    const block = Number(req.body.number) || undefined;
    const data = await DB.Extrinsic.find({ block }).lean();
    return res.json(data);
  } catch (e) {
    processError(e, res);
  }
});

app.post('/getExtrinsicsForAddress', async (req: Request, res: Response) => {
  try {
    const address = getAddress(req.body.address).toString();

    const options = {
      ...getPageAndLimit(req.body),
      sort: '-block',
      paginate: false,
      skipFullCount: true,
      allowDiskUse: true,
      lean: true,
    };

    const data = await DB.Extrinsic.paginate(
      {
        $or: [{ signer: address }, { 'args.futurepass': address }, { 'args.call.args.target': address?.toLowerCase() }],
      },
      options,
    );

    return res.json(data);
  } catch (e) {
    processError(e, res);
  }
});

app.post('/getNftsForAddress', async (req: Request, res: Response) => {
  try {
    const address = getAddress(req.body.address).toString();
    const contractAddress = getAddress(req.body.contractAddress).toString();

    const options = {
      ...getPageAndLimit(req.body),
      skipFullCount: true,
      allowDiskUse: true,
      sort: '-contractAddress tokenId',
      lean: true,
    };
    const data = await DB.NftOwner.paginate({ owner: address, contractAddress }, options);
    return res.json(data);
  } catch (e) {
    processError(e, res);
  }
});

app.post('/getNftCollectionsForAddress', async (req: Request, res: Response) => {
  try {
    const address = getAddress(req.body.address).toString();

    const options = {
      ...getPageAndLimit(req.body),
      allowDiskUse: true,
    };

    const pipeline = DB.NftOwner.aggregate([
      {
        $match: {
          owner: address,
        },
      },
      {
        $group: {
          _id: '$contractAddress',
          count: {
            $sum: 1,
          },
        },
      },
      {
        $lookup: {
          from: 'tokens',
          localField: '_id',
          foreignField: 'contractAddress',
          as: 'tokenLookUp',
        },
      },
      {
        $project: {
          _id: 0,
          contractAddress: '$_id',
          count: 1,
          tokenLookUp: {
            $arrayElemAt: ['$tokenLookUp', 0],
          },
        },
      },
    ]);

    // @ts-expect-error aggregatePipeline does exist
    const data = await DB.NftOwner.aggregatePaginate(pipeline, options);

    return res.json(data);
  } catch (e) {
    processError(e, res);
  }
});

app.post('/getTransactions', async (req: Request, res: Response) => {
  try {
    const options = {
      ...getPageAndLimit(req.body),
      sort: '-blockNumber',
      populate: 'fromLookup toLookup',
      skipFullCount: true,
      allowDiskUse: true,
      lean: true,
    };
    const data = await DB.EvmTransaction.paginate({}, options);
    return res.json(data);
  } catch (e) {
    processError(e, res);
  }
});

app.post('/getTransactionsInBlock', async (req: Request, res: Response) => {
  try {
    const blockNumber = Number(req.body.block) || undefined;
    const options = {
      ...getPageAndLimit(req.body),
      sort: '-blockNumber',
      populate: 'fromLookup toLookup',
      allowDiskUse: true,
      skipFullCount: true,
      lean: true,
    };
    const data = await DB.EvmTransaction.paginate({ blockNumber }, options);
    return res.json(data);
  } catch (e) {
    processError(e, res);
  }
});

app.post('/getEVMTransactionsForWallet', async (req: Request, res: Response) => {
  try {
    const address = getAddress(req.body.address).toString();

    const options = {
      ...getPageAndLimit(req.body),
      sort: '-blockNumber',
      populate: 'fromLookup toLookup',
      skipFullCount: true,
      allowDiskUse: true,
      lean: true,
    };

    const data = await DB.EvmTransaction.paginate({ $or: [{ from: address }, { to: address }] }, options);

    return res.json(data);
  } catch (e) {
    processError(e, res);
  }
});

app.post('/getNativeTransfersForAddress', async (req: Request, res: Response) => {
  try {
    const address = getAddress(req.body.address).toString();

    const options = {
      ...getPageAndLimit(req.body),
      sort: '-blockNumber',
      skipFullCount: true,
      allowDiskUse: true,
      populate: 'extrinsicData tokenNative nftCollection',
      lean: true,
    };

    const data = await DB.Event.paginate(
      {
        $or: [
          // Assets Pallet
          { section: 'assets', method: 'Transferred', 'args.from': address },
          { section: 'assets', method: 'Transferred', 'args.to': address },
          { section: 'assets', method: 'ApprovedTransfer', 'args.source': address },
          { section: 'assets', method: 'Issued', 'args.source': address },
          { section: 'assets', method: 'Issued', 'args.owner': address },
          { section: 'assets', method: 'Burned', 'args.owner': address },
          // Balances Pallet
          { section: 'balances', method: 'Reserved', 'args.who': address },
          { section: 'balances', method: 'Transfer', 'args.from': address },
          { section: 'balances', method: 'Transfer', 'args.to': address },
          { section: 'balances', method: 'Unreserved', 'args.who': address },
          // NFT Transfer
          { section: 'nft', method: 'Transfer', 'args.previousOwner': address },
          { section: 'nft', method: 'Transfer', 'args.newOwner': address },
          { section: 'nft', method: 'Mint', 'args.owner': address },
          // SFT
          { section: 'sft', method: 'Mint', 'args.owner': address },
          { section: 'sft', method: 'Transfer', 'args.previousOwner': address },
          { section: 'sft', method: 'Transfer', 'args.newOwner': address },
        ],
      },
      options,
    );

    return res.json(data);
  } catch (e) {
    processError(e, res);
  }
});

app.post('/getTokens', async (req: Request, res: Response) => {
  try {
    const type: string = req.body.type;
    const options = {
      ...getPageAndLimit(req.body),
      allowDiskUse: true,
      skipFullCount: true,
      sort: 'assetId collectionId',
      lean: true,
    };
    const query: { type?: string } = {};
    if (type) {
      query.type = type;
    }
    const data = await DB.Token.paginate(query, options);
    return res.json(data);
  } catch (e) {
    processError(e, res);
  }
});

app.post('/getExtrinsics', async (req: Request, res: Response) => {
  try {
    const options = {
      ...getPageAndLimit(req.body),
      sort: '-block -timestamp',
      allowDiskUse: true,
      skipFullCount: true,
      lean: true,
    };
    const data = await DB.Extrinsic.paginate({ section: { $ne: 'timestamp' }, method: { $ne: 'set' } }, options);
    return res.json(data);
  } catch (e) {
    processError(e, res);
  }
});

app.post('/getTokenTransfersFromAddress', async (req: Request, res: Response) => {
  try {
    const address = getAddress(req.body.address).toString();

    const options = {
      ...getPageAndLimit(req.body),
      sort: '-blockNumber',
      allowDiskUse: true,
    };

    const pipeline = DB.EvmTransaction.aggregate([
      {
        $match: {
          'events.eventName': { $in: ['Transfer', 'TransferSingle', 'TransferBatch'] },
          $or: [
            {
              'events.from': address,
            },
            {
              'events.to': address,
            },
          ],
        },
      },
      {
        $project: {
          type: 0,
          accessList: 0,
          input: 0,
          from: 0,
          to: 0,
        },
      },
      {
        $unwind: '$events',
      },
      {
        $match: {
          'events.eventName': { $in: ['Transfer', 'TransferSingle', 'TransferBatch'] },
          $or: [
            {
              'events.from': address,
            },
            {
              'events.to': address,
            },
          ],
        },
      },
      {
        $replaceRoot: {
          newRoot: {
            $mergeObjects: ['$events', '$$ROOT'],
          },
        },
      },
    ]);

    // @ts-expect-error aggregatePipeline does exist
    const data = await DB.EvmTransaction.aggregatePaginate(pipeline, options);

    return res.json(data);
  } catch (e) {
    processError(e, res);
  }
});

// TODO: remove this function when will be fixed "transactionFee" field in DB
function fixTransactionFee(item: IEVMTransaction | null): IEVMTransaction | null {
  if (item && item.effectiveGasPrice) {
    item.transactionFee = ((Number(item.effectiveGasPrice) * item.gasUsed) / 10 ** 9).toString();
  }
  return item;
}

app.post('/getTransaction', async (req: Request, res: Response) => {
  try {
    const { hash }: { hash: Hash } = req.body;

    const data: (IEVMTransaction & { xrpPriceData?: object }) | null = await DB.EvmTransaction.findOne({ hash })
      .populate('fromLookup toLookup')
      .lean();
    const xrpPrice = await DB.Token.findOne({ contractAddress: '0xCCCCcCCc00000002000000000000000000000000' }).lean();

    if (data && xrpPrice?.priceData) {
      data.xrpPriceData = xrpPrice?.priceData;
    }
    return res.json(fixTransactionFee(data));
  } catch (e) {
    processError(e, res);
  }
});

app.post('/getNft', async (req: Request, res: Response) => {
  try {
    const contractAddress = getAddress(req.body.contractAddress).toString();
    const tokenId = Number(req.body.tokenId);

    const data = await DB.NftOwner.findOne({ contractAddress, tokenId }).populate('nftCollection').lean();
    return res.json(data);
  } catch (e) {
    processError(e, res);
  }
});

app.post('/getAddress', async (req: Request, res: Response) => {
  try {
    const address = getAddress(req.body.address).toString();
    const data: (IAddress & { rootPriceData?: object | null }) | null = await DB.Address.findOne({
      address,
    })
      .populate('isVerifiedContract token')
      .lean();
    if (data?.balance?.freeFormatted) {
      const rootPriceData = await DB.Token.findOne({
        contractAddress: getAddress('0xcCcCCccC00000001000000000000000000000000'),
      })
        .select('priceData')
        .lean();
      data.rootPriceData = rootPriceData?.priceData;
    }
    return res.json(data);
  } catch (e) {
    processError(e, res);
  }
});

app.post('/getTokenBalances', async (req: Request, res: Response) => {
  try {
    const address = getAddress(req.body.address);
    const options = {
      ...getPageAndLimit(req.body),
      allowDiskUse: true,
      populate: 'tokenDetails',
      lean: true,
    };
    const data = await DB.Balance.paginate({ address }, options);

    return res.json(data);
  } catch (e) {
    processError(e, res);
  }
});

app.post('/getFuturepasses', async (req: Request, res: Response) => {
  try {
    const address = getAddress(req.body.address).toString();
    const options = {
      ...getPageAndLimit(req.body),
      allowDiskUse: true,
      skipFullCount: true,
      lean: true,
    };

    const data = await DB.Event.paginate(
      {
        method: 'FuturepassCreated',
        'args.delegate': address,
      },
      options,
    );

    return res.json(data);
  } catch (e) {
    processError(e, res);
  }
});

app.post('/generateReport', async (req: Request, res: Response) => {
  try {
    const { from, to }: { from: Date; to: Date } = req.body;
    const address = getAddress(req.body.address).toString();

    if (!moment(from).isValid()) {
      throw new Error('Invalid from date provided');
    }

    if (!moment(to).isValid()) {
      throw new Error('Invalid to date provided');
    }

    if (moment(from).isAfter(moment(to))) {
      throw new Error('From date cant be after to date');
    }

    const extrinsicsTokenLookupCache: { [key: string]: { [key: number]: IToken } } = {
      false: {},
      true: {},
    };
    const getEpochTime = (time, endOfDay = false) => {
      if (!endOfDay) {
        return moment(time).valueOf();
      } else {
        return moment(time).endOf('day').valueOf();
      }
    };

    const timestampQueryExtrinsics = {
      $gte: Math.floor(getEpochTime(from) / 1000),
      $lte: Math.floor(getEpochTime(to, true) / 1000),
    };
    const extrinsics = await DB.Event.find({
      $or: [
        // Assets Pallet
        {
          timestamp: timestampQueryExtrinsics,
          section: 'assets',
          method: 'Transferred',
          'args.from': address,
        },
        {
          timestamp: timestampQueryExtrinsics,
          section: 'assets',
          method: 'Transferred',
          'args.to': address,
        },
        {
          timestamp: timestampQueryExtrinsics,
          section: 'assets',
          method: 'Issued',
          'args.source': address,
        },
        {
          timestamp: timestampQueryExtrinsics,
          section: 'assets',
          method: 'Issued',
          'args.owner': address,
        },
        {
          timestamp: timestampQueryExtrinsics,
          section: 'assets',
          method: 'Burned',
          'args.owner': address,
        },
        // NFT, SFT Pallet
        {
          timestamp: timestampQueryExtrinsics,
          section: { $in: ['nft', 'sft'] },
          method: 'Transfer',
          'args.previousOwner': address,
        },
        {
          timestamp: timestampQueryExtrinsics,
          section: { $in: ['nft', 'sft'] },
          method: 'Transfer',
          'args.newOwner': address,
        },
        {
          timestamp: timestampQueryExtrinsics,
          section: { $in: ['nft', 'sft'] },
          method: 'Mint',
          'args.owner': address,
        },
        // Balances Pallet
        {
          timestamp: timestampQueryExtrinsics,
          section: 'balances',
          method: 'Reserved',
          'args.who': address,
        },
        {
          timestamp: timestampQueryExtrinsics,
          section: 'balances',
          method: 'Transfer',
          'args.from': address,
        },
        {
          timestamp: timestampQueryExtrinsics,
          section: 'balances',
          method: 'Transfer',
          'args.to': address,
        },
        {
          timestamp: timestampQueryExtrinsics,
          section: 'balances',
          method: 'Unreserved',
          'args.who': address,
        },
      ],
    })
      .sort('-timestamp')
      .lean();

    let csv = `Date,Tx Hash,Type,Method,Amount,Currency,From,To\n`;

    const findAndCacheToken = async (assetId: number, isCollectionId = false): Promise<IToken | null> => {
      if (extrinsicsTokenLookupCache[String(isCollectionId)][assetId]) {
        return extrinsicsTokenLookupCache[String(isCollectionId)][assetId];
      } else {
        const query = { assetId };
        const collectionIdQuery = { collectionId: assetId };
        const token: IToken | null = await DB.Token.findOne(isCollectionId ? collectionIdQuery : query).lean();
        if (!token) return null;
        extrinsicsTokenLookupCache[String(isCollectionId)][assetId] = token;
        return token;
      }
    };
    for (const extrinsic of extrinsics) {
      const args = extrinsic?.args;
      let from = ZeroAddress;
      let to = ZeroAddress;
      let type = '';
      const date = moment(extrinsic.timestamp * 1000).toISOString();
      const txHash = extrinsic?.extrinsicId || '-';
      let amount = '0';
      let currency = '';

      if (extrinsic.method === 'Transferred') {
        from = args?.from;
        to = args?.to;
        if (from === address) {
          type = 'out';
        } else if (to === address) {
          type = 'in';
        }
        const tokenLookup = await findAndCacheToken(args.assetId);
        if (!tokenLookup || !tokenLookup?.decimals) continue;

        currency = tokenLookup.name;

        amount = formatUnits(BigInt(args.amount), tokenLookup.decimals);
      }

      if (extrinsic.method === 'Issued') {
        to = args?.owner;
        type = 'in';
        const tokenLookup = await findAndCacheToken(args.assetId);
        if (!tokenLookup || !tokenLookup?.decimals) continue;
        currency = tokenLookup.name;
        amount = formatUnits(BigInt(args.totalSupply), tokenLookup.decimals);
      }

      if (extrinsic.method === 'Burned') {
        from = getAddress(args.owner);
        type = 'out';
        const tokenLookup = await findAndCacheToken(args.assetId);
        if (!tokenLookup || !tokenLookup?.decimals) continue;
        currency = tokenLookup.name;
        amount = formatUnits(BigInt(args.balance), tokenLookup.decimals);
      }

      if (extrinsic.method === 'Reserved') {
        from = getAddress(args.who);
        type = 'out';
        const tokenLookup = await findAndCacheToken(1);
        if (!tokenLookup || !tokenLookup?.decimals) continue;
        currency = tokenLookup.name;
        amount = formatUnits(BigInt(args.amount), tokenLookup.decimals);
      }

      if (extrinsic.method === 'Unreserved') {
        to = getAddress(args.who);
        type = 'out';
        const tokenLookup = await findAndCacheToken(1);
        if (!tokenLookup || !tokenLookup?.decimals) continue;
        currency = tokenLookup.name;
        amount = formatUnits(BigInt(args.amount), tokenLookup.decimals);
      }

      if (extrinsic.section === 'balances' && extrinsic.method === 'Transfer') {
        from = args?.from;
        to = args?.to;
        if (from === getAddress(address)) {
          type = 'out';
        } else if (to === getAddress(address)) {
          type = 'in';
        }
        const tokenLookup = await findAndCacheToken(1);
        if (!tokenLookup || !tokenLookup?.decimals) continue;

        currency = tokenLookup.name;

        amount = formatUnits(BigInt(args.amount), tokenLookup.decimals);
      }

      if (['nft', 'sft'].includes(extrinsic.section) && extrinsic.method === 'Transfer') {
        from = args?.previousOwner;
        to = args?.newOwner;
        if (from === getAddress(address)) {
          type = 'out';
        } else if (to === getAddress(address)) {
          type = 'in';
        }
        const tokenLookup = await findAndCacheToken(args.collectionId, true);
        if (!tokenLookup) continue;

        currency = tokenLookup.name;

        amount = `TokenIds: ${args?.serialNumbers?.join('|') || ''}`;
      }

      if (['nft', 'sft'].includes(extrinsic.section) && extrinsic.method === 'Mint') {
        from = '0x0000000000000000000000000000000000000000';
        to = args?.owner;
        type = 'mint';
        const tokenLookup = await findAndCacheToken(args.collectionId, true);
        if (!tokenLookup) continue;

        currency = tokenLookup.name;

        amount =
          extrinsic.section === 'nft'
            ? `TokenIds: ${args?.start}-${args?.end}`
            : `SerialNumbers: ${args?.serialNumbers?.join('|')}`;
      }

      csv += `${date},${txHash},${type},${extrinsic.method},${amount},${currency},${from},${to}\n`;
    }

    const timestampEvmQuery = { $gte: moment(from).valueOf(), $lte: moment(to).valueOf() };
    const evmTransactions = await DB.EvmTransaction.aggregate([
      {
        $match: {
          timestamp: timestampEvmQuery,
          'events.eventName': 'Transfer',
          $or: [
            {
              'events.from': address,
            },
            {
              'events.to': address,
            },
          ],
        },
      },
      {
        $project: {
          type: 0,
          accessList: 0,
          input: 0,
          from: 0,
          to: 0,
        },
      },
      { $unwind: '$events' },
      {
        $match: {
          'events.eventName': 'Transfer',
          $or: [
            {
              'events.from': address,
            },
            {
              'events.to': address,
            },
          ],
        },
      },
      {
        $replaceRoot: {
          newRoot: {
            $mergeObjects: ['$events', '$$ROOT'],
          },
        },
      },
    ]);

    for (const evmTx of evmTransactions) {
      const args = evmTx.events;
      const date = moment(evmTx.timestamp).toISOString();
      const txHash = evmTx.hash;
      const from = args?.from;
      const to = args?.to;
      const type = from === address ? 'out' : 'in';
      const amount = args?.type === 'ERC20' ? args.formattedAmount : args.tokenId;
      const currency = args?.name;

      csv += `${date},${txHash},${type},${amount},${currency},${from},${to}\n`;
    }

    return res.send(csv);
  } catch (e) {
    processError(e, res);
  }
});

app.post('/getAddresses', async (req: Request, res: Response) => {
  try {
    const options = {
      ...getPageAndLimit(req.body),
      allowDiskUse: true,
      skipFullCount: true,
      sort: '-balance.free',
      lean: true,
    };

    const data: { docs?: ({ xrpBalance?: number } & IAddress)[] } = await DB.Address.paginate({}, options);

    if (data?.docs) {
      const addresses = data?.docs?.map((a) => a.address);

      const xrpBalances: IBalance[] = await DB.Balance.find({
        address: { $in: addresses },
        contractAddress: '0xCCCCcCCc00000002000000000000000000000000',
      })
        .select('address balance')
        .lean();

      for (const record of data.docs) {
        const xrpBalance = xrpBalances.find((a) => a.address == record.address);
        if (xrpBalance) {
          record.xrpBalance = xrpBalance?.balance;
        }
      }
    }

    return res.json(data);
  } catch (e) {
    processError(e, res);
  }
});

app.post('/getBridgeTransactions', async (req: Request, res: Response) => {
  try {
    const options = {
      ...getPageAndLimit(req.body),
      populate: 'xrplProcessingOk bridgeErc20Token bridgeErc721Token',
      allowDiskUse: true,
      skipFullCount: true,
      sort: '-block',
      lean: true,
    };

    const genPartialKey = (key: string, isLowerCase: boolean) => {
      if (!req.body.address) return {};
      const address = getAddress(req.body.address).toString();
      return { [key]: isLowerCase ? address.toLowerCase() : address };
    };

    const data = await DB.Extrinsic.paginate(
      {
        $or: [
          // {
          //   method: 'withdrawXrp',
          //   section: 'xrplBridge'
          // },
          {
            method: 'submitTransaction',
            section: 'xrplBridge',
            ...genPartialKey('args.transaction.payment.address', true),
          },
          {
            section: 'ethBridge',
            method: 'submitEvent',
            ...genPartialKey('args.to', false),
          },
        ],
      },
      options,
    );

    return res.json(data);
  } catch (e) {
    processError(e, res);
  }
});

app.post('/getVerifiedContracts', async (req: Request, res: Response) => {
  try {
    const options = {
      ...getPageAndLimit(req.body),
      sort: '-deployedBlock',
      allowDiskUse: true,
      lean: true,
    };

    const data = await DB.VerifiedContract.paginate({}, options);

    return res.json(data);
  } catch (e) {
    processError(e, res);
  }
});

app.post('/getStakingValidators', async (req: Request, res: Response) => {
  try {
    const options = {
      ...getPageAndLimit(req.body),
      allowDiskUse: true,
      sort: '-nominators',
      lean: true,
    };

    const data: { docs: (IStakingValidator & { blocksValidated?: number })[] } = await DB.StakingValidator.paginate(
      {},
      options,
    );

    const addresses = data?.docs?.map((a) => getAddress(a.validator));
    const aggPipe = await DB.Block.aggregate([
      {
        $sort: {
          number: -1,
        },
      },
      {
        // 86400 seconds / 4 second block time = 21600
        $limit: 21600,
      },
      {
        $match: {
          'evmBlock.miner': {
            $in: addresses,
          },
        },
      },
      {
        $group: {
          _id: '$evmBlock.miner',
          count: {
            $sum: 1,
          },
        },
      },
      {
        $project: {
          _id: 0,
          address: '$_id',
          count: 1,
        },
      },
    ]);

    for (const address of data.docs) {
      const lookUp = aggPipe.find((a) => a.address === address.validator);
      if (lookUp) {
        address.blocksValidated = lookUp.count;
      }
    }
    return res.json(data);
  } catch (e) {
    processError(e, res);
  }
});

app.post('/getDex', async (req: Request, res: Response) => {
  try {
    const options = {
      ...getPageAndLimit(req.body),
      allowDiskUse: true,
      skipFullCount: true,
      sort: '-blockNumber',
      populate: 'swapFromToken swapToToken',
      lean: true,
    };
    const data = await DB.Event.paginate(
      {
        $or: [
          {
            method: 'Swap',
            section: 'dex',
          },
        ],
      },
      options,
    );

    return res.json(data);
  } catch (e) {
    processError(e, res);
  }
});

app.post('/getRootPrice', async (req: Request, res: Response) => {
  try {
    const data = await DB.Token.findOne({ contractAddress: '0xcCcCCccC00000001000000000000000000000000' }).lean();
    return res.json(data?.priceData);
  } catch (e) {
    processError(e, res);
  }
});

app.post('/getChainSummary', async (req: Request, res: Response) => {
  try {
    const addresses = await DB.Address.find().estimatedDocumentCount();
    const signedExtrinsics = await DB.Extrinsic.find({ isSigned: true }).estimatedDocumentCount();
    const evmTransactions = await DB.EvmTransaction.find().estimatedDocumentCount();
    return res.json({ addresses, signedExtrinsics, evmTransactions });
  } catch (e) {
    processError(e, res);
  }
});

app.get('/getRequiredComponents', async (req: Request, res: Response) => {
  try {
    const events = await DB.Event.aggregate([
      {
        $group: {
          _id: '$section',
          methods: {
            $addToSet: '$method',
          },
        },
      },
    ]);
    const extrinsics = await DB.Extrinsic.aggregate([
      {
        $group: {
          _id: '$section',
          methods: {
            $addToSet: '$method',
          },
        },
      },
    ]);
    return res.json({ events, extrinsics });
  } catch (e) {
    processError(e, res);
  }
});

app.get('/ready', async (req: Request, res: Response) => {
  return res.json({ ready: true });
});

const server = app.listen(3001, () => {
  logger.info(`🚀`);
});

Mongoose.connection.on('error', (err) => {
  server.close();
});
