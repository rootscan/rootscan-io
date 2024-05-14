import AddressDisplay from '@/components/address-display';
import TransactionStatusBadge from '@/components/transaction-status-badge';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { getShortenedHash } from '@/lib/constants/knownAddresses';
import { camelCaseToWords, cn, formatNumber } from '@/lib/utils';
import { AlertCircle, ChevronRight, SortDesc } from 'lucide-react';
import Link from 'next/link';
import { Address } from 'viem';

import { CopyButton } from './copy-button';
import InOutBadge from './in-out-badge';
import TimeAgoDate from './time-ago-date';
import Tooltip from './tooltip';

export default function TransactionsTable({
  transactions,
  isAddressPage,
  address,
}: {
  transactions: any[];
  isAddressPage?: boolean;
  address?: Address;
}) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          {!isAddressPage ? <TableHead>Status</TableHead> : null}
          <TableHead>Hash</TableHead>
          <TableHead>Method</TableHead>
          <TableHead>
            <div className="flex items-center gap-2">
              <SortDesc className="size-5" /> Block
            </div>
          </TableHead>
          <TableHead className="text-center">Timestamp</TableHead>
          <TableHead>From</TableHead>
          <TableHead />
          <TableHead>To</TableHead>
          <TableHead className="text-center">Value</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {transactions.map((tx, _) => (
          <TableRow key={tx._id} className={cn([tx?.status === 'pending' ? 'italic' : ''])}>
            {!isAddressPage ? (
              <TableCell>
                <TransactionStatusBadge status={tx?.status} />
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
                {tx?.functionName
                  ? camelCaseToWords(tx?.functionName)
                  : tx?.functionSignature
                  ? tx?.functionSignature
                  : '-'}
              </Badge>
            </TableCell>
            <TableCell>
              <Link href={`/blocks/${tx.blockNumber}`}>{tx.blockNumber}</Link>
            </TableCell>
            <TableCell className="text-center">
              <TimeAgoDate date={tx?.timestamp} />
            </TableCell>
            <TableCell className="truncate">
              <AddressDisplay
                address={tx.from}
                nameTag={tx?.fromLookup?.nameTag}
                isContract={tx?.fromLookup?.isContract}
                rnsName={tx?.fromLookup?.rns}
                useShortenedAddress
              />
            </TableCell>
            {isAddressPage ? (
              <TableCell className="max-w-[50px]">
                <InOutBadge address={address} from={tx.from} to={tx.to} />
              </TableCell>
            ) : (
              <TableCell className="max-w-[25px]">
                <ChevronRight className="text-muted-foreground size-4" />
              </TableCell>
            )}

            <TableCell>
              {tx?.creates ? (
                'Contract Deployment'
              ) : (
                <AddressDisplay
                  address={tx.to}
                  nameTag={tx?.toLookup?.nameTag}
                  rnsName={tx?.toLookup?.rns}
                  isContract={tx?.toLookup?.isContract}
                  useShortenedAddress
                />
              )}
            </TableCell>
            <TableCell className="text-center">
              <span className="text-muted-foreground text-xs">
                {tx?.valueFormatted ? formatNumber(tx?.valueFormatted) : '0'} XRP
              </span>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
