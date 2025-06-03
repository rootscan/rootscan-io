'use client';

import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Textarea } from '@/components/ui/textarea';
import { IEVMTransaction } from '@/types/models';
import { RiContractLeftLine, RiQrScan2Line } from '@remixicon/react';

export default function InputData({ input, transaction }: { input: string; transaction: IEVMTransaction }) {
  const [decode, setDecode] = useState<boolean>(false);
  return (
    <div className="flex w-full flex-col gap-4">
      {decode ? (
        <div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Value</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transaction?.functionData?.inputs.map((item, _) => (
                <TableRow key={_}>
                  <TableCell>{item?.name}</TableCell>
                  <TableCell>{item?.type}</TableCell>
                  <TableCell>
                    {typeof transaction?.functionData?.args?.[item?.name] !== 'undefined'
                      ? String(transaction?.functionData?.args?.[item?.name])
                      : ''}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <Textarea
          value={`${
            transaction?.functionData?.signature
              ? `Function: ${transaction?.functionData?.signature} \n ${input}`
              : input
          }`}
          className="w-full rounded-2xl border-0 bg-primary/5"
          readOnly
        />
      )}

      <div className="flex items-center gap-2">
        {decode ? (
          <Button className="gap-2" onClick={() => setDecode(!decode)}>
            <RiContractLeftLine className="size-5" /> Switch Back
          </Button>
        ) : (
          <Button
            className="gap-2"
            disabled={!transaction?.functionData || Object.keys(transaction?.functionData?.args)?.length === 0}
            onClick={() => setDecode(!decode)}
          >
            <RiQrScan2Line className="size-5" /> Decode Input Data
          </Button>
        )}
      </div>
    </div>
  );
}
