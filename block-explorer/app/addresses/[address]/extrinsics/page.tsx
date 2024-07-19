import ExtrinsicsTable from '@/components/extrinsics-table';
import NoData from '@/components/no-data';
import PaginationSuspense from '@/components/pagination-suspense';
import { ApiCommand, request } from '@/lib/api';
import { getPaginationData } from '@/lib/utils';
import { Address } from 'viem';

export default async function Page({
  params,
  searchParams,
}: {
  params: { address: Address };
  searchParams: { page?: number };
}) {
  const data = await request(ApiCommand.getExtrinsicsForAddress, {
    address: params.address,
    page: searchParams.page || 1,
  });

  const transactions = data?.docs;

  if (!transactions?.length) return <NoData />;

  return (
    <div className="flex flex-col gap-4">
      <PaginationSuspense pagination={getPaginationData(data)} />
      <ExtrinsicsTable extrinsics={transactions} />
    </div>
  );
}
