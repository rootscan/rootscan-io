"use client"

import { fromNow } from "@/lib/date-utils"
import { Suspense } from "react"
import Tooltip from "./tooltip"
import { Skeleton } from "./ui/skeleton"

export default function TimeAgoDate({ date }) {
  return (
    <Suspense fallback={<Skeleton className="h-5 w-24" />}>
      <Tooltip text={new Date(date)?.toUTCString()} asChild>
        <span>{fromNow(date)}</span>
      </Tooltip>
    </Suspense>
  )
}
