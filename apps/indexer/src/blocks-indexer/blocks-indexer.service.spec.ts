import { Test, TestingModule } from '@nestjs/testing';

import { BlocksIndexerService } from './blocks-indexer.service';
import { BlocksIndexerModule } from './blocks-indexer.module';

jest.setTimeout(30000);
describe('BlocksIndexerService', () => {
  let service: BlocksIndexerService;
  let module: TestingModule;
  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [BlocksIndexerModule],
    }).compile();

    module.enableShutdownHooks();
    service = module.get<BlocksIndexerService>(BlocksIndexerService);
  });

  afterAll(async () => module.close());

  describe('getData', () => {
    it('processBlock', async () => {
      expect(service).toBeDefined();
    });
  });
});
