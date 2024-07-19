import NftPlayer from '@/components/nft-player';
import NoData from '@/components/no-data';
import PaginationSuspense from '@/components/pagination-suspense';
import Tooltip from '@/components/tooltip';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { ApiCommand, request } from '@/lib/api';
import { getPaginationData } from '@/lib/utils';
import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import { Address } from 'viem';

export default async function Page({
  params,
  searchParams,
}: {
  params: { contractaddress: Address; address: Address };
  searchParams: { page?: number };
}) {
  const data = await request(ApiCommand.getNftsForAddress, {
    address: params.address,
    contractAddress: params?.contractaddress,
    page: searchParams?.page || 1,
  });

  const tokens = data?.docs;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <Tooltip text="Back to collection" asChild>
          <Link href={`/addresses/${params.address}/nft-inventory`}>
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
                  <span className="flex items-center gap-2">
                    {item.tokenId} {item?.amount ? <Badge>x{item?.amount}</Badge> : null}
                  </span>
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
