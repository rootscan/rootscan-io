'use client';

import { Fragment, useState } from 'react';

import { cn } from '@/lib/utils';
import { MenuIcon, XIcon } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { Card, CardContent, CardHeader } from './ui/card';

const items = [
  { title: 'Blocks', href: '/blocks' },
  { title: 'Extrinsics', href: '/extrinsics' },
  { title: 'Events', href: '/events' },
  { title: 'EVM Transactions', href: '/evm-transactions' },
  { title: 'Addresses', href: '/addresses' },
  { title: 'Bridge', href: '/bridge' },
  { title: 'Tokens', href: '/tokens' },
  { title: 'DEX', href: '/dex' },
  { title: 'Staking', href: '/staking' },
  { title: 'Verified Contracts', href: '/verified-contracts' },
  { title: 'Resources', href: '/resources' },
  { title: 'API', href: 'https://build.rootscan.io', newTab: true },
];

export function Navigation() {
  const pathname = usePathname();
  const formattedPathname = pathname?.split('/', 2)?.join('/');

  return (
    <Fragment>
      <div className="hidden items-center gap-4 px-4 lg:flex">
        {items.map((item, _) => (
          <Link href={item.href} key={_} target={item.newTab ? '_blank' : '_self'}>
            <div
              className={cn([
                'text-muted-foreground hover:text-primary flex items-center text-sm font-bold duration-150 ease-in',
                formattedPathname === item.href ? 'text-primary' : '',
              ])}
            >
              {item.title}
            </div>
          </Link>
        ))}
      </div>
      <MobileMenu />
    </Fragment>
  );
}

export const MobileMenu = () => {
  const [open, setOpen] = useState<boolean>(false);

  return (
    <Fragment>
      <div className="block lg:hidden">
        <div className="animate-in animate-out fade-in fade-out duration-300" onClick={() => setOpen(!open)}>
          {open ? <XIcon /> : <MenuIcon />}
        </div>
      </div>
      <div className={cn([open ? 'absolute left-0 top-[64px] !m-0 w-full' : 'hidden'])}>
        <Card className="rounded-b-2xl rounded-t-none">
          <CardHeader className="pb-0" />
          <CardContent>
            <div className="flex flex-col gap-4">
              {items.map((item, _) => (
                <Link href={item.href} onClick={() => setOpen(false)} key={_} target={item.newTab ? '_blank' : '_self'}>
                  <div className="text-muted-foreground hover:text-primary flex items-center text-sm font-bold duration-150 ease-in">
                    {item.title}
                  </div>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </Fragment>
  );
};
