import {
  RiArrowRightUpLine,
  RiSearchLine,
  RiTimerLine,
  RiPencilLine,
  RiArrowLeftRightLine,
  RiWalletLine
} from '@remixicon/react'

import { LatestBlocks } from '@/components/homepage/latest-blocks';
import { LatestExtrinsics } from '@/components/homepage/latest-extrinsics';
import { LatestTransactions } from '@/components/homepage/latest-transactions';
import TargetTimeCountdown from '@/components/target-time-countdown';
import { Button } from '@/components/ui/button.tsx';
import { ApiCommand, request } from '@/lib/api';
import { formatNumber, handleRequestResult } from '@/lib/utils';
import { Search } from '@/components/homepage/search.tsx';

export const dynamic = 'force-dynamic';

const getData = async () => {
  const [blocksResponse, transactionsResponse, extrinsicsResponse, chainSummaryResponse] = await Promise.all([
    request(ApiCommand.getBlocks, { page: 1, limit: 10 }),
    request(ApiCommand.getTransactions, { page: 1, limit: 5 }),
    request(ApiCommand.getExtrinsics, { page: 1, limit: 10 }),
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
      title: 'Signed Extrinsics',
      value: Number(chainSummary?.signedExtrinsics || 0),
      icon: RiPencilLine,
    },
    {
      title: 'Total Transactions',
      value: Number(chainSummary?.evmTransactions || 0),
      icon: RiArrowLeftRightLine,
    },
    {
      title: 'Wallet Addresses',
      value: Number(chainSummary?.addresses || 0),
      icon: RiWalletLine,
    },
  ]

  return (
    <>
      <div style={{ background: `url('/home-page-background.png') top / 100% no-repeat` }}>
        <div className="container flex flex-col gap-6 px-4 pt-8 pb-14 lg:px-8">
          <div className="flex items-center py-4">
            <div className="flex flex-1 flex-col gap-4">
              <h1 className="text-[32px]/[44px] font-bold">Root Network Explorer</h1>
              <Search />
            </div>
            <div
              className="link-box rounded-[16px] p-px"
              style={{ background: 'linear-gradient(90deg, #8F9AE9 0%, #E0BC95 50%, #F78F50 100%)' }}
            >
              <div
                className="flex max-w-[330px] flex-col gap-1 rounded-[15px] bg-white p-6 pt-5 hover:bg-api-portal-banner dark:bg-black"
              >
                <div className="flex items-center justify-between">
                  <a
                    href="https://build.rootscan.io/"
                    target="_blank"
                    className="link-overlay text-[18px]/[28px] font-semibold"
                  >API Portal</a>
                  <RiArrowRightUpLine className="size-6" />
                </div>
                <p className="text-xs font-normal text-foreground/60">
                  Kickstart your development on The Root Network with Rootscan’s <strong className="text-foreground">API</strong> and <strong className="text-foreground">RPC</strong> services
                </p>
              </div>
            </div>
          </div>

          <section className="grid grid-cols-4">
            {stats.map(({ icon: Icon, ...stat }, i) => (
              <div key={i} className="flex flex-col gap-3 border-r border-secondary bg-white p-6 first-of-type:rounded-l-[16px] last-of-type:rounded-r-[16px] last-of-type:border-r-0 dark:bg-black">
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

          <div className="grid grid-cols-2 gap-6">
            <LatestBlocks latestBlocks={latestBlocks} />
            <LatestExtrinsics latestExtrinsics={latestExtrinsics} />
          </div>

          <LatestTransactions latestTransactions={latestTransactions} />
        </div>
      </div>
    </>
  );
}
