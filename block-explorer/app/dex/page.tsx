import AddressDisplay from '@/components/address-display';
import Breadcrumbs from '@/components/breadcrumbs';
import Container from '@/components/container';
import PaginationSuspense from '@/components/pagination-suspense';
import SectionTitle from '@/components/section-title';
import TimeAgoDate from '@/components/time-ago-date';
import TokenDisplay from '@/components/token-display';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ApiCommand, request } from '@/lib/api';
import { getPaginationData } from '@/lib/utils';
import { SortDesc } from 'lucide-react';
import { Metadata } from 'next';
import Link from 'next/link';
import { Address } from 'viem';

export const metadata: Metadata = {
  title: 'DEX',
};

export default async function Page({ searchParams }: { searchParams: { page?: number } }) {
  const data = await request(ApiCommand.getDex, {
    page: searchParams?.page || 1,
  });
  const swaps = data?.docs;

  return (
    <Container>
      <div className="flex flex-col gap-4">
        <Breadcrumbs />
        <SectionTitle>DEX</SectionTitle>
        <PaginationSuspense pagination={getPaginationData(data)} />
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Extrinsic ID</TableHead>
              <TableHead>
                <div className="flex items-center gap-2">
                  <SortDesc className="size-5" /> Timestamp
                </div>
              </TableHead>
              <TableHead>Trader</TableHead>
              <TableHead>Token Amount (In)</TableHead>
              <TableHead>Token Amount (Out)</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {swaps.map((swap) => (
              <TableRow key={swap.eventId}>
                <TableCell>
                  <Link href={`/extrinsics/${swap.extrinsicId}`}>{swap.extrinsicId}</Link>
                </TableCell>
                <TableCell>
                  <TimeAgoDate date={swap.timestamp * 1000} />
                </TableCell>
                <TableCell>
                  <AddressDisplay address={swap.args?.trader as Address} useShortenedAddress />
                </TableCell>
                <TableCell>
                  <TokenDisplay
                    token={swap.swapFromToken}
                    amount={swap.args?.supply_Asset_amount as number}
                    hideCopyButton
                  />
                </TableCell>
                <TableCell>
                  <TokenDisplay
                    token={swap.swapToToken}
                    amount={swap.args?.target_Asset_amount as number}
                    hideCopyButton
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </Container>
  );
}
