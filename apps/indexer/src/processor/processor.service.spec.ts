import { Test, TestingModule } from '@nestjs/testing';

import { ProcessorService } from './processor.service';
import { ProcessorModule } from './processor.module';

jest.setTimeout(30000);
describe('ProcessorService', () => {
  let service: ProcessorService;
  let module: TestingModule;
  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [ProcessorModule],
    }).compile();

    module.enableShutdownHooks();
    service = module.get<ProcessorService>(ProcessorService);
  });

  afterAll(async () => module.close());

  describe('getData', () => {
    it('processBlock', async () => {
      const block = await service.processBlock(14392427);
      // expect(service.processBlock()
    });

    it('getBlockHistoryAtInfo for block 14393059', async () => {
      const data = await service.getBlockHistoryAtInfo(
        '0xed535121a530dc5b5b5aa5eb3e301e6507a61b317a4ed84a4183a0e94b9c8483',
      );
      expect(data.spec).toBe('root/54');
      expect(data.timestamp).toBe(1722280112000);
      expect(data.events.length).toBe(13);
      data.events.forEach((event) => {
        expect(event.eventId.startsWith('14393059-')).toBe(true);
        expect(event.extrinsicId?.startsWith('14393059-')).toBe(true);
        expect(event).toHaveProperty('method');
        expect(event).toHaveProperty('section');
        expect(event).toHaveProperty('args');
        expect(event).toHaveProperty('hash');
      });
    });

    it('getBlockHistoryAtInfo(1)', async () => {
      const data = await service.getBlockHistoryAtInfo(
        '0x942687bf7abee71e025a2314f65cc7070ea845e828e26f4981eff2ee91e4acb6',
      );
      expect(data.spec).toBe('root/6');
      expect(data.timestamp).toBe(1664517756001);
      expect(data.events.length).toBe(1);
      expect(data.events[0]).toMatchObject({
        hash: '0x9c1d65ba800720f939d8555cf2ec86b9b9887fb44eeb3134361f952dfd6a3508',
        eventId: '1-0',
        extrinsicId: '1-0',
        blockNumber: 1,
        method: 'ExtrinsicSuccess',
        section: 'system',
      });
    });
  });
});
