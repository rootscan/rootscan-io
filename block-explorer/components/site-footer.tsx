import { RiArrowRightUpLine, RiDiscordFill, RiGithubFill, RiTwitterXFill } from '@remixicon/react';
import Image from 'next/image';
import Link from 'next/link';

import MetamaskWrapper from './metamask-wrapper';
import { ThemeToggle } from './theme-toggle';
import { Button } from './ui/button';

export default function SiteFooter() {
  return (
    <div className="flex w-full flex-col bg-white dark:bg-black/50">
      <div className="container flex flex-col gap-8 py-10">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <h3 className="text-[20px]/[32px] font-semibold">
            Kickstart your development on The Root Network with Rootscan’s API and RPC services
          </h3>
          <Button variant="secondary" className="shrink-0 gap-2">
            API Portal
            <RiArrowRightUpLine className="size-5" />
          </Button>
        </div>
        <div className="aspect-[345/75] bg-footer-pattern-mobile bg-contain bg-center bg-no-repeat md:aspect-[724/75] md:bg-footer-pattern-tablet xl:aspect-[1334/75] xl:bg-footer-pattern-desktop" />
      </div>
      <div className="hidden h-px w-full border-b md:block" />
      <div className="container flex flex-wrap gap-4 py-6 md:flex-nowrap md:items-center">
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/site-logos/rootscan-logo.png"
            width={190}
            height={190}
            priority
            unoptimized
            className="size-8 rounded-lg invert dark:invert-0"
            alt="rootscan_logo"
          />
          <span className="text-base font-bold">rootscan</span>
        </Link>
        <div className="flex-1" />
        <div className="flex items-center gap-2">
          <Link href="https://github.com/rootscan/rootscan-io" target="_blank">
            <Button variant="ghost" size="icon">
              <RiGithubFill size={20} />
            </Button>
          </Link>
          <Link href="https://twitter.com/rootscan_io" target="_blank">
            <Button variant="ghost" size="icon">
              <RiTwitterXFill size={20} />
            </Button>
          </Link>
          <Link href="#" target="_blank">
            <Button variant="ghost" size="icon">
              <RiDiscordFill size={20} />
            </Button>
          </Link>
        </div>
        <div className="w-full md:w-fit [&>button]:w-full md:[&>button]:w-fit">
          <MetamaskWrapper />
        </div>
      </div>
      <div className="container flex flex-wrap gap-4 pb-6 md:items-center xl:flex-nowrap">
        <p className="w-full text-sm font-normal text-muted-foreground xl:w-fit">
          Rootscan is a Block Explorer tailored for The Root Network, an innovative decentralized network.
        </p>
        <div className="hidden xl:block xl:flex-1" />
        <Link href="/policy" className="text-sm font-normal text-muted-foreground">
          Privacy Policy
        </Link>
        <div className="flex-1 xl:hidden" />
        <ThemeToggle />
      </div>
    </div>
  );
}
