import AddressDisplay from '@/components/address-display';
import TokenDisplay from '@/components/token-display';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { SortDesc } from 'lucide-react';

export default function Erc20Holders({ data }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Address</TableHead>
          <TableHead>
            <div className="flex items-center gap-2">
              <SortDesc className="size-5" /> Balance
            </div>
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data?.map((item, _) => (
          <TableRow key={_}>
            <TableCell>
              <AddressDisplay address={item.address} />
            </TableCell>
            <TableCell>
              <TokenDisplay token={item?.tokenDetails} amount={item?.balance} />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
