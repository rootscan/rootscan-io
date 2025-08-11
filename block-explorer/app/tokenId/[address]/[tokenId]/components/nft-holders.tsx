import AddressDisplay from '@/components/address-display';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { TableNavigation } from '@/components/ui/table-navigation';
import { getPaginationData } from '@/lib/utils';
import { SortDesc } from 'lucide-react';

export default function NftHolders({ data }) {
  return (
    <Table>
      <TableCaption>
        <TableNavigation pagination={getPaginationData(data)}>
          {!data.skipFullCount && <p>A total of {data.totalDocs} holders found</p>}
        </TableNavigation>
      </TableCaption>
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
        {data?.docs.map((item, _) => (
          <TableRow key={_}>
            <TableCell>
              <AddressDisplay address={item.owner} />
            </TableCell>
            <TableCell>{item.amount}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
