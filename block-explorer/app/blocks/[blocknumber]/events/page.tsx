import EventsTable from '@/components/events-table';
import NoData from '@/components/no-data';
import PaginationSuspense from '@/components/pagination-suspense';
import { ApiCommand, request } from '@/lib/api';
import { getPaginationData } from '@/lib/utils';

export default async function Page({
  searchParams,
  params,
}: {
  searchParams: { page: number };
  params: { blocknumber: number };
}) {
  const data = await request(ApiCommand.getEvents, {
    page: searchParams?.page ? searchParams?.page : 1,
    query: { blockNumber: params.blocknumber },
  });

  const events = data.docs;
  if (!events?.length) return <NoData />;

  return (
    <div className="flex flex-col gap-4">
      <PaginationSuspense pagination={getPaginationData(data)} />
      <EventsTable events={events} />
    </div>
  );
}
