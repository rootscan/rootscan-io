import Breadcrumbs from '@/components/breadcrumbs';
import Container from '@/components/container';
import EventsTable from '@/components/events-table';
import NoData from '@/components/no-data';
import PaginationSuspense from '@/components/pagination-suspense';
import SectionTitle from '@/components/section-title';
import { ApiCommand, request } from '@/lib/api';
import { getPaginationData } from '@/lib/utils';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Events',
};

export default async function Page({ searchParams }: { searchParams: { page?: number } }) {
  const data = await request(ApiCommand.getEvents, { page: searchParams?.page || 1 });
  const events = data?.docs;
  return (
    <Container>
      <div className="flex flex-col gap-4">
        <Breadcrumbs />
        <SectionTitle>Events</SectionTitle>
        {!events?.length ? (
          <NoData />
        ) : (
          <>
            <PaginationSuspense pagination={getPaginationData(data)} />
            <EventsTable events={events} />
          </>
        )}
      </div>
    </Container>
  );
}
