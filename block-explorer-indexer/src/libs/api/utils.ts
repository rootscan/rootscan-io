import DB from '@/database';
import logger from '@/logger';
import { IEvent } from '@/types';
import { Response } from 'express';

export const processError = (e: unknown, res: Response) => {
  logger.error(e);
  res.status(400).send(e?.['message']);
};

export async function fillEventsWithNftImages(events: IEvent[]) {
  const found = events.reduce<{ collectionId: number; tokenId: number }[]>((acc, i) => {
    const tokenIds = i.args?.tokenIds || i.args?.serialNumbers || [];
    tokenIds.forEach((tokenId) => {
      acc.push({ collectionId: i.args.collectionId, tokenId });
    });
    return acc;
  }, []);

  if (found.length) {
    const res = await DB.NftOwner.aggregate([
      {
        $match: {
          $or: found,
        },
      },
      {
        $group: {
          _id: { collectionId: '$collectionId', tokenId: '$tokenId' },
          collectionId: { $first: '$collectionId' },
          tokenId: { $first: '$tokenId' },
          image: { $first: '$image' },
        },
      },
    ]);
    events.forEach((event) => {
      event.args.image = res.find(
        (n) =>
          n.collectionId === event.args?.collectionId &&
          (event.args?.tokenIds || event.args?.serialNumbers || []).includes(n.tokenId),
      )?.image;
    });
  }
}
