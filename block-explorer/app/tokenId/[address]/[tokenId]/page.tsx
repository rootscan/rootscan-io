import { ErrorAlert } from '@/components/error-alert';
import { ApiCommand, request } from '@/lib/api';
import { handleRequestResult } from '@/lib/utils';
import { getAddress } from 'viem';

import NftHolders from './components/nft-holders';
import { PageProps } from './components/types';

export default async function Page({ params, searchParams }: PageProps) {
  const paramsObj = await params;
  const searchParamsObj = await searchParams;
  if (!paramsObj.address) {
    throw new Error('Address is required');
  }

  const page = Number(searchParamsObj?.page) || 1;
  try {
    const owners = handleRequestResult(
      await request(ApiCommand.getNftOwners, {
        contractAddress: getAddress(paramsObj.address),
        tokenId: paramsObj.tokenId,
        page,
      }),
    );

    return <NftHolders data={owners}></NftHolders>;
  } catch (error) {
    return <ErrorAlert error={error instanceof Error ? error : new Error('An unexpected error occurred')} />;
  }
}
