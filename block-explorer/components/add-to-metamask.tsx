'use client';

import { porcini, root } from '@/lib/viem-client';
import Image from 'next/image';
import { createWalletClient, custom } from 'viem';

import { Button } from './ui/button';

export default function AddToMetamask() {
  let walletClient;
  let isPorcini = false;

  if (typeof window !== 'undefined') {
    isPorcini = window?.location?.href?.includes('porcini');
    if (window.hasOwnProperty('ethereum')) {
      walletClient = createWalletClient({
        chain: !isPorcini ? root : porcini,
        // @ts-ignore
        transport: custom(window?.ethereum),
      });
    }
  }

  const add = async () => {
    try {
      await walletClient?.addChain({
        chain: !isPorcini ? root : porcini,
      });
    } catch {}
  };
  return (
    <Button size="sm" variant="default" onClick={() => add()}>
      <Image
        src="/site-logos/metamask_logo.webp"
        width={50}
        height={50}
        unoptimized
        priority
        className="mr-2 size-5"
        alt="metamask_logo"
      />
      Add to Metamask
    </Button>
  );
}
