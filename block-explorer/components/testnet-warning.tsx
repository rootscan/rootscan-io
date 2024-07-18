'use server';

import { Fragment, ReactNode } from 'react';

import { CHAIN_ID, isRootChain } from '@/lib/viem-client';

export default async function TestnetWarning({ children }: { children: ReactNode }) {
  if (isRootChain(CHAIN_ID)) {
    return null;
  } else {
    return <Fragment>{children}</Fragment>;
  }
}
