import { Test, TestingModule } from '@nestjs/testing';

import { SubstrateModule } from './substrate.module';
import { SubstrateService } from './substrate.service';
import { BlockHash } from '@polkadot/types/interfaces';

describe('SubstrateService', () => {
  let service: SubstrateService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [SubstrateModule],
    }).compile();

    service = module.get<SubstrateService>(SubstrateService);
  });

  afterAll(async () => {
    //
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('get error when user is not exists', async () => {
    const api = await service.init();
    expect(api).toBeDefined()
  });
  it('get error when user is not exists', async () => {
    const api = await service.init();
    const hash: BlockHash = await api.rpc.chain.getBlockHash(1);
    expect(hash.toString()).toBe('0x942687bf7abee71e025a2314f65cc7070ea845e828e26f4981eff2ee91e4acb6')
  });
});
