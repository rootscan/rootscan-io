import NoData from '@/components/no-data';
import PaginationSuspense from '@/components/pagination-suspense';
import TransactionsTable from '@/components/transactions-table';
import { ApiCommand, request } from '@/lib/api';
import { getPaginationData } from '@/lib/utils';
import { Address, getAddress } from 'viem';

export default async function Page({
  params,
  searchParams,
}: {
  params: { address: Address };
  searchParams: { page?: number };
}) {
  const address = getAddress(params.address);
  const data = await request(ApiCommand.getEVMTransactionsForWallet, {
    address,
    page: searchParams.page || 1,
  });

  const transactions = data?.docs;
  if (!transactions?.length) return <NoData />;

  return (
    <div className="flex flex-col gap-6">
      <PaginationSuspense pagination={getPaginationData(data)} />
      <TransactionsTable address={address} transactions={transactions} isAddressPage />
    </div>
  );
}
