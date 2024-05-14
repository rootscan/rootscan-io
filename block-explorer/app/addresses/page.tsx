import AddressDisplay from '@/components/address-display';
import Breadcrumbs from '@/components/breadcrumbs';
import Container from '@/components/container';
import PaginationSuspense from '@/components/pagination-suspense';
import SectionTitle from '@/components/section-title';
import TokenDisplay from '@/components/token-display';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { getAddresses } from '@/lib/api';
import { ROOT_TOKEN, XRP_TOKEN } from '@/lib/constants/tokens';
import { getPaginationData } from '@/lib/utils';
import { SortDesc } from 'lucide-react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Addresses',
};

const getData = async ({ searchParams }) => {
  const data: any = await getAddresses({ page: searchParams?.page });
  return data;
};

export default async function Page({ searchParams }) {
  const data = await getData({ searchParams });
  const addresses = data?.docs;
  return (
    <Container>
      <div className="flex flex-col gap-4">
        <Breadcrumbs />
        <SectionTitle>Addresses</SectionTitle>

        <PaginationSuspense pagination={getPaginationData(data)} />

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Address</TableHead>
              <TableHead>
                <div className="flex items-center gap-2">
                  <SortDesc className="size-5" /> Root Balance
                </div>
              </TableHead>
              <TableHead>XRP Balance</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {addresses.map((item) => (
              <TableRow key={item?.address}>
                <TableCell>
                  <AddressDisplay address={item?.address} useShortenedAddress />
                </TableCell>
                <TableCell>
                  <TokenDisplay token={ROOT_TOKEN} amount={item?.balance?.free} hideCopyButton />
                </TableCell>
                <TableCell>
                  <TokenDisplay token={XRP_TOKEN} amount={item?.xrpBalance || 0} hideCopyButton />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </Container>
  );
}
