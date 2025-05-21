'use client';

import { RiFileCopyLine, RiCheckLine } from '@remixicon/react'
import * as React from 'react';

import { cn } from '@/lib/utils';

const copyToClipboardWithMeta = async (value: string) => {
  navigator.clipboard.writeText(value);
};

export const CopyButton = ({ value, className, ...props }: { value: string; className?: string }) => {
  const [hasCopied, setHasCopied] = React.useState(false);

  React.useEffect(() => {
    setTimeout(() => {
      setHasCopied(false);
    }, 2000);
  }, [hasCopied]);

  return (
    <div
      className={cn(
        'text-muted-foreground relative z-10 inline-flex cursor-pointer items-center justify-center rounded-md border-neutral-200 text-sm font-medium transition-all focus:outline-none',
        className,
      )}
      {...props}
    >
      {hasCopied ? (
        <RiCheckLine className="size-3.5" />
      ) : (
        <RiFileCopyLine
          className="size-3.5"
          onClick={() => {
            copyToClipboardWithMeta(value);
            setHasCopied(true);
          }}
        />
      )}
    </div>
  );
};
