import { Fragment } from 'react';

import AddressDisplay from '@/components/address-display';
import OnlyMainnet from '@/components/layouts/only-mainnet';
import NoData from '@/components/no-data';
import PaginationSuspense from '@/components/pagination-suspense';
import TokenDisplay from '@/components/token-display';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { getTokenBalances } from '@/lib/api';
import { formatNumber, formatNumberDollars, getPaginationData } from '@/lib/utils';
import { formatUnits } from 'viem';

const getData = async ({ params, searchParams }: any) => {
  return await getTokenBalances({
    address: params.address,
    page: searchParams?.page,
  });
};

export default async function Page({ params, searchParams }) {
  const data = await getData({ params, searchParams });
  const balances = data?.docs;

  return (
    <div className="flex flex-col gap-6">
      <PaginationSuspense pagination={getPaginationData(data)} />
      {balances?.length ? (
        <Table>
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
              <TableRow key={token?.contractAddress}>
                <TableCell>
                  <TokenDisplay token={token?.tokenDetails} hideCopyButton overrideImageSizeClass="size-10 mr-2" />
                </TableCell>
                <TableCell>{token?.tokenDetails?.symbol ? token?.tokenDetails?.symbol : '-'}</TableCell>
                <TableCell>
                  <AddressDisplay address={token?.contractAddress} useShortenedAddress isContract />
                </TableCell>
                <TableCell>
                  {!isNaN(token?.balance) ? (
                    <div>
                      {token?.balance
                        ? formatNumber(Number(formatUnits(BigInt(token?.balance), token?.tokenDetails?.decimals)))
                        : '0'}
                    </div>
                  ) : null}
                </TableCell>
                <TableCell>
                  <OnlyMainnet fallback={'-'}>
                    {token?.tokenDetails?.priceData?.price
                      ? formatNumberDollars(token?.tokenDetails?.priceData?.price)
                      : '-'}
                  </OnlyMainnet>
                </TableCell>
                <TableCell>
                  <OnlyMainnet fallback={'-'}>
                    {token?.balance && token?.tokenDetails?.priceData?.price ? (
                      <Fragment>
                        {formatNumberDollars(
                          Number(formatUnits(BigInt(token?.balance), token?.tokenDetails?.decimals)) *
                            Number(token?.tokenDetails?.priceData?.price),
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
      ) : (
        <NoData />
      )}
    </div>
  );
}
