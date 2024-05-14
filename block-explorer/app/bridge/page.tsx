import Breadcrumbs from '@/components/breadcrumbs';
import BridgeTransactions from '@/components/bridge-transactions';
import Container from '@/components/container';
import NoData from '@/components/no-data';
import PaginationSuspense from '@/components/pagination-suspense';
import SectionTitle from '@/components/section-title';
import { getBridgeTransactions } from '@/lib/api';
import { getPaginationData } from '@/lib/utils';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Bridge',
};
const getData = async ({ searchParams }) => {
  let data = await getBridgeTransactions({ page: searchParams?.page || 1 });

  return data;
};
export default async function Page({ searchParams }) {
  const data = await getData({ searchParams });
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
