'use client';

import { Accordion } from '@/components/ui/accordion';

import ReadItem from './read-item';

export default function ReadContract({ data, address, chainId }) {
  const abi = data?.metadata?.content?.output?.abi;
  const devDoc = data?.metadata?.content?.output?.devdoc?.methods;

  return (
    <Accordion type="multiple" className="w-full">
      {abi
        ?.filter((a) => a.stateMutability === 'view')
        .map((item, _) => (
          <ReadItem index={_} abi={abi} devDoc={devDoc} item={item} key={_} address={address} chainId={chainId} />
        ))}
    </Accordion>
  );
}
