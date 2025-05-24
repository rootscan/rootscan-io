import * as React from 'react';

import { cn } from '@/lib/utils';

export default function Container({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn(['flex-auto bg-transparent', className ? className : ''])}>
      <div className="container p-4 lg:px-8">{children}</div>
    </div>
  );
}

export function ContainerV2({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('container px-4 md:px-6 xl:px-14 lg:px-8', className)} {...props} />
  );
}
