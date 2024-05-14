import ExtrinsicsTable from '@/components/extrinsics-table';
import NoData from '@/components/no-data';
import { getExtrinsicsInBlock } from '@/lib/api';

const getData = async ({ params }: { params: any }) => {
  const extrinsics = await getExtrinsicsInBlock({ number: params.blocknumber });
  return { extrinsics };
};
export default async function Page({ params }: { params: any }) {
  const { extrinsics } = await getData({ params });

  if (!extrinsics?.length) return <NoData />;

  return <ExtrinsicsTable extrinsics={extrinsics} />;
}
