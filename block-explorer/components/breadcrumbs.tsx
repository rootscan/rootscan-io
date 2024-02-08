"use client"

import { getShortenedHash } from "@/lib/constants/knownAddresses"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Fragment } from "react"
import { isAddress } from "viem"

export default function Breadcrumbs() {
  const path = usePathname()
  const paths = path.split("/").filter((a) => a != "")

  const remaps: any = {
    "/tx": "/evm-transactions",
    "/token": "/tokens"
  }

  return (
    <div className="flex max-w-full select-none flex-wrap gap-2 text-xs text-muted-foreground">
      <Link href="/" className="duration-300 ease-in-out hover:text-primary">
        <span>Home</span>
      </Link>
      {paths.map((item, _) => {
        let href = `/${paths.slice(0, _ + 1).join("/")}`
        return (
          <Fragment key={_}>
            <span>/</span>
            <Link
              href={remaps[href] || href}
              className={cn([
                "duration-300 ease-in-out hover:text-primary",
                _ === paths?.length - 1 ? "truncate" : "",
              ])}
            >
              <span className="capitalize">
                {isAddress(item) || item?.startsWith("0x")
                  ? getShortenedHash(item)
                  : paths.includes('extrinsics') || paths.includes('events') ? item : item?.replaceAll("-", " ")}
              </span>
            </Link>
          </Fragment>
        )
      })}
    </div>
  )
}
