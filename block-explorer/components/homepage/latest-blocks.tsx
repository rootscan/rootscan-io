'use client';

import Link from 'next/link';

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
      {latestBlocks?.map((block) => {
        const summary = [
          ['Events', block.eventsCount],
          ['EVM Txs', block.transactionsCount],
          ['Extrinsics', block.extrinsicsCount],
        ]
        return (
          <div
            key={block.number}
            className="flex items-center gap-6 border-b border-[#F1F1F1] p-4 pl-6 last-of-type:border-b-0 dark:border-[#1C1C1C]"
          >
            <div className="flex flex-1 items-center gap-4">
              <div className="rounded-[12px] bg-[#F5F5F5] p-3 dark:bg-[#1C1C1C]">
                <img src="/cube.png" alt="Cube" className="size-10" />
              </div>
              <div className="flex flex-col">
                <h4 className="text-[18px]/[28px] font-semibold">{block.number}</h4>
                <div className="flex gap-1">
                  <span className="text-sm text-muted-foreground">Validator</span>
                  <AddressDisplay address={block.evmBlock.miner} useShortenedAddress />
                </div>
                {block?.isFinalized ? (
                  <span className="text-xs text-foreground/40"><TimeAgoDate date={block.timestamp} /></span>
                ) : (
                  <span className="text-xs text-[#FB923C]">Unfinalized</span>
                )}
              </div>
            </div>
            <div className="flex min-w-[200px] flex-col gap-1 rounded-[12px] border border-[#F1F1F1] p-3 dark:border-[#1C1C1C]">
              {summary.map(([label, value], i) => (
                <div key={i} className="flex items-center justify-between gap-4">
                  <p className="text-xs text-[#737373]">{label}</p>
                  <p className="text-xs font-semibold">{value}</p>
                </div>
              ))}
            </div>
          </div>
        )
      })}
    </Card>
  );
}
