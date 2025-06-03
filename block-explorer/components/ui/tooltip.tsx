import * as React from 'react';

import { cn } from '@/lib/utils';
import * as TooltipPrimitive from '@radix-ui/react-tooltip';

const TooltipProvider = TooltipPrimitive.Provider;

const Tooltip = TooltipPrimitive.Root;

const TooltipTrigger = TooltipPrimitive.Trigger;

const TooltipContent = React.forwardRef<
  React.ElementRef<typeof TooltipPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>
>(({ className, sideOffset = -4, children, ...props }, ref) => (
  <TooltipPrimitive.Content
    ref={ref}
    sideOffset={sideOffset}
    className={cn(
      'bg-surface-hover text-text-light animate-in fade-in-0 zoom-in-95 z-50 w-fit origin-(--radix-tooltip-content-transform-origin) rounded-[8px] px-3 py-2 text-xs text-balance',
      'data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95',
      'data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2',
      className,
    )}
    {...props}
  >
    {children}
    <div className="[&>span]:z-[-1]">
      <TooltipPrimitive.Arrow className="z-10 size-4 translate-y-[calc(-50%_-_2px)] rotate-45 rounded-[2px] bg-surface-hover fill-surface-hover" />
    </div>
  </TooltipPrimitive.Content>
));
TooltipContent.displayName = TooltipPrimitive.Content.displayName;

export { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger };
