import React from 'react';

import { ErrorAlert } from '@/components/error-alert';
import NoData from '@/components/no-data';
import { ApiCommand, request } from '@/lib/api';
import { handleRequestResult } from '@/lib/utils';
import { getAddress } from 'viem';

import NftTransactions from '../../../../token/[address]/components/nft-transactions';
import { PageProps } from '../components/types';

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
        contractAddress: getAddress(paramsObj.address),
        tokenId: paramsObj.tokenId,
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
