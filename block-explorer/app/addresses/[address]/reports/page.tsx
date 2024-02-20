"use client"
import { DatePickerWithRange } from "@/components/date-picker-with-range"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

export default function Page({ params }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Reports</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4">
          <p className="text-muted-foreground">
            You are able to export your transaction history in CSV format for a
            certain date range.
          </p>
          <p className="text-muted-foreground">
            Please note: If you have a large transaction history for the
            selected date range, it will take longer to generate the reports.
          </p>
          <div className="flex flex-col gap-2">
            <label className="text-sm">Date Range</label>
            <DatePickerWithRange />
          </div>
          <div>
            <Link
              href="/api/report?from=25-05-2022"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button>Download</Button>
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
