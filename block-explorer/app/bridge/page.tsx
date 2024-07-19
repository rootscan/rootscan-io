import Breadcrumbs from '@/components/breadcrumbs';
import BridgeTransactions from '@/components/bridge-transactions';
import Container from '@/components/container';
import NoData from '@/components/no-data';
import PaginationSuspense from '@/components/pagination-suspense';
import SectionTitle from '@/components/section-title';
import { ApiCommand, request } from '@/lib/api';
import { getPaginationData } from '@/lib/utils';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Bridge',
};

export default async function Page({ searchParams }) {
  const data = await request(ApiCommand.getBridgeTransactions, { page: searchParams?.page || 1 });
  const transactions = data?.docs;
  return (
    <Container>
      <div className="flex flex-col gap-4">
        <Breadcrumbs />
        <SectionTitle>Bridge</SectionTitle>
        <PaginationSuspense pagination={getPaginationData(data)} />
        {!transactions?.length ? <NoData /> : <BridgeTransactions transactions={transactions} />}
      </div>
    </Container>
  );
}
