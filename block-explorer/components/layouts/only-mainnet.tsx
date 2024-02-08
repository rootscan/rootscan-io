"use server"

import { CHAIN_ID } from "@/lib/viem-client"
import { Fragment, ReactNode } from "react"

// @ts-ignore
export default async function OnlyMainnet({
  children,
  fallback,
}: {
  children: ReactNode
  fallback?: ReactNode
}) {
  if (Number(CHAIN_ID) !== 7668) return fallback ? fallback : <Fragment />

  return <Fragment>{children}</Fragment>
}
