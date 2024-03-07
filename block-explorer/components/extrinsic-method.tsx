import { camelCaseToWords } from "@/lib/utils"
import { ChevronDown } from "lucide-react"
import { Fragment } from "react"
import { Badge } from "./ui/badge"

export default function ExtrinsicMethod({ tx, hideExtrinsic = false }) {
  return (
    <div className="flex flex-col gap-1">
      {!hideExtrinsic &&
      tx?.extrinsicData?.section &&
      tx?.extrinsicData?.method ? (
        <Fragment>
          <div>
            <Badge>
              {camelCaseToWords(tx?.extrinsicData?.section)}{" "}
              {camelCaseToWords(tx?.extrinsicData?.method)}
            </Badge>
          </div>
          <ChevronDown className="size-4 text-muted-foreground" />
        </Fragment>
      ) : null}
      <div>
        <Badge>
          {camelCaseToWords(tx?.section)} {camelCaseToWords(tx?.method)}
        </Badge>
      </div>
    </div>
  )
}
