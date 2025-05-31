import { ErrorAlert } from '@/components/error-alert';
import EventsTable from '@/components/events-table';
import NoData from '@/components/no-data';
import { ApiCommand, request } from '@/lib/api';
import { getPaginationData, handleRequestResult } from '@/lib/utils';
import { PageProps } from '@/types/page';

export const revalidate = 0;

export default async function Page({ searchParams, params }: PageProps) {
  try {
    const paramsObj = await params;
    const searchParamsObj = await searchParams;

    if (!paramsObj.extrinsicId) {
      throw new Error('Extrinsic ID is required');
    }

    const page = Number(searchParamsObj?.page) || 1;
    const data = handleRequestResult(
      await request(ApiCommand.getEvents, {
        page,
        query: { extrinsicId: paramsObj.extrinsicId },
      }),
    );

    if (!data.docs?.length) return <NoData />;

    return (
      <div className="flex flex-col gap-4">
        <EventsTable events={data.docs} pagination={getPaginationData(data)} />
      </div>
    );
  } catch (error) {
    return <ErrorAlert error={error instanceof Error ? error : new Error('An unexpected error occurred')} />;
  }
}
