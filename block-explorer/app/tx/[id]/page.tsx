import { Fragment } from 'react';

import { EventWrapper } from '@/app/tx/[id]/components/event-wrapper.tsx';
import AddressDisplay from '@/components/address-display';
import { CopyButton } from '@/components/copy-button';
import { ErrorAlert } from '@/components/error-alert';
import OnlyMainnet from '@/components/layouts/only-mainnet';
import { NftThumbnail } from '@/components/nft-thumbnail';
import NoData from '@/components/no-data';
import Timestamp from '@/components/timestamp';
import TokenDisplay from '@/components/token-display';
import TokenLogo from '@/components/token-logo';
import Tooltip from '@/components/tooltip';
import TransactionStatusBadge from '@/components/transaction-status-badge';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import CardDetail from '@/components/ui/card-detail.tsx';
import { Separator } from '@/components/ui/separator.tsx';
import { ApiCommand, request } from '@/lib/api';
import { XRP_TOKEN } from '@/lib/constants/tokens';
import { camelCaseToWords, formatNumber, formatNumberDollars, handleRequestResult } from '@/lib/utils';
import { PageProps } from '@/types/page';
import { CornerLeftUp } from 'lucide-react';
import Link from 'next/link';
import { Hash, getAddress } from 'viem';

import ShowMoreTransaction from './components/show-more-tx';

export default async function Page({ params }: PageProps) {
  try {
    const paramsObj = await params;
    if (!paramsObj.id) {
      throw new Error('Transaction ID is required');
    }

    const response = await request(ApiCommand.getTransaction, { hash: paramsObj.id as Hash });
    const transaction = handleRequestResult(response);

    if (!transaction) return <NoData />;

    return (
      <Fragment>
        <Card>
          <CardContent className="flex flex-col gap-5 p-6">
            <CardDetail.Wrapper>
              <CardDetail.Title>Transaction Hash</CardDetail.Title>
              <CardDetail.Content>
                <span className="truncate">{transaction.hash}</span>
                <CopyButton value={transaction.hash} />
              </CardDetail.Content>
            </CardDetail.Wrapper>
            <CardDetail.Wrapper>
              <CardDetail.Title>Method</CardDetail.Title>
              <CardDetail.Content>
                <Badge>
                  {transaction.functionName
                    ? camelCaseToWords(transaction.functionName)
                    : transaction.functionSignature
                      ? transaction.functionSignature
                      : '-'}
                </Badge>
              </CardDetail.Content>
            </CardDetail.Wrapper>
            <CardDetail.Wrapper>
              <CardDetail.Title>Status</CardDetail.Title>
              <CardDetail.Content>
                <TransactionStatusBadge status={transaction.status} />
              </CardDetail.Content>
            </CardDetail.Wrapper>
            <CardDetail.Wrapper>
              <CardDetail.Title>Timestamp</CardDetail.Title>
              <CardDetail.Content>
                <Timestamp date={transaction.timestamp || 0} />
              </CardDetail.Content>
            </CardDetail.Wrapper>
            <CardDetail.Wrapper>
              <CardDetail.Title>Block Height</CardDetail.Title>
              <CardDetail.Content>
                <Link href={`/blocks/${transaction.blockNumber}`}>{transaction.blockNumber}</Link>
              </CardDetail.Content>
            </CardDetail.Wrapper>
            <CardDetail.Wrapper>
              <CardDetail.Title>From</CardDetail.Title>
              <CardDetail.Content>
                <AddressDisplay
                  address={getAddress(transaction.from)}
                  nameTag={transaction.fromLookup?.nameTag}
                  rnsName={transaction.fromLookup?.rns}
                  isContract={transaction.fromLookup?.isContract}
                  isTruncate={true}
                />
              </CardDetail.Content>
            </CardDetail.Wrapper>
            <CardDetail.Wrapper>
              <CardDetail.Title>To</CardDetail.Title>
              <CardDetail.Content>
                {!transaction.to ? (
                  ''
                ) : (
                  <AddressDisplay
                    address={getAddress(transaction.to)}
                    nameTag={transaction.toLookup?.nameTag}
                    rnsName={transaction.toLookup?.rns}
                    isContract={transaction.toLookup?.isContract}
                    isTruncate={true}
                  />
                )}
                {transaction.status === 'reverted' ? (
                  <div className="flex items-center text-sm text-red-500">
                    <CornerLeftUp className="mb-2 size-4" />
                    Warning! Error encountered during contract execution [execution reverted]
                  </div>
                ) : null}
              </CardDetail.Content>
            </CardDetail.Wrapper>
            <CardDetail.Wrapper>
              <CardDetail.Title>Value</CardDetail.Title>
              <CardDetail.Content>
                <TokenDisplay
                  token={{ ...XRP_TOKEN, decimals: 18 }}
                  amount={Number(transaction.value) || 0}
                  hideCopyButton
                />
              </CardDetail.Content>
            </CardDetail.Wrapper>
            <Separator />

            <CardDetail.Wrapper>
              <CardDetail.Title>Event(s)</CardDetail.Title>
              <CardDetail.Content>
                {transaction.events?.length ? (
                  <div className="flex w-full flex-col gap-2">
                    {transaction.events.map((event, _) => {
                      if (event?.type === 'NATIVE' && event?.eventName === 'Transfer')
                        return (
                          <EventWrapper key={_} tag={event.eventName}>
                            <span>From</span>
                            <AddressDisplay address={event.from} className="max-w-[250px]" useShortenedAddress />
                            <span>To</span>
                            <AddressDisplay address={event.to} className="max-w-[250px]" useShortenedAddress />
                            <span>Amount</span>
                            <TokenDisplay token={{ ...XRP_TOKEN, decimals: 18 }} amount={event?.value} />
                          </EventWrapper>
                        );

                      if (event?.type === 'ERC20' && event?.eventName === 'Transfer')
                        return (
                          <EventWrapper key={_} tag={`${event.eventName} ${event?.type}`}>
                            <span>From</span>
                            <AddressDisplay address={event.from} useShortenedAddress />
                            <span>To</span>
                            <AddressDisplay address={event.to} useShortenedAddress />
                            <span>Amount</span>
                            <div className="flex items-center gap-2">
                              <TokenLogo width={250} height={250} contractAddress={event?.address} className="size-5" />
                              {formatNumber(event?.formattedAmount)}{' '}
                              <Link href={`/addresses/${event.address}`}>
                                {event.name} <span className="text-muted-foreground">({event.symbol})</span>
                              </Link>
                            </div>
                          </EventWrapper>
                        );

                      if (event?.type === 'ERC721' && event?.eventName === 'Transfer')
                        return (
                          <EventWrapper key={_} tag={`${event.eventName} ${event?.type}`}>
                            <span>From</span>
                            <AddressDisplay address={event.from} useShortenedAddress />
                            <span>To</span>
                            <AddressDisplay address={event.to} useShortenedAddress />
                            <span>TokenID</span>
                            {String(event.tokenId)?.length < 8 && (
                              <NftThumbnail contractAddress={event?.address} tokenId={event?.tokenId} />
                            )}

                            {String(event.tokenId)?.length > 8 ? (
                              <Tooltip text={event.tokenId}>{String(event.tokenId).slice(0, 8)}...</Tooltip>
                            ) : (
                              <span>{event.tokenId}</span>
                            )}

                            <Link href={`/addresses/${event.address}`}>{event.name}</Link>
                          </EventWrapper>
                        );

                      if (event?.eventName === 'FuturepassCreated')
                        return (
                          <EventWrapper key={_} tag="Futurepass Created (Futurepass)">
                            <span>Futurepass</span>
                            <AddressDisplay address={event.futurepass} useShortenedAddress />
                            <span>Owner</span>
                            <AddressDisplay address={event.owner} useShortenedAddress />
                          </EventWrapper>
                        );

                      if (event?.type === 'ERC20' && event?.eventName === 'Approval')
                        return (
                          <EventWrapper key={_} tag="Approval (ERC20)">
                            <span className="text-muted-foreground">Owner</span>
                            <AddressDisplay address={event.owner} />
                            <span className="text-muted-foreground">Spender</span>
                            <AddressDisplay address={event.spender} />
                            <span className="text-muted-foreground">Amount</span>
                            <span>{event?.formattedValue ? formatNumber(event?.formattedValue) : '0'}</span>
                            <Link href={`/addresses/${event.address}`}>
                              <span>
                                {event.name} ({event.symbol})
                              </span>
                            </Link>
                          </EventWrapper>
                        );

                      if (event?.type === 'ERC721' && event?.eventName === 'ApprovalForAll')
                        return (
                          <EventWrapper key={_} tag="Approval For All (ERC721)">
                            <span className="text-muted-foreground">Owner</span>
                            <AddressDisplay address={event.owner} />
                            <span className="text-muted-foreground">Operator</span>
                            <AddressDisplay address={event.operator} />
                            <span className="text-muted-foreground">Token</span>
                            <Link href={`/addresses/${event.address}`}>
                              <span>
                                {event.name} ({event.symbol})
                              </span>
                            </Link>
                          </EventWrapper>
                        );

                      if (event?.type === 'ERC1155' && event?.eventName === 'TransferSingle')
                        return (
                          <EventWrapper key={_} tag={`${event.eventName} ${event?.type}`}>
                            <span>From</span>
                            <AddressDisplay address={event.from} useShortenedAddress />
                            <span>To</span>
                            <AddressDisplay address={event.to} useShortenedAddress />
                            <span>TokenID</span>
                            {String(event.tokenId)?.length < 8 && (
                              <NftThumbnail contractAddress={event?.address} tokenId={event?.tokenId} />
                            )}

                            {String(event.tokenId)?.length > 8 ? (
                              <Tooltip text={event.tokenId}>{String(event.tokenId).slice(0, 8)}...</Tooltip>
                            ) : (
                              <span>{event.tokenId}</span>
                            )}

                            <Link href={`/addresses/${event.address}`}>{event.name}</Link>
                          </EventWrapper>
                        );

                      return null;
                    })}
                  </div>
                ) : (
                  <p className="text-xs font-normal text-muted-foreground">No parsed events found.</p>
                )}
              </CardDetail.Content>
            </CardDetail.Wrapper>
            <Separator />
            <CardDetail.Wrapper>
              <CardDetail.Title>Transaction Fee</CardDetail.Title>
              <CardDetail.Content>
                <span className="truncate">{transaction.transactionFee} </span>
                <TokenDisplay token={XRP_TOKEN} hideCopyButton />
                <OnlyMainnet>
                  {transaction?.xrpPriceData?.price ? (
                    <Badge type="linear">
                      {formatNumberDollars(Number(transaction.transactionFee) * transaction?.xrpPriceData?.price, 2)}
                    </Badge>
                  ) : null}
                </OnlyMainnet>
              </CardDetail.Content>
            </CardDetail.Wrapper>
            <CardDetail.Wrapper>
              <CardDetail.Title>Nonce</CardDetail.Title>
              <CardDetail.Content className="truncate">{transaction.nonce}</CardDetail.Content>
            </CardDetail.Wrapper>
            {transaction?.tags?.length ? (
              <CardDetail.Wrapper>
                <CardDetail.Title>Tags</CardDetail.Title>
                <CardDetail.Content>
                  {transaction?.tags?.map((tag, _) => (
                    <Badge color="blue" key={_}>
                      {tag}
                    </Badge>
                  ))}
                </CardDetail.Content>
              </CardDetail.Wrapper>
            ) : null}
          </CardContent>
        </Card>
        <ShowMoreTransaction transaction={transaction} />
      </Fragment>
    );
  } catch (error) {
    return <ErrorAlert error={error as Error} />;
  }
}
