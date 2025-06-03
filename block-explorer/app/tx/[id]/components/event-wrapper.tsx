import React from 'react';

import { Badge } from '@/components/ui/badge.tsx';
import { cn } from '@/lib/utils.ts';

interface EventWrapper extends React.HTMLAttributes<HTMLDivElement> {
  tag: string;
}
export function EventWrapper({ tag, className, children, ...props }: EventWrapper) {
  return (
    <div
      className={cn('bg-surface-bg flex gap-1 items-center p-4 rounded-[12px] truncate md:flex-nowrap', className)}
      {...props}
    >
      <Badge type="linear" color="grey">
        {tag}
      </Badge>
      {children}
    </div>
  );
}
