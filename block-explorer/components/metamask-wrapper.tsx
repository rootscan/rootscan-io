'use client';

import dynamic from 'next/dynamic';

const AddToMetamask = dynamic(() => import('./add-to-metamask'), {
  ssr: false,
});

export default function MetamaskWrapper() {
  return <AddToMetamask />;
}
