import { ErrorAlert } from '@/components/error-alert';
import NoData from '@/components/no-data';
import PaginationSuspense from '@/components/pagination-suspense';
import TransactionsTable from '@/components/transactions-table';
import { ApiCommand, request } from '@/lib/api';
import { getPaginationData, handleRequestResult } from '@/lib/utils';
import { PageProps } from '@/types/page';

export default async function Page({ searchParams, params }: PageProps) {
  try {
    const paramsObj = await params;
    const searchParamsObj = await searchParams;
    const page = Number(searchParamsObj?.page) || 1;
    const blocknumber = Number(paramsObj.blocknumber);

    if (isNaN(blocknumber)) {
      throw new Error('Invalid block number');
    }

    const data = handleRequestResult(
      await request(ApiCommand.getTransactionsInBlock, {
        page,
        block: blocknumber,
      }),
    );

    if (!data.docs?.length) return <NoData />;

    return (
      <div className="flex flex-col gap-4">
        <PaginationSuspense pagination={getPaginationData(data)} />
        <TransactionsTable transactions={data.docs} />
      </div>
    );
  } catch (error) {
    return <ErrorAlert error={error instanceof Error ? error : new Error('An unexpected error occurred')} />;
  }
}
