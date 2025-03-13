import Breadcrumbs from '@/components/breadcrumbs';
import Container from '@/components/container';
import ExtrinsicsTable from '@/components/extrinsics-table';
import NoData from '@/components/no-data';
import PaginationSuspense from '@/components/pagination-suspense';
import SectionTitle from '@/components/section-title';
import { ApiCommand, request } from '@/lib/api';
import { getPaginationData } from '@/lib/utils';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Extrinsics',
};

export default async function Page({ searchParams }: { searchParams: { page?: string } }) {
  const searchParamsObj = await Promise.resolve(searchParams);
  const page = searchParamsObj?.page ? parseInt(searchParamsObj.page) : 1;
  const data = await request(ApiCommand.getExtrinsics, { page });
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
