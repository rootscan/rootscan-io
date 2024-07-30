import { Test, TestingModule } from '@nestjs/testing';

import { SubstrateModule } from './substrate.module';
import { SubstrateService } from './substrate.service';
import { BlockHash } from '@polkadot/types/interfaces';

jest.setTimeout(10000);
describe('SubstrateService', () => {
  let service: SubstrateService;
  let module: TestingModule;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [SubstrateModule],
    }).compile();
    module.enableShutdownHooks();

    service = module.get<SubstrateService>(SubstrateService);
  });

  afterAll(async () => module.close());

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('define substrate api', async () => {
    const api = await service.init();
    expect(api).toBeDefined();
  });

  it('getBlockHash(1)', async () => {
    const api = await service.init();
    const hash: BlockHash = await api.rpc.chain.getBlockHash(1);
    expect(hash.toString()).toBe('0x942687bf7abee71e025a2314f65cc7070ea845e828e26f4981eff2ee91e4acb6');
  });
});
