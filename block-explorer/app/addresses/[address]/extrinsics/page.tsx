import { ErrorAlert } from '@/components/error-alert';
import ExtrinsicsTable from '@/components/extrinsics-table';
import NoData from '@/components/no-data';
import PaginationSuspense from '@/components/pagination-suspense';
import { ApiCommand, request } from '@/lib/api';
import { getPaginationData, handleRequestResult } from '@/lib/utils';
import { PageProps } from '@/types/page';
import { getAddress } from 'viem';

export default async function Page({ params, searchParams }: PageProps) {
  try {
    const paramsObj = await params;
    if (!paramsObj.address) {
      throw new Error('Address is required');
    }

    const searchParamsObj = await searchParams;
    const page = Number(searchParamsObj?.page) || 1;

    const data = handleRequestResult(
      await request(ApiCommand.getExtrinsicsForAddress, {
        address: getAddress(paramsObj.address),
        page,
      }),
    );

    if (!data.docs?.length) return <NoData />;

    return (
      <div className="flex flex-col gap-4">
        <PaginationSuspense pagination={getPaginationData(data)} />
        <ExtrinsicsTable extrinsics={data.docs} />
      </div>
    );
  } catch (error) {
    return <ErrorAlert error={error instanceof Error ? error : new Error('An unexpected error occurred')} />;
  }
}
