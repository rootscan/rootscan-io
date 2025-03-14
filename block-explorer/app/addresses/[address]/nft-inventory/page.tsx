import { ErrorAlert } from '@/components/error-alert';
import NoData from '@/components/no-data';
import PaginationSuspense from '@/components/pagination-suspense';
import TokenDisplay from '@/components/token-display';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ApiCommand, request } from '@/lib/api';
import { getPaginationData, handleRequestResult } from '@/lib/utils';
import { PageProps } from '@/types/page';
import Link from 'next/link';
import { getAddress } from 'viem';

export default async function Page({ params, searchParams }: PageProps) {
  try {
    const paramsObj = await params;
    if (!paramsObj.address) {
      throw new Error('Address is required');
    }

    const searchParamsObj = await searchParams;
    const page = Number(searchParamsObj?.page) || 1;

    const data = handleRequestResult(
      await request(ApiCommand.getNftCollectionsForAddress, {
        address: getAddress(paramsObj.address),
        page,
      }),
    );

    if (!data.docs?.length) return <NoData />;

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
            {data.docs.map((item) => (
              <TableRow key={item.contractAddress}>
                <TableCell>
                  <TokenDisplay token={item.tokenLookUp} hideCopyButton overrideImageSizeClass="h-10 w-10 mr-2" />
                </TableCell>
                <TableCell>{item.count}</TableCell>
                <TableCell>
                  <div className="my-auto flex justify-end">
                    <Link href={`/addresses/${paramsObj.address}/nft-inventory/${item.contractAddress}`}>
                      <Button size="sm" variant="outline">
                        {item.tokenLookUp.type === 'ERC1155' ? 'View SFTs' : 'View NFTs'}
                      </Button>
                    </Link>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  } catch (error) {
    return <ErrorAlert error={error instanceof Error ? error : new Error('An unexpected error occurred')} />;
  }
}
