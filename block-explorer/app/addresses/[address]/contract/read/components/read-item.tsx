'use client';

import { useState } from 'react';

import { AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { isRootChain, porciniClient, rootClient } from '@/lib/viem-client';
import { useMutation } from '@tanstack/react-query';
import { CornerLeftUp, Loader2 } from 'lucide-react';

export default function ReadItem({ abi, item, devDoc, index, address, chainId }) {
  const [args, setArgs] = useState<string[]>(Array(item?.inputs?.length));
  const devDocKey = `${item?.name}(${item?.inputs?.map((a) => `${a.type}`)})`;
  const currentDevDoc = devDoc[devDocKey];

  const client = isRootChain(chainId) ? rootClient : porciniClient;
  const updateArgsIndex = (index, value) => {
    const newArgs = structuredClone(args);
    newArgs[index] = value;
    setArgs(newArgs);
  };

  const mutation = useMutation({
    mutationFn: () =>
      client.readContract({
        address,
        abi,
        functionName: item?.name,
        args,
      }),
    mutationKey: [item.name, address],
  });

  return (
    <AccordionItem value={`field_${index}`}>
      <AccordionTrigger>
        {index + 1}. {item?.name}
      </AccordionTrigger>
      <AccordionContent>
        <div className="flex flex-col gap-4">
          {currentDevDoc ? <span className="text-xs">@dev: {currentDevDoc?.details}</span> : null}
          {item?.inputs.map((input, k) => (
            <div key={`input_${index}_${k}`} className="flex max-w-md flex-col gap-2">
              <span className="font-mono text-xs">
                {input?.name} ({input?.type})
              </span>
              <Input
                placeholder={`${input?.name} (${input?.type})`}
                onChange={({ target }) => updateArgsIndex(k, target?.value)}
              />
            </div>
          ))}
          <Button className="max-w-16" size="sm" onClick={() => mutation.mutateAsync()} disabled={mutation?.isPending}>
            {mutation?.isPending ? <Loader2 className="size-4 animate-spin" /> : 'Read'}
          </Button>
          {mutation?.data !== undefined ? (
            <div className="flex flex-col gap-1">
              <span className="text-muted-foreground">Result</span>
              <span>{String(mutation?.data)}</span>
            </div>
          ) : null}
          {item?.outputs?.length && !mutation?.error ? (
            <div className="text-muted-foreground flex items-center gap-2 text-xs italic">
              <CornerLeftUp className="size-4" />
              <div className="flex items-center gap-2">
                {item?.outputs?.map((x) => `${x.name} ${x.type}`).join(',')}
              </div>
            </div>
          ) : null}
          {mutation?.error ? <span className="text-xs text-red-500">Error: {String(mutation?.error)}</span> : null}
        </div>
      </AccordionContent>
    </AccordionItem>
  );
}
