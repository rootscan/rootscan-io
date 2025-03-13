import ExtrinsicsTable from '@/components/extrinsics-table';
import NoData from '@/components/no-data';
import PaginationSuspense from '@/components/pagination-suspense';
import { ApiCommand, request } from '@/lib/api';
import { getPaginationData } from '@/lib/utils';
import { getAddress } from 'viem';

export default async function Page({
  params,
  searchParams,
}: {
  params: { address: string };
  searchParams: { page?: string };
}) {
  const paramsObj = await Promise.resolve(params);
  const searchParamsObj = await Promise.resolve(searchParams);
  const page = searchParamsObj?.page ? parseInt(searchParamsObj.page) : 1;

  const data = await request(ApiCommand.getExtrinsicsForAddress, {
    address: getAddress(paramsObj.address),
    page,
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
