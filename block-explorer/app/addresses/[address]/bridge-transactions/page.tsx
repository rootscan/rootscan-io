import BridgeTransactions from '@/components/bridge-transactions';
import NoData from '@/components/no-data';
import PaginationSuspense from '@/components/pagination-suspense';
import { getBridgeTransactions } from '@/lib/api';
import { getPaginationData } from '@/lib/utils';

const getData = async ({ searchParams, params }) => {
  let data = await getBridgeTransactions({
    page: searchParams?.page || 1,
    address: params.address,
  });

  return data;
};
export default async function Page({ searchParams, params }) {
  const data = await getData({ searchParams, params });
  const transactions = data?.docs;
  return (
    <div className="flex flex-col gap-4">
      <PaginationSuspense pagination={getPaginationData(data)} />
      {!transactions?.length ? <NoData /> : <BridgeTransactions transactions={transactions} />}
    </div>
  );
}
