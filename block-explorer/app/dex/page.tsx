import AddressDisplay from '@/components/address-display';
import Breadcrumbs from '@/components/breadcrumbs';
import Container from '@/components/container';
import { ErrorAlert } from '@/components/error-alert';
import NoData from '@/components/no-data';
import PaginationSuspense from '@/components/pagination-suspense';
import SectionTitle from '@/components/section-title';
import TimeAgoDate from '@/components/time-ago-date';
import TokenDisplay from '@/components/token-display';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ApiCommand, request } from '@/lib/api';
import { getPaginationData, handleRequestResult } from '@/lib/utils';
import { PageProps } from '@/types/page';
import { SortDesc } from 'lucide-react';
import { Metadata } from 'next';
import Link from 'next/link';
import { Address } from 'viem';

export const metadata: Metadata = {
  title: 'DEX',
};

export default async function Page({ searchParams }: PageProps) {
  try {
    const searchParamsObj = await searchParams;
    const page = Number(searchParamsObj?.page) || 1;

    const data = handleRequestResult(
      await request(ApiCommand.getDex, {
        page,
      }),
    );

    const swaps = data.docs;
    if (!swaps?.length) return <NoData />;

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
  } catch (error) {
    return <ErrorAlert error={error instanceof Error ? error : new Error('An unexpected error occurred')} />;
  }
}
