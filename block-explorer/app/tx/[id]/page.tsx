import AddressDisplay from '@/components/address-display';
import { CopyButton } from '@/components/copy-button';
import OnlyMainnet from '@/components/layouts/only-mainnet';
import NftThumbnail from '@/components/nft-thumbnail';
import NoData from '@/components/no-data';
import TestnetWarning from '@/components/testnet-warning';
import Timestamp from '@/components/timestamp';
import TokenDisplay from '@/components/token-display';
import TokenLogo from '@/components/token-logo';
import Tooltip from '@/components/tooltip';
import TransactionStatusBadge from '@/components/transaction-status-badge';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { getTransaction } from '@/lib/api';
import { XRP_TOKEN } from '@/lib/constants/tokens';
import { camelCaseToWords, formatNumber, formatNumberDollars } from '@/lib/utils';
import { CornerLeftUp } from 'lucide-react';
import Link from 'next/link';
import { Hash, getAddress } from 'viem';

import ShowMoreTransaction from './components/show-more-tx';

const getData = async ({ params }: { params: { id: Hash } }) => {
  const data = await getTransaction({ hash: params.id });
  return data;
};

export default async function Page({ params }: { params: { id: Hash } }) {
  const transaction = await getData({ params });

  if (!transaction) return <NoData />;
  return (
    <div className="flex flex-col gap-4">
      <TestnetWarning>
        <p className="text-sm text-red-500">
          [ This is a <strong>Testnet</strong> transaction only ]
        </p>
      </TestnetWarning>
      {/* Overview Card */}
      <Card>
        <CardHeader className="relative">
          <CardTitle>Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-1">
              <span className="text-muted-foreground">Transaction Hash</span>
              <div className="flex items-center gap-2">
                <span className="truncate">{transaction?.hash}</span>
                <CopyButton value={transaction?.hash} />
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-muted-foreground">Method</span>
              <div>
                <Badge>
                  {transaction?.functionName
                    ? camelCaseToWords(transaction?.functionName)
                    : transaction?.functionSignature
                    ? transaction?.functionSignature
                    : '-'}
                </Badge>
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-muted-foreground">Status</span>
              <div>
                <TransactionStatusBadge status={transaction?.status} />
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-muted-foreground">Timestamp</span>
              <Timestamp date={transaction?.timestamp} />
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-muted-foreground">Block Height</span>
              <span>
                <Link href={`/blocks/${transaction?.blockNumber}`}>{transaction?.blockNumber}</Link>
              </span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-muted-foreground">From</span>
              <AddressDisplay
                address={getAddress(transaction.from)}
                nameTag={transaction?.fromLookup?.nameTag}
                rnsName={transaction?.fromLookup?.rns}
                isContract={transaction?.fromLookup?.isContract}
              />
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-muted-foreground">To</span>
              {!transaction?.to ? (
                ''
              ) : (
                <AddressDisplay
                  address={getAddress(transaction?.to)}
                  nameTag={transaction?.toLookup?.nameTag}
                  rnsName={transaction?.toLookup?.rns}
                  isContract={transaction?.toLookup?.isContract}
                />
              )}
              {transaction?.status === 'reverted' ? (
                <div className="flex items-center text-sm text-red-500">
                  <CornerLeftUp className="mb-2 size-4" />
                  Warning! Error encountered during contract execution [execution reverted]
                </div>
              ) : null}
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-muted-foreground">Value</span>

              <TokenDisplay
                token={{ ...XRP_TOKEN, decimals: 18 }}
                amount={Number(transaction?.value) || 0}
                hideCopyButton
              />
            </div>
            {transaction?.events?.length ? (
              <div className="flex flex-col gap-1">
                <span className="text-muted-foreground">⚡ Event(s)</span>
                <div className="mt-1 rounded-2xl bg-black/5 p-3 dark:bg-white/5">
                  <div className="flex flex-col gap-4">
                    {transaction?.events?.map((event, _) => {
                      if (event?.type === 'NATIVE' && event?.eventName === 'Transfer')
                        return (
                          <div className="flex flex-col flex-wrap gap-2" key={_}>
                            <span className="text-muted-foreground">{event.eventName}</span>
                            <div className="flex flex-wrap items-center gap-2 truncate md:flex-nowrap">
                              <span>From</span>
                              <AddressDisplay address={event.from} className="max-w-[250px]" useShortenedAddress />
                              <span>To</span>
                              <AddressDisplay address={event.to} className="max-w-[250px]" useShortenedAddress />
                              <span>Amount</span>
                              <TokenDisplay token={{ ...XRP_TOKEN, decimals: 18 }} amount={event?.value} />
                            </div>
                          </div>
                        );

                      if (event?.type === 'ERC20' && event?.eventName === 'Transfer')
                        return (
                          <div className="flex flex-col flex-wrap gap-2" key={_}>
                            <span className="text-muted-foreground">
                              {event.eventName} ({event?.type})
                            </span>
                            <div className="flex flex-wrap items-center gap-2 truncate md:flex-nowrap">
                              <span>From</span>
                              <AddressDisplay address={event.from} useShortenedAddress />
                              <span>To</span>
                              <AddressDisplay address={event.to} useShortenedAddress />
                              <span>Amount</span>
                              <div className="flex   items-center gap-2">
                                <TokenLogo
                                  width={250}
                                  height={250}
                                  contractAddress={event?.address}
                                  className="size-5"
                                />
                                {formatNumber(event?.formattedAmount)}{' '}
                                <Link href={`/addresses/${event.address}`}>
                                  {event.name} <span className="text-muted-foreground">({event.symbol})</span>
                                </Link>
                              </div>
                            </div>
                          </div>
                        );

                      if (event?.type === 'ERC721' && event?.eventName === 'Transfer')
                        return (
                          <div className="flex flex-col flex-wrap" key={_}>
                            <span className="text-muted-foreground">
                              {event.eventName} ({event?.type})
                            </span>
                            <div className="flex flex-wrap items-center gap-2 truncate">
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

                              <Link href={`/addresses/${event.address}`}>
                                {event.name} {event.symbol && `(${event.symbol})`}
                              </Link>
                            </div>
                          </div>
                        );

                      if (event?.eventName === 'FuturepassCreated')
                        return (
                          <div className="flex flex-wrap items-center gap-2" key={_}>
                            <span className="text-muted-foreground">Futurepass Created (Futurepass)</span>
                            <div className="flex flex-wrap items-center gap-2 truncate md:flex-nowrap">
                              <span>Futurepass</span>
                              <AddressDisplay address={event.futurepass} useShortenedAddress />
                              <span>Owner</span>
                              <AddressDisplay address={event.owner} useShortenedAddress />
                            </div>
                          </div>
                        );

                      if (event?.type === 'ERC20' && event?.eventName === 'Approval')
                        return (
                          <div className="flex flex-wrap items-center gap-2" key={_}>
                            <span className="text-muted-foreground">Approval (ERC20)</span>
                            <div className="flex flex-wrap items-center gap-2 truncate md:flex-nowrap">
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
                            </div>
                          </div>
                        );
                      if (event?.type === 'ERC721' && event?.eventName === 'ApprovalForAll')
                        return (
                          <div className="flex flex-wrap items-center gap-2" key={_}>
                            <span className="text-muted-foreground">Approval For All (ERC721)</span>
                            <div className="flex flex-wrap items-center gap-2 truncate md:flex-nowrap">
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
                            </div>
                          </div>
                        );
                      if (
                        event?.type === 'ERC1155' &&
                        (event?.eventName === 'TransferSingle' || event?.eventName === 'TransferBatch')
                      )
                        return (
                          <div className="flex flex-col flex-wrap" key={_}>
                            <span className="text-muted-foreground">
                              {event.eventName} ({event?.type})
                            </span>
                            <div className="flex flex-wrap items-center gap-2 truncate">
                              <span>From</span>
                              <AddressDisplay address={event.from} useShortenedAddress />
                              <span>To</span>
                              <AddressDisplay address={event.to} useShortenedAddress />
                              {event.id && (
                                <>
                                  <span>TokenID</span>
                                  {String(event.id).length > 8 ? (
                                    <Tooltip text={event.id}>{String(event.id).slice(0, 8)}...</Tooltip>
                                  ) : (
                                    <span>{event.id}</span>
                                  )}
                                </>
                              )}
                              <span className="text-muted-foreground">Qty</span>
                              <span>{event?.value ? formatNumber(event?.value) : '0'}</span>
                            </div>
                          </div>
                        );

                      return null;
                    })}
                  </div>
                </div>
              </div>
            ) : null}
            <div className="flex flex-col gap-1">
              <span className="text-muted-foreground">Transaction Fee</span>
              <div className="flex items-center gap-2">
                <span className="truncate">{transaction.transactionFee} </span>
                <TokenDisplay token={XRP_TOKEN} hideCopyButton />
                <OnlyMainnet>
                  {transaction?.xrpPriceData?.price ? (
                    <Badge variant="outline">
                      {formatNumberDollars(transaction.transactionFee * transaction?.xrpPriceData?.price, 2)}
                    </Badge>
                  ) : null}
                </OnlyMainnet>
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-muted-foreground">Nonce</span>
              <span className="truncate">{transaction.nonce}</span>
            </div>
            {transaction?.tags?.length > 0 ? (
              <div className="flex flex-col gap-1">
                <span className="text-muted-foreground">Tags</span>
                <div className="mt-1 flex flex-wrap items-center gap-2">
                  {transaction?.tags?.map((tag, _) => (
                    <Badge variant="info" key={_}>
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        </CardContent>
      </Card>
      <ShowMoreTransaction transaction={transaction} />
    </div>
  );
}
