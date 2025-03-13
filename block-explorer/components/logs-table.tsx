import AddressDisplay from '@/components/address-display';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { getAddress } from 'viem';

interface Log {
  logIndex: number;
  address: string;
  eventName?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  args?: Record<string, any>;
  topics?: string[];
  data?: string;
}

export default function LogsTable({ logs }: { logs: Log[] }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Index</TableHead>
          <TableHead>Address</TableHead>
          <TableHead>Event Name</TableHead>
          <TableHead>Arguments</TableHead>
          <TableHead>Topics</TableHead>
          <TableHead>Data</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {logs.map((log, index) => (
          <TableRow key={index}>
            <TableCell>
              <Button size="icon">{log.logIndex}</Button>
            </TableCell>
            <TableCell>
              <AddressDisplay address={getAddress(log.address)} />
            </TableCell>
            <TableCell>{log.eventName || '-'}</TableCell>
            <TableCell>
              {log.args ? (
                <div className="flex flex-col gap-1">
                  {Object.entries(log.args).map(([key, value]) => (
                    <div key={key}>
                      {key}: {typeof value === 'object' ? JSON.stringify(value, null, 2) : String(value)}
                    </div>
                  ))}
                </div>
              ) : (
                '-'
              )}
            </TableCell>
            <TableCell>
              {log.topics ? (
                <div className="flex flex-col gap-1">
                  {log.topics.map((topic, i) => (
                    <div key={i}>{topic}</div>
                  ))}
                </div>
              ) : (
                '-'
              )}
            </TableCell>
            <TableCell className="break-anywhere">{log.data || '-'}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
