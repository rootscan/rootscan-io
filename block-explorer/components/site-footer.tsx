import Image from "next/image"
import Link from "next/link"
import AddToMetamask from "./add-to-metamask"
import { BackToTopButton } from "./back-to-top"
import Container from "./container"

export default function SiteFooter() {
  return (
    <div className="flex w-full flex-col rounded-b-2xl bg-black/50 py-4">
      <Container className="hidden md:block">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 text-sm">
          <div />
          <div className="flex flex-wrap items-center gap-4 text-muted-foreground">
            {/* <ThemeToggle /> */}
            <BackToTopButton />
          </div>
        </div>
      </Container>
      <div className="hidden h-[1px] w-full border-b md:block" />
      <Container>
        <p className="py-4 text-xs">
          Rootscan is a Block Explorer for The Root Network.
        </p>
        <div className="flex flex-wrap items-center justify-between gap-4 text-sm">
          <div className="flex flex-col gap-2">
            <Link href="/" className="flex items-center gap-2">
              <Image
                src="/site-logos/rootscan-logo.png"
                width={190}
                height={190}
                unoptimized
                className="size-8 rounded-lg"
                alt="rootscan_logo"
              />
              <span className="text-md font-bold">rootscan</span>
            </Link>
          </div>
          <div className="flex flex-wrap items-center gap-4 text-muted-foreground">
            <AddToMetamask />
            <div>Status</div>
            <div>Feedback</div>
            {/* <div className="block md:hidden">
              <ThemeToggle />
            </div> */}
          </div>
        </div>
      </Container>
    </div>
  )
}
