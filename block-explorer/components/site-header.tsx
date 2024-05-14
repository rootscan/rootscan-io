import { Fragment } from 'react';

import { Fuel } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

import OnlyMainnet from './layouts/only-mainnet';
import MainSearch from './main-search';
import { Navigation } from './navigation';
import RootPrice from './root-price';
import TestnetWarning from './testnet-warning';
import { Badge } from './ui/badge';

export function SiteHeader() {
  return (
    <Fragment>
      <header className="z-40 flex w-full flex-col bg-white py-4 dark:bg-black/50">
        <div className="hidden border-b pb-4 lg:block">
          <div className="container">
            <div className="flex items-center justify-between gap-4">
              <div className="text-primary/80 flex select-none items-center gap-2 text-xs">
                <OnlyMainnet>
                  <RootPrice />
                </OnlyMainnet>
                <Fuel className="text-muted-foreground size-4" />{' '}
                <span className="text-muted-foreground">EVM Gas:</span> 7500 Gwei
              </div>
              <div className="hidden max-w-2xl grow lg:block">
                <MainSearch />
              </div>
            </div>
          </div>
        </div>
        <div className="container flex items-center justify-between gap-4 space-x-4 pt-0 sm:space-x-0 lg:pt-4">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/site-logos/rootscan-logo.png"
              width={250}
              height={250}
              unoptimized
              className="size-8 rounded-lg invert dark:invert-0"
              alt="rootscan_logo"
            />
            <span className="text-md font-bold">rootscan</span>
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
