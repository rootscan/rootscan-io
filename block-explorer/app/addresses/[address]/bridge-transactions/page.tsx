import BridgeTransactions from '@/components/bridge-transactions';
import NoData from '@/components/no-data';
import PaginationSuspense from '@/components/pagination-suspense';
import { ApiCommand, request } from '@/lib/api';
import { getPaginationData } from '@/lib/utils';
import { getAddress } from 'viem';

interface PageProps {
  params: Promise<{ address: string }>;
  searchParams: Promise<{ page?: string }>;
}

export default async function Page({ params, searchParams }: PageProps) {
  const paramsObj = await params;
  const searchParamsObj = await searchParams;
  const page = searchParamsObj?.page ? parseInt(searchParamsObj.page) : 1;

  const data = await request(ApiCommand.getBridgeTransactions, {
    page,
    address: getAddress(paramsObj.address),
  });
  const transactions = data?.docs;

  return (
    <div className="flex flex-col gap-4">
      <PaginationSuspense pagination={getPaginationData(data)} />
      {!transactions?.length ? <NoData /> : <BridgeTransactions transactions={transactions} />}
    </div>
  );
}
