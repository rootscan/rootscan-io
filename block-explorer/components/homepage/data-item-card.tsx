'use client';

import { ReactNode, useState } from 'react';

import { Button } from '@/components/ui/button.tsx';
import { CardContent } from '@/components/ui/v2/card.tsx';
import Tooltip from '@/components/tooltip';
import { cn } from '@/lib/utils.ts';
import { RiArrowDownSLine } from '@remixicon/react';

type DataItemCardProps = {
  iconSrc: string;
  children: ReactNode;
  summary: Array<[string, string | number | ReactNode]>;
};
export const DataItemCard = (props: DataItemCardProps) => {
  const { iconSrc, summary, children } = props;

  const [openSummary, setOpenSummary] = useState(false);

  return (
    <CardContent className="relative flex flex-col gap-3 pl-6 lg:flex-row lg:items-center lg:gap-6">
      <Button
        variant="secondary"
        size="sm"
        className={cn('lg:hidden absolute h-6 right-[16px] top-[18px] p-1', openSummary && 'rotate-180')}
        onClick={() => setOpenSummary((prev) => !prev)}
      >
        <RiArrowDownSLine className="size-4" />
      </Button>
      <div className="flex flex-1 items-center gap-4">
        <div className="shrink-0 rounded-[12px] bg-[#F5F5F5] p-3 dark:bg-[#1C1C1C]">
          <img src={iconSrc} alt="" className="size-10" />
        </div>
        <div className="flex flex-col">{children}</div>
      </div>
      <div
        className={cn(
          'hidden min-w-[200px] flex-col gap-1 rounded-[12px] border border-[#F1F1F1] p-3 dark:border-[#1C1C1C] lg:flex',
          openSummary && 'flex',
        )}
      >
        {summary.map(([label, value], i) => (
          <div key={i} className="flex items-center justify-between gap-4">
            <p className="shrink-0 text-xs text-[#737373]">{label}</p>
            {typeof value === 'string' || typeof value === 'number' ? (
              <Tooltip text={String(value)}>
                <p className="min-w-0 truncate text-xs font-semibold">{value}</p>
              </Tooltip>
            ) : (
              <div className="min-w-0 truncate">{value}</div>
            )}
          </div>
        ))}
      </div>
    </CardContent>
  );
};
