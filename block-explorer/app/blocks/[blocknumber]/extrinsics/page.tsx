import ExtrinsicsTable from '@/components/extrinsics-table';
import NoData from '@/components/no-data';
import { ApiCommand, request } from '@/lib/api';
import { PageProps } from '@/types/page';

export default async function Page({ params }: PageProps) {
  const paramsObj = await params;
  if (!paramsObj.blocknumber) {
    return null;
  }
  const extrinsics = await request(ApiCommand.getExtrinsicsInBlock, { number: paramsObj.blocknumber });

  if (!extrinsics?.length) return <NoData />;

  return <ExtrinsicsTable extrinsics={extrinsics} />;
}
