import { cn } from "@/lib/utils"

export default function GasUsage({
  gasUsed,
  gasLimit,
  onlyBar,
}: {
  gasUsed: number
  gasLimit: number
  onlyBar?: boolean
}) {
  const randomWidth = Math.round((Number(gasUsed) / Number(gasLimit)) * 100)
  return (
    <div>
      {!onlyBar ? (
        <div className="flex items-center gap-2">
          <div>{gasUsed}</div>
          <div className="text-xs text-muted-foreground">{randomWidth}%</div>
        </div>
      ) : null}
      <div className="relative h-1 bg-white/20">
        <div
          className={cn([
            "absolute left-0 h-1 bg-white duration-300 animate-in fade-in-0",
            `w-[${randomWidth}%]`,
          ])}
        />
      </div>
    </div>
  )
}
