'use client';

import { Fragment } from 'react';

import { getShortenedHash } from '@/lib/constants/knownAddresses';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { isAddress } from 'viem';

export default function Breadcrumbs() {
  const path = usePathname();
  const paths = path.split('/').filter((a) => a != '');

  const remaps: any = {
    '/tx': '/evm-transactions',
    '/token': '/tokens',
  };

  return (
    <div className="text-muted-foreground flex max-w-full select-none flex-wrap gap-2 text-xs">
      <Link href="/" className="hover:text-primary duration-300 ease-in-out">
        <span>Home</span>
      </Link>
      {paths.map((item, _) => {
        let href = `/${paths.slice(0, _ + 1).join('/')}`;
        return (
          <Fragment key={_}>
            <span>/</span>
            <Link
              href={remaps[href] || href}
              className={cn(['hover:text-primary duration-300 ease-in-out', _ === paths?.length - 1 ? 'truncate' : ''])}
            >
              <span className="capitalize">
                {isAddress(item) || item?.startsWith('0x')
                  ? getShortenedHash(item)
                  : paths.includes('extrinsics') || paths.includes('events')
                  ? item
                  : item?.replaceAll('-', ' ')}
              </span>
            </Link>
          </Fragment>
        );
      })}
    </div>
  );
}
