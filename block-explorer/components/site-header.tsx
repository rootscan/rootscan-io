import Link from "next/link"

import { Fuel } from "lucide-react"
import Image from "next/image"
import { Fragment } from "react"
import MainSearch from "./main-search"
import { Navigation } from "./navigation"
import RootPrice from "./root-price"
import TestnetWarning from "./testnet-warning"
import { Badge } from "./ui/badge"
export function SiteHeader() {
  return (
    <Fragment>
      <header className="z-40 flex w-full flex-col rounded-b-2xl bg-black/50 py-4">
        <div className="hidden border-b pb-4 lg:block">
          <div className="container">
            <div className="flex items-center justify-between gap-4">
              <div className="flex select-none items-center gap-2 text-xs text-primary/80">
                <RootPrice />
                <Fuel className="h-4 w-4 text-muted-foreground" />{" "}
                <span className="text-muted-foreground">EVM Gas:</span> 7500
                Gwei
              </div>
              <div className="hidden max-w-2xl grow lg:block">
                <MainSearch />
              </div>
            </div>
          </div>
        </div>
        <div className="container flex items-center justify-between gap-4 space-x-4 pt-0 sm:space-x-0 lg:pt-4">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/site-logos/rootscan-logo.png"
              width={190}
              height={190}
              unoptimized
              className="h-8 w-8 rounded-lg"
              alt="rootscan_logo"
            />
            <span className="text-md font-bold">rootscan</span>
            <TestnetWarning>
              <Badge>Porcini Testnet</Badge>
            </TestnetWarning>
          </Link>
          <Navigation />
        </div>
      </header>
    </Fragment>
  )
}
