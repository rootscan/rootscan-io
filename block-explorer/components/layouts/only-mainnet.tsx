import { CHAIN_ID } from "@/lib/viem-client"

export default function OnlyMainnet({ children, fallback }) {
  if (Number(CHAIN_ID) !== 7668) return fallback ? fallback : null

  return children
}
