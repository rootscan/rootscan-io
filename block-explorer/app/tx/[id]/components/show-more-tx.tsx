'use client';

import { Fragment, useState } from 'react';

import GasUsage from '@/app/blocks/components/gas-usage';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import CardDetail from '@/components/ui/card-detail';
import { cn, formatNumber } from '@/lib/utils';

import InputData from './input-data';

export default function ShowMoreTransaction({ transaction }) {
  const [expanded, setExpanded] = useState<boolean>(false);
  return (
    <Fragment>
      <div
        className="cursor-pointer select-none"
        onClick={() => {
          setExpanded(!expanded);
        }}
      >
        {!expanded ? 'Show more details' : 'Show less details'}
      </div>
      {/* More Details Card */}
      <Card className={cn([!expanded ? 'hidden' : ' animate-in fade-in-0 duration-300'])}>
        <CardContent className="pt-6">
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-1">
              <span className="text-muted-foreground">Gas Usage & Limit</span>
              <div className="max-w-xs">
                <GasUsage gasUsed={transaction?.gasUsed} gasLimit={transaction?.gas} onlyBar />
              </div>
              <span className="truncate">
                {formatNumber(transaction.gasUsed)} / {formatNumber(transaction.gas)}
                <span className="text-muted-foreground ml-2">
                  {'('}
                  {Math.round((Number(transaction.gasUsed) / Number(transaction.gas)) * 100)}
                  {'%)'}
                </span>
              </span>
            </div>
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
              <CardDetail.Wrapper>
                <CardDetail.Title>Input</CardDetail.Title>
                <CardDetail.Content>
                  <InputData transaction={transaction} input={transaction?.input} />
                </CardDetail.Content>
              </CardDetail.Wrapper>
            ) : null}
          </div>
        </CardContent>
      </Card>
    </Fragment>
  );
}
