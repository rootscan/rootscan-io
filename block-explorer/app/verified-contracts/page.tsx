import AddressDisplay from '@/components/address-display';
import Breadcrumbs from '@/components/breadcrumbs';
import Container from '@/components/container';
import { ErrorAlert } from '@/components/error-alert';
import NoData from '@/components/no-data';
import PaginationSuspense from '@/components/pagination-suspense';
import SectionTitle from '@/components/section-title';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
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

    const data = handleRequestResult(await request(ApiCommand.getVerifiedContracts, { page }));
    if (!data.docs?.length) return <NoData />;

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
        </div>
      </Container>
    );
  } catch (error) {
    return <ErrorAlert error={error instanceof Error ? error : new Error('An unexpected error occurred')} />;
  }
}
