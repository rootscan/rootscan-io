import { Fragment } from 'react';

import AddressDisplay from '@/components/address-display';
import { CopyButton } from '@/components/copy-button';
import { ErrorAlert } from '@/components/error-alert';
import {
  getEventComponent,
  hasParsedEventsAvailableExtrinsics,
  isAllowedEventInExtrinsic,
} from '@/components/events-components';
import ExtrinsicStatus from '@/components/extrinsic-status';
import JsonViewer from '@/components/json-viewer';
import NoData from '@/components/no-data';
import Timestamp from '@/components/timestamp';
import TokenDisplay from '@/components/token-display';
import Tooltip from '@/components/tooltip';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import CardDetail from '@/components/ui/card-detail';
import { Separator } from '@/components/ui/separator.tsx';
import { ApiCommand, request } from '@/lib/api';
import { XRP_TOKEN } from '@/lib/constants/tokens';
import { camelCaseToWords, handleRequestResult } from '@/lib/utils';
import { RiArrowRightSLine, RiArrowUpLine, RiCornerLeftUpLine } from '@remixicon/react';
import Link from 'next/link';

import ExtrinsicIdDisplay from './components/extrinsicIdDisplay';

interface PageProps {
  params: Promise<{ extrinsicId: string }>;
}

export default async function Page({ params }: PageProps) {
  try {
    const paramsObj = await params;
    if (!paramsObj.extrinsicId) {
      throw new Error('Extrinsic ID is required');
    }

    const data = handleRequestResult(await request(ApiCommand.getExtrinsic, { extrinsicId: paramsObj.extrinsicId }));

    if (!data) return <NoData />;

    const isProxy = data?.isProxy;

    return (
      <Card>
        <CardContent className="flex flex-col gap-5 p-6">
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
              <Timestamp date={data?.timestamp ? data.timestamp * 1000 : 0} />
            </CardDetail.Content>
          </CardDetail.Wrapper>
          <Separator />
          <CardDetail.Wrapper>
            <CardDetail.Title>Pallet</CardDetail.Title>
            <CardDetail.Content className="flex-wrap gap-1">
              <Badge>{data?.section ? camelCaseToWords(data.section) : null}</Badge>
              {isProxy ? (
                <Fragment>
                  {data?.proxiedSections?.map((item, _) => (
                    <Fragment key={_}>
                      <RiArrowRightSLine className="size-5" />
                      <Tooltip text="Proxied">
                        <Badge>{item ? camelCaseToWords(item) : null}</Badge>
                      </Tooltip>
                    </Fragment>
                  ))}
                </Fragment>
              ) : null}
            </CardDetail.Content>
          </CardDetail.Wrapper>
          <CardDetail.Wrapper>
            <CardDetail.Title>Method</CardDetail.Title>
            <CardDetail.Content className="flex-wrap gap-1">
              <Badge>{data?.method ? camelCaseToWords(data.method) : null}</Badge>
              {isProxy ? (
                <Fragment>
                  {data?.proxiedMethods?.map((item, _) => (
                    <Fragment key={_}>
                      <RiArrowRightSLine className="size-5" />
                      <Tooltip text="Proxied">
                        <Badge>{item ? camelCaseToWords(item) : null}</Badge>
                      </Tooltip>
                    </Fragment>
                  ))}
                </Fragment>
              ) : null}
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
          <Separator />

          <CardDetail.Wrapper>
            <CardDetail.Title>Event(s)</CardDetail.Title>
            <CardDetail.Content>
              {data?.events && hasParsedEventsAvailableExtrinsics(data.events) ? (
                <div className="flex flex-col gap-2">
                  {data?.events?.map((currentEvent, _) => {
                    if (!isAllowedEventInExtrinsic(currentEvent)) {
                      return null;
                    }
                    return (
                      <div className="flex items-center gap-1 rounded-[12px] bg-surface-bg p-4" key={_}>
                        <div className="flex flex-col gap-2 md:flex-row">
                          <div className="flex items-center gap-1">
                            <Badge type="linear">
                              {currentEvent?.section ? camelCaseToWords(currentEvent?.section) : null}
                            </Badge>
                            <Badge type="linear">
                              {currentEvent?.method ? camelCaseToWords(currentEvent?.method) : null}
                            </Badge>
                          </div>
                          <div>{getEventComponent(currentEvent, true)}</div>
                        </div>
                      </div>
                    );
                  })}
                  <p className="mt-2 text-xs font-normal text-muted-foreground">
                    Not all events are displayed here. Please refer to Events tab for more info.
                  </p>
                </div>
              ) : data?.events?.length ? (
                <p className="text-xs font-normal text-muted-foreground">
                  No parsed events found, please refer to the events tab.
                </p>
              ) : null}
            </CardDetail.Content>
          </CardDetail.Wrapper>

          <Separator />

          {data?.signer ? (
            <CardDetail.Wrapper>
              <CardDetail.Title>Signer</CardDetail.Title>
              <CardDetail.Content>
                <AddressDisplay address={data.signer} />
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
                      <RiCornerLeftUpLine className="hidden size-5 md:block" />
                      <RiArrowUpLine className="block size-5 md:hidden" />
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

          <Separator />

          {data?.args ? (
            <CardDetail.Wrapper>
              <CardDetail.Title>
                <div className="flex items-center gap-2">
                  Raw Arguments <CopyButton value={data?.args ? JSON.stringify(data.args) : ''} />
                </div>
              </CardDetail.Title>
              <CardDetail.Content>
                {data?.args ? <JsonViewer json={data.args} className="w-full" /> : null}
              </CardDetail.Content>
            </CardDetail.Wrapper>
          ) : null}
        </CardContent>
      </Card>
    );
  } catch (error) {
    return <ErrorAlert error={error instanceof Error ? error : new Error('An unexpected error occurred')} />;
  }
}
