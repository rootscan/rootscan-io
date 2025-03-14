import { ErrorAlert } from '@/components/error-alert';
import ExtrinsicsTable from '@/components/extrinsics-table';
import NoData from '@/components/no-data';
import { ApiCommand, request } from '@/lib/api';
import { handleRequestResult } from '@/lib/utils';
import { PageProps } from '@/types/page';

export default async function Page({ params }: PageProps) {
  try {
    const { blocknumber } = await params;
    if (!blocknumber) return <NoData />;

    const extrinsics = handleRequestResult(await request(ApiCommand.getExtrinsicsInBlock, { number: blocknumber }));
    if (!extrinsics?.length) return <NoData />;

    return (
      <div className="flex flex-col gap-4">
        <ExtrinsicsTable extrinsics={extrinsics} />
      </div>
    );
  } catch (error) {
    return <ErrorAlert error={error instanceof Error ? error : new Error('An unexpected error occurred')} />;
  }
}
