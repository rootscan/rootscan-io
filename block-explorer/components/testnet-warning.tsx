'use server';

import { Fragment, ReactNode } from 'react';

import { CHAIN_ID } from '@/lib/viem-client';

export default async function TestnetWarning({ children }: { children: ReactNode }) {
  if (Number(CHAIN_ID) === 7668) return null;

  return <Fragment>{children}</Fragment>;
}
