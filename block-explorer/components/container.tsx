import { cn } from "@/lib/utils"

export default function Container({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <div
      className={cn(["flex-auto bg-transparent", className ? className : ""])}
    >
      <div className="container px-4 py-4 lg:px-8">{children}</div>
    </div>
  )
}
