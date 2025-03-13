import AddressDisplay from '@/components/address-display';
import NoData from '@/components/no-data';
import PaginationSuspense from '@/components/pagination-suspense';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ApiCommand, request } from '@/lib/api';
import { getPaginationData } from '@/lib/utils';
import Link from 'next/link';
import { Address, getAddress } from 'viem';

export default async function Page({
  params,
  searchParams,
}: {
  params: { address: string };
  searchParams: { page?: string };
}) {
  const paramsObj = await Promise.resolve(params);
  const searchParamsObj = await Promise.resolve(searchParams);
  const page = searchParamsObj?.page ? parseInt(searchParamsObj.page) : 1;

  const data = await request(ApiCommand.getFuturepasses, {
    address: getAddress(paramsObj.address),
    page,
  });

  const futurepasses = data?.docs;
  if (!futurepasses?.length) return <NoData />;

  return (
    <div className="flex flex-col gap-4">
      <PaginationSuspense pagination={getPaginationData(data)} />
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Futurepass</TableHead>
            <TableHead />
          </TableRow>
        </TableHeader>
        <TableBody>
          {futurepasses.map((item) => {
            const futurepassAddress = item?.args?.futurepass as Address;
            return (
              <TableRow key={item.eventId}>
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
    </div>
  );
}
