"use client"
import { CornerDownLeft, Search } from "lucide-react"
import {ChangeEvent, useState} from "react"
import { Input } from "./ui/input"
import {performSearchMainSearch} from "@/lib/helpers";

export default function MainSearch() {
  const [value, setValue] = useState('')

  const handlePress = async (e: any) => {
    if (e?.key === "Enter") {
      await performSearchMainSearch(value)
    }
  }

  const handleChangeValue = (e: ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value)
  }

  return (
    <div className="relative">
      <Search className="text-muted-foreground absolute left-2.5 top-2.5 -z-10 size-5" />
      <Input
        onChange={handleChangeValue}
        placeholder="Search by address / txn hash / block..."
        onKeyDown={handlePress}
        className="px-10"
      />
      <CornerDownLeft className="text-muted-foreground absolute right-2.5 top-2.5 -z-10 m-auto size-5" />
    </div>
  );
}
