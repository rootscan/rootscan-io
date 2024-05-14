import AddressDisplay from '@/components/address-display';
import InOutBadge from '@/components/in-out-badge';
import NftThumbnail from '@/components/nft-thumbnail';
import NoData from '@/components/no-data';
import PaginationSuspense from '@/components/pagination-suspense';
import TimeAgoDate from '@/components/time-ago-date';
import TokenDisplay from '@/components/token-display';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { getTokenTransfersFromAddress } from '@/lib/api';
import { getPaginationData } from '@/lib/utils';
import { ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { getAddress } from 'viem';

const getData = async ({ params, searchParams }) => {
  const data = await getTokenTransfersFromAddress({
    address: params.address,
    page: searchParams.page,
  });
  return data;
};
export default async function Page({ params, searchParams }) {
  const data = await getData({ params, searchParams });
  const transactions = data?.docs;
  const address = getAddress(params.address);

  return (
    <div className="flex flex-col gap-4">
      <PaginationSuspense pagination={getPaginationData(data)} />
      {!transactions || transactions?.length === 0 ? (
        <NoData />
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Hash</TableHead>
              <TableHead />
              <TableHead>Token Type</TableHead>
              <TableHead>Timestamp</TableHead>
              <TableHead>Token</TableHead>
              <TableHead>Amount / TokenId</TableHead>
              <TableHead>From</TableHead>
              <TableHead />
              <TableHead>To</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.map((tx, _) => (
              <TableRow key={tx._id}>
                <TableCell className="max-w-[150px] truncate">
                  <Link href={`/tx/${tx.hash}`}>
                    <span className="truncate">{tx.hash}</span>
                  </Link>
                </TableCell>
                <TableCell>
                  <InOutBadge address={address} from={tx.from} to={tx.to} />
                </TableCell>
                <TableCell>
                  <Badge variant="outline">{tx.type}</Badge>
                </TableCell>
                <TableCell>
                  <TimeAgoDate date={tx?.timestamp} />
                </TableCell>
                <TableCell>
                  <TokenDisplay
                    token={{
                      name: tx?.name,
                      symbol: tx?.symbol,
                      type: tx?.type,
                      contractAddress: tx?.address,
                    }}
                    hideCopyButton
                  />
                </TableCell>
                <TableCell>
                  {tx?.type === 'ERC20' ? (
                    tx.formattedAmount
                  ) : (
                    <div className="flex items-center gap-2" key={_}>
                      <NftThumbnail contractAddress={tx?.address} tokenId={tx?.tokenId} />
                      {tx?.tokenId}
                    </div>
                  )}
                </TableCell>
                <TableCell className="max-w-[150px] truncate">
                  <AddressDisplay address={tx.from} useShortenedAddress />
                </TableCell>
                <TableCell className="text-muted-foreground max-w-[25px]">
                  <ChevronRight className="size-4" />
                </TableCell>
                <TableCell className="max-w-[150px] truncate">
                  <AddressDisplay address={tx.to} useShortenedAddress />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
