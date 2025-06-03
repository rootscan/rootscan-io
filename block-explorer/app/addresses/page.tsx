import AddressDisplay from '@/components/address-display';
import Breadcrumbs from '@/components/breadcrumbs';
import Container from '@/components/container';
import { ErrorAlert } from '@/components/error-alert';
import NoData from '@/components/no-data';
import SectionTitle from '@/components/section-title';
import TokenDisplay from '@/components/token-display';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { TableNavigation } from '@/components/ui/table-navigation.tsx';
import { ApiCommand, request } from '@/lib/api';
import { ROOT_TOKEN, XRP_TOKEN } from '@/lib/constants/tokens';
import { getPaginationData, handleRequestResult } from '@/lib/utils';
import { PageProps } from '@/types/page';
import { RiSortDesc } from '@remixicon/react';
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
      <Container className="flex flex-col gap-6">
        <div className="space-y-4">
          <Breadcrumbs />
          <SectionTitle>Addresses</SectionTitle>
        </div>

        <Table>
          <TableCaption>
            <TableNavigation pagination={getPaginationData(data)} />
          </TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Address</TableHead>
              <TableHead>
                <div className="flex items-center gap-2">
                  Root Balance
                  <RiSortDesc className="size-4" />
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
                  <TokenDisplay token={ROOT_TOKEN} amount={item.balance?.free} hideCopyButton shortFormat={true} />
                </TableCell>
                <TableCell>
                  <TokenDisplay token={XRP_TOKEN} amount={item.xrpBalance || 0} hideCopyButton shortFormat={true} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Container>
    );
  } catch (error) {
    return <ErrorAlert error={error instanceof Error ? error : new Error('An unexpected error occurred')} />;
  }
}
