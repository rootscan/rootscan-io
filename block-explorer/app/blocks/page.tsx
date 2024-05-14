import { Fragment, Suspense } from 'react';

import AddressDisplay from '@/components/address-display';
import Breadcrumbs from '@/components/breadcrumbs';
import Container from '@/components/container';
import PaginationSuspense from '@/components/pagination-suspense';
import SectionTitle from '@/components/section-title';
import TimeAgoDate from '@/components/time-ago-date';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { getBlocks } from '@/lib/api';
import { getAddressName } from '@/lib/constants/knownAddresses';
import { getPaginationData } from '@/lib/utils';
import { SortDesc } from 'lucide-react';
import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Blocks',
};

const getData = async ({ searchParams }: { searchParams: any }) => {
  let data = await getBlocks({
    page: searchParams?.page ? searchParams?.page : 1,
    limit: 25,
  });

  return data;
};

export default async function Page({ searchParams }: { searchParams: any }) {
  const data: any = await getData({ searchParams });
  const blocks = data.docs;
  return (
    <Container>
      <div className="flex flex-col gap-4">
        <Suspense fallback={<Fragment />}>
          <Breadcrumbs />
        </Suspense>
        <SectionTitle>Blocks</SectionTitle>
        <PaginationSuspense pagination={getPaginationData(data)} />
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
            {blocks.map((block: any) => (
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
                  <TimeAgoDate date={block?.timestamp} />
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
}
