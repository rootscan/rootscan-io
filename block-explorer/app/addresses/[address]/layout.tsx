import AddressDisplay from '@/components/address-display';
import Breadcrumbs from '@/components/breadcrumbs';
import Container from '@/components/container';
import OnlyMainnet from '@/components/layouts/only-mainnet';
import TokenDisplay from '@/components/token-display';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import CardDetail from '@/components/ui/card-detail';
import { getAddress, getRnsName } from '@/lib/api';
import { ROOT_TOKEN } from '@/lib/constants/tokens';
import { formatNumberDollars } from '@/lib/utils';
import { generateAvatarURL } from '@cfx-kit/wallet-avatar';
import Image from 'next/image';
import { getAddress as getAddressViem } from 'viem';

import Menu from './components/menu';
import QrCode from './components/qr-code';

export async function generateMetadata({ params }) {
  return {
    title: `Address ${params.address}`,
  };
}

const getData = async ({ params }) => {
  const data = await getAddress({ address: getAddressViem(params.address) });
  return data;
};

export default async function Layout({ children, params }: { children: React.ReactNode; params: any }) {
  const { address } = params;
  const data = await getData({ params });
  const rnsName = await getRnsName(address);
  const tags: string[] = [];
  if (getAddressViem(address)?.toLowerCase()?.startsWith('0xffffffff')) {
    tags.push('Futurepass');
  }
  if (getAddressViem(address)?.toLowerCase()?.startsWith('0xaaaaaaaa')) {
    tags.push('ERC721 Precompile');
  }
  if (getAddressViem(address)?.toLowerCase()?.startsWith('0xcccccccc')) {
    tags.push('ERC20 Precompile');
  }
  if (getAddressViem(address)?.toLowerCase()?.startsWith('0xbbbbbbbb')) {
    tags.push('ERC1155 Precompile');
  }
  return (
    <Container>
      <div className="flex flex-col gap-4">
        <Breadcrumbs />
        <Card>
          <CardHeader>
            <CardTitle>
              <div className="flex items-center gap-2">
                <div className="size-8">
                  <Image
                    src={generateAvatarURL(address)}
                    width={50}
                    height={50}
                    priority
                    unoptimized
                    className="rounded-[5px]"
                    alt="jazz"
                  />
                </div>
                {data?.isContract ? 'EVM Smart Contract' : 'Overview'}
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-6">
              {data?.nameTag ? (
                <CardDetail.Wrapper>
                  <CardDetail.Title>Name Tag</CardDetail.Title>
                  <CardDetail.Content>{data?.nameTag}</CardDetail.Content>
                </CardDetail.Wrapper>
              ) : null}
              <div className="flex items-center gap-12">
                <CardDetail.Wrapper>
                  <CardDetail.Title>Address</CardDetail.Title>
                  <CardDetail.Content>
                    <div className="flex items-center gap-2">
                      <AddressDisplay address={address} className="truncate" />
                      <QrCode address={address} />
                    </div>
                  </CardDetail.Content>
                </CardDetail.Wrapper>
                {rnsName && (
                  <CardDetail.Wrapper>
                    <CardDetail.Title>RSN</CardDetail.Title>
                    <CardDetail.Content>
                      <div className="flex items-center gap-2">{rnsName.name}</div>
                    </CardDetail.Content>
                  </CardDetail.Wrapper>
                )}
              </div>
              <CardDetail.Wrapper>
                <CardDetail.Title>Root Balance</CardDetail.Title>
                <CardDetail.Content>
                  {!data?.balance?.reserved && data?.balance?.reserved !== '0' ? (
                    <div className="flex flex-col gap-2">
                      <TokenDisplay token={ROOT_TOKEN} amount={data?.balance?.free || 0} hideCopyButton />
                      <OnlyMainnet>
                        {data?.balance?.freeFormatted && data?.rootPriceData?.price ? (
                          <span className="text-muted-foreground text-xs">
                            {formatNumberDollars(Number(data?.balance?.freeFormatted) * data.rootPriceData.price, 2)} @
                            ({formatNumberDollars(data.rootPriceData.price)}/ Root)
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
                                  BigInt(Math.max(...[data?.balance?.miscFrozen || 0, data?.balance?.feeFrozen || 0])),
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
                <div className="max-w-md">
                  <CardDetail.Wrapper>
                    <CardDetail.Title>Token Tracker</CardDetail.Title>
                    <CardDetail.Content>
                      <TokenDisplay token={data?.token} isTokenTracker hideCopyButton />
                    </CardDetail.Content>
                  </CardDetail.Wrapper>
                </div>
              ) : null}
              {tags?.length ? (
                <CardDetail.Wrapper>
                  <CardDetail.Title>Tags</CardDetail.Title>
                  <CardDetail.Content>
                    <div className="mt-2 flex gap-2">
                      {tags?.map((tag, _) => (
                        <Badge variant="default" key={_}>
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </CardDetail.Content>
                </CardDetail.Wrapper>
              ) : null}
            </div>
          </CardContent>
        </Card>
        <div className="flex items-center justify-between gap-4">
          <Menu isContract={data?.isContract} isVerified={data?.isVerifiedContract || false} />
        </div>
        {children}
      </div>
    </Container>
  );
}
