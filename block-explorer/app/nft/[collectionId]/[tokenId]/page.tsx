import { ApiCommand, request } from '@/lib/api';
import { handleRequestResult } from '@/lib/utils';
import { redirect } from 'next/navigation';

export default async function RedirectPage({ params }) {
  const { collectionId, tokenId } = params;

  const data = handleRequestResult(
    await request(ApiCommand.getNft, {
      collectionId,
      tokenId,
    }),
  );

  // Redirect to token page
  redirect(`/token/${data.contractAddress}/${tokenId}`);
}
