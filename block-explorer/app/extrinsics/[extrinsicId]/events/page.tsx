import EventsTable from '@/components/events-table';
import NoData from '@/components/no-data';
import PaginationSuspense from '@/components/pagination-suspense';
import { ApiCommand, request } from '@/lib/api';
import { getPaginationData } from '@/lib/utils';

export const revalidate = 0;

export default async function Page({
  searchParams,
  params,
}: {
  searchParams: { page?: number };
  params: { extrinsicId?: string };
}) {
  const data = await request(ApiCommand.getEvents, {
    page: searchParams?.page || 1,
    query: { extrinsicId: params.extrinsicId },
  });
  const events = data?.docs;

  return (
    <div className="flex flex-col gap-4">
      <PaginationSuspense pagination={getPaginationData(data)} />
      {!events?.length ? <NoData /> : <EventsTable events={events} />}
    </div>
  );
}
