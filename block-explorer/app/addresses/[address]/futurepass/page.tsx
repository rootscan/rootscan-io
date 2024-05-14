import AddressDisplay from '@/components/address-display';
import NoData from '@/components/no-data';
import PaginationSuspense from '@/components/pagination-suspense';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { getFuturepasses } from '@/lib/api';
import { getPaginationData } from '@/lib/utils';
import Link from 'next/link';
import { getAddress } from 'viem';

const getData = async ({ params, searchParams }) => {
  const data = await getFuturepasses({
    address: getAddress(params.address),
    page: searchParams.page,
  });
  return data;
};
export default async function Page({ params, searchParams }) {
  const data = await getData({ params, searchParams });
  const futurepasses = data?.docs;

  return (
    <div className="flex flex-col gap-4">
      <PaginationSuspense pagination={getPaginationData(data)} />
      {!futurepasses || futurepasses?.length === 0 ? (
        <NoData />
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Futurepass</TableHead>
              <TableHead />
            </TableRow>
          </TableHeader>
          <TableBody>
            {futurepasses.map((item, _) => {
              const futurepassAddress = item?.args?.futurepass;
              return (
                <TableRow key={item._id}>
                  <TableCell>
                    <AddressDisplay address={futurepassAddress} />
                  </TableCell>
                  <TableCell className="flex justify-end">
                    <Link href={`/address/${futurepassAddress}`}>
                      <Button variant="outline" size="sm">
                        View
                      </Button>
                    </Link>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
