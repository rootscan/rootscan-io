import Breadcrumbs from '@/components/breadcrumbs';
import BridgeTransactions from '@/components/bridge-transactions';
import Container from '@/components/container';
import { ErrorAlert } from '@/components/error-alert';
import NoData from '@/components/no-data';
import PaginationSuspense from '@/components/pagination-suspense';
import SectionTitle from '@/components/section-title';
import { ApiCommand, request } from '@/lib/api';
import { getPaginationData, handleRequestResult } from '@/lib/utils';
import { PageProps } from '@/types/page';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Bridge',
};

export default async function Page({ searchParams }: PageProps) {
  try {
    const searchParamsObj = await searchParams;
    const page = Number(searchParamsObj?.page) || 1;

    const data = handleRequestResult(await request(ApiCommand.getBridgeTransactions, { page }));
    if (!data.docs?.length) return <NoData />;

    return (
      <Container>
        <div className="flex flex-col gap-4">
          <Breadcrumbs />
          <SectionTitle>Bridge Transactions</SectionTitle>
          <PaginationSuspense pagination={getPaginationData(data)} />
          <BridgeTransactions transactions={data.docs} />
        </div>
      </Container>
    );
  } catch (error) {
    return <ErrorAlert error={error instanceof Error ? error : new Error('An unexpected error occurred')} />;
  }
}
