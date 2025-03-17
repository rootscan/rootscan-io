import { Fragment } from 'react';

import AddressDisplay from '@/components/address-display';
import { ErrorAlert } from '@/components/error-alert';
import ExtrinsicMethod from '@/components/extrinsic-method';
import InOutBadge from '@/components/in-out-badge';
import NFTMint from '@/components/nft-mint-comp';
import { NftThumbnail } from '@/components/nft-thumbnail';
import NoData from '@/components/no-data';
import PaginationSuspense from '@/components/pagination-suspense';
import TimeAgoDate from '@/components/time-ago-date';
import TokenDisplay from '@/components/token-display';
import Tooltip from '@/components/tooltip';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ApiCommand, request } from '@/lib/api';
import { ROOT_TOKEN } from '@/lib/constants/tokens';
import { getPaginationData, handleRequestResult } from '@/lib/utils';
import { PageProps } from '@/types/page';
import { ChevronRight, Flame } from 'lucide-react';
import Link from 'next/link';
import { getAddress, zeroAddress } from 'viem';

export default async function Page({ params, searchParams }: PageProps) {
  try {
    const paramsObj = await params;
    if (!paramsObj.address) {
      throw new Error('Address is required');
    }

    const searchParamsObj = await searchParams;
    const page = searchParamsObj?.page ? parseInt(searchParamsObj.page) : 1;

    const data = handleRequestResult(
      await request(ApiCommand.getNativeTransfersForAddress, {
        address: getAddress(paramsObj.address),
        page,
      }),
    );

    if (!data.docs?.length) return <NoData />;

    const transactions = data.docs;

    return (
      <div className="flex flex-col gap-4">
        <PaginationSuspense pagination={getPaginationData(data)} />
        {!transactions || transactions?.length === 0 ? (
          <NoData />
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Extrinsic ID</TableHead>
                <TableHead>Extrinsic Method</TableHead>
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
                if (section === 'assets' && method === 'Transferred') {
                  return <AssetsTransferred tx={tx} address={paramsObj.address} key={_} />;
                }
                if (section === 'assets' && method === 'ApprovedTransfer') {
                  return <AssetsApprovedTransfer tx={tx} address={paramsObj.address} key={_} />;
                }
                if (section === 'assets' && method === 'Issued') {
                  return <AssetsIssued tx={tx} address={paramsObj.address} key={_} />;
                }
                if (section === 'assets' && method === 'Burned') {
                  return <AssetsBurned tx={tx} address={paramsObj.address} key={_} />;
                }
                if (section === 'balances' && method === 'Reserved') {
                  return <BalancesReserved tx={tx} address={paramsObj.address} key={_} />;
                }
                if (section === 'balances' && method === 'Transfer') {
                  return <BalancesTransfer tx={tx} address={paramsObj.address} key={_} />;
                }
                if (section === 'balances' && method === 'Unreserved') {
                  return <BalancesUnreserved tx={tx} address={paramsObj.address} key={_} />;
                }

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
        )}
      </div>
    );
  } catch (error) {
    return <ErrorAlert error={error instanceof Error ? error : new Error('An unexpected error occurred')} />;
  }
}

const AssetsTransferred = ({ tx, address }) => {
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
        <InOutBadge address={address} from={tx?.args?.from} to={tx?.args?.to} />
      </TableCell>
      <TableCell>
        <TimeAgoDate date={tx?.timestamp * 1000} />
      </TableCell>
      <TableCell>
        <TokenDisplay className="truncate" token={tx?.tokenNative} amount={tx?.args?.amount} hideCopyButton />
      </TableCell>
      <TableCell>
        <AddressDisplay address={tx?.args?.from} useShortenedAddress />
      </TableCell>
      <TableCell className="max-w-[25px] text-muted-foreground">
        <ChevronRight className="size-4" />
      </TableCell>
      <TableCell>
        <AddressDisplay address={tx?.args?.to} useShortenedAddress />
      </TableCell>
    </TableRow>
  );
};

const AssetsApprovedTransfer = ({ tx, address }) => {
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
        <InOutBadge address={address} from={tx?.args?.from} to={tx?.args?.to} />
      </TableCell>
      <TableCell>
        <TimeAgoDate date={tx?.timestamp * 1000} />
      </TableCell>
      <TableCell>{tx?.name}</TableCell>
      <TableCell>{tx?.type === 'ERC20' ? tx?.formattedAmount : tx?.tokenId}</TableCell>
      <TableCell className="max-w-[150px] truncate">
        <AddressDisplay address={tx?.from} useShortenedAddress />
      </TableCell>
      <TableCell className="max-w-[25px] text-muted-foreground">
        <ChevronRight className="size-4" />
      </TableCell>
      <TableCell className="max-w-[150px] truncate">
        <AddressDisplay address={tx?.to} useShortenedAddress />
      </TableCell>
    </TableRow>
  );
};

const AssetsIssued = ({ tx, address }) => {
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
        <TokenDisplay token={tx?.tokenNative} amount={tx?.args?.totalSupply || tx?.args?.amount} hideCopyButton />
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

const AssetsBurned = ({ tx, address }) => {
  return (
    <TableRow>
      <TableCell className="max-w-[150px] truncate">-</TableCell>
      <TableCell>
        <ExtrinsicMethod tx={tx} hideExtrinsic />
      </TableCell>
      <TableCell>
        <InOutBadge address={address} from={address} to="" />
      </TableCell>
      <TableCell>
        <TimeAgoDate date={tx?.timestamp * 1000} />
      </TableCell>
      <TableCell>
        <TokenDisplay amount={tx?.args?.balance} token={tx?.tokenNative} hideCopyButton />
      </TableCell>
      <TableCell className="max-w-[150px] truncate">
        <AddressDisplay address={tx?.args?.owner} useShortenedAddress />
      </TableCell>
      <TableCell className="max-w-[25px] text-muted-foreground">
        <ChevronRight className="size-4" />
      </TableCell>
      <TableCell className="max-w-[150px] truncate">
        <Tooltip text="Burned">
          <Flame className="size-5" />
        </Tooltip>
      </TableCell>
    </TableRow>
  );
};

const BalancesReserved = ({ tx, address }) => {
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
        <InOutBadge address={address} from={address} to="" />
      </TableCell>
      <TableCell>
        <TimeAgoDate date={tx?.timestamp * 1000} />
      </TableCell>
      <TableCell>
        <TokenDisplay token={ROOT_TOKEN} amount={tx?.args?.amount} hideCopyButton />
      </TableCell>
      <TableCell className="max-w-[150px] truncate">
        <AddressDisplay address={tx?.args?.who} useShortenedAddress />
      </TableCell>
      <TableCell className="max-w-[25px] text-muted-foreground">
        <ChevronRight className="size-4" />
      </TableCell>
      <TableCell className="max-w-[150px] truncate">
        <Tooltip text="Reserved">
          <Badge variant="warning">Reserved</Badge>
        </Tooltip>
      </TableCell>
    </TableRow>
  );
};

const BalancesTransfer = ({ tx, address }) => {
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
        <InOutBadge address={address} from={tx?.args?.from} to={tx?.args?.to} />
      </TableCell>
      <TableCell>
        <TimeAgoDate date={tx?.timestamp * 1000} />
      </TableCell>
      <TableCell>
        <TokenDisplay token={ROOT_TOKEN} amount={tx?.args?.amount} hideCopyButton />
      </TableCell>
      <TableCell className="max-w-[150px] truncate">
        <AddressDisplay address={tx?.args?.from} useShortenedAddress />
      </TableCell>
      <TableCell className="max-w-[25px] text-muted-foreground">
        <ChevronRight className="size-4" />
      </TableCell>
      <TableCell className="max-w-[150px] truncate">
        <AddressDisplay address={tx?.args?.to} useShortenedAddress />
      </TableCell>
    </TableRow>
  );
};

const BalancesUnreserved = ({ tx, address }) => {
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
        <InOutBadge address={address} from={''} to={address} />
      </TableCell>
      <TableCell>
        <TimeAgoDate date={tx?.timestamp * 1000} />
      </TableCell>
      <TableCell>
        <TokenDisplay token={ROOT_TOKEN} amount={tx?.args?.amount} hideCopyButton />
      </TableCell>
      <TableCell className="max-w-[150px] truncate">
        <Tooltip text="Unreserved">
          <Badge variant="success">Unreserved</Badge>
        </Tooltip>
      </TableCell>
      <TableCell className="max-w-[25px] text-muted-foreground">
        <ChevronRight className="size-4" />
      </TableCell>
      <TableCell className="max-w-[150px] truncate">
        <AddressDisplay address={tx?.args?.who} useShortenedAddress />
      </TableCell>
    </TableRow>
  );
};

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
            <>
              <NftThumbnail key={_} tokenId={tokenId} contractAddress={tx?.args?.contractAddress} />
              {tokenId}
            </>
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
            <>
              <NftThumbnail key={_} tokenId={tokenId} contractAddress={tx?.args?.contractAddress} />
              {tokenId}
            </>
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
            <NftThumbnail key={_} tokenId={tokenId} contractAddress={tx?.args?.contractAddress} />
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
