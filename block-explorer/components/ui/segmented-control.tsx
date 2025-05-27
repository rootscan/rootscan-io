import * as React from 'react';
import { useContext } from 'react';

import { cn } from '@/lib/utils';
import * as TabsPrimitive from '@radix-ui/react-tabs';
import { type VariantProps, cva } from 'class-variance-authority';

type SegmentedControlContextValue = {
  size: 'md' | 'sm';
};
const SegmentedControlContext = React.createContext<SegmentedControlContextValue>({
  size: 'md',
});

interface SegmentedControlProps extends React.ComponentPropsWithoutRef<typeof TabsPrimitive.Tabs> {
  size?: SegmentedControlContextValue['size'];
}
const SegmentedControl = React.forwardRef<React.ElementRef<typeof TabsPrimitive.Tabs>, SegmentedControlProps>(
  ({ size = 'md', ...props }, ref) => (
    <SegmentedControlContext.Provider value={{ size }}>
      <TabsPrimitive.Root ref={ref} {...props} />
    </SegmentedControlContext.Provider>
  ),
);
SegmentedControl.displayName = 'SegmentedControl';

interface SegmentedControlListProps
  extends Omit<React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>, 'defaultValue'> {}
const SegmentedControlList = React.forwardRef<React.ElementRef<typeof TabsPrimitive.List>, SegmentedControlListProps>(
  ({ className, ...props }, ref) => {
    return (
      <TabsPrimitive.List
        ref={ref}
        className={cn(
          'bg-[#F5F5F5] dark:bg-[#1c1c1c] inline-flex gap-1 items-center justify-center rounded-[10px] p-1',
          className,
        )}
        {...props}
      />
    );
  },
);
SegmentedControlList.displayName = 'SegmentedControlList';

const segmentedControlTriggerVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-[6px] font-semibold text-[#737373] ring-offset-background transition-all hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm dark:text-[#999999] dark:hover:text-foreground dark:data-[state=active]:text-foreground',
  {
    variants: {
      size: {
        md: 'h-8 gap-2 px-4 py-1.5 text-[14px]/[20px] [&>svg]:size-[18px]',
        sm: 'h-6 gap-1.5 px-3 py-1 text-[12px]/[16px] [&>svg]:size-[16px]',
      },
      icon: {
        none: '',
        left: '',
        only: '',
      },
    },
    compoundVariants: [
      {
        size: 'md',
        icon: 'left',
        className: 'pl-2.5',
      },
      {
        size: 'md',
        icon: 'only',
        className: 'px-[7px]',
      },
      {
        size: 'sm',
        icon: 'left',
        className: 'pl-2',
      },
      {
        size: 'sm',
        icon: 'only',
        className: 'px-1',
      },
    ],
    defaultVariants: {
      size: 'md',
    },
  },
);

interface SegmentedControlTriggerProps
  extends React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>,
    Omit<VariantProps<typeof segmentedControlTriggerVariants>, 'icon'> {
  icon?: React.ReactElement;
}
const SegmentedControlTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  SegmentedControlTriggerProps
>(({ className, icon, children, ...props }, ref) => {
  const { size } = useContext(SegmentedControlContext);

  return (
    <TabsPrimitive.Trigger
      ref={ref}
      className={cn(
        segmentedControlTriggerVariants({
          size,
          icon: !!icon && !!children ? 'left' : !!icon && !children ? 'only' : 'none',
          className,
        }),
      )}
      {...props}
    >
      {icon}
      {children}
    </TabsPrimitive.Trigger>
  );
});
SegmentedControlTrigger.displayName = 'SegmentedControlTrigger';

export { SegmentedControl, SegmentedControlList, SegmentedControlTrigger };
