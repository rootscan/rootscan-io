import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { camelCaseToWords } from '@/lib/utils';
import { SortDesc } from 'lucide-react';
import Link from 'next/link';

import TimeAgoDate from './time-ago-date';
import { Badge } from './ui/badge';

export default function EventsTable({ events }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Event ID</TableHead>
          <TableHead>
            <div className="flex items-center gap-2">
              <SortDesc className="size-5" /> Block
            </div>
          </TableHead>
          <TableHead>Extrinsic ID</TableHead>
          <TableHead>Timestamp</TableHead>
          <TableHead>Pallet</TableHead>
          <TableHead>Method</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {events.map((event: any) => (
          <TableRow key={event._id}>
            <TableCell>
              <Link href={`/events/${event.eventId}`}>{event.eventId}</Link>
            </TableCell>
            <TableCell>
              <Link href={`/blocks/${event?.blockNumber}`}>{event?.blockNumber}</Link>
            </TableCell>
            <TableCell>
              {event?.extrinsicId ? <Link href={`/extrinsics/${event?.extrinsicId}`}>{event?.extrinsicId}</Link> : '-'}
            </TableCell>
            <TableCell>
              <TimeAgoDate date={event?.timestamp * 1000} />
            </TableCell>
            <TableCell className="capitalize">
              <Badge>{event?.section ? camelCaseToWords(event?.section) : null}</Badge>
            </TableCell>
            <TableCell className="capitalize">
              <Badge>{event?.method ? camelCaseToWords(event?.method) : null}</Badge>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
