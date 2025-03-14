import AddressDisplay from '@/components/address-display';
import Breadcrumbs from '@/components/breadcrumbs';
import Container from '@/components/container';
import { ErrorAlert } from '@/components/error-alert';
import NoData from '@/components/no-data';
import PaginationSuspense from '@/components/pagination-suspense';
import SectionTitle from '@/components/section-title';
import TokenDisplay from '@/components/token-display';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ApiCommand, request } from '@/lib/api';
import { ROOT_TOKEN, XRP_TOKEN } from '@/lib/constants/tokens';
import { getPaginationData, handleRequestResult } from '@/lib/utils';
import { PageProps } from '@/types/page';
import { SortDesc } from 'lucide-react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Addresses',
};

export default async function Page({ searchParams }: PageProps) {
  try {
    const searchParamsObj = await searchParams;
    const page = Number(searchParamsObj?.page) || 1;

    const data = handleRequestResult(await request(ApiCommand.getAddresses, { page }));

    if (!data.docs?.length) return <NoData />;

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
              {data.docs.map((item) => (
                <TableRow key={item.address}>
                  <TableCell>
                    <AddressDisplay address={item.address} useShortenedAddress />
                  </TableCell>
                  <TableCell>
                    <TokenDisplay token={ROOT_TOKEN} amount={item.balance?.free} hideCopyButton />
                  </TableCell>
                  <TableCell>
                    <TokenDisplay token={XRP_TOKEN} amount={item.xrpBalance || 0} hideCopyButton />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Container>
    );
  } catch (error) {
    return <ErrorAlert error={error instanceof Error ? error : new Error('An unexpected error occurred')} />;
  }
}
