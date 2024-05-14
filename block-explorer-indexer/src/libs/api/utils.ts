import logger from '@/logger';
import { Response } from 'express';

export const processError = (e: any, res: Response) => {
  logger.error(e);
  res.status(400).send(e?.message);
};
