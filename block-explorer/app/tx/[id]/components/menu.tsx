'use client';

import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs.tsx';
import { useParams, usePathname, useRouter } from 'next/navigation';

export default function Menu() {
  const { id } = useParams();
  const pathname = usePathname();
  const router = useRouter();

  const tabs = [
    { title: 'Overview', href: `/tx/${id}` },
    { title: 'Logs', href: `/tx/${id}/logs` },
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
