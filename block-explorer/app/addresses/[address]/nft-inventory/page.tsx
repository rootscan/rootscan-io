import NoData from '@/components/no-data';
import PaginationSuspense from '@/components/pagination-suspense';
import TokenDisplay from '@/components/token-display';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ApiCommand, request } from '@/lib/api';
import { getPaginationData } from '@/lib/utils';
import Link from 'next/link';
import { Address } from 'viem';

export default async function Page({
  params,
  searchParams,
}: {
  params: { address: Address };
  searchParams: { page?: number };
}) {
  const data = await request(ApiCommand.getNftCollectionsForAddress, {
    address: params.address,
    page: searchParams?.page || 1,
  });

  const tokens = data?.docs;
  if (!tokens?.length) return <NoData />;

  return (
    <div className="flex flex-col gap-4">
      <PaginationSuspense pagination={getPaginationData(data)} />
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Collection</TableHead>
            <TableHead>NFTs Owned</TableHead>
            <TableHead />
          </TableRow>
        </TableHeader>
        <TableBody>
          {tokens.map((item) => {
            return (
              <TableRow key={item.contractAddress}>
                <TableCell>
                  <TokenDisplay token={item.tokenLookUp} hideCopyButton overrideImageSizeClass="h-10 w-10 mr-2" />
                </TableCell>
                <TableCell>{item.count}</TableCell>
                <TableCell>
                  <div className="my-auto flex justify-end">
                    <Link href={`/addresses/${params.address}/nft-inventory/${item.contractAddress}`}>
                      <Button size="sm" variant="outline">
                        {item.tokenLookUp.type === 'ERC1155' ? 'View SFTs' : 'View NFTs'}
                      </Button>
                    </Link>
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
