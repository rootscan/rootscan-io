import { Suspense } from 'react';

import Container from '@/components/container';
import OnlyMainnet from '@/components/layouts/only-mainnet';
import Pagination from '@/components/pagination';
import SectionTitle from '@/components/section-title';
import TokenDisplay from '@/components/token-display';
import TokenLogo from '@/components/token-logo';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { getTokens } from '@/lib/api';
import { cn, formatNumberDollars, getPaginationData } from '@/lib/utils';
import { ChevronDown, ChevronUp } from 'lucide-react';
import millify from 'millify';
import { Metadata } from 'next';

import SubMenu from './components/submenu';

export const metadata: Metadata = {
  title: 'Tokens',
};

const getData = async ({ searchParams }: { searchParams: any }) => {
  const data = await getTokens({
    page: searchParams?.page ? searchParams?.page : 1,
    type: searchParams?.type,
  });
  return data;
};
export default async function Page({ searchParams }: { searchParams: any }) {
  const data = await getData({ searchParams });
  const tokens = data?.docs;
  return (
    <Container>
      <div className="flex flex-col gap-4">
        {/* <Breadcrumbs /> */}
        <SectionTitle>Tokens</SectionTitle>
        <Suspense fallback={'Loading'}>
          <SubMenu />
        </Suspense>
        <Suspense fallback={'Loading'}>
          <Pagination pagination={getPaginationData(data)} />
        </Suspense>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead />
              <TableHead>Name</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Native ID</TableHead>
              <TableHead>Total Supply</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tokens.map((token: any) => (
              <TableRow key={token.contractAddress}>
                <TableCell className="lg:max-w-8">
                  <div className="size-10">
                    <TokenLogo contractAddress={token.contractAddress} width={250} height={250} />
                  </div>
                </TableCell>
                <TableCell className="max-w-xs truncate">
                  <TokenDisplay token={token} hideCopyButton hideLogo />
                </TableCell>
                <TableCell>
                  <OnlyMainnet fallback={'-'}>
                    {token?.priceData ? (
                      <div className="flex items-center gap-2">
                        <span className="text-primary/80">
                          {token?.priceData?.price ? formatNumberDollars(token?.priceData?.price) : '-'}
                        </span>
                        <span
                          className={cn([
                            token?.priceData?.percent_change_24h < 0 ? 'text-red-400' : 'text-green-400',
                            'flex items-center gap-1',
                          ])}
                        >
                          {token?.priceData?.percent_change_24h < 0 ? (
                            <ChevronDown className="size-4" />
                          ) : (
                            <ChevronUp className="size-4" />
                          )}
                          {token?.priceData?.percent_change_24h ? token?.priceData?.percent_change_24h.toFixed(2) : '-'}
                          %
                        </span>
                      </div>
                    ) : null}
                  </OnlyMainnet>
                </TableCell>
                <TableCell>
                  <Badge variant="outline">{token?.type}</Badge>
                </TableCell>
                <TableCell>
                  {token?.collectionId ? token?.collectionId : token?.assetId ? token?.assetId : '-'}
                </TableCell>
                <TableCell>
                  {token?.totalSupplyFormatted
                    ? millify(token?.totalSupplyFormatted)
                    : token?.totalSupply
                    ? millify(token?.totalSupply)
                    : '-'}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </Container>
  );
}
