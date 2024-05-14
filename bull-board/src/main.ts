import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = 3003;
  await app.listen(port);
  Logger.log(`Listening at http://localhost:${port}/`);
}
bootstrap();
