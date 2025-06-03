import AddressDisplay from '@/components/address-display';
import Breadcrumbs from '@/components/breadcrumbs';
import Container from '@/components/container';
import { ErrorAlert } from '@/components/error-alert';
import NoData from '@/components/no-data';
import SectionTitle from '@/components/section-title';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { TableNavigation } from '@/components/ui/table-navigation.tsx';
import { ApiCommand, request } from '@/lib/api';
import { getPaginationData, handleRequestResult } from '@/lib/utils';
import { PageProps } from '@/types/page';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Verified Contracts',
};

export default async function Page({ searchParams }: PageProps) {
  try {
    const searchParamsObj = await searchParams;
    const page = Number(searchParamsObj?.page) || 1;

    const numberFormatter = new Intl.NumberFormat('en-US', { style: 'decimal' });

    const data = handleRequestResult(await request(ApiCommand.getVerifiedContracts, { page }));
    if (!data.docs?.length) return <NoData />;

    return (
      <Container className="flex flex-col gap-6">
        <div className="space-y-4">
          <Breadcrumbs />
          <SectionTitle>Verified Contracts</SectionTitle>
        </div>

        <Table>
          <TableCaption>
            <TableNavigation pagination={getPaginationData(data)}>
              {!data.skipFullCount && <p>Showing {numberFormatter.format(data.totalDocs)} contracts</p>}
            </TableNavigation>
          </TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Contract Address</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Deployer</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.docs.map((contract, _) => (
              <TableRow key={_}>
                <TableCell>
                  <AddressDisplay address={contract.address} />
                </TableCell>
                <TableCell>{contract.contractName}</TableCell>
                <TableCell>
                  <AddressDisplay address={contract.deployer} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Container>
    );
  } catch (error) {
    return <ErrorAlert error={error instanceof Error ? error : new Error('An unexpected error occurred')} />;
  }
}
