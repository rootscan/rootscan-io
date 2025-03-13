import Breadcrumbs from '@/components/breadcrumbs';
import Container from '@/components/container';
import OnlyMainnet from '@/components/layouts/only-mainnet';
import TokenDisplay from '@/components/token-display';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import CardDetail from '@/components/ui/card-detail';
import { ApiCommand, request } from '@/lib/api';
import { formatNumber, formatNumberDollars } from '@/lib/utils';
import { IToken } from '@/types/models';
import { getAddress } from 'viem';

import Menu from './components/menu';

interface LayoutProps {
  children: React.ReactNode;
  params: Promise<{ address: string }>;
}

export default async function Layout({ params, children }: LayoutProps) {
  const paramsObj = await params;
  const data = await request(ApiCommand.getToken, {
    contractAddress: getAddress(paramsObj.address),
  });

  return (
    <Container>
      <div className="flex flex-col gap-4">
        <Breadcrumbs />
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {/* Overview */}
          <Card>
            <CardHeader>
              <CardTitle>Token Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDetail.Wrapper>
                <CardDetail.Title>Token</CardDetail.Title>
                <CardDetail.Content>
                  <TokenDisplay token={data as IToken} hideCopyButton overrideImageSizeClass="size-10 mr-2" />
                </CardDetail.Content>
              </CardDetail.Wrapper>
            </CardContent>
            <CardContent>
              <CardDetail.Wrapper>
                <CardDetail.Title>Total Supply</CardDetail.Title>
                <CardDetail.Content>
                  {data?.type === 'ERC20' ? (
                    <span>{data?.totalSupplyFormatted ? formatNumber(data?.totalSupplyFormatted) : '-'}</span>
                  ) : data?.type === 'ERC721' || data?.type === 'ERC1155' ? (
                    <span>{data?.totalSupply ? data?.totalSupply : '-'}</span>
                  ) : (
                    '-'
                  )}
                </CardDetail.Content>
              </CardDetail.Wrapper>
            </CardContent>
            <CardContent>
              <CardDetail.Wrapper>
                <CardDetail.Title>Holders</CardDetail.Title>
                <CardDetail.Content>{data?.holders ? data?.holders : '-'}</CardDetail.Content>
              </CardDetail.Wrapper>
            </CardContent>
          </Card>
          {/* Market */}
          <Card>
            <CardHeader>
              <CardTitle>Market</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDetail.Wrapper>
                <CardDetail.Title>Price</CardDetail.Title>
                <CardDetail.Content>
                  <OnlyMainnet fallback={'-'}>
                    {data?.priceData?.price ? formatNumberDollars(data?.priceData?.price) : '-'}
                  </OnlyMainnet>
                </CardDetail.Content>
              </CardDetail.Wrapper>
            </CardContent>
            <CardContent>
              <CardDetail.Wrapper>
                <CardDetail.Title>Fully Diluted Market Cap</CardDetail.Title>
                <CardDetail.Content>
                  <OnlyMainnet fallback={'-'}>
                    {data?.priceData?.fully_diluted_market_cap
                      ? formatNumberDollars(data?.priceData?.fully_diluted_market_cap)
                      : '-'}
                  </OnlyMainnet>
                </CardDetail.Content>
              </CardDetail.Wrapper>
            </CardContent>
          </Card>
        </div>
        <Menu />
        {children}
      </div>
    </Container>
  );
}
