import { Module } from '@nestjs/common';
import { SubstrateService } from './substrate.service';
import { ConfigModule } from '@nestjs/config';
import Joi from 'joi';

@Module({
  imports: [
    ConfigModule.forRoot(),
    ConfigModule.forRoot({ envFilePath: '../../.env' }),
    ConfigModule.forRoot({
      validationSchema: Joi.object({
        RPC_WS_URL: Joi.string().optional(),
        RPC_HTTP_URL: Joi.string().optional(),
        RPC_PROVIDER: Joi.string().optional(),
      }).or('RPC_WS_URL', 'RPC_HTTP_URL'),
    }),
  ],
  providers: [SubstrateService],
  exports: [SubstrateService],
})
export class SubstrateModule {}
