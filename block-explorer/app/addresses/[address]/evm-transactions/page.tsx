import { ErrorAlert } from '@/components/error-alert';
import NoData from '@/components/no-data';
import PaginationSuspense from '@/components/pagination-suspense';
import TransactionsTable from '@/components/transactions-table';
import { ApiCommand, request } from '@/lib/api';
import { getPaginationData, handleRequestResult } from '@/lib/utils';
import { PaginationResponse } from '@/types/api-types';
import { IEVMTransaction } from '@/types/models';
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
    const address = getAddress(paramsObj.address);

    const response = await request(ApiCommand.getEVMTransactionsForWallet, {
      address,
      page,
    });

    const data = handleRequestResult(response) as PaginationResponse<IEVMTransaction>;

    if (!data.docs?.length) return <NoData />;

    return (
      <div className="flex flex-col gap-6">
        <PaginationSuspense pagination={getPaginationData(data)} />
        <TransactionsTable address={address} transactions={data.docs} isAddressPage />
      </div>
    );
  } catch (error) {
    return <ErrorAlert error={error instanceof Error ? error : new Error('An unexpected error occurred')} />;
  }
}
