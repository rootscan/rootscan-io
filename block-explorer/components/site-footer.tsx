import { RiArrowRightUpLine, RiGithubFill, RiTwitterXFill, RiDiscordFill } from '@remixicon/react'
import Image from 'next/image';
import Link from 'next/link';

import { ContainerV2 } from './container';
import MetamaskWrapper from './metamask-wrapper';
import { ThemeToggle } from './theme-toggle';
import { Button } from './ui/button';

export default function SiteFooter() {
  return (
    <div className="bg-white dark:bg-black/50 flex flex-col w-full">
      <ContainerV2 className="flex flex-col gap-8 py-10">
        <div className="flex flex-col md:flex-row gap-4 md:items-center justify-between">
          <h3 className="font-semibold text-[20px]/[32px]">
            Kickstart your development on The Root Network with Rootscan’s API and RPC services
          </h3>
          <Button variant="secondary" className="gap-2 shrink-0">
            API Portal
            <RiArrowRightUpLine className="size-5" />
          </Button>
        </div>
        <div className="aspect-[345/75] md:aspect-[724/75] xl:aspect-[1334/75] bg-footer-pattern-mobile md:bg-footer-pattern-tablet xl:bg-footer-pattern-desktop bg-center bg-contain bg-no-repeat" />
      </ContainerV2>
      <div className="hidden h-px w-full border-b md:block" />
      <ContainerV2 className="flex flex-wrap md:flex-nowrap gap-4 md:items-center py-6">
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
        <div className="flex gap-2 items-center">
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
      </ContainerV2>
      <ContainerV2 className="flex flex-wrap xl:flex-nowrap gap-4 md:items-center pb-6">
        <p className="font-normal text-sm text-muted-foreground w-full xl:w-fit">
          Rootscan is a Block Explorer tailored for The Root Network, an innovative decentralized network.
        </p>
        <div className="hidden xl:block xl:flex-1" />
        <Link href="/policy" className="font-normal text-sm text-muted-foreground">
          Privacy Policy
        </Link>
        <div className="flex-1 xl:hidden" />
        <ThemeToggle />
      </ContainerV2>
    </div>
  );
}
