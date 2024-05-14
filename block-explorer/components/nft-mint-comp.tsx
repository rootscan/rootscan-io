'use client';

import { Fragment, useState } from 'react';

import ExtrinsicMethod from '@/components/extrinsic-method';
import { ChevronRight } from 'lucide-react';
import Link from 'next/link';

import AddressDisplay from './address-display';
import InOutBadge from './in-out-badge';
import TimeAgoDate from './time-ago-date';
import { Button } from './ui/button';
import { TableCell, TableRow } from './ui/table';

export default function NFTMint({ tx, address }) {
  const tokenIdsMinted: any = [];
  if (!isNaN(tx?.args?.start) && !isNaN(tx?.args?.end)) {
    for (let i = tx?.args?.start; i <= tx?.args?.end; i++) {
      tokenIdsMinted.push(i);
    }
  }
  const maxSize = tokenIdsMinted?.length;
  const [maxBatch, setMaxBatch] = useState(maxSize >= 5 ? 5 : maxSize);

  return (
    <TableRow>
      <TableCell className="max-w-[150px] truncate">
        <Link href={`/extrinsics/${tx.extrinsicId}`}>
          <span className="truncate">{tx.extrinsicId}</span>
        </Link>
      </TableCell>
      <TableCell>
        <ExtrinsicMethod tx={tx} />
      </TableCell>
      <TableCell>
        <InOutBadge address={address} from={'0x0000000000000000000000'} to={tx?.args?.owner} />
      </TableCell>
      <TableCell>
        <TimeAgoDate date={tx?.timestamp * 1000} />
      </TableCell>
      <TableCell className="max-w-[100px]">
        <div className="flex flex-col gap-2">
          {tokenIdsMinted.splice(0, maxBatch).map((tokenId, _) => (
            <div className="flex items-center gap-2" key={`${_}_${tx?.nftCollection?.contractAddress}_${tokenId}`}>
              {tokenId}
              <AddressDisplay
                address={tx?.nftCollection?.contractAddress}
                nameTag={tx?.nftCollection?.name}
                hideCopyButton
              />
            </div>
          ))}
          {maxBatch != maxSize ? (
            <Fragment>
              <p>...{maxSize - maxBatch} more records</p>
              <div>
                <Button size="sm" variant="secondary" onClick={() => setMaxBatch(maxBatch + 5)}>
                  Load More
                </Button>
              </div>
            </Fragment>
          ) : null}
        </div>
      </TableCell>
      <TableCell className="max-w-[150px] truncate">-</TableCell>
      <TableCell className="text-muted-foreground max-w-[25px]">
        <ChevronRight className="size-4" />
      </TableCell>
      <TableCell className="max-w-[150px] truncate">
        <AddressDisplay address={tx?.args?.owner} useShortenedAddress />
      </TableCell>
    </TableRow>
  );
}
