import Breadcrumbs from '@/components/breadcrumbs';
import Container from '@/components/container';
import { ErrorAlert } from '@/components/error-alert';
import EventsTable from '@/components/events-table';
import NoData from '@/components/no-data';
import PaginationSuspense from '@/components/pagination-suspense';
import SectionTitle from '@/components/section-title';
import { ApiCommand, request } from '@/lib/api';
import { getPaginationData, handleRequestResult } from '@/lib/utils';
import { PageProps } from '@/types/page';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Events',
};

export default async function Page({ searchParams }: PageProps) {
  try {
    const searchParamsObj = await searchParams;
    const page = Number(searchParamsObj?.page) || 1;

    const data = handleRequestResult(await request(ApiCommand.getEvents, { page }));

    return (
      <Container>
        <div className="flex flex-col gap-4">
          <Breadcrumbs />
          <SectionTitle>Events</SectionTitle>
          {!data.docs?.length ? (
            <NoData />
          ) : (
            <>
              <PaginationSuspense pagination={getPaginationData(data)} />
              <EventsTable events={data.docs} />
            </>
          )}
        </div>
      </Container>
    );
  } catch (error) {
    return <ErrorAlert error={error instanceof Error ? error : new Error('An unexpected error occurred')} />;
  }
}
