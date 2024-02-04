"use client"

import { getAddressName } from "@/lib/constants/knownAddresses"
import { cn } from "@/lib/utils"
import { FileText } from "lucide-react"
import Link from "next/link"
import { Address, isAddress } from "viem"
import { CopyButton } from "./copy-button"
import Logo from "./logo"
import Tooltip from "./tooltip"
export default function AddressDisplay({
  address,
  nameTag,
  rnsName,
  isContract = false,
  hideCopyButton,
  useShortenedAddress = false,
  className,
}: {
  address: Address
  nameTag?: string
  rnsName?: string
  isContract?: boolean
  hideCopyButton?: boolean
  useShortenedAddress?: boolean
  className?: string
}) {
  if (!address || !isAddress(address)) return null
  const name = rnsName
    ? rnsName
    : nameTag
      ? nameTag
      : getAddressName(address, useShortenedAddress)

  const isFuturepass = address?.toLowerCase()?.startsWith("0xffffffff")

  return (
    <div
      className={cn(["flex items-center gap-2", className ? className : ""])}
    >
      {isContract ? (
        <Tooltip text="EVM Contract" asChild>
          <FileText className="size-4 text-muted-foreground" />
        </Tooltip>
      ) : null}
      {isFuturepass ? (
        <Tooltip text="Futurepass" asChild>
          <Logo className="size-4" />
        </Tooltip>
      ) : null}
      <Tooltip text={address} disabled={!useShortenedAddress} asChild>
        <Link href={`/addresses/${address}`}>{name}</Link>
      </Tooltip>
      {!hideCopyButton || !address ? <CopyButton value={address} /> : null}
    </div>
  )
}
