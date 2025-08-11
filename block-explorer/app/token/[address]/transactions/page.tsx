import React from 'react';

import { ErrorAlert } from '@/components/error-alert';
import NoData from '@/components/no-data';
import { ApiCommand, request } from '@/lib/api';
import { handleRequestResult } from '@/lib/utils';
import { PageProps } from '@/types/page';
import { getAddress, isAddress } from 'viem';

import NftTransactions from '../components/nft-transactions';

export default async function Page({ params, searchParams }: PageProps) {
  try {
    const paramsObj = await params;
    if (!paramsObj.address) {
      throw new Error('Address is required');
    }

    const searchParamsObj = await searchParams;
    const page = searchParamsObj?.page ? parseInt(searchParamsObj.page) : 1;

    const data = handleRequestResult(
      await request(ApiCommand.getNftCollectionEvents, {
        collectionId: isAddress(paramsObj.address) ? undefined : parseInt(paramsObj.address),
        contractAddress: isAddress(paramsObj.address) ? getAddress(paramsObj.address) : undefined,
        page,
      }),
    );
    const transactions = data.docs;
    if (!transactions || transactions?.length === 0) {
      return <NoData />;
    }
    return <NftTransactions data={data} contractAddress={paramsObj.address}></NftTransactions>;
  } catch (error) {
    return <ErrorAlert error={error instanceof Error ? error : new Error('An unexpected error occurred')} />;
  }
}
