import AddressDisplay from '@/components/address-display';
import Breadcrumbs from '@/components/breadcrumbs';
import Container from '@/components/container';
import PaginationSuspense from '@/components/pagination-suspense';
import SectionTitle from '@/components/section-title';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { getVerifiedContracts } from '@/lib/api';
import { getPaginationData } from '@/lib/utils';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Verified Contracts',
};

const getData = async ({ searchParams, params }) => {
  return await getVerifiedContracts({ page: searchParams?.page || 1 });
};
export default async function Page({ searchParams, params }) {
  const data = await getData({ searchParams, params });
  const contracts = data?.docs;
  return (
    <Container>
      <div className="flex flex-col gap-4">
        <Breadcrumbs />
        <SectionTitle>Verified Contracts</SectionTitle>
        <PaginationSuspense pagination={getPaginationData(data)} />
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Contract Address</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Deployer</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {contracts?.map((item, _) => (
              <TableRow key={_}>
                <TableCell>
                  <AddressDisplay address={item.address} useShortenedAddress />
                </TableCell>
                <TableCell>{item.contractName}</TableCell>
                <TableCell>
                  <AddressDisplay address={item?.deployer} useShortenedAddress />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </Container>
  );
}
