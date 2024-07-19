import BridgeTransactions from '@/components/bridge-transactions';
import NoData from '@/components/no-data';
import PaginationSuspense from '@/components/pagination-suspense';
import { ApiCommand, request } from '@/lib/api';
import { getPaginationData } from '@/lib/utils';

export default async function Page({ searchParams, params }) {
  const data = await request(ApiCommand.getBridgeTransactions, {
    page: searchParams?.page || 1,
    address: params.address,
  });
  const transactions = data?.docs;

  return (
    <div className="flex flex-col gap-4">
      <PaginationSuspense pagination={getPaginationData(data)} />
      {!transactions?.length ? <NoData /> : <BridgeTransactions transactions={transactions} />}
    </div>
  );
}
