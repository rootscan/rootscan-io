import { ErrorAlert } from '@/components/error-alert';
import { ApiCommand, request } from '@/lib/api';
import { handleRequestResult } from '@/lib/utils';
import Image from 'next/image';
import { Address } from 'viem';

interface Props {
  contractAddress: Address;
  tokenId: string;
}

export async function NftThumbnail({ contractAddress, tokenId }: Props) {
  try {
    const nft = handleRequestResult(await request(ApiCommand.getNft, { contractAddress, tokenId }));
    if (!nft) return null;

    const imageUrl = nft.image || '';

    return (
      <div className="relative aspect-square w-full overflow-hidden rounded-lg border bg-muted">
        <Image
          src={imageUrl}
          alt={`NFT #${tokenId}`}
          className="object-cover"
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>
    );
  } catch (error) {
    return <ErrorAlert error={error instanceof Error ? error : new Error('An unexpected error occurred')} />;
  }
}
