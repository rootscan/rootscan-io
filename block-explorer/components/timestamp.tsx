import { fromNow } from "@/lib/date-utils"

export default function Timestamp({ date }: { date: number | Date }) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span>{date ? new Date(date).toUTCString() : ""}</span>
      <span className="hidden text-muted-foreground lg:block">•</span>
      <span className="text-muted-foreground">
        {date ? fromNow(date) : "-"}
      </span>
    </div>
  )
}
