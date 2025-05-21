'use client';

import { generateAvatarURL } from '@cfx-kit/wallet-avatar';
import { RiArrowRightSLine } from '@remixicon/react'
import Image from 'next/image';
import Link from 'next/link';
import { getAddress } from 'viem';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button.tsx';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/v2/card';
import { IEVMTransaction } from '@/types/models';

import AddressDisplay from '../address-display';
import TimeAgoDate from '../time-ago-date';

type LatestTransactionsProps = {
  latestTransactions: IEVMTransaction[]
}
export const LatestTransactions = (props: LatestTransactionsProps) => {
  const { latestTransactions } = props;

  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between">
        <CardTitle>EVM Transactions</CardTitle>
        <Button asChild variant="secondary" size="sm">
          <Link href="/evm-transactions">View All</Link>
        </Button>
      </CardHeader>
      <div className="h-stack">
        {latestTransactions?.map((transaction, _) => (
          <CardContent key={transaction?.hash || _} className="flex flex-row items-center gap-4 p-6">
            <div className="rounded-[12px] bg-[#F5F5F5] p-3 dark:bg-[#1C1C1C]">
              <img src="/arrows.png" alt="Arrows" className="size-10" />
            </div>

            <div className="flex flex-1 flex-col gap-1.5">
              <div className="flex items-center gap-2">
                <Link
                  href={`/tx/${transaction.hash}`}
                  className="flex-1 text-[16px]/[24px] font-semibold"
                >
                  {transaction.hash}
                </Link>
                {transaction?.toLookup?.isContract ? <Badge variant="info">Contract Call</Badge> : null}
                {transaction?.tags?.map((tag, _) => (
                  <Badge variant="info" key={_}>
                    {tag}
                  </Badge>
                ))}
                {transaction.status === 'success' ? <Badge variant="success">Confirmed</Badge> : null}
              </div>

              <div className="flex flex-wrap items-center gap-1.5 md:justify-start">
                <Image
                  src={generateAvatarURL(transaction.from)}
                  width={20}
                  height={20}
                  priority
                  unoptimized
                  className="hidden rounded-[5px] md:block md:size-5"
                  alt="jazz"
                />
                <AddressDisplay
                  address={getAddress(transaction.from)}
                  nameTag={transaction?.fromLookup?.nameTag}
                  rnsName={transaction?.fromLookup?.rns}
                  isContract={transaction?.fromLookup?.isContract}
                  useShortenedAddress
                />

                <RiArrowRightSLine className="mx-0.5 size-4 shrink-0 text-muted-foreground" />

                <Image
                  src={generateAvatarURL(String(transaction.to))}
                  width={20}
                  height={20}
                  priority
                  unoptimized
                  className="hidden rounded-[5px] md:block md:size-5"
                  alt="jazz"
                />

                <AddressDisplay
                  address={getAddress(String(transaction.to))}
                  nameTag={transaction?.toLookup?.nameTag}
                  rnsName={transaction?.toLookup?.rns}
                  isContract={transaction?.toLookup?.isContract}
                  useShortenedAddress
                />
              </div>

              <span className="text-xs text-muted-foreground">
                <TimeAgoDate date={transaction?.timestamp} />
              </span>
            </div>
          </CardContent>
        ))}
      </div>
    </Card>
  );
}
