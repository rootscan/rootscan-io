'use client';

import SectionTitle from '@/components/section-title';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel';
import { cn } from '@/lib/utils';
import { AlertTriangle, Box } from 'lucide-react';
import Link from 'next/link';

import AddressDisplay from '../address-display';
import TimeAgoDate from '../time-ago-date';
import Tooltip from '../tooltip';

export default function LatestBlocks({ latestBlocks }: { latestBlocks: any }) {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <Link href="/blocks">
          <SectionTitle>Blocks</SectionTitle>
        </Link>
      </div>
      <div className="group flex flex-col gap-6 overflow-x-hidden lg:flex-row">
        <Carousel>
          <CarouselContent>
            {latestBlocks?.map((block: any, _: number) => (
              <CarouselItem
                key={block.number}
                className={cn(['basis-1/1 md:basis-1/2 lg:basis-1/4', _ === 0 && 'animate-block w-full'])}
              >
                <Card>
                  <CardHeader>
                    <CardTitle>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <Box className="text-muted-foreground" />
                          <Link href={`/blocks/${block.number}`}>
                            <span>{block.number}</span>
                          </Link>
                        </div>
                        {block?.isFinalized ? (
                          <span className="text-muted-foreground line-clamp-1 truncate text-right text-xs">
                            <TimeAgoDate date={block.timestamp} />
                          </span>
                        ) : (
                          <Tooltip text="Unfinalized">
                            <AlertTriangle className="size-5 text-orange-400" />
                          </Tooltip>
                        )}
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col gap-4">
                      <div className="flex gap-2">
                        <span className="text-muted-foreground">EVM Txs</span>
                        <Link href={`/blocks/${block.number}/evm-transactions`}>
                          <span>{block.transactionsCount}</span>
                        </Link>
                      </div>
                      <div className="flex flex-row justify-between">
                        <div className="flex gap-2">
                          <span className="text-muted-foreground">Extrinsics</span>
                          <Link href={`/blocks/${block.number}/extrinsics`}>
                            <span>{block.extrinsicsCount}</span>
                          </Link>
                        </div>
                        <div className="flex gap-2">
                          <span className="text-muted-foreground">Events</span>
                          <Link href={`/blocks/${block.number}/events`}>
                            <span>{block.eventsCount}</span>
                          </Link>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <span className="text-muted-foreground">Validator</span>
                        <AddressDisplay address={block.evmBlock.miner} useShortenedAddress />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>
    </div>
  );
}
