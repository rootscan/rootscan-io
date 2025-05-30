import AddressDisplay from '@/components/address-display';
import Breadcrumbs from '@/components/breadcrumbs';
import Container from '@/components/container';
import { ErrorAlert } from '@/components/error-alert';
import NoData from '@/components/no-data';
import SectionTitle from '@/components/section-title';
import TimeAgoDate from '@/components/time-ago-date';
import TokenDisplay from '@/components/token-display';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ApiCommand, request } from '@/lib/api';
import { getPaginationData, handleRequestResult } from '@/lib/utils';
import { PageProps } from '@/types/page';
import { Metadata } from 'next';
import Link from 'next/link';
import { Address } from 'viem';
import { TableNavigation } from '@/components/ui/table-navigatio.tsx';

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
      <Container className="flex flex-col gap-6">
        <div className="space-y-4">
          <Breadcrumbs />
          <SectionTitle>DEX</SectionTitle>
        </div>
        <Table>
          <TableCaption>
            <TableNavigation pagination={getPaginationData(data)} />
          </TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Extrinsic ID</TableHead>
              <TableHead>Timestamp</TableHead>
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
      </Container>
    );
  } catch (error) {
    return <ErrorAlert error={error instanceof Error ? error : new Error('An unexpected error occurred')} />;
  }
}
