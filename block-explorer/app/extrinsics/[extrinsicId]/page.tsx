import { Fragment } from 'react';

import AddressDisplay from '@/components/address-display';
import { CopyButton } from '@/components/copy-button';
import {
  getEventComponent,
  hasParsedEventsAvailableExtrinsics,
  isAllowedEventInExtrinsic,
} from '@/components/events-components';
import ExtrinsicStatus from '@/components/extrinsic-status';
import JsonViewer from '@/components/json-viewer';
import Timestamp from '@/components/timestamp';
import TokenDisplay from '@/components/token-display';
import Tooltip from '@/components/tooltip';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import CardDetail from '@/components/ui/card-detail';
import { getExtrinsic } from '@/lib/api';
import { XRP_TOKEN } from '@/lib/constants/tokens';
import { camelCaseToWords } from '@/lib/utils';
import { ArrowUp, ChevronRight, CornerLeftUp } from 'lucide-react';
import Link from 'next/link';

import ExtrinsicIdDisplay from './components/extrinsicIdDisplay';

const getData = async ({ params }) => {
  const data = await getExtrinsic({ extrinsicId: String(params?.extrinsicId) });
  return data;
};

export default async function Page({ params }) {
  const data = await getData({ params });

  const isProxy = data?.isProxy;

  return (
    <Card>
      <CardHeader className="relative">
        <CardTitle>Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-6">
          <CardDetail.Wrapper>
            <CardDetail.Title>Extrinsic ID</CardDetail.Title>
            <CardDetail.Content>
              <ExtrinsicIdDisplay extrinsicId={data?.extrinsicId} retroExtrinsicId={data?.retroExtrinsicId} />
            </CardDetail.Content>
          </CardDetail.Wrapper>
          <CardDetail.Wrapper>
            <CardDetail.Title>Result</CardDetail.Title>
            <CardDetail.Content>
              <ExtrinsicStatus extrinsic={data} showErrorInfo />
            </CardDetail.Content>
          </CardDetail.Wrapper>
          <CardDetail.Wrapper>
            <CardDetail.Title>Block Height</CardDetail.Title>
            <CardDetail.Content>
              <Link href={`/blocks/${data?.block}`}>{data?.block}</Link>
            </CardDetail.Content>
          </CardDetail.Wrapper>
          <CardDetail.Wrapper>
            <CardDetail.Title>Timestamp</CardDetail.Title>
            <CardDetail.Content>
              <Timestamp date={data?.timestamp * 1000} />
            </CardDetail.Content>
          </CardDetail.Wrapper>
          <CardDetail.Wrapper>
            <CardDetail.Title>Pallet</CardDetail.Title>
            <CardDetail.Content>
              <div className="flex flex-wrap items-center gap-1">
                <Badge>{data?.section ? camelCaseToWords(data?.section) : null}</Badge>
                {isProxy ? (
                  <Fragment>
                    {data?.proxiedSections.map((item, _) => (
                      <Tooltip text="Proxied" key={_}>
                        <div className="flex items-center gap-1">
                          <ChevronRight />
                          <Badge>{item ? camelCaseToWords(item) : null}</Badge>
                        </div>
                      </Tooltip>
                    ))}
                  </Fragment>
                ) : null}
              </div>
            </CardDetail.Content>
          </CardDetail.Wrapper>
          <CardDetail.Wrapper>
            <CardDetail.Title>Method</CardDetail.Title>
            <CardDetail.Content>
              <div className="flex flex-wrap items-center gap-1">
                <Badge>{data?.method ? camelCaseToWords(data?.method) : null}</Badge>
                {isProxy ? (
                  <Fragment>
                    {data?.proxiedMethods.map((item, _) => (
                      <Tooltip text="Proxied" key={_}>
                        <div className="flex items-center gap-1">
                          <ChevronRight />
                          <Badge> {item ? camelCaseToWords(item) : null}</Badge>
                        </div>
                      </Tooltip>
                    ))}
                  </Fragment>
                ) : null}
              </div>
            </CardDetail.Content>
          </CardDetail.Wrapper>
          {data?.args?.futurepass || data?.args?.call?.args?.futurepass ? (
            <CardDetail.Wrapper>
              <CardDetail.Title>Futurepass</CardDetail.Title>
              <CardDetail.Content>
                <AddressDisplay address={data?.args?.futurepass || data?.args?.call?.args?.futurepass} />
              </CardDetail.Content>
            </CardDetail.Wrapper>
          ) : null}

          {data?.events && hasParsedEventsAvailableExtrinsics(data?.events) ? (
            <div className="flex flex-col gap-1">
              <span className="text-muted-foreground">⚡ Event(s)</span>
              <div className="mt-1 rounded-2xl bg-black/5 p-3 dark:bg-white/5">
                <div className="flex flex-col gap-4">
                  {data?.events?.map((currentEvent, _) => {
                    if (!isAllowedEventInExtrinsic(currentEvent)) {
                      return null;
                    }
                    return (
                      <Fragment key={_}>
                        <div className="flex flex-col gap-2 md:flex-row">
                          <div className="flex items-center gap-1">
                            <Badge>{currentEvent?.section ? camelCaseToWords(currentEvent?.section) : null}</Badge>
                            <Badge>{currentEvent?.method ? camelCaseToWords(currentEvent?.method) : null}</Badge>
                          </div>
                          <div>{getEventComponent(currentEvent, true)}</div>
                        </div>
                      </Fragment>
                    );
                  })}
                </div>
              </div>
              <p className="text-muted-foreground mt-2 text-xs">
                Not all events are displayed here. Please refer to Events tab for more info.
              </p>
            </div>
          ) : data?.events?.length ? (
            <p className="text-muted-foreground text-xs">No parsed events found, please refer to the events tab.</p>
          ) : null}
          {data?.signer ? (
            <CardDetail.Wrapper>
              <CardDetail.Title>Signer</CardDetail.Title>
              <CardDetail.Content>
                <AddressDisplay address={data?.signer} />
              </CardDetail.Content>
            </CardDetail.Wrapper>
          ) : null}

          {data?.fee ? (
            <CardDetail.Wrapper>
              <CardDetail.Title>Transaction Fee</CardDetail.Title>
              <CardDetail.Content>
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-1">
                    <span>{data?.fee?.actualFeeFormatted} </span>
                    <TokenDisplay token={XRP_TOKEN} hideCopyButton />
                  </div>
                  {data?.proxyFee ? (
                    <div className="flex flex-wrap items-center gap-1">
                      <CornerLeftUp className="hidden size-5 md:block" />
                      <ArrowUp className="block size-5 md:hidden" />
                      <div className="flex flex-wrap items-center gap-1 whitespace-normal">
                        Swapped{' '}
                        <TokenDisplay
                          token={data?.proxyFeeToken}
                          amount={data?.proxyFee?.swappedAmount}
                          hideCopyButton
                        />{' '}
                        to pay for gas
                      </div>
                    </div>
                  ) : null}
                </div>
              </CardDetail.Content>
            </CardDetail.Wrapper>
          ) : null}

          {data?.args?.transactionHash ? (
            <CardDetail.Wrapper>
              <CardDetail.Title>EVM Transaction Hash</CardDetail.Title>
              <CardDetail.Content>
                <Link href={`/tx/${data?.args?.transactionHash}`} className="truncate">
                  {data?.args?.transactionHash}
                </Link>
              </CardDetail.Content>
            </CardDetail.Wrapper>
          ) : null}

          {data?.args ? (
            <CardDetail.Wrapper>
              <CardDetail.Title>
                <div className="flex items-center gap-2">
                  Raw Arguments <CopyButton value={data?.args ? JSON.stringify(data.args) : ''} />
                </div>
              </CardDetail.Title>
              <CardDetail.Content>{data?.args ? <JsonViewer json={data?.args} /> : null}</CardDetail.Content>
            </CardDetail.Wrapper>
          ) : null}
        </div>
      </CardContent>
    </Card>
  );
}
