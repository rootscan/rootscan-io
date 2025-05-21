'use client'

import { RiGasStationLine } from '@remixicon/react';
import { usePathname } from 'next/navigation';

import MainSearch from '@/components/main-search.tsx';
import { RootPrice } from '@/components/root-price.tsx';
import OnlyMainnet from '@/components/layouts/only-mainnet.tsx';

export const SiteTopBar = () => {
  const pathname = usePathname()

  const isHomePage = pathname === '/'

  return (
    <div className="hidden border-b pb-4 lg:block">
      <div className="container">
        <div className="flex items-center justify-between gap-4">
          <div className="flex w-full select-none items-center gap-2 text-xs text-primary/80">
            <OnlyMainnet>
              <RootPrice />
            </OnlyMainnet>
            {isHomePage && (<div className="flex-1" />)}
            <RiGasStationLine className="size-4 text-muted-foreground" />{' '}
            <span className="text-muted-foreground">EVM Gas:{' '}</span>
            <span>7500 Gwei</span>
          </div>
          {!isHomePage && (
            <div className="hidden max-w-2xl grow lg:block">
              <MainSearch />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
