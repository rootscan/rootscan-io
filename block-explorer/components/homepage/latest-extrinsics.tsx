'use client';

import Link from 'next/link';
import { ReactNode } from 'react';

import { DataItemCard } from '@/components/homepage/data-item-card.tsx';
import { Button } from '@/components/ui/button.tsx';
import { Card, CardHeader, CardTitle } from '@/components/ui/v2/card';
import { IExtrinsic } from '@/types/models';

import AddressDisplay from '../address-display';
import TimeAgoDate from '../time-ago-date';

type LatestExtrinsicsProps = {
  latestExtrinsics: IExtrinsic[]
}
export const LatestExtrinsics = (props: LatestExtrinsicsProps) => {
  const { latestExtrinsics } = props;

  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between">
        <CardTitle>Extrinsics</CardTitle>
        <Button asChild variant="secondary" size="sm">
          <Link href="/extrinsics">View All</Link>
        </Button>
      </CardHeader>
      <div className="h-stack">
        {latestExtrinsics?.map((extrinsic) => {
          const summary: Array<[string, string | number | ReactNode]> = [
            ['Pallet', extrinsic?.section],
            ['Method', extrinsic?.method],
            ['Signer', <AddressDisplay address={extrinsic?.signer} useShortenedAddress className="text-xs font-semibold" />],
          ]
          return (
            <DataItemCard
              key={extrinsic?.extrinsicId}
              iconSrc="/layers.png"
              summary={summary}
            >
              <Link
                href={`/extrinsics/${extrinsic?.extrinsicId}`}
                className="text-[18px]/[28px] font-semibold"
              >
                {extrinsic?.extrinsicId}
              </Link>
              <span className="text-xs text-foreground/40"><TimeAgoDate date={extrinsic?.timestamp * 1000} /></span>
            </DataItemCard>
          )
        })}
      </div>
    </Card>
  );
}
