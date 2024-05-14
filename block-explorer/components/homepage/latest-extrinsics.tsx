'use client';

import SectionTitle from '@/components/section-title';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FunctionSquare } from 'lucide-react';
import Link from 'next/link';

import AddressDisplay from '../address-display';
import TimeAgoDate from '../time-ago-date';

export default function LatestExtrinsics({ latestExtrinsics }: { latestExtrinsics: any }) {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <Link href="/extrinsics">
          <SectionTitle>Extrinsics</SectionTitle>
        </Link>
      </div>
      <div className="group flex flex-col gap-6">
        {latestExtrinsics?.map((extrinsic: any, _: number) => (
          <Card
            key={extrinsic?.extrinsicId}
            // className={cn([_ === 0 && "duration-300 animate-in fade-in"])}
          >
            <CardHeader>
              <CardTitle>
                <div className="flex items-center gap-4">
                  <FunctionSquare className="text-muted-foreground size-6" />
                  <Link href={`/extrinsics/${extrinsic?.extrinsicId}`} className="shrink-0">
                    <span>{extrinsic?.extrinsicId}</span>
                  </Link>
                  <div className="ml-auto flex items-center">
                    <span className="text-muted-foreground text-xs">
                      <TimeAgoDate date={extrinsic?.timestamp * 1000} />
                    </span>
                  </div>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-4">
                <div className="flex flex-row justify-between">
                  <div className="flex gap-2 truncate">
                    <span className="text-muted-foreground">Pallet</span>
                    <span className="truncate">{extrinsic?.section}</span>
                  </div>
                </div>
                <div className="flex flex-row justify-between">
                  <div className="flex gap-2 truncate">
                    <span className="text-muted-foreground">Method</span>
                    <span className="truncate">{extrinsic?.method}</span>
                  </div>
                </div>
                {extrinsic?.signer ? (
                  <div className="flex gap-2">
                    <span className="text-muted-foreground">Signer</span>
                    <AddressDisplay address={extrinsic?.signer} useShortenedAddress />
                  </div>
                ) : null}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
