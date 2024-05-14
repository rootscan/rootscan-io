import AddressDisplay from '@/components/address-display';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { SortDesc } from 'lucide-react';
import Link from 'next/link';

export default function Erc1155Holders({ data, contractAddress }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Address</TableHead>
          <TableHead>
            <div className="flex items-center gap-2">
              <SortDesc className="size-5" /> Amount
            </div>
          </TableHead>
          <TableHead />
        </TableRow>
      </TableHeader>
      <TableBody>
        {data?.map((item, _) => (
          <TableRow key={_}>
            <TableCell>
              <AddressDisplay address={item.owner} />
            </TableCell>
            <TableCell>{item.count}</TableCell>
            <TableCell className="flex justify-end">
              <Link href={`/addresses/${item.owner}/nft-inventory/${contractAddress}`}>
                <Button size="sm" variant="ghost">
                  View NFTs
                </Button>
              </Link>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
