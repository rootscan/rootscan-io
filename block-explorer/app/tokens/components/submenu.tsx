'use client';

import { useCallback } from 'react';

import { Button } from '@/components/ui/button';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

export default function SubMenu() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams: any = useSearchParams();

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
  const currentType = params.get('type');
  return (
    <div className="flex gap-3">
      <Button
        variant={!currentType ? 'default' : 'outline'}
        onClick={() => {
          router.push(pathname + '?' + createQueryString('type', 'undefined'));
        }}
      >
        All
      </Button>
      <Button
        variant={currentType === 'ERC20' ? 'default' : 'outline'}
        onClick={() => {
          router.push(pathname + '?' + createQueryString('type', 'ERC20'));
        }}
      >
        ERC20
      </Button>
      <Button
        variant={currentType === 'ERC721' ? 'default' : 'outline'}
        onClick={() => {
          router.push(pathname + '?' + createQueryString('type', 'ERC721'));
        }}
      >
        ERC721
      </Button>
      <Button
        variant={currentType === 'ERC1155' ? 'default' : 'outline'}
        onClick={() => {
          router.push(pathname + '?' + createQueryString('type', 'ERC1155'));
        }}
      >
        ERC1155
      </Button>
    </div>
  );
}
