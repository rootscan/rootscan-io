import { Fragment, Suspense } from 'react';

import AddressDisplay from '@/components/address-display';
import Breadcrumbs from '@/components/breadcrumbs';
import Container from '@/components/container';
import { ErrorAlert } from '@/components/error-alert';
import PaginationSuspense from '@/components/pagination-suspense';
import SectionTitle from '@/components/section-title';
import TimeAgoDate from '@/components/time-ago-date';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ApiCommand, request } from '@/lib/api';
import { getAddressName } from '@/lib/constants/knownAddresses';
import { getPaginationData } from '@/lib/utils';
import { handleRequestResult } from '@/lib/utils';
import { PageProps } from '@/types/page';
import { SortDesc } from 'lucide-react';
import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Blocks',
};

export default async function Page({ searchParams }: PageProps) {
  try {
    const params = await searchParams;
    const page = Number(params?.page) || 1;
    const blocks = handleRequestResult(await request(ApiCommand.getBlocks, { page, limit: 24 }));

    return (
      <Container>
        <div className="flex flex-col gap-4">
          <Suspense fallback={<Fragment />}>
            <Breadcrumbs />
          </Suspense>
          <SectionTitle>Blocks</SectionTitle>
          <PaginationSuspense pagination={getPaginationData(blocks)} />
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead />
                <TableHead>
                  <div className="flex items-center gap-2">
                    <SortDesc className="size-5" /> Block
                  </div>
                </TableHead>
                <TableHead>Age</TableHead>
                <TableHead>Validator</TableHead>
                <TableHead className="text-center">Hash</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {blocks.docs.map((block) => (
                <TableRow key={block.number}>
                  <TableCell className="max-w-fit md:max-w-[120px] lg:max-w-[60px]">
                    {block?.isFinalized ? (
                      <div>
                        <Badge variant="success">Finalized</Badge>
                      </div>
                    ) : (
                      <div className="flex items-center">
                        <Badge variant="warning">Unfinalized</Badge>
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    <Link href={`/blocks/${block.number}`}>{block.number}</Link>
                  </TableCell>
                  <TableCell>
                    <TimeAgoDate date={block.timestamp} />
                  </TableCell>
                  <TableCell>
                    <AddressDisplay address={block.evmBlock.miner} useShortenedAddress />
                  </TableCell>
                  <TableCell className="text-center">{getAddressName(block.hash, true)}</TableCell>
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
