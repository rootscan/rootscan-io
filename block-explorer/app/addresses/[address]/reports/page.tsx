'use client';

import { use, useState } from 'react';
import { DateRange } from 'react-day-picker';

import { DatePickerWithRange } from '@/components/date-picker-with-range';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { RiCloseLine, RiInformationLine } from '@remixicon/react';
import Link from 'next/link';

export default function Page({ params }: { params: Promise<{ address: string }> }) {
  const resolvedParams = use(params);

  const [date, setDate] = useState<DateRange>({ from: undefined, to: undefined });
  const [showAlert, setShowAlert] = useState(true);

  return (
    <Card>
      <CardContent className="flex flex-col gap-5 rounded-[16px] p-6">
        <h2 className="text-[24px]/[32px] font-semibold">Reports</h2>
        <p className="text-sm">
          You are able to export your transaction history in CSV format for a certain date range.
        </p>
        {showAlert && (
          <div className="flex w-fit items-center gap-3 rounded-[8px] border border-border-info bg-surface-alert p-4">
            <RiInformationLine className="size-5 text-text-info-primary" />
            <p className="text-sm font-semibold">
              Please note: If you have a large transaction history for the selected date range, it will take longer to
              generate the reports.
            </p>
            <RiCloseLine className="size-5 cursor-pointer" onClick={() => setShowAlert(false)} />
          </div>
        )}
        <DatePickerWithRange onChange={(d) => typeof d !== 'undefined' && setDate(d)} />
        {date?.from && date?.to ? (
          <div>
            <Link
              href={`/api/report?from=${new Date(date.from).toISOString()}&to=${new Date(
                date.to,
              ).toISOString()}&address=${resolvedParams.address}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button>Download</Button>
            </Link>
          </div>
        ) : (
          <Button disabled>Download</Button>
        )}
      </CardContent>
    </Card>
  );
}
