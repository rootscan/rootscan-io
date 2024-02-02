import { CHAIN_ID } from "@/lib/viem-client"
import { ReactNode } from "react"

export default function TestnetWarning({ children }: { children: ReactNode }) {
  if (Number(CHAIN_ID) === 7668) return null

  return children
}
