'use client';

import Link from 'next/link';
import { ReactNode } from 'react';

import { DataItemCard } from '@/components/homepage/data-item-card.tsx';
import { Button } from '@/components/ui/button.tsx';
import { Card, CardHeader, CardTitle } from '@/components/ui/v2/card.tsx';
import { IBlock } from '@/types/models';

import AddressDisplay from '../address-display';
import TimeAgoDate from '../time-ago-date';

type LatestBlocksProps = {
  latestBlocks: IBlock[]
}
export const LatestBlocks = (props: LatestBlocksProps) => {
  const { latestBlocks } = props;

  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between">
        <CardTitle className="text-[18px]/[28px] font-semibold">Blocks</CardTitle>
        <Button asChild variant="secondary" size="sm">
          <Link href="/blocks">View All</Link>
        </Button>
      </CardHeader>
      <div className="h-stack">
        {latestBlocks?.map((block) => {
          const summary: Array<[string, string | number | ReactNode]> = [
            ['Events', block.eventsCount],
            ['EVM Txs', block.transactionsCount],
            ['Extrinsics', block.extrinsicsCount],
          ]

          return (
            <DataItemCard key={block.number} iconSrc="/cube.png" summary={summary}>
              <Link
                href={`/blocks/${block.number}`}
                className="text-[18px]/[28px] font-semibold"
              >
                {block.number}
              </Link>
              <div className="flex gap-1">
                <span className="text-sm text-muted-foreground">Validator</span>
                <AddressDisplay address={block.evmBlock.miner} useShortenedAddress />
              </div>
              {block?.isFinalized ? (
                <span className="text-xs text-foreground/40"><TimeAgoDate date={block.timestamp} /></span>
              ) : (
                <span className="text-xs text-[#FB923C]">Unfinalized</span>
              )}
            </DataItemCard>
          )
        })}
      </div>
    </Card>
  );
}
