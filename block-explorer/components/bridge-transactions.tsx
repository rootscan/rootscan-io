import { Fragment } from 'react';

import AddressDisplay from '@/components/address-display';
import NftThumbnail from '@/components/nft-thumbnail';
import TimeAgoDate from '@/components/time-ago-date';
import TokenDisplay from '@/components/token-display';
import Tooltip from '@/components/tooltip';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ETH_TOKEN, XRP_TOKEN } from '@/lib/constants/tokens';
import { ExternalLink, SortDesc } from 'lucide-react';
import Link from 'next/link';

export default function BridgeTransactions({ transactions }) {
  return (
    <Fragment>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Type</TableHead>
            <TableHead>
              <div className="flex items-center gap-2">
                <SortDesc className="size-5" /> Timestamp
              </div>
            </TableHead>
            <TableHead>Blockchain</TableHead>
            <TableHead>From</TableHead>
            <TableHead>Beneficiary</TableHead>
            <TableHead>Amount / Token</TableHead>
            <TableHead>External</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactions.map((tx, _) => {
            if (tx?.section === 'xrplBridge' && tx?.method === 'submitTransaction') {
              return <XRPDeposit tx={tx} key={_} />;
            }
            if (tx?.section === 'xrplBridge' && tx?.method === 'withdrawXrp') {
              return <XRPWithdraw tx={tx} key={_} />;
            }
            if (tx?.section === 'ethBridge' && tx?.method === 'submitEvent') {
              return <ETHBridgeSubmitEvent tx={tx} key={_} />;
            }

            return <Fragment key={_} />;
          })}
        </TableBody>
      </Table>
    </Fragment>
  );
}

const ETHBridgeSubmitEvent = ({ tx }) => {
  return (
    <TableRow>
      <TableCell className="max-w-[100px]">
        {tx?.args?.type === 'inbox' ? (
          <Badge variant="success">Deposit</Badge>
        ) : (
          <Badge variant="warning">Withdraw</Badge>
        )}
      </TableCell>
      <TableCell>
        <TimeAgoDate date={tx?.timestamp * 1000} />
      </TableCell>
      <TableCell>Ethereum</TableCell>
      <TableCell className="max-w-[150px] truncate">-</TableCell>
      <TableCell className="max-w-[150px] truncate">
        <AddressDisplay address={tx?.args?.to} useShortenedAddress />
      </TableCell>
      <TableCell>
        {tx?.args?.erc20Value ? (
          <TokenDisplay token={tx?.bridgeErc20Token} amount={tx?.args?.erc20Value?.amount} hideCopyButton />
        ) : tx?.args?.erc721Value ? (
          <div>
            {tx?.args?.erc721Value?.map((item, _) => (
              <div key={_}>
                {item?.tokenIds?.map((tokenId, _) => (
                  <div className="flex items-center gap-2" key={`${_}_${item?.tokenAddress}_${tokenId}`}>
                    <NftThumbnail contractAddress={tx?.bridgeErc721Token?.contractAddress} tokenId={tokenId} />
                    {tokenId}
                    <TokenDisplay token={tx?.bridgeErc721Token} hideCopyButton />
                  </div>
                ))}
              </div>
            ))}
          </div>
        ) : tx?.args?.ethValue ? (
          <TokenDisplay token={ETH_TOKEN} amount={tx?.args?.ethValue?.amount} hideCopyButton />
        ) : null}
      </TableCell>
      <TableCell>
        <Tooltip text="View on Etherscan">
          <Link href={`https://etherscan.io/tx/${tx?.args?.tx_hash}`} target="_blank">
            <ExternalLink className="text-muted-foreground size-5" />
          </Link>
        </Tooltip>
      </TableCell>
    </TableRow>
  );
};

const XRPDeposit = ({ tx }) => {
  return (
    <TableRow>
      <TableCell className="max-w-[100px]">
        <Badge variant="success">Deposit</Badge>
      </TableCell>
      <TableCell>
        <TimeAgoDate date={tx?.timestamp * 1000} />
      </TableCell>
      <TableCell>XRP</TableCell>
      <TableCell className="max-w-[150px] truncate">-</TableCell>
      <TableCell className="max-w-[150px] truncate">
        <AddressDisplay address={tx?.args?.transaction?.payment?.address} useShortenedAddress />
      </TableCell>
      <TableCell>
        <TokenDisplay token={XRP_TOKEN} amount={tx?.args?.transaction?.payment?.amount} hideCopyButton />
      </TableCell>
      <TableCell>
        <Link href={`https://xrpscan.com/tx/${tx?.args?.transaction_hash}`} target="_blank">
          <ExternalLink className="text-muted-foreground size-5" />
        </Link>
      </TableCell>
    </TableRow>
  );
};

const XRPWithdraw = ({ tx }) => {
  return (
    <TableRow>
      <TableCell className="max-w-[100px]">
        <Badge variant="destructive">Withdraw</Badge>
      </TableCell>
      <TableCell>
        <TimeAgoDate date={tx?.timestamp * 1000} />
      </TableCell>
      <TableCell>XRP</TableCell>
      <TableCell className="max-w-[150px] truncate">-</TableCell>
      <TableCell className="max-w-[150px] truncate">
        <AddressDisplay address={tx?.args?.destination} useShortenedAddress />
      </TableCell>
      <TableCell>
        <TokenDisplay token={XRP_TOKEN} amount={tx?.args?.amount} hideCopyButton />
      </TableCell>
      <TableCell>
        <Link href={`https://xrpscan.com/tx/${tx?.args?.transaction_hash}`} target="_blank">
          <ExternalLink className="text-muted-foreground size-5" />
        </Link>
      </TableCell>
    </TableRow>
  );
};
