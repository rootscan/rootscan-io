import { Fragment } from 'react';

import AddressDisplay from '@/components/address-display';
import ExtrinsicMethod from '@/components/extrinsic-method';
import InOutBadge from '@/components/in-out-badge';
import NFTMint from '@/components/nft-mint-comp';
import NftThumbnail from '@/components/nft-thumbnail';
import NoData from '@/components/no-data';
import PaginationSuspense from '@/components/pagination-suspense';
import TimeAgoDate from '@/components/time-ago-date';
import TokenDisplay from '@/components/token-display';
import Tooltip from '@/components/tooltip';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { getNativeTransfersForAddress } from '@/lib/api';
import { ROOT_TOKEN } from '@/lib/constants/tokens';
import { getPaginationData } from '@/lib/utils';
import { ChevronRight, Flame } from 'lucide-react';
import Link from 'next/link';
import { getAddress } from 'viem';

const getData = async ({ params, searchParams }) => {
  const data = await getNativeTransfersForAddress({
    address: getAddress(params.address),
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
                return <AssetsTransferred tx={tx} address={address} key={_} />;
              }
              if (section === 'assets' && method === 'ApprovedTransfer') {
                return <AssetsApprovedTransfer tx={tx} address={address} key={_} />;
              }
              if (section === 'assets' && method === 'Issued') {
                return <AssetsIssued tx={tx} address={address} key={_} />;
              }
              if (section === 'assets' && method === 'Burned') {
                return <AssetsBurned tx={tx} address={address} key={_} />;
              }
              if (section === 'balances' && method === 'Reserved') {
                return <BalancesReserved tx={tx} address={address} key={_} />;
              }
              if (section === 'balances' && method === 'Transfer') {
                return <BalancesTransfer tx={tx} address={address} key={_} />;
              }
              if (section === 'balances' && method === 'Unreserved') {
                return <BalancesUnreserved tx={tx} address={address} key={_} />;
              }

              if (section === 'nft' && method === 'Transfer') {
                return <NFTTransfer tx={tx} address={address} key={_} />;
              }

              if (section === 'nft' && method === 'Mint') {
                return <NFTMint tx={tx} address={address} key={_} />;
              }

              if (section === 'sft' && method === 'Transfer') {
                return <SFTTransfer tx={tx} address={address} key={_} />;
              }

              if (section === 'sft' && method === 'Mint') {
                return <SFTMint tx={tx} address={address} key={_} />;
              }

              return <Fragment key={_} />;
            })}
          </TableBody>
        </Table>
      )}
    </div>
  );
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
      <TableCell className="text-muted-foreground max-w-[25px]">
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
      <TableCell className="text-muted-foreground max-w-[25px]">
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
      <TableCell className="max-w-[150px] truncate">-</TableCell>
      <TableCell>
        <ExtrinsicMethod tx={tx} hideExtrinsic />
      </TableCell>
      <TableCell>
        <InOutBadge address={address} from={'-'} to={tx?.args?.owner} />
      </TableCell>
      <TableCell>
        <TimeAgoDate date={tx?.timestamp * 1000} />
      </TableCell>
      <TableCell>
        <TokenDisplay token={tx?.tokenNative} amount={tx?.args?.totalSupply} hideCopyButton />
      </TableCell>
      <TableCell className="max-w-[150px] truncate">-</TableCell>
      <TableCell className="text-muted-foreground max-w-[25px]">
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
      <TableCell className="text-muted-foreground max-w-[25px]">
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
        <InOutBadge address={address} from={tx?.args?.who} to={tx?.args?.who} />
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
      <TableCell className="text-muted-foreground max-w-[25px]">
        <ChevronRight className="size-4" />
      </TableCell>
      <TableCell className="max-w-[150px] truncate">
        <AddressDisplay address={tx?.args?.who} useShortenedAddress />
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
      <TableCell className="text-muted-foreground max-w-[25px]">
        <ChevronRight className="size-4" />
      </TableCell>
      <TableCell className="max-w-[150px] truncate">
        <AddressDisplay address={tx?.args?.to} useShortenedAddress />
      </TableCell>
    </TableRow>
  );
};
const BalancesUnreserved = ({ tx, address }) => {
  // ;<div className="flex flex-wrap items-center gap-2">
  //   {args?.amount ? (
  //     <TokenDisplay token={ROOT_TOKEN} amount={args?.amount} />
  //   ) : (
  //     <TokenDisplay token={ROOT_TOKEN} amount={0} />
  //   )}
  //   moved from reserved to free on
  //   <AddressDisplay address={args?.who} useShortenedAddress />
  // </div>
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
        <InOutBadge address={address} from={'0x000000000'} to={address} />
      </TableCell>
      <TableCell>
        <TimeAgoDate date={tx?.timestamp * 1000} />
      </TableCell>
      <TableCell>
        {tx?.args?.amount ? (
          <TokenDisplay token={ROOT_TOKEN} amount={tx?.args?.amount} />
        ) : (
          <TokenDisplay token={ROOT_TOKEN} amount={0} />
        )}
      </TableCell>
      <TableCell className="max-w-[150px] truncate">-</TableCell>
      <TableCell className="text-muted-foreground max-w-[25px]">
        <ChevronRight className="size-4" />
      </TableCell>
      <TableCell className="max-w-[150px] truncate">
        <AddressDisplay address={tx?.args?.who} useShortenedAddress />
      </TableCell>
    </TableRow>
  );
};

const NFTTransfer = ({ tx, address }) => {
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
        <InOutBadge address={address} from={tx?.args?.previousOwner} to={tx?.args?.newOwner} />
      </TableCell>
      <TableCell>
        <TimeAgoDate date={tx?.timestamp * 1000} />
      </TableCell>
      <TableCell>
        <div className="flex flex-col gap-2">
          {tx?.args?.serialNumbers.map((tokenId, _) => (
            <div className="flex items-center gap-2" key={_}>
              <NftThumbnail contractAddress={tx?.nftCollection?.contractAddress} tokenId={tokenId} />
              {tokenId} <TokenDisplay token={tx?.nftCollection} hideCopyButton />
            </div>
          ))}
        </div>
      </TableCell>
      <TableCell className="max-w-[150px] truncate">
        <AddressDisplay address={tx?.args?.previousOwner} useShortenedAddress />
      </TableCell>
      <TableCell className="text-muted-foreground max-w-[25px]">
        <ChevronRight className="size-4" />
      </TableCell>
      <TableCell className="max-w-[150px] truncate">
        <AddressDisplay address={tx?.args?.newOwner} useShortenedAddress />
      </TableCell>
    </TableRow>
  );
};

const SFTTransfer = ({ tx, address }) => {
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
        <InOutBadge address={address} from={tx?.args?.previousOwner} to={tx?.args?.newOwner} />
      </TableCell>
      <TableCell>
        <TimeAgoDate date={tx?.timestamp * 1000} />
      </TableCell>
      <TableCell>
        <div className="flex flex-col gap-2">
          {tx?.args?.serialNumbers.map((tokenId, _) => (
            <div className="flex items-center gap-2" key={`${_}_${tx?.nftCollection?.contractAddress}_${tokenId}`}>
              <NftThumbnail contractAddress={tx?.nftCollection?.contractAddress} tokenId={tokenId} />
              <div className="flex items-center gap-2">
                <span>{tokenId}</span>
                <Badge>x{tx?.args?.balances}</Badge>
              </div>

              <TokenDisplay token={tx?.nftCollection} hideCopyButton />
            </div>
          ))}
        </div>
      </TableCell>
      <TableCell className="max-w-[150px] truncate">
        <AddressDisplay address={tx?.args?.previousOwner} useShortenedAddress />
      </TableCell>
      <TableCell className="text-muted-foreground max-w-[25px]">
        <ChevronRight className="size-4" />
      </TableCell>
      <TableCell className="max-w-[150px] truncate">
        <AddressDisplay address={tx?.args?.newOwner} useShortenedAddress />
      </TableCell>
    </TableRow>
  );
};

const SFTMint = ({ tx, address }) => {
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
        <InOutBadge address={address} from={'0x0000000000000000000000'} to={tx?.args?.owner} />
      </TableCell>
      <TableCell>
        <TimeAgoDate date={tx?.timestamp * 1000} />
      </TableCell>
      <TableCell className="max-w-[100px]">
        <div className="flex flex-col gap-2">
          {tx?.args?.serialNumbers.map((tokenId, _) => (
            <div className="flex items-center gap-2" key={`${_}_${tx?.nftCollection?.contractAddress}_${tokenId}`}>
              <NftThumbnail contractAddress={tx?.nftCollection?.contractAddress} tokenId={tokenId} />
              <div className="flex items-center gap-2">
                <span>{tokenId}</span>
                <Badge>x{tx?.args?.balances}</Badge>
              </div>

              <TokenDisplay token={tx?.nftCollection} hideCopyButton />
            </div>
          ))}
        </div>
      </TableCell>
      <TableCell className="max-w-[150px] truncate">-</TableCell>
      <TableCell className="text-muted-foreground max-w-[25px]">
        <ChevronRight className="size-4" />
      </TableCell>
      <TableCell className="max-w-[150px] truncate">
        <AddressDisplay address={tx?.args?.owner} useShortenedAddress />
      </TableCell>
    </TableRow>
  );
};
