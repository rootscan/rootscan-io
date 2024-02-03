import { CHAIN_ID } from "@/lib/viem-client"
import { ReactNode } from "react"

export default function OnlyMainnet({
  children,
  fallback,
}: {
  children: ReactNode
  fallback?: ReactNode
}) {
  if (Number(CHAIN_ID) !== 7668) return fallback ? fallback : null

  return children
}
