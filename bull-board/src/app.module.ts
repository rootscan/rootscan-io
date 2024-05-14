import { ExpressAdapter } from '@bull-board/express';
import { BullBoardModule } from '@bull-board/nestjs';
import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { LocalRedisModule } from './local-redis.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    BullModule.forRoot({
      connection: {
        db: 1,
        lazyConnect: false,
        host: 'localhost',
        port: 29012,
        username: 'default',
        password: 'redis', //defined in the docker compose yml
      },
    }),

    BullBoardModule.forRoot({
      route: '/',
      adapter: ExpressAdapter,
    }),

    LocalRedisModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
