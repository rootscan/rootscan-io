import { SiGithub, SiX } from '@icons-pack/react-simple-icons';
import Image from 'next/image';
import Link from 'next/link';

import { BackToTopButton } from './back-to-top';
import Container from './container';
import MetamaskWrapper from './metamask-wrapper';
import { ThemeToggle } from './theme-toggle';
import { Button } from './ui/button';

export default function SiteFooter() {
  return (
    <div className="flex w-full flex-col rounded-b-2xl bg-white py-4 dark:bg-black/50">
      <Container className="hidden md:block">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 text-sm">
          <div />
          <div className="flex flex-wrap items-center gap-4 text-muted-foreground">
            {/*<ThemeToggle />*/}
            <BackToTopButton />
          </div>
        </div>
      </Container>
      <div className="hidden h-px w-full border-b md:block" />
      <Container>
        <div className="flex justify-between">
          <p className="max-w-md pb-8 text-xs">
            Rootscan is a Block Explorer tailored for The Root Network, an innovative decentralized network.
          </p>
          <Link href="/policy" className="text-sm text-muted-foreground">
            Privacy Policy
          </Link>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-4 text-sm">
          <div className="flex items-center gap-2">
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
          </div>
          <div className="flex flex-wrap items-center gap-4 text-muted-foreground">
            <MetamaskWrapper />
            <Link href="https://github.com/rootscan/rootscan-io" target="_blank">
              <Button variant="ghost" size="icon">
                <SiGithub size={20} />
              </Button>
            </Link>
            <Link href="https://twitter.com/rootscan_io" target="_blank">
              <Button variant="ghost" size="icon">
                <SiX size={20} />
              </Button>
            </Link>
            <ThemeToggle />
          </div>
        </div>
      </Container>
    </div>
  );
}
