import { Injectable } from '@nestjs/common';

@Injectable()
export class BlocksIndexerService {
  processBlock({ blockNumber: number }): void {
    // return { blockNumber };
  }
}
