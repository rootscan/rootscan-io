"use client"

import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { ArrowLeftToLine, Blocks } from "lucide-react"
import { useState } from "react"

export default function InputData({
  input,
  transaction,
}: {
  input: string
  transaction: any
}) {
  const [decode, setDecode] = useState<boolean>(false)
  return (
    <div className="flex flex-col gap-4">
      {decode ? (
        <div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Value</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transaction?.functionData?.inputs.map((item, _) => (
                <TableRow key={_}>
                  <TableCell>{item?.name}</TableCell>
                  <TableCell>{item?.type}</TableCell>
                  <TableCell>
                    {typeof transaction?.functionData?.args?.[item?.name] !==
                    undefined
                      ? String(transaction?.functionData?.args?.[item?.name])
                      : ""}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="truncate rounded-2xl bg-primary/5">
          <p className="whitespace-pre-line p-2">
            {transaction?.functionData?.signature
              ? `Function: ${transaction?.functionData?.signature} \n\n`
              : ""}
            {input}
          </p>
        </div>
      )}

      <div className="flex items-center gap-2">
        {decode ? (
          <Button
            size="sm"
            onClick={() => setDecode(!decode)}
            className="flex items-center gap-1"
          >
            <ArrowLeftToLine /> Switch Back
          </Button>
        ) : (
          <Button
            size="sm"
            onClick={() => setDecode(!decode)}
            className="flex items-center gap-1"
            disabled={
              !transaction?.functionData ||
              Object.keys(transaction?.functionData?.args)?.length === 0
            }
          >
            <Blocks /> Decode Input Data
          </Button>
        )}
      </div>
    </div>
  )
}
