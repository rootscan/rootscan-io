'use client';

import { useCallback } from 'react';

import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs.tsx';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

export default function SubMenu() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams);
      if (value === 'undefined') {
        params.delete(name);
      } else {
        params.set(name, value);
      }
      const currentPage = params.get('page');
      if (currentPage) {
        params.set('page', '1');
      }

      return params.toString();
    },
    [searchParams],
  );
  const params = new URLSearchParams(searchParams);
  const currentType = params.get('type') || 'undefined';

  return (
    <Tabs
      variant="pill"
      value={currentType}
      onValueChange={(newValue) => router.push(pathname + '?' + createQueryString('type', newValue))}
    >
      <TabsList>
        <TabsTrigger value="undefined">All</TabsTrigger>
        <TabsTrigger value="ERC20">ERC20</TabsTrigger>
        <TabsTrigger value="ERC721">ERC721</TabsTrigger>
        <TabsTrigger value="ERC1155">ERC1155</TabsTrigger>
      </TabsList>
    </Tabs>
  );
}
