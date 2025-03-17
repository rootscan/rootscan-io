import React from 'react';

import { ApiCommand, request } from '@/lib/api';
import { cn, handleRequestResult } from '@/lib/utils';
import { Address } from 'viem';

import SkeletonImage from './skeleton-image';

const getData = async ({ contractAddress, tokenId }: { contractAddress: Address; tokenId: number | string }) => {
  if (!contractAddress) return null;
  const data = await request(ApiCommand.getNft, { contractAddress, tokenId });
  return handleRequestResult(data);
};

const size = `h-12 w-12`;

export async function NftThumbnail({ contractAddress, tokenId }) {
  if (!contractAddress) {
    return (
      <div className={cn([size, `bg-muted text-muted-foreground grid select-none place-items-center rounded-xl`])}>
        <div>NFT</div>
      </div>
    );
  }

  const data = await getData({ contractAddress, tokenId });

  if (!data?.image) {
    return (
      <div className={cn([size, `bg-muted text-muted-foreground grid select-none place-items-center rounded-xl`])}>
        <div>NFT</div>
      </div>
    );
  }

  return (
    <SkeletonImage
      src={data?.image}
      width={250}
      height={250}
      priority
      alt="nft_image"
      unoptimized
      className={cn([size, 'shrink-0 rounded-xl'])}
    />
  );
}
