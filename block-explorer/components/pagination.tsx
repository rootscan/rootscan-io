'use client';

import { useCallback, useEffect, useState } from 'react';

import { ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

import { Button } from './ui/button';

export default function Pagination({ pagination }: { pagination?: any }) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams: any = useSearchParams();

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
      {isLoading ? <Loader2 className="text-muted-foreground size-5 animate-spin" /> : null}
      <div className="flex items-center justify-end gap-6">
        {!pagination?.skipFullCount ? (
          <span className="text-muted-foreground text-sm">
            Page {pagination?.page} of {pagination?.totalPages}
          </span>
        ) : null}
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="pagination"
            onClick={() => {
              router.push(
                pathname +
                  '?' +
                  createQueryString('page', String(Number(currentPage) - 1 >= 1 ? Number(currentPage) - 1 : 1)),
              );
            }}
            disabled={!pagination?.hasPrevPage}
          >
            <ChevronLeft />
          </Button>
          <Button
            variant="outline"
            size="pagination"
            className="w-full cursor-default select-none border-none hover:bg-transparent"
          >
            {currentPage}
          </Button>
          <Button
            variant="outline"
            size="pagination"
            onClick={() => {
              router.push(pathname + '?' + createQueryString('page', String(Number(currentPage) + 1)));
            }}
            disabled={!pagination?.hasNextPage}
          >
            <ChevronRight />
          </Button>
        </div>
      </div>
    </div>
  );
}
