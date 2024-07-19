import ExtrinsicsTable from '@/components/extrinsics-table';
import NoData from '@/components/no-data';
import { ApiCommand, request } from '@/lib/api';

export default async function Page({ params }: { params: { blocknumber: number } }) {
  const extrinsics = await request(ApiCommand.getExtrinsicsInBlock, { number: params.blocknumber });

  if (!extrinsics?.length) return <NoData />;

  return <ExtrinsicsTable extrinsics={extrinsics} />;
}
