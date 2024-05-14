'use client';

import { Suspense } from 'react';

import Pagination from './pagination';

export default function PaginationSuspense({ pagination }) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Pagination pagination={pagination} />
    </Suspense>
  );
}
