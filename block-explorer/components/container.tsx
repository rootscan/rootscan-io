import * as React from 'react';

import { cn } from '@/lib/utils';

export default function Container({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('container py-6 xl:pt-8 xl:pb-14', className)} {...props} />;
}
