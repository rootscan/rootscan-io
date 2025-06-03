'use client';

import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs.tsx';
import { RiCheckLine } from '@remixicon/react';
import { useParams, usePathname, useRouter } from 'next/navigation';

interface MenuProps {
  isContract?: boolean;
  isVerified?: boolean;
}
export default function Menu(props: MenuProps) {
  const { isContract = false, isVerified = false } = props;

  const { address } = useParams();
  const pathname = usePathname();
  const router = useRouter();

  const tabs = [
    { title: 'Native Transfers', href: `/addresses/${address}` },
    { title: 'Extrinsics', href: `/addresses/${address}/extrinsics` },
    { title: 'EVM Transfers', href: `/addresses/${address}/evm-transfers` },
    {
      title: 'EVM Transactions',
      href: `/addresses/${address}/evm-transactions`,
    },
    {
      title: 'Contract',
      hasCheckmark: isContract && isVerified,
      href: `/addresses/${address}/contract`,
    },
    { title: 'Token Balances', href: `/addresses/${address}/balances` },
    { title: 'NFT Inventory', href: `/addresses/${address}/nft-inventory` },
    {
      title: 'Bridge Transactions',
      href: `/addresses/${address}/bridge-transactions`,
    },
    {
      title: 'Futurepass',
      href: `/addresses/${address}/futurepass`,
    },
    {
      title: 'Reports',
      href: `/addresses/${address}/reports`,
    },
  ];

  return (
    <Tabs size="sm" variant="pill" value={pathname} onValueChange={(newValue) => router.push(newValue)}>
      <TabsList>
        {tabs.map((tab, _) => {
          if (!isContract && tab?.title === 'Contract') {
            return null;
          }

          return (
            <TabsTrigger key={_} value={tab.href} className="group">
              {tab.title}
              {tab.hasCheckmark ? (
                <div className="inline-flex size-4 rounded-full bg-green-500 text-text-light group-data-[state=active]:text-foreground">
                  <RiCheckLine className="m-auto size-3" />
                </div>
              ) : null}
            </TabsTrigger>
          );
        })}
      </TabsList>
    </Tabs>
  );
}
