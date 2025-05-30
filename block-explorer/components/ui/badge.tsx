import * as React from 'react';

import { cn } from '@/lib/utils';
import { type VariantProps, cva } from 'class-variance-authority';

const badgeVariants = cva(
  'inline-flex select-none items-center whitespace-nowrap rounded-[6px] px-1.5 text-[9px]/[14px] font-bold uppercase transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
  {
    variants: {
      size: {
        sm: 'h-5 px-[6px] py-[3px]',
        md: 'h-6 px-[8px] py-[5px]',
      },
      color: {
        grey: '',
        green: '',
        orange: '',
        blue: '',
      },
      type: {
        filled: '',
        linear: 'border bg-surface-container',
      },
    },
    compoundVariants: [
      {
        color: 'grey',
        type: 'linear',
        className: 'border-border-primary text-text-foreground',
      },
      {
        color: 'grey',
        type: 'filled',
        className: 'bg-surface-hover-secondary text-text-foreground',
      },
      {
        color: 'green',
        type: 'filled',
        className: 'bg-tag-green-dark text-tag-green-light',
      },
      {
        color: 'orange',
        type: 'filled',
        className: 'bg-tag-orange-dark text-tag-orange-light',
      },
      {
        color: 'blue',
        type: 'filled',
        className: 'bg-tag-blue-dark text-tag-blue-light',
      },
    ],
    defaultVariants: {
      size: 'sm',
      color: 'grey',
      type: 'filled',
    },
  },
);

export interface BadgeProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'color'>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, size, color, type, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ size, color, type }), className)} {...props} />;
}

export { Badge, badgeVariants };
