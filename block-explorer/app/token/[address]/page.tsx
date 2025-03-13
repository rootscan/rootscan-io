import { Fragment } from 'react';

import NoData from '@/components/no-data';
import PaginationSuspense from '@/components/pagination-suspense';
import { ApiCommand, request } from '@/lib/api';
import { getPaginationData } from '@/lib/utils';
import { PageProps } from '@/types/page';
import { getAddress } from 'viem';

import Erc20Holders from './components/erc20-holders';
import Erc721Holders from './components/erc721-holders';
import Erc1155Holders from './components/erc1155-holders';

const getData = async ({ params, searchParams }: PageProps) => {
  const paramsObj = await params;
  const searchParamsObj = await searchParams;
  if (!paramsObj.address) {
    return null;
  }
  const page = searchParamsObj?.page ? parseInt(searchParamsObj.page) : 1;
  const data = await request(ApiCommand.getTokenHolders, {
    contractAddress: getAddress(paramsObj.address),
    page,
  });
  const tokens = data.docs;

  if (!tokens?.length) return null;

  return {
    data: {
      docs: data.docs,
      type: data.type,
      pagination: getPaginationData(data),
    },
    tokens,
  };
};

export default async function Page({ params, searchParams }: PageProps) {
  const paramsObj = await params;
  if (!paramsObj.address) {
    return null;
  }
  const result = await getData({ params, searchParams });
  if (!result) {
    return <NoData />;
  }

  const { data } = result;

  return (
    <div className="flex flex-col gap-4">
      <PaginationSuspense pagination={data.pagination} />
      <Fragment>
        {data.type === 'ERC20' ? (
          <Erc20Holders data={data.docs} />
        ) : data.type === 'ERC721' ? (
          <Erc721Holders data={data.docs} contractAddress={getAddress(paramsObj.address)} />
        ) : data.type === 'ERC1155' ? (
          <Erc1155Holders data={data.docs} contractAddress={getAddress(paramsObj.address)} />
        ) : null}
      </Fragment>
    </div>
  );
}
