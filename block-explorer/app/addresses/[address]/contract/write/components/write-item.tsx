'use client';

import { useState } from 'react';

import { AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useContractWrite } from 'wagmi';

export default function WriteItem({ abi, item, devDoc, index, address }) {
  const [args, setArgs] = useState<string | number | boolean[]>(Array(item?.inputs?.length));
  const [value, setValue] = useState<number | undefined>(undefined);
  const devDocKey = `${item?.name}(${item?.inputs?.map((a) => `${a.type}`)})`;
  const currentDevDoc = devDoc[devDocKey];

  const updateArgsIndex = (index: number, value: any) => {
    const newArgs = structuredClone(args);
    let updValue: any = String(value);
    if (updValue === 'false' || updValue === 'true') {
      updValue = Boolean(updValue);
    }

    newArgs[index] = updValue;
    setArgs(newArgs);
  };

  const mutation = useContractWrite({
    abi,
    address,
    functionName: item?.name,
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
          {item?.stateMutability === 'payable' ? (
            <div className="flex max-w-md flex-col gap-2">
              <span className="font-mono text-xs">payable (uint256) (wei)</span>
              <Input placeholder="payableAmount (in Wei)" onChange={({ target }) => setValue(Number(target?.value))} />
            </div>
          ) : null}
          <Button
            className="max-w-16"
            size="sm"
            onClick={() => mutation.write({ args, value: value ? BigInt(value) : BigInt(0) })}
            disabled={mutation?.isLoading}
          >
            {mutation?.isLoading ? <Loader2 className="size-4 animate-spin" /> : 'Write'}
          </Button>
          {mutation?.data?.hash ? (
            <Link href={`/tx/${mutation?.data?.hash}`} target="_blank">
              <span className="text-xs">Transaction Hash: {mutation?.data?.hash}</span>
            </Link>
          ) : null}
          {mutation?.error ? <span className="text-xs text-red-500">Error: {String(mutation?.error)}</span> : null}
        </div>
      </AccordionContent>
    </AccordionItem>
  );
}
