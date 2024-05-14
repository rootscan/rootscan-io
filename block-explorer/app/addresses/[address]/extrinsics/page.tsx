import ExtrinsicsTable from '@/components/extrinsics-table';
import NoData from '@/components/no-data';
import PaginationSuspense from '@/components/pagination-suspense';
import { getExtrinsicsForAddress } from '@/lib/api';
import { getPaginationData } from '@/lib/utils';

const getData = async ({ params, searchParams }) => {
  const data = await getExtrinsicsForAddress({
    address: params.address,
    page: searchParams.page,
  });
  return data;
};
export default async function Page({ params, searchParams }) {
  const data = await getData({ params, searchParams });
  const transactions = data?.docs;

  return (
    <div className="flex flex-col gap-4">
      <PaginationSuspense pagination={getPaginationData(data)} />
      {!transactions || transactions?.length === 0 ? <NoData /> : <ExtrinsicsTable extrinsics={transactions} />}
    </div>
  );
}
