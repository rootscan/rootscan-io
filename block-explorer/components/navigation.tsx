'use client';

import { Fragment, useState } from 'react';

import { Card, CardContent, CardHeader } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu.tsx';
import { cn } from '@/lib/utils';
import { RiArrowDownSLine } from '@remixicon/react';
import { MenuIcon, XIcon } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

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
  { title: 'Ecosystem', href: '/ecosystem' },
  { title: 'API', href: 'https://build.rootscan.io', newTab: true },
];

type HeaderMenuLink = {
  title: string;
  href: string;
  target?: '_blank';
};

type HeaderMenuGroupLink = {
  title: string;
  subitems: Omit<HeaderMenuLink, 'target'>[];
};

const items2: Array<HeaderMenuLink | HeaderMenuGroupLink> = [
  {
    title: 'Blockchain',
    subitems: [
      { title: 'Blocks', href: '/blocks' },
      { title: 'Extrinsics', href: '/extrinsics' },
      { title: 'Events', href: '/events' },
      { title: 'EVM Transactions', href: '/evm-transactions' },
    ],
  },
  {
    title: 'Track',
    subitems: [
      { title: 'Bridge', href: '/bridge' },
      { title: 'DEX', href: '/dex' },
      { title: 'Staking', href: '/staking' },
    ],
  },
  { title: 'Addresses', href: '/addresses' },
  { title: 'Tokens', href: '/tokens' },
  { title: 'Verified Contracts', href: '/verified-contracts' },
  { title: 'Ecosystem', href: '/ecosystem' },
  { title: 'API Portal', href: 'https://build.rootscan.io', target: '_blank' },
];

export function Navigation() {
  const pathname = usePathname();
  const formattedPathname = pathname?.split('/', 2)?.join('/');

  return (
    <Fragment>
      <div className="hidden items-center gap-0.5 px-4 lg:flex">
        {items2.map((item, _) => {
          const { title } = item;
          const { href, target } = item as HeaderMenuLink;
          const { subitems } = item as HeaderMenuGroupLink;
          const isLink = !!href;

          const headerMenuLink = (
            <Link
              href={isLink ? href : '#'}
              target={target ? '_blank' : '_self'}
              className={cn([
                'group font-semibold gap-2 inline-flex items-center py-1.5 px-3 transition-colors text-[14px]/[20px] text-muted-foreground data-[state=open]:text-primary hover:text-primary focus:outline-0',
                !isLink && 'pr-2.5',
                formattedPathname === href ? 'text-primary' : '',
              ])}
            >
              {title}
              {!isLink && <RiArrowDownSLine className="size-4 transition-all group-data-[state=open]:rotate-180" />}
            </Link>
          );

          return (
            <Fragment key={_}>
              {isLink ? (
                headerMenuLink
              ) : (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>{headerMenuLink}</DropdownMenuTrigger>
                  <DropdownMenuContent className="flex flex-col gap-1 rounded-[12px] bg-popover p-2">
                    {subitems?.map((subitem, i) => (
                      <DropdownMenuItem
                        asChild
                        key={i}
                        className="cursor-pointer rounded-[4px] px-3 py-2 text-[14px]/[20px] font-semibold"
                      >
                        <Link href={subitem.href}>{subitem.title}</Link>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </Fragment>
          );
        })}
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
        <div className="duration-300 animate-in animate-out fade-in fade-out" onClick={() => setOpen(!open)}>
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
                  <div className="flex items-center text-sm font-bold text-muted-foreground duration-150 ease-in hover:text-primary">
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
