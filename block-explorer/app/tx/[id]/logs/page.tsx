import LogsTable from '@/components/logs-table';
import NoData from '@/components/no-data';
import PaginationSuspense from '@/components/pagination-suspense';
import { ApiCommand, request } from '@/lib/api';
import { PaginationResponse } from '@/types/api-types';
import { PageProps } from '@/types/page';
import { Hash } from 'viem';

export default async function Page({ params }: PageProps) {
  const paramsObj = await params;
  if (!paramsObj.id) {
    return null;
  }

  const data = await request(ApiCommand.getTransaction, { hash: paramsObj.id as Hash });
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
}
