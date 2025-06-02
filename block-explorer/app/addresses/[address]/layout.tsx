import { Fragment, Suspense } from 'react';

import AddressDisplay from '@/components/address-display';
import Breadcrumbs from '@/components/breadcrumbs';
import Container from '@/components/container';
import { ErrorAlert } from '@/components/error-alert';
import OnlyMainnet from '@/components/layouts/only-mainnet';
import TokenDisplay from '@/components/token-display';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import CardDetail from '@/components/ui/card-detail';
import { Separator } from '@/components/ui/separator.tsx';
import { Skeleton } from '@/components/ui/skeleton.tsx';
import { ApiCommand, request } from '@/lib/api';
import { ROOT_TOKEN } from '@/lib/constants/tokens';
import { formatNumberDollars, handleRequestResult } from '@/lib/utils';
import { generateAvatarURL } from '@cfx-kit/wallet-avatar';
import Image from 'next/image';
import { Address, getAddress } from 'viem';

import Menu from './components/menu';
import QrCode from './components/qr-code';
import { RnsName } from './components/rns-name.tsx';

interface LayoutProps {
  children: React.ReactNode;
  params: Promise<{ address: Address }>;
}

export async function generateMetadata({ params }: { params: Promise<{ address: string }> }) {
  const paramsObj = await params;
  return {
    title: `Address ${paramsObj.address}`,
  };
}

const getData = async ({ params }: { params: Promise<{ address: string }> }) => {
  const paramsObj = await params;
  if (!paramsObj.address) {
    throw new Error('Address is required');
  }
  const normalizedAddress = getAddress(paramsObj.address);
  return handleRequestResult(await request(ApiCommand.getAddress, { address: normalizedAddress }));
};

export default async function Layout({ children, params }: LayoutProps) {
  try {
    const paramsObj = await params;
    const address = paramsObj.address;
    const data = await getData({ params: Promise.resolve(paramsObj) });
    // const rnsName = await getRnsName(address); TODO: restore rnsName after RPC fix;

    if (!data) {
      return <ErrorAlert error={new Error('Address not found')} />;
    }

    const tags: string[] = [];
    const normalizedAddress = getAddress(address).toLowerCase();
    if (normalizedAddress.startsWith('0xffffffff')) {
      tags.push('Futurepass');
    }
    if (normalizedAddress.startsWith('0xaaaaaaaa')) {
      tags.push('ERC721 Precompile');
    }
    if (normalizedAddress.startsWith('0xcccccccc')) {
      tags.push('ERC20 Precompile');
    }
    if (normalizedAddress.startsWith('0xbbbbbbbb')) {
      tags.push('ERC1155 Precompile');
    }

    return (
      <Container className="flex flex-col gap-6">
        <Breadcrumbs />

        <Card>
          <CardContent className="flex flex-col gap-5 rounded-[16px] p-6">
            <div className="flex items-center gap-3">
              <Image
                src={generateAvatarURL(address)}
                width={32}
                height={32}
                priority
                unoptimized
                className="rounded-[6px]"
                alt="jazz"
              />
              <h3 className="text-[20px]/[32px] font-semibold">
                {data?.isContract ? 'EVM Smart Contract' : 'Overview'}
              </h3>
            </div>
            {data?.nameTag ? (
              <Fragment>
                <CardDetail.Wrapper>
                  <CardDetail.Title>Name Tag</CardDetail.Title>
                  <CardDetail.Content>{data?.nameTag}</CardDetail.Content>
                </CardDetail.Wrapper>
                <Separator />
              </Fragment>
            ) : null}
            <CardDetail.Wrapper>
              <CardDetail.Title>Address</CardDetail.Title>
              <CardDetail.Content>
                <div className="flex items-center gap-2">
                  <AddressDisplay address={address} isTruncate />
                  <QrCode address={address} />
                </div>
              </CardDetail.Content>
            </CardDetail.Wrapper>
            <Separator />
            <CardDetail.Wrapper>
              <CardDetail.Title>RNS</CardDetail.Title>
              <CardDetail.Content>
                <Suspense fallback={<Skeleton className="h-6 w-10" />}>
                  <RnsName address={address} />
                </Suspense>
              </CardDetail.Content>
            </CardDetail.Wrapper>
            <Separator />
            <CardDetail.Wrapper>
              <CardDetail.Title>Root Balance</CardDetail.Title>
              <CardDetail.Content>
                {!data?.balance?.reserved && data?.balance?.reserved?.toString() !== '0' ? (
                  <div className="flex flex-col gap-2">
                    <TokenDisplay token={ROOT_TOKEN} amount={data?.balance?.free || 0} hideCopyButton />
                    <OnlyMainnet>
                      {data?.balance?.freeFormatted && data?.rootPriceData?.price ? (
                        <span className="text-xs text-muted-foreground">
                          {formatNumberDollars(Number(data?.balance?.freeFormatted) * data.rootPriceData.price, 2)} @ (
                          {formatNumberDollars(data.rootPriceData.price)}/ Root)
                        </span>
                      ) : null}
                    </OnlyMainnet>
                  </div>
                ) : (
                  <div className="flex flex-col gap-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-muted-foreground">Total</span>
                      <span>
                        {data?.balance?.freeFormatted ? (
                          <TokenDisplay
                            token={ROOT_TOKEN}
                            amount={Number(BigInt(data?.balance?.free) + BigInt(data?.balance?.reserved || '0')) || 0}
                            hideCopyButton
                          />
                        ) : (
                          '0'
                        )}
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-muted-foreground">Available</span>
                      <span>
                        {data?.balance?.free ? (
                          <TokenDisplay
                            token={ROOT_TOKEN}
                            amount={Number(
                              BigInt(data?.balance?.free) -
                                BigInt(
                                  Math.max(
                                    data?.balance?.frozen || 0,
                                    data?.balance?.miscFrozen || 0,
                                    data?.balance?.feeFrozen || 0,
                                  ),
                                ),
                            )}
                            hideCopyButton
                          />
                        ) : (
                          '0'
                        )}
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-muted-foreground">Reserved</span>
                      <span>
                        {data?.balance?.reservedFormatted ? (
                          <TokenDisplay token={ROOT_TOKEN} amount={data?.balance?.reserved || 0} hideCopyButton />
                        ) : (
                          '0'
                        )}
                      </span>
                    </div>
                  </div>
                )}
              </CardDetail.Content>
            </CardDetail.Wrapper>
            {data?.token ? (
              <Fragment>
                <Separator />
                <CardDetail.Wrapper>
                  <CardDetail.Title>Token Tracker</CardDetail.Title>
                  <CardDetail.Content>
                    <TokenDisplay token={data?.token} isTokenTracker hideCopyButton />
                  </CardDetail.Content>
                </CardDetail.Wrapper>
              </Fragment>
            ) : null}
            {tags?.length ? (
              <Fragment>
                <Separator />
                <CardDetail.Wrapper>
                  <CardDetail.Title>Tags</CardDetail.Title>
                  <CardDetail.Content>{tags?.map((tag, _) => <Badge key={_}>{tag}</Badge>)}</CardDetail.Content>
                </CardDetail.Wrapper>
              </Fragment>
            ) : null}
          </CardContent>
        </Card>

        <div className="flex flex-col gap-4">
          <Menu isContract={data?.isContract} isVerified={!!data?.isVerifiedContract} />
          {children}
        </div>
      </Container>
    );
  } catch (error) {
    return <ErrorAlert error={error instanceof Error ? error : new Error('An unexpected error occurred')} />;
  }
}
