"use client"

import { PlayCircle, StopCircle } from "lucide-react"
import Image from "next/image"
import { useState } from "react"

export default function NftPlayer({ animation_url, image }) {
  const [showVideo, setShowVideo] = useState<boolean>(false)
  return (
    <div className="relative aspect-square">
      {image && animation_url ? (
        <div className="absolute bottom-2.5 right-2.5 z-10">
          {!showVideo ? (
            <PlayCircle
              className="size-10 cursor-pointer"
              onClick={() => setShowVideo(true)}
            />
          ) : (
            <StopCircle
              className="size-10 cursor-pointer"
              onClick={() => setShowVideo(false)}
            />
          )}
        </div>
      ) : null}
      {image && !showVideo ? (
        <Image
          src={image}
          width={300}
          height={300}
          priority
          unoptimized
          className="rounded-sm"
          alt="image"
        />
      ) : showVideo && animation_url ? (
        <video
          loop
          width="100%"
          height="100%"
          className="aspect-square h-full w-full"
          autoPlay
          muted
          playsInline
        >
          <source src={animation_url} />
        </video>
      ) : (
        <div className="grid h-full w-full select-none place-items-center bg-muted text-muted-foreground">
          <div>NFT</div>
        </div>
      )}
    </div>
  )
}
