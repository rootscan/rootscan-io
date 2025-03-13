import Breadcrumbs from '@/components/breadcrumbs';
import Container from '@/components/container';
import PaginationSuspense from '@/components/pagination-suspense';
import SectionTitle from '@/components/section-title';
import TransactionsTable from '@/components/transactions-table';
import { ApiCommand, request } from '@/lib/api';
import { getPaginationData } from '@/lib/utils';
import { PageProps } from '@/types/page';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'EVM Transactions',
};

export default async function Page({ searchParams }: PageProps) {
  const searchParamsObj = await searchParams;
  const page = searchParamsObj?.page ? parseInt(searchParamsObj.page) : 1;
  const data = await request(ApiCommand.getTransactions, { page });
  const transactions = data?.docs;
  return (
    <Container>
      <div className="flex flex-col gap-4">
        <Breadcrumbs />
        <SectionTitle>EVM Transactions</SectionTitle>
        <PaginationSuspense pagination={getPaginationData(data)} />
        <TransactionsTable transactions={transactions} />
      </div>
    </Container>
  );
}
