import Breadcrumbs from '@/components/breadcrumbs';
import Container from '@/components/container';
import { ErrorAlert } from '@/components/error-alert';
import NoData from '@/components/no-data';
import SectionTitle from '@/components/section-title';
import TransactionsTable from '@/components/transactions-table';
import { ApiCommand, request } from '@/lib/api';
import { getPaginationData, handleRequestResult } from '@/lib/utils';
import { PageProps } from '@/types/page';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'EVM Transactions',
};

export default async function Page({ searchParams }: PageProps) {
  try {
    const searchParamsObj = await searchParams;
    const page = Number(searchParamsObj?.page) || 1;

    const data = handleRequestResult(await request(ApiCommand.getTransactions, { page }));
    if (!data.docs?.length) return <NoData />;

    return (
      <Container className="flex flex-col gap-6">
        <div className="space-y-4">
          <Breadcrumbs />
          <SectionTitle>EVM Transactions</SectionTitle>
        </div>
        <TransactionsTable transactions={data.docs} pagination={getPaginationData(data)} />
      </Container>
    );
  } catch (error) {
    return <ErrorAlert error={error instanceof Error ? error : new Error('An unexpected error occurred')} />;
  }
}
