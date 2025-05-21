'use client';

import Link from 'next/link';

import { Button } from '@/components/ui/button.tsx';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/v2/card';
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
          const summary = [
            ['Pallet', extrinsic?.section],
            ['Method', extrinsic?.method],
            ['Signer', <AddressDisplay address={extrinsic?.signer} useShortenedAddress className="text-xs font-semibold" />],
          ]
          return (
            <CardContent
              key={extrinsic?.extrinsicId}
              className="flex items-center gap-6 pl-6"
            >
              <div className="flex flex-1 items-center gap-4">
                <div className="rounded-[12px] bg-[#F5F5F5] p-3 dark:bg-[#1C1C1C]">
                  <img src="/layers.png" alt="Layers" className="size-10" />
                </div>
                <div className="flex flex-col">
                  <Link
                    href={`/extrinsics/${extrinsic?.extrinsicId}`}
                    className="text-[18px]/[28px] font-semibold"
                  >
                    {extrinsic?.extrinsicId}
                  </Link>
                  <span className="text-xs text-foreground/40"><TimeAgoDate date={extrinsic?.timestamp * 1000} /></span>
                </div>
              </div>

              <div className="flex min-w-[200px] flex-col gap-1 rounded-[12px] border border-[#F1F1F1] p-3 dark:border-[#1C1C1C]">
                {summary.map(([label, value], i) => (
                  <div key={i} className="flex items-center justify-between gap-4">
                    <p className="text-xs text-[#737373]">{label}</p>
                    {typeof value === 'string' ? <p className="text-xs font-semibold">{value}</p> : value}
                  </div>
                ))}
              </div>
            </CardContent>
          )
        })}
      </div>
    </Card>
  );
}
