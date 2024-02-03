import { Response } from 'express';
import logger from '@/logger';

export const processError = (e: any, res: Response) => {
  logger.error(e);
  res.status(400).send(e?.message);
};
