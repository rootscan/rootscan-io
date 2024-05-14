import Breadcrumbs from '@/components/breadcrumbs';
import Container from '@/components/container';
import EventsTable from '@/components/events-table';
import NoData from '@/components/no-data';
import PaginationSuspense from '@/components/pagination-suspense';
import SectionTitle from '@/components/section-title';
import { getEvents } from '@/lib/api';
import { getPaginationData } from '@/lib/utils';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Events',
};

const getData = async ({ searchParams }) => {
  const data = await getEvents({ page: searchParams?.page });
  return data;
};

export default async function Page({ searchParams }) {
  const data = await getData({ searchParams });
  const events = data?.docs;
  return (
    <Container>
      <div className="flex flex-col gap-4">
        <Breadcrumbs />
        <SectionTitle>Events</SectionTitle>
        <PaginationSuspense pagination={getPaginationData(data)} />

        {!events?.length ? <NoData /> : <EventsTable events={events} />}
      </div>
    </Container>
  );
}
