import AddressDisplay from '@/components/address-display';
import NoData from '@/components/no-data';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { TableNavigation } from '@/components/ui/table-navigation.tsx';
import { ApiCommand, request } from '@/lib/api';
import { getPaginationData, handleRequestResult } from '@/lib/utils';
import { PageProps } from '@/types/page';
import Link from 'next/link';
import { Address, getAddress } from 'viem';

export default async function Page({ params, searchParams }: PageProps) {
  const paramsObj = await params;
  const searchParamsObj = await searchParams;
  if (!paramsObj.address) {
    return null;
  }
  const page = searchParamsObj?.page ? parseInt(searchParamsObj.page) : 1;

  const data = handleRequestResult(
    await request(ApiCommand.getFuturepasses, {
      address: getAddress(paramsObj.address),
      page,
    }),
  );

  const futurepasses = data?.docs;
  if (!futurepasses?.length) return <NoData />;

  return (
    <Table>
      <TableCaption>
        <TableNavigation pagination={getPaginationData(data)}>
          {!data.skipFullCount && <p>Showing {data.totalDocs} futurepasses</p>}
        </TableNavigation>
      </TableCaption>
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
  );
}
