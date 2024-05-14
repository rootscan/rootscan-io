'use client';

import { Suspense } from 'react';
import TimeAgo from 'react-timeago';

import Tooltip from './tooltip';
import { Skeleton } from './ui/skeleton';

export default function TimeAgoDate({ date }) {
  return (
    <Suspense fallback={<Skeleton className="h-5 w-24" />}>
      <Tooltip text={new Date(date)?.toUTCString()}>
        <TimeAgo date={date} className="truncate" />
      </Tooltip>
    </Suspense>
  );
}
