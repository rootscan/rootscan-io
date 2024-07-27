import { Test } from '@nestjs/testing';

import { BlocksIndexerService } from './blocks-indexer.service';

describe('BlocksIndexerService', () => {
  let service: BlocksIndexerService;

  beforeAll(async () => {
    const app = await Test.createTestingModule({
      providers: [BlocksIndexerService],
    }).compile();

    service = app.get<BlocksIndexerService>(BlocksIndexerService);
  });

  describe('getData', () => {
    it('should return "Hello API"', () => {
      // expect(service.processBlock()
    });
  });
});
