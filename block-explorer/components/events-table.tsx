import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { TableNavigation } from '@/components/ui/table-navigation.tsx';
import { camelCaseToWords } from '@/lib/utils';
import { PaginationResponse } from '@/types/api-types.ts';
import { IEvent } from '@/types/models';
import Link from 'next/link';

import TimeAgoDate from './time-ago-date';
import { Badge } from './ui/badge';

interface EventsTableProps {
  events: IEvent[];
  pagination?: Omit<PaginationResponse<unknown>, 'docs'>;
}
export default function EventsTable({ events, pagination }: EventsTableProps) {
  return (
    <Table>
      {!!pagination && (
        <TableCaption>
          <TableNavigation pagination={pagination}>
            <p>
              Showing events between #{events[0].eventId} to #{events[events.length - 1].eventId}
            </p>
          </TableNavigation>
        </TableCaption>
      )}
      <TableHeader>
        <TableRow>
          <TableHead>Event ID</TableHead>
          <TableHead>Block</TableHead>
          <TableHead>Extrinsic ID</TableHead>
          <TableHead>Timestamp</TableHead>
          <TableHead>Pallet</TableHead>
          <TableHead>Method</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {events.map((event) => (
          <TableRow key={event.eventId}>
            <TableCell>
              <Link href={`/events/${event.eventId}`}>{event.eventId}</Link>
            </TableCell>
            <TableCell>
              <Link href={`/blocks/${event.blockNumber}`}>{event.blockNumber}</Link>
            </TableCell>
            <TableCell>
              {event.extrinsicId ? <Link href={`/extrinsics/${event.extrinsicId}`}>{event.extrinsicId}</Link> : '-'}
            </TableCell>
            <TableCell>
              <TimeAgoDate date={event.timestamp * 1000} />
            </TableCell>
            <TableCell className="capitalize">
              <Badge>{event.section ? camelCaseToWords(event.section) : null}</Badge>
            </TableCell>
            <TableCell className="capitalize">
              <Badge>{event.method ? camelCaseToWords(event.method) : null}</Badge>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
