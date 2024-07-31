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
    // it('processBlock 14392427', async () => {
    //   const res = await service.getBlockData(14392427);
    //   console.log(res.extrinsics);
    //   expect(res.block.number).toBe(14392427);
    //   expect(res.header.number).toBe(14392427);
    //   expect(res.extrinsics?.length).toBe(2);
    // });

    it('processBlock with proxyExtrinsic method', async () => {
      const res = await service.getBlockData(14281964);
      expect(res.extrinsics?.[1]).toMatchObject({
        hash: '0xe6c2ea4bf86c74effed3ae34d2d16646d58868f6b17553f05404f91feed60085',
        block: 14281964,
        extrinsicId: '14281964-1',
        retroExtrinsicId: '0014281964-000001-dcc4a',
        method: 'proxyExtrinsic',
        section: 'futurepass',
        isSigned: true,
        isSuccess: true,
        args: {
          futurepass: '0xFfFfFfff0000000000000000000000000000061D',
          call: {
            section: 'nft',
            method: 'transfer',
          },
        },
        fee: {
          who: '0xB811dc71aF7d9242A161D43318A5CA685f56F680',
          actualFee: 59730,
          actualFeeFormatted: 0.05973,
          tip: 0,
          tipFormatted: 0.05973,
        },
        isProxy: true,
        proxiedSections: ['nft'],
        proxiedMethods: ['transfer'],
      });
    });

    it('processBlock with callWithFeePreferences method', async () => {
      const res = await service.getBlockData(13879273);
      expect(res.extrinsics?.[1]).toMatchObject({
        hash: '0x4c558d615c9e19a1a84432ad0422cef72e857933993c15d161403ff94fba18d8',
        block: 13879273,
        extrinsicId: '13879273-1',
        retroExtrinsicId: '0013879273-000001-c07d8',
        method: 'callWithFeePreferences',
        section: 'feeProxy',
        isSigned: true,
        isSuccess: true,
        isProxy: true,
        proxiedSections: ['futurepass', 'nft'],
        proxiedMethods: ['proxyExtrinsic', 'transfer'],
      });
    });

    it('processBlock with transact ethereum method', async () => {
      const res = await service.getBlockData(13785289);
      expect(res.extrinsics?.[2]).toMatchObject({
        hash: '0xcb0d5310bb516fce6af01ac0a9365ee5c450c0d262dffc227b1f337b9b2a3cf1',
        block: 13785289,
        extrinsicId: '13785289-2',
        retroExtrinsicId: '0013785289-000002-70824',
        method: 'transact',
        section: 'ethereum',
        isSigned: false,
        isSuccess: true,
        args: {
          transactionHash: '0x3ae1b5e5d7e0e63c16ec6e894a5ac2f32cda0f48585a2cbaeca5779cca825264',
          transaction: {
            eip1559: {
              chainId: 7668,
              //...
            },
          },
        },
      });
    });

    it('processBlock with failed extrinsic', async () => {
      const res = await service.getBlockData(13783478);
      expect(res.extrinsics?.[1]).toMatchObject({
        hash: '0xaaeee39acc9084b330472de88e521f93043c3852beb1ba36c2eeb1fb0b666ce1',
        block: 13783478,
        extrinsicId: '13783478-1',
        retroExtrinsicId: '0013783478-000001-5429a',
        method: 'submitEvent',
        section: 'ethBridge',
        isSigned: true,
        timestamp: 1719837188001,
        isSuccess: false,
        errorInfo: 'ethBridge.EventReplayPending', // <- get actual error message
        fee: {
          who: '0x38193D74fDFD7321a4714d45ccc67F1895B9382b',
          actualFee: 155280,
          actualFeeFormatted: 0.15528,
          tip: 0,
          tipFormatted: 0.15528,
        },
      });
    });

    it('processBlock with ethBridge extrinsic', async () => {
      const res = await service.getBlockData(13785289);
      expect(res.extrinsics?.[1]).toMatchObject({
        extrinsicId: '13785289-1',
        method: 'submitEvent',
        section: 'ethBridge',
        args: {
          type: 'inbox',
          erc20Value: {
            amount: '3500000000',
            tokenAddress: '0xa3d4BEe77B05d4a0C943877558Ce21A763C4fa29',
          },
        },
      });
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
