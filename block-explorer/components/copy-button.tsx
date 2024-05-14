'use client';

import * as React from 'react';

import { cn } from '@/lib/utils';
import { Check, Copy } from 'lucide-react';

const copyToClipboardWithMeta = async (value: string) => {
  navigator.clipboard.writeText(value);
};

export const CopyButton = ({ value, className, ...props }: { value?: any; className?: string }) => {
  const [hasCopied, setHasCopied] = React.useState(false);

  React.useEffect(() => {
    setTimeout(() => {
      setHasCopied(false);
    }, 2000);
  }, [hasCopied]);

  return (
    <div
      className={cn(
        'text-muted-foreground relative z-10 ml-1 inline-flex cursor-pointer items-center justify-center rounded-md border-neutral-200 text-sm font-medium transition-all focus:outline-none',
        className,
      )}
      {...props}
    >
      {hasCopied ? (
        <Check className="size-4" />
      ) : (
        <Copy
          className="size-4"
          onClick={() => {
            copyToClipboardWithMeta(value);
            setHasCopied(true);
          }}
        />
      )}
    </div>
  );
};
