import { Fragment } from 'react';

import NoData from '@/components/no-data';
import PaginationSuspense from '@/components/pagination-suspense';
import { ApiCommand, request } from '@/lib/api';
import { getPaginationData } from '@/lib/utils';
import { Address, getAddress } from 'viem';

import Erc20Holders from './components/erc20-holders';
import Erc721Holders from './components/erc721-holders';
import Erc1155Holders from './components/erc1155-holders';

export default async function Page({
  params,
  searchParams,
}: {
  searchParams: { page?: number };
  params: { address: Address };
}) {
  const data = await request(ApiCommand.getTokenHolders, {
    contractAddress: getAddress(params.address),
    page: searchParams?.page || 1,
  });
  const tokens = data.docs;

  if (!tokens?.length) return <NoData />;

  return (
    <div className="flex flex-col gap-4">
      <PaginationSuspense pagination={getPaginationData(data)} />
      <Fragment>
        {data?.type == 'ERC20' ? (
          <Erc20Holders data={data?.docs} />
        ) : data?.type === 'ERC721' ? (
          <Erc721Holders data={data?.docs} contractAddress={getAddress(params.address)} />
        ) : data?.type === 'ERC1155' ? (
          <Erc1155Holders data={data?.docs} contractAddress={getAddress(params.address)} />
        ) : null}
      </Fragment>
    </div>
  );
}
