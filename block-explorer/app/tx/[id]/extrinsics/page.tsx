import ExtrinsicsTable from '@/components/extrinsics-table';
import NoData from '@/components/no-data';
import PaginationSuspense from '@/components/pagination-suspense';
import { ApiCommand, request } from '@/lib/api';
import { getPaginationData } from '@/lib/utils';
import { PageProps } from '@/types/page';
import { Hash } from 'viem';

export default async function Page({ params, searchParams }: PageProps) {
  const paramsObj = await params;
  const searchParamsObj = await searchParams;
  if (!paramsObj.id) {
    return null;
  }
  const page = searchParamsObj?.page ? parseInt(searchParamsObj.page) : 1;

  const data = await request(ApiCommand.getExtrinsicsForAddress, {
    address: paramsObj.id as Hash,
    page,
  });

  const extrinsics = data?.docs;

  if (!extrinsics?.length) return <NoData />;

  return (
    <div className="flex flex-col gap-4">
      <PaginationSuspense pagination={getPaginationData(data)} />
      <ExtrinsicsTable extrinsics={extrinsics} />
    </div>
  );
}
