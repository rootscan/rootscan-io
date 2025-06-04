import * as React from 'react';
import { createContext, useContext } from 'react';

import { cn } from '@/lib/utils';
import * as TabsPrimitive from '@radix-ui/react-tabs';
import { cva } from 'class-variance-authority';

type TabsContextValue = {
  size: 'md' | 'sm';
  variant: 'pill' | 'underline';
};
const TabsContext = createContext<TabsContextValue>({
  size: 'md',
  variant: 'pill',
});

interface TabsProps extends React.ComponentPropsWithoutRef<typeof TabsPrimitive.Tabs> {
  size?: TabsContextValue['size'];
  variant?: TabsContextValue['variant'];
}
const Tabs = React.forwardRef<React.ElementRef<typeof TabsPrimitive.Tabs>, TabsProps>(
  ({ size = 'md', variant = 'pill', ...props }, ref) => (
    <TabsContext.Provider value={{ size, variant }}>
      <TabsPrimitive.Root ref={ref} {...props} />
    </TabsContext.Provider>
  ),
);
Tabs.displayName = 'Tabs';

const TabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    className={cn('gap-2 inline-flex items-center overflow-x-auto scrollbar-hide flex-nowrap w-full', className)}
    {...props}
  />
));
TabsList.displayName = TabsPrimitive.List.displayName;

const tabsTriggerVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap font-semibold text-text-secondary transition-all hover:text-foreground focus-visible:outline-none disabled:pointer-events-none',
  {
    variants: {
      size: {
        md: 'text-sm',
        sm: 'text-xs',
      },
      variant: {
        pill: 'gap-2 rounded-[8px] bg-surface-button2 px-3 data-[state=active]:bg-surface-primary data-[state=active]:text-text-light',
        underline:
          'border-b-2 border-transparent pb-2.5 data-[state=active]:border-b-text-foreground data-[state=active]:text-foreground',
      },
    },
    compoundVariants: [
      {
        variant: 'pill',
        size: 'md',
        className: 'py-2.5',
      },
      {
        variant: 'pill',
        size: 'sm',
        className: 'py-2',
      },
    ],
    defaultVariants: {
      size: 'md',
      variant: 'pill',
    },
  },
);

const TabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
>(({ className, ...props }, ref) => {
  const { size, variant } = useContext(TabsContext);

  return (
    <TabsPrimitive.Trigger ref={ref} className={cn(tabsTriggerVariants({ size, variant, className }))} {...props} />
  );
});
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName;

const TabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => <TabsPrimitive.Content ref={ref} className={cn('', className)} {...props} />);
TabsContent.displayName = TabsPrimitive.Content.displayName;

export { Tabs, TabsList, TabsTrigger, TabsContent };
