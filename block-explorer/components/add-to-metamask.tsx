"use client"
import { root } from "@/lib/viem-client"
import Image from "next/image"
import { createWalletClient, custom } from "viem"
import { Button } from "./ui/button"

export default function AddToMetamask() {
  let walletClient

  if (typeof window !== "undefined") {
    if (window.hasOwnProperty("ethereum")) {
      walletClient = createWalletClient({
        chain: root,
        // @ts-ignore
        transport: custom(window?.ethereum),
      })
    }
  }

  const add = async () => {
    try {
      await walletClient?.addChain({ chain: root })
    } catch {}
  }
  return (
    <Button size="sm" variant="default" onClick={() => add()}>
      <Image
        src="/site-logos/metamask_logo.webp"
        width={50}
        height={50}
        unoptimized
        className="mr-2 size-5"
        alt="metamask_logo"
      />
      Add to Metamask
    </Button>
  )
}
