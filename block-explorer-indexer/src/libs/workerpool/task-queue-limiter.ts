import logger from '@/logger';
import { BulkJobOptions } from 'bullmq';

import queue from './index';

const C_CHECK_NEXT_INTERVAL = 3000;

export class TaskQueueLimiter<T> {
  constructor(
    private limit: number,
    private prepare: (data: T) => {
      name: string;
      data: Record<string, unknown>;
      opts?: BulkJobOptions | undefined;
    },
  ) {}
  #queue: T[] = [];

  add(data: T) {
    this.#queue.push(data);
  }

  addBulk(data: T[]) {
    if (data?.length) {
      this.#queue = [...this.#queue, ...data];
    }
  }

  async processNext() {
    if (!this.#queue.length) {
      return;
    }
    const count = await queue.count();
    const nextCount = this.limit - count;
    if (nextCount <= 0) {
      return;
    }
    const tasks = this.#queue.splice(0, nextCount);
    logger.info(`Add jobs for ${tasks[0]} to ${tasks[tasks.length - 1]}`);
    queue.addBulk(tasks.map((i) => this.prepare(i)));
  }

  async run() {
    return new Promise((_, reject) => {
      setInterval(() => {
        this.processNext().catch(reject);
      }, C_CHECK_NEXT_INTERVAL);
    });
  }
}
