import * as React from 'react';

import PaginationSuspense from '@/components/pagination-suspense.tsx';
import { cn } from '@/lib/utils.ts';
import { PaginationResponse } from '@/types/api-types.ts';

interface TableNavigationProps extends React.HTMLAttributes<HTMLDivElement> {
  pagination?: Omit<PaginationResponse<unknown>, 'docs'>;
}
export const TableNavigation = React.forwardRef<HTMLDivElement, TableNavigationProps>(
  ({ className, children, pagination, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('flex flex-wrap md:flex-nowrap gap-4 md:items-center py-4 px-5', className)}
      {...props}
    >
      {children}
      <div className="flex-1" />
      {!!pagination && (
        <div className="flex items-center gap-1">
          <PaginationSuspense pagination={pagination} />
        </div>
      )}
    </div>
  ),
);
TableNavigation.displayName = 'TableNavigation';
