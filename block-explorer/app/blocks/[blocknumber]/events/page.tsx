import EventsTable from '@/components/events-table';
import NoData from '@/components/no-data';
import PaginationSuspense from '@/components/pagination-suspense';
import { getEvents } from '@/lib/api';
import { getPaginationData } from '@/lib/utils';

const getData = async ({ searchParams, params }: { searchParams: any; params: any }) => {
  const data = await getEvents({
    page: searchParams?.page ? searchParams?.page : 1,
    query: { blockNumber: params.blocknumber },
  });
  return data;
};
export default async function Page({ searchParams, params }: { searchParams: any; params: any }) {
  const data = await getData({ searchParams, params });
  const events = data?.docs;
  return (
    <div className="flex flex-col gap-4">
      <PaginationSuspense pagination={getPaginationData(data)} />

      {!events?.length ? <NoData /> : <EventsTable events={events} />}
    </div>
  );
}
