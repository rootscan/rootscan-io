"use client"

import { Undo } from "lucide-react"
import { useState } from "react"
export default function ExtrinsicIdDisplay({ extrinsicId, retroExtrinsicId }) {
  const [retro, setRetro] = useState<boolean>(false)
  return (
    <div className="flex items-center gap-2 ">
      {retro ? <span>{retroExtrinsicId}</span> : <span>{extrinsicId}</span>}

      <Undo onClick={() => setRetro(!retro)} className="cursor-pointer" />
    </div>
  )
}
