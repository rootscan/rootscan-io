import Container from '@/components/container.tsx';
import { LatestBlocks } from '@/components/homepage/latest-blocks';
import { LatestExtrinsics } from '@/components/homepage/latest-extrinsics';
import { LatestTransactions } from '@/components/homepage/latest-transactions';
import { Search } from '@/components/homepage/search.tsx';
import TargetTimeCountdown from '@/components/target-time-countdown';
import { ApiCommand, request } from '@/lib/api';
import { formatNumber, handleRequestResult } from '@/lib/utils';
import { RiArrowLeftRightLine, RiArrowRightUpLine, RiPencilLine, RiTimerLine, RiWalletLine } from '@remixicon/react';

export const dynamic = 'force-dynamic';

const getData = async () => {
  const [blocksResponse, transactionsResponse, extrinsicsResponse, chainSummaryResponse] = await Promise.all([
    request(ApiCommand.getBlocks, { page: 1, limit: 5 }),
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
  const stats = [
    { title: 'Target Block Time', value: '4s', icon: RiTimerLine },
    {
      title: 'Transactions 24h',
      value: Number(chainSummary?.transfers24h || 0),
      icon: RiPencilLine,
    },
    {
      title: 'Total Transactions',
      value: Number(chainSummary?.totalTransfers || 0),
      icon: RiArrowLeftRightLine,
    },
    {
      title: 'Wallet Addresses',
      value: Number(chainSummary?.addresses || 0),
      icon: RiWalletLine,
    },
  ];

  return (
    <div className="bg-home-page-hero-section-mobile bg-contain bg-top bg-no-repeat sm:bg-home-page-hero-section-tablet lg:bg-home-page-hero-section-desktop">
      <Container className="grid grid-cols-2 gap-4 pt-8 md:gap-6 md:pt-10 xl:pt-8">
        <section className="col-span-2 flex flex-col gap-6 xl:flex-row xl:items-center xl:gap-0 xl:py-4">
          <div className="flex flex-1 flex-col gap-4">
            <h1 className="text-[32px]/[44px] font-bold">The Root Network Explorer</h1>
            <div className="w-full xl:max-w-[650px]">
              <Search />
            </div>
          </div>
          <div
            className="link-box group rounded-[16px] p-px"
            style={{ background: 'linear-gradient(90deg, #8F9AE9 0%, #E0BC95 50%, #F78F50 100%)' }}
          >
            <div className="flex flex-col gap-1 rounded-[15px] bg-white p-6 pt-5 hover:bg-api-portal-banner dark:bg-black xl:max-w-[330px]">
              <div className="flex items-center justify-between">
                <a
                  href="https://build.rootscan.io/"
                  target="_blank"
                  className="link-overlay text-[18px]/[28px] font-semibold"
                >
                  API Portal
                </a>
                <RiArrowRightUpLine className="size-6 transition-transform duration-300 ease-in-out group-hover:rotate-45" />
              </div>
              <p className="text-xs font-normal text-foreground/60">
                Kickstart your development on The Root Network with Rootscan's{' '}
                <strong className="text-foreground">API</strong> and <strong className="text-foreground">RPC</strong>{' '}
                services
              </p>
            </div>
          </div>
        </section>

        <section className="col-span-2 grid grid-cols-1 gap-px overflow-hidden rounded-[16px] bg-secondary md:grid-cols-2 xl:grid-cols-4">
          {stats.map(({ icon: Icon, ...stat }, i) => (
            <div key={i} className="flex flex-col gap-2 bg-white p-4 dark:bg-black md:gap-3 md:p-6">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Icon className="size-5" />
                <span className="text-xs font-bold uppercase">{stat.title}</span>
              </div>
              <div className="text-2xl font-semibold">
                {stat?.title === 'Target Block Time' ? (
                  <TargetTimeCountdown />
                ) : (
                  formatNumber(typeof stat.value === 'string' ? Number(stat.value) : stat.value)
                )}
              </div>
            </div>
          ))}
        </section>

        <div className="col-span-2 xl:col-span-1">
          <LatestBlocks latestBlocks={latestBlocks} />
        </div>

        <div className="col-span-2 xl:col-span-1">
          <LatestExtrinsics latestExtrinsics={latestExtrinsics} />
        </div>

        <div className="col-span-2">
          <LatestTransactions latestTransactions={latestTransactions} />
        </div>
      </Container>
    </div>
  );
}
