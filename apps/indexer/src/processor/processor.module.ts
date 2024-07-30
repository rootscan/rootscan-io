import { Module } from '@nestjs/common';

import { ProcessorService } from './processor.service';
import { SubstrateModule } from '@rootscan/substrate';

@Module({
  imports: [SubstrateModule],
  providers: [ProcessorService],
})
export class ProcessorModule {}
