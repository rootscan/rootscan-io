"use client"

import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card"
import { QrCodeIcon } from "lucide-react"
import { useQRCode } from "next-qrcode"
import { Address, getAddress } from "viem"
export default function QrCode({ address }: { address: Address }) {
  const { Canvas } = useQRCode()

  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <div
          className={
            "relative z-10 inline-flex cursor-pointer items-center justify-center rounded-md border-neutral-200 text-sm font-medium text-muted-foreground transition-all focus:outline-none"
          }
        >
          <QrCodeIcon className="size-5" />
        </div>
      </HoverCardTrigger>
      <HoverCardContent className="w-full">
        <Canvas
          text={getAddress(address)}
          options={{
            errorCorrectionLevel: "M",
            margin: 3,
            scale: 4,
            width: 150,
            color: {
              dark: "#0000",
              light: "#FFFF",
            },
          }}
        />
      </HoverCardContent>
    </HoverCard>
  )
}
