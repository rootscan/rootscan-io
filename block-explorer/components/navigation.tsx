'use client';

import { Fragment, useState } from 'react';

import { Card, CardContent } from '@/components/ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible.tsx';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu.tsx';
import { cn } from '@/lib/utils';
import { RiArrowDownSLine, RiCloseLargeLine, RiMenuLine } from '@remixicon/react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

type HeaderMenuLink = {
  title: string;
  href: string;
  target?: '_blank';
};

type HeaderMenuGroupLink = {
  title: string;
  subitems: Omit<HeaderMenuLink, 'target'>[];
};

const items: Array<HeaderMenuLink | HeaderMenuGroupLink> = [
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
        {items.map((item, _) => {
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
                      <DropdownMenuItem key={i} asChild>
                        <Link
                          href={subitem.href}
                          className="cursor-pointer rounded-[4px] px-3 py-2 text-[14px]/[20px] font-semibold"
                        >
                          {subitem.title}
                        </Link>
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

  const pathname = usePathname();

  const isHomePage = pathname === '/';

  return (
    <Fragment>
      <div className="block lg:hidden">
        <div className="p-1 duration-300 animate-in animate-out fade-in fade-out" onClick={() => setOpen(!open)}>
          {open ? <RiCloseLargeLine className="size-6" /> : <RiMenuLine className="size-6" />}
        </div>
      </div>
      <div
        className={cn(
          'absolute left-0 top-[64px] !m-0 w-full',
          !open && 'hidden',
          isHomePage ? 'top-[96px]' : 'top-[128px]',
        )}
      >
        <Card className="rounded-b-2xl rounded-t-none dark:bg-black">
          <CardContent className="p-2">
            <div className="flex flex-col gap-0.5">
              {items.map((item, _) => {
                const { title } = item;
                const { href } = item as HeaderMenuLink;
                const { subitems } = item as HeaderMenuGroupLink;
                const isLink = !!href;

                const headerMenuLink = (
                  <Link
                    className="group flex items-center justify-between py-3.5 pl-2 pr-3.5 text-[14px]/[20px] font-semibold transition-all"
                    href={isLink ? href : '#'}
                    onClick={() => isLink && setOpen(false)}
                  >
                    {title}
                    {!isLink && (
                      <RiArrowDownSLine className="size-5 transition-all group-data-[state=open]:rotate-180" />
                    )}
                  </Link>
                );

                return (
                  <Fragment key={_}>
                    {isLink ? (
                      headerMenuLink
                    ) : (
                      <Collapsible>
                        <CollapsibleTrigger asChild>{headerMenuLink}</CollapsibleTrigger>
                        <CollapsibleContent>
                          <div className="flex flex-col gap-1 rounded-[12px] border p-2">
                            {subitems?.map((subitem, i) => (
                              <Link
                                key={i}
                                href={subitem.href}
                                className="cursor-pointer rounded-[4px] px-3 py-2 text-[14px]/[20px] font-semibold"
                                onClick={() => setOpen(false)}
                              >
                                {subitem.title}
                              </Link>
                            ))}
                          </div>
                        </CollapsibleContent>
                      </Collapsible>
                    )}
                  </Fragment>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </Fragment>
  );
};
