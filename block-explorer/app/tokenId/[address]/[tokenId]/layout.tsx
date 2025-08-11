import Breadcrumbs from '@/components/breadcrumbs';
import Container from '@/components/container';
import { ErrorAlert } from '@/components/error-alert';
import NftPlayer from '@/components/nft-player';
import TokenDisplay from '@/components/token-display';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import CardDetail from '@/components/ui/card-detail';
import { ApiCommand, request } from '@/lib/api';
import { formatNumber, handleRequestResult } from '@/lib/utils';
import { IToken } from '@/types/models';
import { getAddress } from 'viem';

import Menu from './components/menu';

interface LayoutProps {
  children: React.ReactNode;
  params: Promise<{ address: string; tokenId: number }>;
}

export default async function Layout({ params, children }: LayoutProps) {
  try {
    const paramsObj = await params;
    if (!paramsObj.address) {
      throw new Error('Address is required');
    }

    const data = handleRequestResult(
      await request(ApiCommand.getNft, {
        contractAddress: getAddress(paramsObj.address),
        tokenId: paramsObj.tokenId,
      }),
    );

    const token = handleRequestResult(
      await request(ApiCommand.getToken, {
        contractAddress: getAddress(paramsObj.address),
      }),
    );

    if (!token) {
      throw new Error('Token not found');
    }

    return (
      <Container>
        <div className="flex flex-col gap-4">
          <Breadcrumbs />
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <Card>
              <Card>
                <CardHeader>
                  <CardTitle>Token Overview</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDetail.Wrapper>
                    <CardDetail.Title>Token</CardDetail.Title>
                    <CardDetail.Content>
                      <TokenDisplay token={token as IToken} hideCopyButton overrideImageSizeClass="size-10 mr-2" />
                    </CardDetail.Content>
                  </CardDetail.Wrapper>
                </CardContent>
                <CardContent>
                  <CardDetail.Wrapper>
                    <CardDetail.Title>Total Supply</CardDetail.Title>
                    <CardDetail.Content>
                      {token?.type === 'ERC20' ? (
                        <span>{token?.totalSupplyFormatted ? formatNumber(token?.totalSupplyFormatted) : '-'}</span>
                      ) : data?.type === 'ERC721' || data?.type === 'ERC1155' ? (
                        <span>{token?.totalSupply ? token?.totalSupply : '-'}</span>
                      ) : (
                        '-'
                      )}
                    </CardDetail.Content>
                  </CardDetail.Wrapper>
                </CardContent>
                <CardContent>
                  <CardDetail.Wrapper>
                    <CardDetail.Title>Holders</CardDetail.Title>
                    <CardDetail.Content>{token?.holders ? token?.holders : '-'}</CardDetail.Content>
                  </CardDetail.Wrapper>
                </CardContent>
              </Card>
              <CardHeader>
                <CardTitle>Token ID: {paramsObj.tokenId}</CardTitle>
              </CardHeader>
              <CardContent>
                <NftPlayer animation_url={data?.animation_url} image={data?.image} />
              </CardContent>
            </Card>
          </div>
          <Menu tokenType={data.type} />
          {children}
        </div>
      </Container>
    );
  } catch (error) {
    return <ErrorAlert error={error instanceof Error ? error : new Error('An unexpected error occurred')} />;
  }
}
