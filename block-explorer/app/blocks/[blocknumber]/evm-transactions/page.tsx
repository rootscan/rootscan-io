import NoData from '@/components/no-data';
import PaginationSuspense from '@/components/pagination-suspense';
import TransactionsTable from '@/components/transactions-table';
import { getTransactionsInBlock } from '@/lib/api';
import { getPaginationData } from '@/lib/utils';

const getData = async ({ searchParams, params }: { searchParams: any; params: any }) => {
  const data = await getTransactionsInBlock({
    page: searchParams?.page ? searchParams?.page : 1,
    block: params.blocknumber,
  });
  return data;
};
export default async function Page({ searchParams, params }: { searchParams: any; params: any }) {
  const data = await getData({ searchParams, params });
  const transactions = data?.docs;
  return (
    <div className="flex flex-col gap-4">
      <PaginationSuspense pagination={getPaginationData(data)} />

      {!transactions?.length ? <NoData /> : <TransactionsTable transactions={transactions} />}
    </div>
  );
}
