import AddressDisplay from '@/components/address-display';
import Breadcrumbs from '@/components/breadcrumbs';
import Container from '@/components/container';
import { ErrorAlert } from '@/components/error-alert';
import NoData from '@/components/no-data';
import SectionTitle from '@/components/section-title';
import TokenDisplay from '@/components/token-display';
import Tooltip from '@/components/tooltip';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { TableNavigation } from '@/components/ui/table-navigatio.tsx';
import { ApiCommand, request } from '@/lib/api';
import { ROOT_TOKEN } from '@/lib/constants/tokens';
import { getPaginationData, handleRequestResult } from '@/lib/utils';
import { PageProps } from '@/types/page';
import { AlertTriangle } from 'lucide-react';
import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Staking',
};

export default async function Page({ searchParams }: PageProps) {
  try {
    const searchParamsObj = await searchParams;
    const page = Number(searchParamsObj?.page) || 1;

    const numberFormatter = new Intl.NumberFormat('en-US', { style: 'decimal' });

    const data = handleRequestResult(await request(ApiCommand.getStakingValidators, { page }));

    if (!data.docs?.length) return <NoData />;

    return (
      <Container className="flex flex-col gap-6">
        <div className="space-y-4">
          <Breadcrumbs />
          <SectionTitle>Staking</SectionTitle>
          <p className="text-sm">
            If you own $ROOT and wish to stake, please visit{' '}
            <Link href="https://staking.therootnetwork.com/" className="text-text-info-primary" target="_blank">
              here.
            </Link>
          </p>
        </div>

        <Table>
          <TableCaption>
            <TableNavigation pagination={getPaginationData(data)}>
              {!data?.skipFullCount && <p>Showing {numberFormatter.format(data.totalDocs)} results</p>}
            </TableNavigation>
          </TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Validator</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Nominators</TableHead>
              <TableHead>Total Root Nominated</TableHead>
              <TableHead>Validated Blocks (24h)</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.docs.map((item, _) => (
              <TableRow key={_}>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <AddressDisplay address={item.validator} useShortenedAddress />
                    {item?.isOversubscribed ? (
                      <Tooltip
                        text={`Validators can only pay out the first 256 nominators per era. \n You will not earn rewards if you are 257 or higher nominator.`}
                      >
                        <AlertTriangle className="size-4 text-orange-400" />
                      </Tooltip>
                    ) : null}
                  </div>
                </TableCell>
                <TableCell>{item?.validatorName}</TableCell>
                <TableCell>{item.nominators}</TableCell>
                <TableCell>
                  <TokenDisplay token={ROOT_TOKEN} amount={item?.totalRootNominated} hideCopyButton />
                </TableCell>
                <TableCell>{item?.blocksValidated || 0}</TableCell>
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
