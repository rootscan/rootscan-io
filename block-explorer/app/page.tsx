import Container from '@/components/container';
import LatestBlocks from '@/components/homepage/latest-blocks';
import LatestExtrinsics from '@/components/homepage/latest-extrinsics';
import LatestTransactions from '@/components/homepage/latest-transactions';
import TargetTimeCountdown from '@/components/target-time-countdown';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ApiCommand, request } from '@/lib/api';
import { formatNumber, handleRequestResult } from '@/lib/utils';
import { ArrowLeftRight, Clock, Pencil, Wallet } from 'lucide-react';

export const dynamic = 'force-dynamic';

const getData = async () => {
  const [blocksResponse, transactionsResponse, extrinsicsResponse, chainSummaryResponse] = await Promise.all([
    request(ApiCommand.getBlocks, { page: 1, limit: 10 }),
    request(ApiCommand.getTransactions, { page: 1, limit: 5 }),
    request(ApiCommand.getExtrinsics, { page: 1, limit: 5 }),
    request(ApiCommand.getChainSummary),
  ]);

  return {
    latestExtrinsics: handleRequestResult(extrinsicsResponse)?.docs || [],
    latestBlocks: handleRequestResult(blocksResponse)?.docs || [],
    latestTransactions: handleRequestResult(transactionsResponse)?.docs || [],
    chainSummary: handleRequestResult(chainSummaryResponse),
  };
};

export default async function IndexPage() {
  const { latestBlocks, latestExtrinsics, latestTransactions, chainSummary } = await getData();

  return (
    <Container>
      <div className="flex flex-col gap-8">
        <section className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { title: 'Target Block Time', value: '4s', icon: Clock },
            {
              title: 'Signed Extrinsics',
              value: Number(chainSummary?.signedExtrinsics || 0),
              icon: Pencil,
            },
            {
              title: 'Total Transactions',
              value: Number(chainSummary?.evmTransactions || 0),
              icon: ArrowLeftRight,
            },
            {
              title: 'Wallet Addresses',
              value: Number(chainSummary?.addresses || 0),
              icon: Wallet,
            },
          ].map((stat, _) => {
            const Icon = stat.icon;
            return (
              <div key={_}>
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                    <Icon className="size-5 text-muted-foreground" />
                    <CardTitle className="text-xs uppercase text-muted-foreground">{stat.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {stat?.title === 'Target Block Time' ? (
                        <TargetTimeCountdown />
                      ) : (
                        formatNumber(typeof stat.value === 'string' ? Number(stat.value) : stat.value)
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            );
          })}
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
