"use client"

import { AppProgressBar as ProgressBar } from "next-nprogress-bar"
import { Fragment, Suspense } from "react"

export default function ClientProgressBar() {
  return (
    <Suspense fallback={<Fragment/>}>
      <ProgressBar
        height="4px"
        color={"#ffff"}
        options={{ showSpinner: true }}
        shallowRouting
      />
    </Suspense>
  )
}
