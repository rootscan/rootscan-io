import { Module } from '@nestjs/common';
import { SubstrateService } from './substrate.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot(),
    ConfigModule.forRoot({ envFilePath: '../../.env' }),
    ConfigModule.forRoot({
      // validationSchema: Joi.object({
      // CLICKHOUSE_HOST: Joi.string().required(),
      // CLICKHOUSE_PROTOCOL: Joi.string().required(),
      // CLICKHOUSE_PORT_HTTP: Joi.number().required(),
      // CLICKHOUSE_RAPP_USER: Joi.string().optional(),
      // CLICKHOUSE_RAPP_PASSWORD: Joi.string().optional().allow(null, ''),
      // }),
    }),
  ],
  controllers: [],
  providers: [SubstrateService],
  exports: [SubstrateService],
})
export class SubstrateModule {}
