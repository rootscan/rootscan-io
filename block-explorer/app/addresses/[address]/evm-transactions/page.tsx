import NoData from '@/components/no-data';
import PaginationSuspense from '@/components/pagination-suspense';
import TransactionsTable from '@/components/transactions-table';
import { ApiCommand, request } from '@/lib/api';
import { getPaginationData } from '@/lib/utils';
import { PageProps } from '@/types/page';
import { getAddress } from 'viem';

export default async function Page({ params, searchParams }: PageProps) {
  const paramsObj = await params;
  const searchParamsObj = await searchParams;
  if (!paramsObj.address) {
    return null;
  }
  const address = getAddress(paramsObj.address);
  const page = searchParamsObj?.page ? parseInt(searchParamsObj.page) : 1;

  const data = await request(ApiCommand.getEVMTransactionsForWallet, {
    address,
    page,
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
