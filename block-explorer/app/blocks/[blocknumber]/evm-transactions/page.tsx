import NoData from '@/components/no-data';
import PaginationSuspense from '@/components/pagination-suspense';
import TransactionsTable from '@/components/transactions-table';
import { ApiCommand, request } from '@/lib/api';
import { getPaginationData } from '@/lib/utils';
import { PaginationParams } from '@/types/api-types';

export default async function Page({
  searchParams,
  params,
}: {
  searchParams: PaginationParams;
  params: { blocknumber: number };
}) {
  const data = await request(ApiCommand.getTransactionsInBlock, {
    page: searchParams?.page || 1,
    block: params.blocknumber,
  });

  const transactions = data?.docs;
  if (!transactions) return <NoData />;

  return (
    <div className="flex flex-col gap-4">
      <PaginationSuspense pagination={getPaginationData(data)} />
      <TransactionsTable transactions={transactions} />
    </div>
  );
}
