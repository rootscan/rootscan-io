"use client"

import { cn } from "@/lib/utils"
import { MenuIcon, XIcon } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Fragment, useState } from "react"
import { Card, CardContent, CardHeader } from "./ui/card"

const items = [
  { title: "Blocks", href: "/blocks" },
  { title: "Extrinsics", href: "/extrinsics" },
  { title: "Events", href: "/events" },
  { title: "EVM Transactions", href: "/evm-transactions" },
  { title: "Addresses", href: "/addresses" },
  { title: "Bridge", href: "/bridge" },
  { title: "Tokens", href: "/tokens" },
  { title: "DEX", href: "/dex" },
  { title: "Staking", href: "/staking" },
  { title: "Verified Contracts", href: "/verified-contracts" },
]

export function Navigation() {
  const pathname = usePathname()
  const formattedPathname = pathname?.split("/", 2)?.join("/")

  return (
    <Fragment>
      <div className="hidden items-center gap-4 px-4 lg:flex">
        {items.map((item, _) => (
          <Link href={item.href} key={_}>
            <div
              className={cn([
                "text-sm font-bold text-muted-foreground duration-150 ease-in hover:text-primary",
                formattedPathname === item.href ? "text-primary" : "",
              ])}
            >
              {item.title}
            </div>
          </Link>
        ))}
      </div>
      <MobileMenu />
    </Fragment>
  )
}

export const MobileMenu = () => {
  const [open, setOpen] = useState<boolean>(false)

  return (
    <Fragment>
      <div className="block lg:hidden">
        <div
          className="duration-300 animate-in animate-out fade-in fade-out"
          onClick={() => setOpen(!open)}
        >
          {open ? <XIcon /> : <MenuIcon />}
        </div>
      </div>
      <div
        className={cn([
          open
            ? "absolute left-0 top-[64px] !m-0 w-full duration-300 animate-in fade-in"
            : "hidden",
        ])}
      >
        <Card>
          <CardHeader className="pb-0" />
          <CardContent>
            <div className="flex flex-col gap-4">
              {items.map((item, _) => (
                <Link href={item.href} onClick={() => setOpen(false)} key={_}>
                  <div className="text-sm font-bold text-muted-foreground duration-150 ease-in hover:text-primary">
                    {item.title}
                  </div>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </Fragment>
  )
}
