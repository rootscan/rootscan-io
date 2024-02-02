"use client"

import { useEffect, useState } from "react"

export default function TargetTimeCountdown({
  fromSeconds = 4,
}: {
  fromSeconds?: number
}) {
  const [count, setCount] = useState<number>(fromSeconds)

  useEffect(() => {
    const interval = setInterval(() => {
      setCount(count - 0.1 > 0 ? Number(count - 0.1) : fromSeconds)
    }, 100)

    return () => clearInterval(interval)
  }, [count])

  return (
    <div className="flex items-center gap-4">
      {count.toFixed(1)}s{" "}
      {count <= 0.5 ? (
        <div className="size-1 animate-ping rounded-full bg-green-500/70" />
      ) : null}
    </div>
  )
}
