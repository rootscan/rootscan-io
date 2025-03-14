import Container from '@/components/container';
import LatestBlocks from '@/components/homepage/latest-blocks';
import LatestExtrinsics from '@/components/homepage/latest-extrinsics';
import LatestTransactions from '@/components/homepage/latest-transactions';
import StatsCard from '@/components/homepage/stats-card';
import { ApiCommand, request } from '@/lib/api';
import { handleRequestResult } from '@/lib/utils';
import { ArrowLeftRight, Pencil, Wallet } from 'lucide-react';

export const dynamic = 'force-dynamic';

async function getData() {
  const [blocksResponse, extrinsicsResponse, transactionsResponse, chainSummaryResponse] = await Promise.all([
    request(ApiCommand.getBlocks, { page: 1, limit: 10 }),
    request(ApiCommand.getExtrinsics, { page: 1, limit: 10 }),
    request(ApiCommand.getTransactions, { page: 1, limit: 10 }),
    request(ApiCommand.getChainSummary),
  ]);

  return {
    latestBlocks: handleRequestResult(blocksResponse)?.docs,
    latestExtrinsics: handleRequestResult(extrinsicsResponse)?.docs,
    latestTransactions: handleRequestResult(transactionsResponse)?.docs,
    chainSummary: handleRequestResult(chainSummaryResponse),
  };
}

export default async function Page() {
  const { latestBlocks, latestExtrinsics, latestTransactions, chainSummary } = await getData();

  return (
    <Container>
      <div className="flex flex-col gap-8">
        <section className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <StatsCard title="Signed Extrinsics" value={chainSummary?.signedExtrinsics || 0} icon={Pencil} />
          <StatsCard title="Total Transactions" value={chainSummary?.evmTransactions || 0} icon={ArrowLeftRight} />
          <StatsCard title="Wallet Addresses" value={chainSummary?.addresses || 0} icon={Wallet} />
        </section>

        <section className="grid grid-cols-12 gap-6">
          <div className="col-span-full">
            <LatestBlocks latestBlocks={latestBlocks} />
          </div>
          <div className="col-span-full lg:col-span-8">
            <LatestTransactions latestTransactions={latestTransactions} />
          </div>
          <div className="col-span-full lg:col-span-4">
            <LatestExtrinsics latestExtrinsics={latestExtrinsics} />
          </div>
        </section>
      </div>
    </Container>
  );
}
