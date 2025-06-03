'use client';

import { Fragment } from 'react';

import GasUsage from '@/app/blocks/components/gas-usage';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import CardDetail from '@/components/ui/card-detail';
import { Separator } from '@/components/ui/separator.tsx';
import { formatNumber } from '@/lib/utils';

import InputData from './input-data';

export default function ShowMoreTransaction({ transaction }) {
  const percentageFormatter = new Intl.NumberFormat('en-US', { style: 'percent' });
  return (
    <Card>
      <CardContent className="flex flex-col gap-5 p-6">
        <CardDetail.Wrapper>
          <CardDetail.Title>Gas Usage & Limit</CardDetail.Title>
          <CardDetail.Content>
            <div className="flex w-full max-w-[240px] flex-col gap-2">
              <div className="truncate">
                {formatNumber(transaction.gasUsed)} / {formatNumber(transaction.gas)}
                <span className="ml-2 font-normal text-muted-foreground">
                  {`(${percentageFormatter.format(Number(transaction.gasUsed) / Number(transaction.gas))})`}
                </span>
              </div>
              <div>
                <GasUsage gasUsed={transaction?.gasUsed} gasLimit={transaction?.gas} />
              </div>
            </div>
          </CardDetail.Content>
        </CardDetail.Wrapper>
        <CardDetail.Wrapper>
          <CardDetail.Title>Gas Fees</CardDetail.Title>
          <CardDetail.Content>
            <div className="flex flex-wrap items-center gap-2 divide-x-0 md:gap-0 md:divide-x-2">
              {transaction?.type === 'eip1559' ? (
                <Fragment>
                  <div className="flex items-center gap-2 text-sm md:pr-2">
                    Gas Price <Badge>{transaction?.gasPrice} gwei</Badge>
                  </div>
                  <div className="flex items-center gap-2 text-sm md:px-2">
                    Effective Gas Price <Badge>{transaction?.effectiveGasPrice} gwei</Badge>
                  </div>
                  <div className="flex items-center gap-2 text-sm md:pl-2">
                    Max Priority <Badge>{transaction?.maxPriorityFeePerGas} gwei</Badge>
                  </div>
                </Fragment>
              ) : (
                <Fragment>
                  <div className="flex items-center gap-2 pr-2 text-sm">
                    Gas Price <Badge>{transaction?.gasPrice} gwei</Badge>
                  </div>
                </Fragment>
              )}
            </div>
          </CardDetail.Content>
        </CardDetail.Wrapper>
        <Separator />
        <CardDetail.Wrapper>
          <CardDetail.Title>Other Attributes</CardDetail.Title>
          <CardDetail.Content>
            <div className="flex flex-wrap items-center gap-2 divide-x-0 md:gap-0 md:divide-x-2">
              <div className="flex items-center gap-2 text-sm md:pr-2">
                Type <Badge>{transaction?.type}</Badge>
              </div>
              <div className="flex items-center gap-2 text-sm md:px-2">
                Nonce <Badge>{transaction?.nonce}</Badge>
              </div>
              <div className="flex items-center gap-2 text-sm md:pl-2">
                Position in Block{' '}
                <Badge>{transaction?.transactionIndex >= 0 ? transaction?.transactionIndex : '-'}</Badge>
              </div>
            </div>
          </CardDetail.Content>
        </CardDetail.Wrapper>
        {transaction?.input ? (
          <>
            <Separator />
            <CardDetail.Wrapper>
              <CardDetail.Title>Input</CardDetail.Title>
              <CardDetail.Content>
                <InputData transaction={transaction} input={transaction?.input} />
              </CardDetail.Content>
            </CardDetail.Wrapper>
          </>
        ) : null}
      </CardContent>
    </Card>
  );
}
