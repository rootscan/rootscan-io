'use client';

import { ReactNode } from 'react';

import { TooltipContent, Tooltip as TooltipShad, TooltipTrigger } from '@/components/ui/tooltip';

export default function Tooltip({
  children,
  text,
  disabled,
  asChild,
}: {
  children: ReactNode;
  text: string;
  disabled?: boolean;
  asChild?: boolean;
}) {
  if (disabled) {
    return children;
  }
  return (
    <TooltipShad delayDuration={0}>
      <TooltipTrigger asChild={asChild}>{children}</TooltipTrigger>
      <TooltipContent className="!z-20">
        <p className="whitespace-pre-line">{text}</p>
      </TooltipContent>
    </TooltipShad>
  );
}
