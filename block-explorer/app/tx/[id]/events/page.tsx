import EventsTable from '@/components/events-table';
import NoData from '@/components/no-data';
import PaginationSuspense from '@/components/pagination-suspense';
import { ApiCommand, request } from '@/lib/api';
import { getPaginationData } from '@/lib/utils';
import { PageProps } from '@/types/page';

export default async function Page({ params, searchParams }: PageProps) {
  const paramsObj = await params;
  const searchParamsObj = await searchParams;
  if (!paramsObj.id) {
    return null;
  }
  const page = searchParamsObj?.page ? parseInt(searchParamsObj.page) : 1;

  const data = await request(ApiCommand.getEvents, {
    page,
    query: { extrinsicId: paramsObj.id },
  });

  const events = data?.docs;

  if (!events?.length) return <NoData />;

  return (
    <div className="flex flex-col gap-4">
      <PaginationSuspense pagination={getPaginationData(data)} />
      <EventsTable events={events} />
    </div>
  );
}
