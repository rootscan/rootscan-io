'use client';

import { Fragment } from 'react';

import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { TableNavigation } from '@/components/ui/table-navigation.tsx';
import { camelCaseToWords } from '@/lib/utils';
import { PaginationResponse } from '@/types/api-types.ts';
import { IExtrinsic } from '@/types/models';
import { ChevronRight } from 'lucide-react';
import Link from 'next/link';

import AddressDisplay from './address-display';
import ExtrinsicStatus from './extrinsic-status';
import NoData from './no-data';
import TimeAgoDate from './time-ago-date';
import Tooltip from './tooltip';
import { Badge } from './ui/badge';

interface ExtrinsicsTableProps {
  extrinsics: IExtrinsic[];
  pagination?: Omit<PaginationResponse<unknown>, 'docs'>;
}
export default function ExtrinsicsTable({ extrinsics, pagination }: ExtrinsicsTableProps) {
  if (!extrinsics?.length) return <NoData />;
  return (
    <Table>
      {!!pagination && (
        <TableCaption>
          <TableNavigation pagination={pagination}>
            <p>
              Showing extrinsics between <strong>{extrinsics[0].extrinsicId}</strong> to{' '}
              <strong>{extrinsics[extrinsics.length - 1].extrinsicId}</strong>
            </p>
          </TableNavigation>
        </TableCaption>
      )}
      <TableHeader>
        <TableRow>
          <TableHead>Status</TableHead>
          <TableHead>Extrinsic ID</TableHead>
          <TableHead>Block</TableHead>
          <TableHead>Timestamp</TableHead>
          <TableHead>Pallet</TableHead>
          <TableHead>Method</TableHead>
          <TableHead>Signer</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {extrinsics.map((extrinsic) => (
          <TableRow key={extrinsic.extrinsicId}>
            <TableCell className="max-w-fit md:max-w-[120px] lg:max-w-[60px]">
              <ExtrinsicStatus extrinsic={extrinsic} />
            </TableCell>
            <TableCell>
              <Link href={`/extrinsics/${extrinsic.extrinsicId}`}>{extrinsic.extrinsicId}</Link>
            </TableCell>
            <TableCell>
              <Link href={`/blocks/${extrinsic.block}`}>{extrinsic.block}</Link>
            </TableCell>
            <TableCell>
              <TimeAgoDate date={extrinsic.timestamp * 1000} />
            </TableCell>
            <TableCell className="capitalize">
              <div className="flex items-center gap-1">
                <Badge>{extrinsic.section ? camelCaseToWords(extrinsic.section) : null}</Badge>
                {extrinsic.isProxy ? (
                  <Fragment>
                    {extrinsic.proxiedSections?.map((item, _) => (
                      <Tooltip text="Proxied" key={_}>
                        <div className="flex items-center gap-1">
                          <ChevronRight className="size-4 text-muted-foreground" />
                          <Badge>{item ? camelCaseToWords(item) : null}</Badge>
                        </div>
                      </Tooltip>
                    ))}
                  </Fragment>
                ) : null}
              </div>
            </TableCell>
            <TableCell className="capitalize">
              <div className="flex items-center gap-1">
                <Badge>{extrinsic.method ? camelCaseToWords(extrinsic.method) : null}</Badge>
                {extrinsic.isProxy ? (
                  <Fragment>
                    {extrinsic.proxiedMethods?.map((item, _) => (
                      <Tooltip text="Proxied" key={_}>
                        <div className="flex items-center gap-1">
                          <ChevronRight className="size-4 text-muted-foreground" />
                          <Badge>{item ? camelCaseToWords(item) : null}</Badge>
                        </div>
                      </Tooltip>
                    ))}
                  </Fragment>
                ) : null}
              </div>
            </TableCell>
            <TableCell>
              {extrinsic.signer ? <AddressDisplay address={extrinsic.signer} useShortenedAddress /> : '-'}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
