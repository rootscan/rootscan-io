import { Fragment } from 'react';

import AddressDisplay from '@/components/address-display';
import { ErrorAlert } from '@/components/error-alert';
import OnlyMainnet from '@/components/layouts/only-mainnet';
import NoData from '@/components/no-data';
import TokenDisplay from '@/components/token-display';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { TableNavigation } from '@/components/ui/table-navigation.tsx';
import { ApiCommand, request } from '@/lib/api';
import { formatNumber, formatNumberDollars, getPaginationData, handleRequestResult } from '@/lib/utils';
import { PageProps } from '@/types/page';
import { formatUnits, getAddress } from 'viem';

export default async function Page({ params, searchParams }: PageProps) {
  try {
    const paramsObj = await params;
    if (!paramsObj.address) {
      throw new Error('Address is required');
    }

    const searchParamsObj = await searchParams;
    const page = Number(searchParamsObj?.page) || 1;

    const data = handleRequestResult(
      await request(ApiCommand.getTokenBalances, {
        address: getAddress(paramsObj.address),
        page,
      }),
    );

    const balances = data.docs;
    if (!balances?.length) return <NoData />;

    return (
      <Table>
        <TableCaption>
          <TableNavigation pagination={getPaginationData(data)}>
            {!data.skipFullCount && <p>Showing {data.totalDocs} tokens</p>}
          </TableNavigation>
        </TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Asset</TableHead>
            <TableHead>Symbol</TableHead>
            <TableHead>Contract Address</TableHead>
            <TableHead>Balance</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Value</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {balances.map((token) => (
            <TableRow key={token.contractAddress}>
              <TableCell>
                <TokenDisplay token={token.tokenDetails} hideCopyButton overrideImageSizeClass="size-8 mr-2" />
              </TableCell>
              <TableCell>{token.tokenDetails?.symbol ? token.tokenDetails?.symbol : '-'}</TableCell>
              <TableCell>
                <AddressDisplay address={token.contractAddress} useShortenedAddress isContract />
              </TableCell>
              <TableCell>
                {!isNaN(token.balance) ? (
                  <div>
                    {token.balance
                      ? formatNumber(Number(formatUnits(BigInt(token.balance), token.tokenDetails?.decimals || 0)))
                      : '0'}
                  </div>
                ) : null}
              </TableCell>
              <TableCell>
                <OnlyMainnet fallback={'-'}>
                  {token.tokenDetails?.priceData?.price
                    ? formatNumberDollars(token.tokenDetails?.priceData?.price)
                    : '-'}
                </OnlyMainnet>
              </TableCell>
              <TableCell>
                <OnlyMainnet fallback={'-'}>
                  {token.balance && token.tokenDetails?.priceData?.price ? (
                    <Fragment>
                      {formatNumberDollars(
                        Number(formatUnits(BigInt(token.balance), token.tokenDetails?.decimals || 0)) *
                          Number(token.tokenDetails?.priceData?.price),
                      )}
                    </Fragment>
                  ) : (
                    '-'
                  )}
                </OnlyMainnet>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  } catch (error) {
    return <ErrorAlert error={error instanceof Error ? error : new Error('An unexpected error occurred')} />;
  }
}
