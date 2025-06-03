'use client';

import * as React from 'react';
import { DateRange } from 'react-day-picker';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { RiCalendarLine } from '@remixicon/react';
import { format, subDays } from 'date-fns';
import moment from 'moment';

interface DatePickerWithRangeProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
  onChange: (date: DateRange | undefined) => void;
}

export function DatePickerWithRange(props: DatePickerWithRangeProps) {
  const { className, onChange } = props;

  const presets = [
    [1, '1 month'],
    [6, '6 months'],
    [12, '1 year'],
  ];

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
    <div className={cn('flex gap-2 items-center', className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant="outline"
            className={cn(
              'border border-border-secondary max-w-[320px] justify-start text-left font-normal w-full',
              !date && 'text-muted-foreground',
            )}
          >
            <RiCalendarLine className="mr-2 size-4" />
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
      {presets.map(([months, label], _) => (
        <Button
          key={_}
          variant="secondary"
          onClick={() => {
            setDate({
              from: moment().subtract(months, 'months').toDate(),
              to: moment().toDate(),
            });
          }}
        >
          {label}
        </Button>
      ))}
    </div>
  );
}
