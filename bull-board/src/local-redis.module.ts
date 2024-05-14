import { BullMQAdapter } from '@bull-board/api/bullMQAdapter';
import { BullBoardModule } from '@bull-board/nestjs';
import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';

// example feature module, feature can be anything. eg. user module
@Module({
  imports: [
    BullModule.registerQueue({
      name: 'workerpool',
    }),

    //Register each queue using the `forFeature` method.
    BullBoardModule.forFeature({
      name: 'workerpool',
      adapter: BullMQAdapter,
    }),
  ],
})
export class LocalRedisModule {}
