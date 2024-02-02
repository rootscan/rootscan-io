"use client"
import { CornerDownLeft, Search } from "lucide-react"
import { useRouter } from "next/navigation"
import { useRef } from "react"
import { isAddress, isHash, isHex } from "viem"
import { Input } from "./ui/input"

export default function MainSearch() {
  const ref = useRef<HTMLInputElement>(null)
  const router = useRouter()

  const handlePress = (e: any) => {
    if (e?.key === "Enter") {
      performSearch()
    }
  }

  const performSearch = () => {
    const value = ref?.current?.value
    if (!value) return
    ref.current.value = ""
    // Is Address
    if (isAddress(value)) {
      return router.push(`/addresses/${value}`)
    }
    // Is Tx Hash
    if (isHash(value) && value?.length == 66) {
      return router.push(`/tx/${value}`)
    }

    if (value?.includes("-")) {
      const splitted = value?.split("-")
      if (splitted?.length === 2) {
        if (!isNaN(Number(splitted[0])) && !isNaN(Number(splitted[1]))) {
          return router.push(`/extrinsics/${value}`)
        }
      }
    }

    // Is Block
    if (Number.isInteger(parseInt(value)) && !isHex(value)) {
      return router.push(`/blocks/${value}`)
    }
  }

  return (
    <div className="relative">
      <Search className="absolute left-2.5 top-2.5 -z-10 size-5 text-muted-foreground" />
      <Input
        ref={ref}
        placeholder="Search by address / txn hash / block..."
        onKeyDown={handlePress}
        className="px-10"
      />
      <CornerDownLeft className="absolute right-2.5 top-2.5 -z-10 m-auto size-5 text-muted-foreground" />
    </div>
  )
}
