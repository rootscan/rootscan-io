import logger from '@/logger';
import redisClient from '@/redis';
import { Queue } from 'bullmq';

/** @dev - Cross-Fetch is needed for DigitalOcean's Buildpack which runs Node 17.x */
// prettier-ignore
import "cross-fetch/polyfill";
import dotenv from 'dotenv';

dotenv.config();

if (!process.env.WORKERPOOL_QUEUE) {
  logger.error('Missing WORKERPOOL_QUEUE from .env');
  process.exit(1);
}

const queue: Queue = new Queue(process.env.WORKERPOOL_QUEUE, {
  connection: redisClient,
  defaultJobOptions: {
    removeOnComplete: true,
    removeOnFail: false,
    attempts: 50,
    backoff: {
      type: 'exponential',
      delay: 1000,
    },
  },
});

queue.on('error', (err: Error) => console.error(err));
// queue.on("ioredis:close", () => {
//   logger.error("Redis connection closed");
// });

export default queue;
