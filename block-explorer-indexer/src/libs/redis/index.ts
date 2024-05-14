import logger from '@/logger';
import dotenv from 'dotenv';
import IORedis, { Redis } from 'ioredis';

dotenv.config();

if (!process.env.REDIS_USERNAME || !process.env.REDIS_HOST || !process.env.REDIS_PORT) {
  logger.error('Missing REDIS details in .env');
  process.exit(1);
}

const creds: { username: string; password: string; host: string; port: number } = {
  username: process?.env?.REDIS_USERNAME ? process?.env?.REDIS_USERNAME : '',
  password: process?.env?.REDIS_PASSWORD ? process?.env?.REDIS_PASSWORD : '',
  host: process.env.REDIS_HOST,
  port: Number(process.env.REDIS_PORT),
};

const REDIS_CONNECTION = `${process?.env?.REDIS_SECURE === 'true' ? 'rediss://' : 'redis://'}${creds.username}:${
  creds.password
}@${creds.host}:${creds.port}/1`;

const connection: Redis = new IORedis(REDIS_CONNECTION, {
  lazyConnect: true,
  connectTimeout: 5000,
  maxRetriesPerRequest: null,
});

export default connection;
