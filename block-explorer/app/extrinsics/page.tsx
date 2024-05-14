import Breadcrumbs from '@/components/breadcrumbs';
import Container from '@/components/container';
import ExtrinsicsTable from '@/components/extrinsics-table';
import NoData from '@/components/no-data';
import PaginationSuspense from '@/components/pagination-suspense';
import SectionTitle from '@/components/section-title';
import { getExtrinsics } from '@/lib/api';
import { getPaginationData } from '@/lib/utils';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Extrinsics',
};

const getData = async ({ searchParams }: { searchParams: { page: number | string } }) => {
  const data = await getExtrinsics({ page: searchParams?.page });
  return data;
};

export default async function Page({ searchParams }: { searchParams: { page: number | string } }) {
  const data = await getData({ searchParams });
  const extrinsics = data?.docs;

  return (
    <Container>
      <div className="flex flex-col gap-4">
        <Breadcrumbs />
        <SectionTitle>Extrinsics</SectionTitle>
        <PaginationSuspense pagination={getPaginationData(data)} />

        {!extrinsics?.length ? <NoData /> : <ExtrinsicsTable extrinsics={extrinsics} />}
      </div>
    </Container>
  );
}
