import { Module } from '@nestjs/common';

import { BlocksIndexerService } from './blocks-indexer.service';

@Module({
  imports: [],
  providers: [BlocksIndexerService],
})
export class BlocksIndexerModule {}
