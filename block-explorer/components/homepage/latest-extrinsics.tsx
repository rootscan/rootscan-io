"use client"

import { FunctionSquare } from "lucide-react"
import Link from "next/link"

import SectionTitle from "@/components/section-title"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import AddressDisplay from "../address-display"

export default function LatestExtrinsics({
  latestExtrinsics,
}: {
  latestExtrinsics: any
}) {
  return (
    <div className="flex flex-col gap-4">
      <SectionTitle>Latest Extrinsics</SectionTitle>
      <div className="group flex flex-col gap-4">
        {latestExtrinsics?.map((extrinsic: any, _: number) => (
          <Card
            key={extrinsic?.extrinsicId}
            // className={cn([_ === 0 && "duration-300 animate-in fade-in"])}
          >
            <CardHeader>
              <CardTitle>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <FunctionSquare className="text-muted-foreground" />
                    <Link href={`/extrinsics/${extrinsic?.extrinsicId}`}>
                      <span>{extrinsic?.extrinsicId}</span>
                    </Link>
                  </div>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-4">
                <div className="flex flex-row justify-between">
                  <div className="flex gap-2 truncate">
                    <span className="text-muted-foreground">Pallet</span>
                    <span className="truncate">{extrinsic?.section}</span>
                  </div>
                </div>
                <div className="flex flex-row justify-between">
                  <div className="flex gap-2 truncate">
                    <span className="text-muted-foreground">Method</span>
                    <span className="truncate">{extrinsic?.method}</span>
                  </div>
                </div>
                {extrinsic?.signer ? (
                  <div className="flex gap-2">
                    <span className="text-muted-foreground">Signer</span>
                    <AddressDisplay
                      address={extrinsic?.signer}
                      useShortenedAddress
                    />
                  </div>
                ) : null}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      <Link href="/extrinsics" className="text-center">
        <span className="text-sm font-medium text-primary/80 hover:text-primary">
          View all Extrinsics
        </span>
      </Link>
    </div>
  )
}
