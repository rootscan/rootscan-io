import NoData from '@/components/no-data';
import PaginationSuspense from '@/components/pagination-suspense';
import TransactionsTable from '@/components/transactions-table';
import { getEVMTransactionsForWallet } from '@/lib/api';
import { getPaginationData } from '@/lib/utils';
import { getAddress } from 'viem';

const getData = async ({ params, searchParams }) => {
  const data = await getEVMTransactionsForWallet({
    address: params.address,
    page: searchParams.page,
  });

  return data;
};

export default async function Page({ params, searchParams }) {
  const data = await getData({ params, searchParams });
  const transactions = data?.docs;
  const address = getAddress(params.address);
  return (
    <div className="flex flex-col gap-6">
      <PaginationSuspense pagination={getPaginationData(data)} />
      {!transactions || transactions?.length === 0 ? (
        <NoData />
      ) : (
        <TransactionsTable address={address} transactions={transactions} isAddressPage />
      )}
    </div>
  );
}
