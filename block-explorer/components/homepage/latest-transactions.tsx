'use client';

import SectionTitle from '@/components/section-title';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { generateAvatarURL } from '@cfx-kit/wallet-avatar';
import { ArrowLeftRight, ChevronRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { getAddress } from 'viem';

import AddressDisplay from '../address-display';
import TimeAgoDate from '../time-ago-date';

export default function LatestTransactions({ latestTransactions }: { latestTransactions: any }) {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <Link href="/evm-transactions">
          <SectionTitle>EVM Txs</SectionTitle>
        </Link>
      </div>
      <div className="flex flex-col gap-6">
        {latestTransactions?.map((transaction, _) => (
          <Card key={transaction?.hash || _}>
            <CardContent className="flex flex-col gap-4 pt-6">
              <div className="flex flex-col flex-wrap justify-between gap-4">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div className="flex flex-wrap items-center gap-4">
                    {transaction?.toLookup?.isContract ? <Badge variant="info">Contract Call</Badge> : null}
                    {transaction.status === 'success' ? <Badge variant="success">Confirmed</Badge> : null}
                    {transaction?.tags?.map((tag, _) => (
                      <Badge variant="info" key={_}>
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <span className="text-muted-foreground text-xs">
                    <TimeAgoDate date={transaction?.timestamp} />
                  </span>
                </div>
              </div>
              <div className="flex min-w-0 items-center gap-4 truncate">
                <ArrowLeftRight className="text-muted-foreground shrink-0" />
                <Link href={`/tx/${transaction.hash}`} className="truncate">
                  <span className="truncate">{transaction.hash}</span>
                </Link>
              </div>
              <div className="flex flex-wrap items-center gap-2 md:justify-start">
                <Image
                  src={generateAvatarURL(transaction.from)}
                  width={50}
                  height={50}
                  priority
                  unoptimized
                  className="hidden rounded-[5px] md:block md:size-10"
                  alt="jazz"
                />
                <AddressDisplay
                  address={getAddress(transaction.from)}
                  nameTag={transaction?.fromLookup?.nameTag}
                  rnsName={transaction?.fromLookup?.rns}
                  isContract={transaction?.fromLookup?.isContract}
                  useShortenedAddress
                />

                <ChevronRight className="text-muted-foreground mx-1 size-4 shrink-0" />

                <Image
                  src={generateAvatarURL(transaction.to)}
                  width={50}
                  height={50}
                  priority
                  unoptimized
                  className="hidden rounded-[5px] md:block md:size-10"
                  alt="jazz"
                />

                <AddressDisplay
                  address={getAddress(transaction.to)}
                  nameTag={transaction?.toLookup?.nameTag}
                  rnsName={transaction?.toLookup?.rns}
                  isContract={transaction?.toLookup?.isContract}
                  useShortenedAddress
                />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
