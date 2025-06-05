'use client';

import React from 'react';

import MainSearch from '@/components/main-search.tsx';
import { RiGasStationLine } from '@remixicon/react';
import { usePathname } from 'next/navigation';

interface SiteTopBarProps {
  rootPrice: React.ReactElement;
}
export const SiteTopBar = ({ rootPrice }: SiteTopBarProps) => {
  const pathname = usePathname();

  const isHomePage = pathname === '/';

  return (
    <div className="border-b">
      <div className="container flex h-12 items-center justify-between gap-4 py-2">
        <div
          className={`${isHomePage ? 'flex' : 'hidden lg:flex'} w-full select-none items-center gap-2 text-xs md:gap-4`}
        >
          {rootPrice}
          {isHomePage && <div className="flex-1" />}
          <div className="flex items-center gap-1 md:gap-2">
            <RiGasStationLine className="size-4 text-muted-foreground" />
            <span className="hidden font-normal text-muted-foreground sm:inline">EVM Gas:</span>
            <span className="font-normal text-muted-foreground sm:hidden">EVM Gas:</span>
            <span className="font-semibold text-foreground">7500 Gwei</span>
          </div>
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
