import BridgeTransactions from '@/components/bridge-transactions';
import { ErrorAlert } from '@/components/error-alert';
import NoData from '@/components/no-data';
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
      await request(ApiCommand.getBridgeTransactions, {
        address: getAddress(paramsObj.address),
        page,
      }),
    );

    if (!data.docs?.length) return <NoData />;

    return (
      <BridgeTransactions
        transactions={data.docs}
        pagination={getPaginationData(data)}
        caption={!data.skipFullCount ? `Showing ${data.totalDocs} transactions` : undefined}
      />
    );
  } catch (error) {
    return <ErrorAlert error={error instanceof Error ? error : new Error('An unexpected error occurred')} />;
  }
}
