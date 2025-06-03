'use client';

import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs.tsx';
import { useParams, usePathname, useRouter } from 'next/navigation';

export default function Menu() {
  const { blocknumber } = useParams();
  const pathname = usePathname();
  const router = useRouter();

  const tabs = [
    { title: 'Overview', href: `/blocks/${blocknumber}` },
    { title: 'Extrinsics', href: `/blocks/${blocknumber}/extrinsics` },
    { title: 'Events', href: `/blocks/${blocknumber}/events` },
    { title: 'EVM Transactions', href: `/blocks/${blocknumber}/evm-transactions` },
  ];

  return (
    <Tabs size="sm" variant="pill" value={pathname} onValueChange={(newValue) => router.push(newValue)}>
      <TabsList>
        {tabs.map((tab, _) => (
          <TabsTrigger key={_} value={tab.href}>
            {tab.title}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
}
