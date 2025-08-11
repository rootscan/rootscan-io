import { Fragment } from 'react';

import { CopyButton } from '@/components/copy-button';
import { ErrorAlert } from '@/components/error-alert';
import NftPlayer from '@/components/nft-player';
import NoData from '@/components/no-data';
import PaginationSuspense from '@/components/pagination-suspense';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { ApiCommand, request } from '@/lib/api';
import { getShortenedHash } from '@/lib/constants/knownAddresses';
import { getPaginationData, handleRequestResult } from '@/lib/utils';
import Link from 'next/link';
import { getAddress } from 'viem';

export interface PageProps {
  params: Promise<{
    address?: string;
  }>;
  searchParams?: Promise<{
    page?: string;
    type?: string;
  }>;
}

export default async function Page({ params, searchParams }: PageProps) {
  try {
    const paramsObj = await params;
    if (!paramsObj.address) {
      throw new Error('Address is required');
    }

    const numberFormatter = new Intl.NumberFormat('en-US', { style: 'decimal' });

    const searchParamsObj = await searchParams;
    const page = Number(searchParamsObj?.page) || 1;

    const address = getAddress(paramsObj.address);

    const data = handleRequestResult(
      await request(ApiCommand.getNftsForCollection, {
        contractAddress: address,
        page,
      }),
    );

    const tokens = data.docs;

    if (!tokens?.length) {
      return <NoData />;
    }

    return (
      <Fragment>
        <div className="flex flex-col gap-4 rounded-[16px] border border-surface-bg bg-surface-container px-5 py-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            <div className="space-y-0.5">
              <p className="text-sm font-normal">Showing {numberFormatter.format(data.totalDocs)} NFTs</p>
            </div>
          </div>

          <PaginationSuspense pagination={getPaginationData(data)} />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-6">
          {tokens.map((item, _) => (
            <Card key={`${item.contractAddress}_${item.tokenId}_${_}`} className="overflow-hidden rounded-[12px] p-0">
              <CardHeader className="p-0">
                <Link href={`/token/${address}/${item.tokenId}`}>
                  <NftPlayer animation_url={item?.animation_url} image={item?.image} />
                </Link>
              </CardHeader>
              <CardContent className="flex flex-col gap-4 p-3">
                <div className="flex flex-col gap-2">
                  <span className="text-xs font-semibold text-text-secondary">TokenID</span>
                  <div className="flex items-center gap-1">
                    <span className="truncate text-sm font-semibold">
                      {item.tokenId.toString().length > 12 ? getShortenedHash(item.tokenId.toString()) : item.tokenId}
                    </span>
                    <CopyButton value={item.tokenId.toString()} />
                    {item?.totalAmount ? <Badge>x{item?.totalAmount}</Badge> : null}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </Fragment>
    );
  } catch (error) {
    return <ErrorAlert error={error instanceof Error ? error : new Error('An unexpected error occurred')} />;
  }
}
