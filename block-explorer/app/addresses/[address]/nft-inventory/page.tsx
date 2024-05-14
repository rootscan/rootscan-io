import NoData from '@/components/no-data';
import PaginationSuspense from '@/components/pagination-suspense';
import TokenDisplay from '@/components/token-display';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { getNftCollectionsForAddress } from '@/lib/api';
import { getPaginationData } from '@/lib/utils';
import Link from 'next/link';

const getData = async ({ params, searchParams }) => {
  const data = await getNftCollectionsForAddress({
    address: params.address,
    page: searchParams?.page,
  });

  return data;
};

export default async function Page({ params, searchParams }) {
  const data = await getData({ params, searchParams });
  const tokens = data?.docs || [];

  return (
    <div className="flex flex-col gap-4">
      <PaginationSuspense pagination={getPaginationData(data)} />
      {tokens?.length ? (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Collection</TableHead>
              <TableHead>NFTs Owned</TableHead>
              <TableHead />
            </TableRow>
          </TableHeader>
          <TableBody>
            {tokens.map((item, _) => (
              <TableRow key={item?.address}>
                <TableCell>
                  <TokenDisplay token={item?.tokenLookUp} hideCopyButton overrideImageSizeClass="h-10 w-10 mr-2" />
                </TableCell>
                <TableCell>{item?.count}</TableCell>
                <TableCell>
                  <div className="my-auto flex justify-end">
                    <Link href={`/addresses/${params.address}/nft-inventory/${item.contractAddress}`}>
                      <Button size="sm" variant="outline">
                        View NFTs
                      </Button>
                    </Link>
                  </div>
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
