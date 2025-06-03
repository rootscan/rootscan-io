import AddressDisplay from '@/components/address-display';
import TransactionStatusBadge from '@/components/transaction-status-badge';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { TableNavigation } from '@/components/ui/table-navigation.tsx';
import { getShortenedHash } from '@/lib/constants/knownAddresses';
import { camelCaseToWords, cn, formatNumber } from '@/lib/utils';
import { PaginationResponse } from '@/types/api-types.ts';
import { IEVMTransaction } from '@/types/models';
import { AlertCircle, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { Address } from 'viem';

import { CopyButton } from './copy-button';
import InOutBadge from './in-out-badge';
import TimeAgoDate from './time-ago-date';
import Tooltip from './tooltip';

interface TransactionsTableProps {
  transactions: IEVMTransaction[];
  isAddressPage?: boolean;
  address?: Address;
  pagination?: Omit<PaginationResponse<unknown>, 'docs'>;
  caption?: string;
}
export default function TransactionsTable({
  transactions,
  isAddressPage,
  address,
  pagination,
  caption,
}: TransactionsTableProps) {
  return (
    <Table>
      {!!pagination && (
        <TableCaption>
          <TableNavigation pagination={pagination}>
            {caption ? caption : <p>Showing the last 500k records</p>}
          </TableNavigation>
        </TableCaption>
      )}
      <TableHeader>
        <TableRow>
          {!isAddressPage ? <TableHead>Status</TableHead> : null}
          <TableHead>Hash</TableHead>
          <TableHead>Method</TableHead>
          <TableHead>Block</TableHead>
          <TableHead>Timestamp</TableHead>
          <TableHead>From</TableHead>
          <TableHead />
          <TableHead>To</TableHead>
          <TableHead>Value</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {transactions.map((tx) => (
          <TableRow key={tx.hash} className={cn([tx.status === 'pending' ? 'italic' : ''])}>
            {!isAddressPage ? (
              <TableCell>
                <TransactionStatusBadge status={tx.status} />
              </TableCell>
            ) : null}
            <TableCell className="truncate">
              <div className="flex items-center gap-2 truncate">
                <Link href={`/tx/${tx.hash}`} className="flex items-center gap-2">
                  {tx.status === 'reverted' ? (
                    <Tooltip text="Reverted">
                      <AlertCircle className="size-4   text-red-500" />
                    </Tooltip>
                  ) : null}
                  <span className="truncate">{getShortenedHash(tx.hash)}</span>
                </Link>
                <CopyButton value={tx.hash} />
              </div>
            </TableCell>
            <TableCell>
              <Badge>
                {tx.functionName
                  ? camelCaseToWords(tx.functionName)
                  : tx.functionSignature
                    ? tx.functionSignature
                    : '-'}
              </Badge>
            </TableCell>
            <TableCell>
              <Link href={`/blocks/${tx.blockNumber}`}>{tx.blockNumber}</Link>
            </TableCell>
            <TableCell>
              <TimeAgoDate date={tx.timestamp} />
            </TableCell>
            <TableCell className="truncate">
              <AddressDisplay
                address={tx.from}
                nameTag={tx.fromLookup?.nameTag}
                isContract={tx.fromLookup?.isContract}
                rnsName={tx.fromLookup?.rns}
                useShortenedAddress
              />
            </TableCell>
            {isAddressPage ? (
              <TableCell className="max-w-[50px]">
                <InOutBadge address={address} from={tx.from} to={tx.to} />
              </TableCell>
            ) : (
              <TableCell className="max-w-[25px]">
                <ChevronRight className="size-4 text-muted-foreground" />
              </TableCell>
            )}

            <TableCell>
              {/* {tx.creates ? (
                'Contract Deployment'
              ) : ( */}
              <AddressDisplay
                address={tx.to}
                nameTag={tx.toLookup?.nameTag}
                rnsName={tx.toLookup?.rns}
                isContract={tx.toLookup?.isContract}
                useShortenedAddress
              />
              {/* )} */}
            </TableCell>
            <TableCell>
              <span className="text-xs text-muted-foreground">
                {tx.valueFormatted ? formatNumber(parseFloat(tx.valueFormatted)) : '0'} XRP
              </span>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
