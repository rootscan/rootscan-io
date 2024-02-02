"use client"

import { fromNow } from "@/lib/date-utils"
import Tooltip from "./tooltip"
import { Skeleton } from "./ui/skeleton"
import { Suspense } from "react"

export default function TimeAgoDate({ date }) {
  return (
    <Suspense fallback={<Skeleton className="h-5 w-24" />}>
      <Tooltip text={new Date(date)?.toUTCString()}>{fromNow(date)}</Tooltip>
    </Suspense>
  )
}
