import Breadcrumbs from '@/components/breadcrumbs';
import Container from '@/components/container';
import PaginationSuspense from '@/components/pagination-suspense';
import SectionTitle from '@/components/section-title';
import TransactionsTable from '@/components/transactions-table';
import { getTransactions } from '@/lib/api';
import { getPaginationData } from '@/lib/utils';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'EVM Transactions',
};

const getData = async ({ searchParams }: { searchParams: any }) => {
  const data = await getTransactions({
    page: searchParams?.page ? searchParams?.page : 1,
  });
  return data;
};

export default async function Page({ searchParams }: { searchParams: any }) {
  const data = await getData({ searchParams });
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
