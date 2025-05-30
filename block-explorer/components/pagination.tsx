'use client';

import { useCallback, useEffect, useState } from 'react';

import { PaginationResponse } from '@/types/api-types';
import { RiArrowLeftSLine, RiArrowRightSLine, RiLoader4Line } from '@remixicon/react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

import { Button } from './ui/button';

export default function Pagination({ pagination }: { pagination?: Omit<PaginationResponse<unknown>, 'docs'> }) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams);
      params.set(name, value);
      setIsLoading(true);
      return params.toString();
    },
    [searchParams],
  );

  useEffect(() => {
    setIsLoading(false);
    return () => {
      setIsLoading(true);
    };
  }, [pathname, searchParams]);

  const currentPage = searchParams.get('page') || 1;

  return (
    <div className="flex items-center justify-end gap-4">
      {isLoading ? <RiLoader4Line className="size-5 animate-spin text-muted-foreground" /> : null}
      <div className="flex items-center justify-end gap-6">
        <div className="flex items-center gap-1">
          <Button
            variant="secondary"
            size="sm"
            className="px-2"
            onClick={() => {
              router.push(
                pathname +
                  '?' +
                  createQueryString('page', String(Number(currentPage) - 1 >= 1 ? Number(currentPage) - 1 : 1)),
              );
            }}
            disabled={!pagination?.hasPrevPage}
          >
            <RiArrowLeftSLine className="size-4" />
          </Button>
          {!pagination?.skipFullCount ? (
            <p className="px-3">
              Page {pagination?.page} of {pagination?.totalPages}
            </p>
          ) : (
            <p className="px-3">Page {currentPage}</p>
          )}
          <Button
            variant="secondary"
            size="sm"
            className="px-2"
            onClick={() => {
              router.push(pathname + '?' + createQueryString('page', String(Number(currentPage) + 1)));
            }}
            disabled={!pagination?.hasNextPage}
          >
            <RiArrowRightSLine className="size-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
