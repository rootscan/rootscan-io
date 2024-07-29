'use client';

import { Accordion } from '@/components/ui/accordion';

import WriteItem from './write-item';

export default function WriteContract({ data, address }) {
  const abi = data?.metadata?.content?.output?.abi;
  const devDoc = data?.metadata?.content?.output?.devdoc?.methods;

  return (
    <Accordion type="multiple" className="w-full">
      {abi
        ?.filter((a) => a.stateMutability !== 'view' && a.type === 'function')
        .map((item, _) => <WriteItem index={_} abi={abi} devDoc={devDoc} item={item} key={_} address={address} />)}
    </Accordion>
  );
}
