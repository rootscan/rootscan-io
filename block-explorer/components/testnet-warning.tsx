"use server"

import { CHAIN_ID } from "@/lib/viem-client"
import { Fragment, ReactNode } from "react"

export default async function TestnetWarning({
  children,
}: {
  children: ReactNode
}) {
  if (Number(CHAIN_ID) === 7668) return null

  return <Fragment>{children}</Fragment>
}
