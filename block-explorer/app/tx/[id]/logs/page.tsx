import { ErrorAlert } from '@/components/error-alert';
import LogsTable from '@/components/logs-table';
import NoData from '@/components/no-data';
import PaginationSuspense from '@/components/pagination-suspense';
import { ApiCommand, request } from '@/lib/api';
import { handleRequestResult } from '@/lib/utils';
import { PaginationResponse } from '@/types/api-types';
import { PageProps } from '@/types/page';
import { Hash } from 'viem';

export default async function Page({ params }: PageProps) {
  try {
    const paramsObj = await params;
    if (!paramsObj.id) {
      throw new Error('Transaction ID is required');
    }

    const data = handleRequestResult(await request(ApiCommand.getTransaction, { hash: paramsObj.id as Hash }));

    const logs = data?.logs;
    if (!logs?.length) return <NoData />;

    const paginationData: PaginationResponse<unknown> = {
      docs: logs,
      totalDocs: logs.length,
      limit: logs.length,
      totalPages: 1,
      page: 1,
      pagingCounter: 1,
      hasPrevPage: false,
      hasNextPage: false,
      prevPage: null,
      nextPage: null,
    };

    return (
      <div className="flex flex-col gap-4">
        <PaginationSuspense pagination={paginationData} />
        <LogsTable logs={logs} />
      </div>
    );
  } catch (error) {
    return <ErrorAlert error={error instanceof Error ? error : new Error('An unexpected error occurred')} />;
  }
}
