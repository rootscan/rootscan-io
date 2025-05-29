'use client';

import OnlyMainnet from '@/components/layouts/only-mainnet.tsx';
import MainSearch from '@/components/main-search.tsx';
import { RootPrice } from '@/components/root-price.tsx';
import { RiGasStationLine } from '@remixicon/react';
import { usePathname } from 'next/navigation';

export const SiteTopBar = () => {
  const pathname = usePathname();

  const isHomePage = pathname === '/';

  return (
    <div className="border-b">
      <div className="container flex h-12 items-center justify-between gap-4 px-4 py-2 lg:px-8">
        <div className="hidden w-full select-none items-center gap-2 text-xs text-primary/80 lg:flex">
          <OnlyMainnet>
            <RootPrice />
          </OnlyMainnet>
          {isHomePage && <div className="hidden lg:flex-1" />}
          <RiGasStationLine className="size-4 text-muted-foreground" />{' '}
          <span className="text-muted-foreground">EVM Gas: </span>
          <span>7500 Gwei</span>
        </div>
        {!isHomePage && (
          <div className="w-full grow lg:max-w-[656px]">
            <MainSearch />
          </div>
        )}
      </div>
    </div>
  );
};
