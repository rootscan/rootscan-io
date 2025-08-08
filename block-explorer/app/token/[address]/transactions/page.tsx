import { Fragment } from 'react';
import React from 'react';

import AddressDisplay from '@/components/address-display';
import { ErrorAlert } from '@/components/error-alert';
import ExtrinsicMethod from '@/components/extrinsic-method';
import InOutBadge from '@/components/in-out-badge';
import NFTMint from '@/components/nft-mint-comp';
import { NftThumbnail } from '@/components/nft-thumbnail';
import NoData from '@/components/no-data';
import TimeAgoDate from '@/components/time-ago-date';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { TableNavigation } from '@/components/ui/table-navigation.tsx';
import { ApiCommand, request } from '@/lib/api';
import { getPaginationData, handleRequestResult } from '@/lib/utils';
import { PageProps } from '@/types/page';
import { ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { getAddress, isAddress, zeroAddress } from 'viem';

export default async function Page({ params, searchParams }: PageProps) {
  try {
    const paramsObj = await params;
    if (!paramsObj.address) {
      throw new Error('Address is required');
    }

    const searchParamsObj = await searchParams;
    const page = searchParamsObj?.page ? parseInt(searchParamsObj.page) : 1;

    const data = handleRequestResult(
      await request(ApiCommand.getNftCollectionEvents, {
        collectionId: isAddress(paramsObj.address) ? undefined : parseInt(paramsObj.address),
        contractAddress: isAddress(paramsObj.address) ? getAddress(paramsObj.address) : undefined,
        page,
      }),
    );

    if (!data.docs?.length) return <NoData />;

    const transactions = data.docs;

    return !transactions || transactions?.length === 0 ? (
      <NoData />
    ) : (
      <Table>
        <TableCaption>
          <TableNavigation pagination={getPaginationData(data)}>
            {!data.skipFullCount && <p>A total of {data.totalDocs} native transfers found</p>}
          </TableNavigation>
        </TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Extrinsic ID</TableHead>
            <TableHead className="pl-[32px]">Extrinsic Method</TableHead>
            <TableHead />
            <TableHead>Timestamp</TableHead>
            <TableHead>Amount / TokenID(s)</TableHead>
            <TableHead>From</TableHead>
            <TableHead />
            <TableHead>To</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactions.map((tx, _) => {
            const { method, section } = tx;

            if (section === 'nft' && method === 'Transfer') {
              return <NFTTransfer tx={tx} address={paramsObj.address} key={_} />;
            }

            if (section === 'nft' && method === 'Mint') {
              return <NFTMint tx={tx} address={paramsObj.address} key={_} />;
            }

            if (section === 'sft' && method === 'Transfer') {
              return <SFTTransfer tx={tx} address={paramsObj.address} key={_} />;
            }

            if (section === 'sft' && method === 'Mint') {
              return <SFTMint tx={tx} address={paramsObj.address} key={_} />;
            }

            return <Fragment key={_} />;
          })}
        </TableBody>
      </Table>
    );
  } catch (error) {
    return <ErrorAlert error={error instanceof Error ? error : new Error('An unexpected error occurred')} />;
  }
}

const NFTTransfer = ({ tx, address }) => {
  const tokensIds = tx?.args?.tokenIds || tx?.args?.serialNumbers || [];
  return (
    <TableRow>
      <TableCell className="max-w-[150px] truncate">
        <Link href={`/extrinsics/${tx.extrinsicId}`}>
          <span className="truncate">{tx.extrinsicId}</span>
        </Link>
      </TableCell>
      <TableCell>
        <ExtrinsicMethod tx={tx} />
      </TableCell>
      <TableCell>
        <InOutBadge
          address={address}
          from={tx?.args?.from || tx?.args.previousOwner}
          to={tx?.args?.to || tx?.args.newOwner}
        />
      </TableCell>
      <TableCell>
        <TimeAgoDate date={tx?.timestamp * 1000} />
      </TableCell>
      <TableCell>
        <div className="flex flex-wrap items-center gap-2">
          {tokensIds.map((tokenId, _) => (
            <React.Fragment key={tokenId}>
              <NftThumbnail key={_} image={tx?.args?.image} />
              {tokenId}
            </React.Fragment>
          ))}
        </div>
      </TableCell>
      <TableCell className="max-w-[150px] truncate">
        <AddressDisplay address={tx?.args?.from || tx?.args.previousOwner} useShortenedAddress />
      </TableCell>
      <TableCell className="max-w-[25px] text-muted-foreground">
        <ChevronRight className="size-4" />
      </TableCell>
      <TableCell className="max-w-[150px] truncate">
        <AddressDisplay address={tx?.args?.to || tx?.args.newOwner} useShortenedAddress />
      </TableCell>
    </TableRow>
  );
};

const SFTTransfer = ({ tx, address }) => {
  const tokensIds = tx?.args?.tokenIds || tx?.args?.serialNumbers || [];
  return (
    <TableRow>
      <TableCell className="max-w-[150px] truncate">
        <Link href={`/extrinsics/${tx.extrinsicId}`}>
          <span className="truncate">{tx.extrinsicId}</span>
        </Link>
      </TableCell>
      <TableCell>
        <ExtrinsicMethod tx={tx} />
      </TableCell>
      <TableCell>
        <InOutBadge
          address={address}
          from={tx?.args?.from || tx?.args.previousOwner}
          to={tx?.args?.to || tx?.args.newOwner}
        />
      </TableCell>
      <TableCell>
        <TimeAgoDate date={tx?.timestamp * 1000} />
      </TableCell>
      <TableCell>
        <div className="flex flex-wrap items-center gap-2">
          {tokensIds.map((tokenId, _) => (
            <React.Fragment key={tokenId}>
              <NftThumbnail key={_} image={tx?.args.image} />
              {tokenId}
              {<Badge>x {tx?.args?.balances?.[_]}</Badge>}
            </React.Fragment>
          ))}
        </div>
      </TableCell>
      <TableCell className="max-w-[150px] truncate">
        <AddressDisplay address={tx?.args?.from || tx?.args.previousOwner} useShortenedAddress />
      </TableCell>
      <TableCell className="max-w-[25px] text-muted-foreground">
        <ChevronRight className="size-4" />
      </TableCell>
      <TableCell className="max-w-[150px] truncate">
        <AddressDisplay address={tx?.args?.to || tx?.args.newOwner} useShortenedAddress />
      </TableCell>
    </TableRow>
  );
};

const SFTMint = ({ tx, address }) => {
  const tokensIds = tx?.args?.tokenIds || tx?.args?.serialNumbers || [];
  return (
    <TableRow>
      <TableCell className="max-w-[150px] truncate">
        <Link href={`/extrinsics/${tx.extrinsicId}`}>
          <span className="truncate">{tx.extrinsicId}</span>
        </Link>
      </TableCell>
      <TableCell>
        <ExtrinsicMethod tx={tx} />
      </TableCell>
      <TableCell>
        <InOutBadge address={address} from={'-'} to={tx?.args?.owner} />
      </TableCell>
      <TableCell>
        <TimeAgoDate date={tx?.timestamp * 1000} />
      </TableCell>
      <TableCell>
        <div className="flex flex-wrap items-center gap-2">
          {tokensIds.map((tokenId, _) => (
            <React.Fragment key={tokenId}>
              <NftThumbnail key={_} image={tx?.args.image} />
              {tokenId}
              {<Badge>x {tx?.args?.balances?.[_]}</Badge>}
            </React.Fragment>
          ))}
        </div>
      </TableCell>
      <TableCell className="max-w-[150px] truncate">
        <AddressDisplay address={zeroAddress} useShortenedAddress />
      </TableCell>
      <TableCell className="max-w-[25px] text-muted-foreground">
        <ChevronRight className="size-4" />
      </TableCell>
      <TableCell className="max-w-[150px] truncate">
        <AddressDisplay address={tx?.args?.owner} useShortenedAddress />
      </TableCell>
    </TableRow>
  );
};
