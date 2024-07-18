import { Fragment, ReactNode } from 'react';

import { CHAIN_ID, isRootChain } from '@/lib/viem-client';

export default function OnlyMainnet({ children, fallback }: { children: ReactNode; fallback?: ReactNode }) {
  if (!isRootChain(CHAIN_ID)) {
    return fallback ? fallback : <Fragment />;
  } else {
    return <Fragment>{children}</Fragment>;
  }
}
