'use client';

import { Suspense } from 'react';
import ReactJson from 'react18-json-view';
import 'react18-json-view/src/dark.css';
import 'react18-json-view/src/style.css';

import { cn } from '@/lib/utils.ts';

interface JsonViewer extends Omit<React.HTMLAttributes<HTMLDivElement>, 'children'> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  json: any;
}
export default function JsonViewer({ json, className, ...props }: JsonViewer) {
  return (
    <Suspense fallback={'Loading...'}>
      <div className={cn('overflow-x-auto rounded-lg bg-surface-bg p-2', className)} {...props}>
        <ReactJson src={json} theme="a11y" CopyComponent={() => null} />
      </div>
    </Suspense>
  );
}
