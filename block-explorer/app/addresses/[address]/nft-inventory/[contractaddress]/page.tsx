import { CopyButton } from '@/components/copy-button.tsx';
import NftPlayer from '@/components/nft-player';
import NoData from '@/components/no-data';
import PaginationSuspense from '@/components/pagination-suspense';
import Tooltip from '@/components/tooltip';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { ApiCommand, request } from '@/lib/api';
import { getShortenedHash } from '@/lib/constants/knownAddresses.ts';
import { getPaginationData } from '@/lib/utils';
import { PageProps } from '@/types/page';
import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import { getAddress } from 'viem';

export default async function Page({ params, searchParams }: PageProps) {
  const paramsObj = await params;
  const searchParamsObj = await searchParams;

  if (!paramsObj.address || !paramsObj.contractaddress) {
    return null;
  }

  const data = await request(ApiCommand.getNftsForAddress, {
    address: getAddress(paramsObj.address),
    contractAddress: getAddress(paramsObj.contractaddress),
    page: searchParamsObj?.page ? parseInt(searchParamsObj.page) : 1,
    limit: 24,
  });

  const tokens = data?.docs;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <Tooltip text="Back to collection" asChild>
          <Link href={`/addresses/${paramsObj.address}/nft-inventory`}>
            <Button size="pagination" variant="outline">
              <ChevronLeft />
            </Button>
          </Link>
        </Tooltip>
        {tokens?.length ? <PaginationSuspense pagination={getPaginationData(data)} /> : null}
      </div>
      {tokens?.length ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-6">
          {tokens.map((item, _) => (
            <Card key={`${item.contractAddress}_${item.tokenId}_${_}`} className="p-0">
              <CardHeader className="p-0">
                <NftPlayer animation_url={item?.animation_url} image={item?.image} />
              </CardHeader>
              <CardContent className="flex flex-col gap-4 p-3">
                {/* Image */}

                <div className="flex flex-col gap-1">
                  <span className="text-muted-foreground">TokenID</span>
                  <div className="flex items-center gap-2">
                    <span className="truncate">
                      {item.tokenId.toString().length > 12 ? getShortenedHash(item.tokenId.toString()) : item.tokenId}
                    </span>
                    <CopyButton value={item.tokenId.toString()} />
                    {item?.amount ? <Badge>x{item?.amount}</Badge> : null}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <NoData />
      )}
    </div>
  );
}
