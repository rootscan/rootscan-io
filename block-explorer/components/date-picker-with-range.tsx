'use client';

import * as React from 'react';
import { DateRange } from 'react-day-picker';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { format, subDays } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';
import moment from 'moment';

export function DatePickerWithRange({ className, onChange }: React.HTMLAttributes<HTMLDivElement> & { onChange: any }) {
  const [date, setDate] = React.useState<DateRange | undefined>({
    from: subDays(new Date(), 31),
    to: new Date(),
  });

  React.useEffect(() => {
    onChange(date);
  }, []);

  React.useEffect(() => {
    onChange(date);
  }, [date]);
  return (
    <div className={cn('grid gap-2', className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={'outline'}
            className={cn('w-[300px] justify-start text-left font-normal', !date && 'text-muted-foreground')}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, 'LLL dd, y')} - {format(date.to, 'LLL dd, y')}
                </>
              ) : (
                format(date.from, 'LLL dd, y')
              )
            ) : (
              <span>Pick a date</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={setDate}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>
      <div className="flex items-center gap-2">
        <Button
          size="sm"
          variant="outline"
          onClick={() => {
            setDate({
              from: moment().subtract(1, 'month').toDate(),
              to: moment().toDate(),
            });
          }}
        >
          1 month
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={() => {
            setDate({
              from: moment().subtract(6, 'months').toDate(),
              to: moment().toDate(),
            });
          }}
        >
          6 months
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={() => {
            setDate({
              from: moment().subtract(12, 'months').toDate(),
              to: moment().toDate(),
            });
          }}
        >
          1 year
        </Button>
      </div>
    </div>
  );
}
