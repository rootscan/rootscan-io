import EventsTable from '@/components/events-table';
import NoData from '@/components/no-data';
import PaginationSuspense from '@/components/pagination-suspense';
import { ApiCommand, request } from '@/lib/api';
import { getPaginationData } from '@/lib/utils';
import { PageProps } from '@/types/page';

export const revalidate = 0;

export default async function Page({ searchParams, params }: PageProps) {
  const paramsObj = await params;
  const searchParamsObj = await searchParams;

  if (!paramsObj.extrinsicId) {
    return null;
  }

  const data = await request(ApiCommand.getEvents, {
    page: searchParamsObj?.page ? parseInt(searchParamsObj.page) : 1,
    query: { extrinsicId: paramsObj.extrinsicId },
  });
  const events = data?.docs;

  return (
    <div className="flex flex-col gap-4">
      <PaginationSuspense pagination={getPaginationData(data)} />
      {!events?.length ? <NoData /> : <EventsTable events={events} />}
    </div>
  );
}
