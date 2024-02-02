"use client"

import {
  TooltipContent,
  Tooltip as TooltipShad,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { ReactNode } from "react"

export default function Tooltip({
  children,
  text,
  disabled,
}: {
  children: ReactNode
  text: string
  disabled?: boolean
}) {
  if (disabled) {
    return children
  }
  return (
    <TooltipShad delayDuration={0}>
      <TooltipTrigger>{children}</TooltipTrigger>
      <TooltipContent>
        <p className="whitespace-pre-line">{text}</p>
      </TooltipContent>
    </TooltipShad>
  )
}
