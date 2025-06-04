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
    if (Object.prototype.hasOwnProperty.call(window, 'ethereum')) {
      walletClient = createWalletClient({
        chain: !isPorcini ? root : porcini,
        transport: custom(window['ethereum']),
      });
    }
  }

  const add = async () => {
    try {
      await walletClient?.addChain({
        chain: !isPorcini ? root : porcini,
      });
    } catch {
      // noop
    }
  };
  return (
    <Button size="default" variant="default" onClick={() => add()}>
      <Image
        src="/site-logos/metamask_logo.svg"
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
