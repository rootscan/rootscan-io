import { Fragment } from 'react';

import { SiteTopBar } from '@/components/site-top-bar.tsx';
import Image from 'next/image';
import Link from 'next/link';

import { Navigation } from './navigation';
import TestnetWarning from './testnet-warning';
import { Badge } from './ui/badge';

export function SiteHeader() {
  return (
    <Fragment>
      <header className="z-40 flex w-full flex-col bg-white dark:bg-black">
        <SiteTopBar />
        <div className="container flex items-center justify-between gap-4 space-x-4 p-4 sm:space-x-0 lg:px-8">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/site-logos/rootscan-logo.png"
              width={250}
              height={250}
              unoptimized
              className="size-8 rounded-lg invert dark:invert-0"
              alt="rootscan_logo"
            />
            <span className="text-base font-bold">rootscan</span>
            <TestnetWarning>
              <Badge>Porcini Testnet</Badge>
            </TestnetWarning>
          </Link>
          <Navigation />
        </div>
      </header>
    </Fragment>
  );
}
