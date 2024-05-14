import { Fragment } from 'react';

import { ROOT_TOKEN, XRP_TOKEN } from '@/lib/constants/tokens';
import { ChevronRight, ExternalLink } from 'lucide-react';
import Link from 'next/link';

import AddressDisplay from '../address-display';
import NftThumbnail from '../nft-thumbnail';
import TokenDisplay from '../token-display';
import { Badge } from '../ui/badge';

export const components = {
  'futurepass.ProxyExecuted': ({ args }) => (
    <div className="flex items-center gap-2">
      Delegate <AddressDisplay address={args.delegate} /> executed transaction with result OK.
    </div>
  ),
  // "feeProxy.CallWithFeePreferences": "",
  'futurepass.DelegateRegistered': ({ args }) => (
    <div className="flex flex-wrap gap-2">
      Delegate <AddressDisplay address={args?.delegate} useShortenedAddress /> of Futurepass:{' '}
      <AddressDisplay address={args?.futurepass} useShortenedAddress /> was registered. With proxyType set to:{' '}
      {args?.proxyType}.
    </div>
  ),
  'futurepass.FuturepassCreated': ({ args }) => (
    <div className="flex flex-wrap gap-2">
      A new Futurepass was created: <AddressDisplay address={args?.futurepass} useShortenedAddress /> with delegate set
      to: <AddressDisplay address={args?.delegate} useShortenedAddress />
    </div>
  ),
  'futurepass.DelegateUnregistered': ({ args }) => (
    <div className="flex flex-wrap gap-2">
      Delegate <AddressDisplay address={args?.delegate} useShortenedAddress /> of Futurepass:{' '}
      <AddressDisplay address={args?.futurepass} useShortenedAddress /> was unregistered.
    </div>
  ),
  'futurepass.FuturepassTransferred': ({ args }) => (
    <div className="flex flex-wrap gap-2">
      Ownership of Futurepass: <AddressDisplay address={args?.futurepass} useShortenedAddress /> was transferred from:{' '}
      <AddressDisplay address={args?.oldOwner} useShortenedAddress /> to{' '}
      <AddressDisplay address={args?.newOwner} useShortenedAddress />
    </div>
  ),
  // "electionProviderMultiPhase.SignedPhaseStarted": "",
  // "electionProviderMultiPhase.ElectionFinalized": "",
  // "electionProviderMultiPhase.SolutionStored": "",
  // "electionProviderMultiPhase.UnsignedPhaseStarted": "",
  'proxy.ProxyRemoved': ({ args }) => (
    <div className="flex flex-wrap gap-2">
      Delegatee <AddressDisplay address={args?.delegatee} useShortenedAddress /> was removed from delegator:{' '}
      <AddressDisplay address={args?.delegator} useShortenedAddress /> with proxyType set to: {args?.proxyType} and a
      delay of {args?.delay}.
    </div>
  ),
  'proxy.ProxyAdded': ({ args }) => (
    <div className="flex flex-wrap gap-2">
      Delegatee <AddressDisplay address={args?.delegatee} useShortenedAddress /> was added to delegator:{' '}
      <AddressDisplay address={args?.delegator} useShortenedAddress /> with proxyType set to: {args?.proxyType} and a
      delay of {args?.delay}.
    </div>
  ),
  'proxy.ProxyExecuted': () => <div className="flex items-center gap-2">Proxied extrinsic executed successfully.</div>,
  'utility.BatchInterrupted': ({ args }) => (
    <div className="flex items-center gap-2">Batch with index {args?.index} has interrupted.</div>
  ),
  'utility.ItemCompleted': () => (
    <div className="flex items-center gap-2">An item in batch execution has completed.</div>
  ),
  'utility.BatchCompleted': () => <div className="flex items-center gap-2">A batch has completed successfully.</div>,
  'balances.Unreserved': ({ args }) => (
    <div className="flex flex-wrap items-center gap-2">
      {args?.amount ? (
        <TokenDisplay token={ROOT_TOKEN} amount={args?.amount} />
      ) : (
        <TokenDisplay token={ROOT_TOKEN} amount={0} />
      )}
      moved from reserved to free on
      <AddressDisplay address={args?.who} useShortenedAddress />
    </div>
  ),
  'balances.Reserved': ({ args }) => (
    <div className="flex flex-wrap items-center gap-2">
      {args?.amount ? (
        <TokenDisplay token={ROOT_TOKEN} amount={args?.amount} />
      ) : (
        <TokenDisplay token={ROOT_TOKEN} amount={0} />
      )}
      moved from free to reserved on
      <AddressDisplay address={args?.who} useShortenedAddress />
    </div>
  ),
  'balances.Transfer': ({ args }) => (
    <div className="flex flex-wrap items-center gap-2">
      Transfer of
      {args?.amount ? (
        <TokenDisplay token={ROOT_TOKEN} amount={args?.amount} />
      ) : (
        <TokenDisplay token={ROOT_TOKEN} amount={0} />
      )}
      from
      <AddressDisplay address={args?.from} useShortenedAddress />{' '}
      <ChevronRight className="text-muted-foreground size-4" />
      to <AddressDisplay address={args?.to} useShortenedAddress />
    </div>
  ),
  'balances.Endowed': ({ args }) => (
    <div className="flex flex-wrap items-center gap-1">
      A balance of
      {args?.freeBalance ? (
        <TokenDisplay token={ROOT_TOKEN} amount={args?.freeBalance} />
      ) : (
        <TokenDisplay token={ROOT_TOKEN} amount={0} />
      )}
      was endowed on
      <AddressDisplay address={args?.account} useShortenedAddress />
    </div>
  ),
  'transactionPayment.TransactionFeePaid': ({ args }) => (
    <div className="flex flex-wrap items-center gap-1">
      A transaction fee of
      {args?.actualFee ? (
        <TokenDisplay token={XRP_TOKEN} amount={args?.actualFee} />
      ) : (
        <TokenDisplay token={XRP_TOKEN} amount={0} />
      )}
      was paid by
      <AddressDisplay address={args?.who} useShortenedAddress />
    </div>
  ),
  // "multisig.NewMultisig": "",
  // "multisig.MultisigApproval": "",
  // "multisig.MultisigExecuted": "",
  'sft.CollectionCreate': ({ args }) => (
    <div className="flex flex-col flex-wrap gap-2">
      <div className="max-w-full whitespace-pre-line">
        A new SFT (ERC1155) collection has been created with collectionId: {args?.collectionId}
      </div>
      <div className="max-w-full whitespace-pre-line">Name: {args?.name}</div>
      <div className="flex max-w-full flex-wrap items-center gap-1 whitespace-pre-line">
        Collection Owner: <AddressDisplay address={args?.collectionOwner} />
      </div>
      <div className="max-w-full whitespace-pre-line">Metadata URI: {args?.metadataScheme}</div>
    </div>
  ),
  'sft.OwnerSet': ({ args }) => (
    <div className="flex flex-wrap items-center gap-2">
      Ownership of collectionId: {args?.collectionId} updated to: <AddressDisplay address={args?.newOwner} />
    </div>
  ),
  'sft.Transfer': (event) => (
    <Fragment>
      {event?.args?.serialNumbers.map((tokenId, _) => (
        <div className="flex flex-wrap items-center gap-2" key={_}>
          Transfer of <Badge>{event?.args?.balances[_]} x</Badge>
          <NftThumbnail contractAddress={event?.nftCollection?.contractAddress} tokenId={tokenId} /> TokenID {tokenId}{' '}
          of
          <TokenDisplay token={event?.nftCollection} hideCopyButton /> from{' '}
          <AddressDisplay address={event?.args?.previousOwner} useShortenedAddress />
          to
          <AddressDisplay address={event?.args?.newOwner} useShortenedAddress />
        </div>
      ))}
    </Fragment>
  ),
  'sft.Mint': ({ args }) => (
    <div className="flex flex-col gap-2">
      SFT (ERC1155) tokens were minted for collectionId: {args?.collectionId}
      {args?.serialNumbers?.map((item, _) => (
        <div className="flex flex-wrap items-center gap-2" key={_}>
          <span>TokenId: {args?.serialNumbers?.[_]}</span> <span className="truncate">Qty: {args?.balances?.[_]}</span>
        </div>
      ))}
      <div className="flex flex-wrap items-center gap-2">
        All tokens were minted to: <AddressDisplay address={args?.owner} />
      </div>
    </div>
  ),
  'sft.TokenCreate': ({ args }) => (
    <div className="flex flex-col gap-2">
      <span>
        TokenId {args?.tokenId?.[1]} was issued to collectionId: {args?.tokenId?.[0]}
      </span>
      <span>Initial Issuance: {args?.initialIssuance || '0'}</span>
      <span>Max Issuance: {args?.maxIssuance || 'Infinity'}</span>
      <span>Token Name: {args?.tokenName || 'Unknown'}</span>
      <div className="flex flex-wrap items-center gap-1">
        Token Owner: <AddressDisplay address={args?.tokenOwner} />
      </div>
    </div>
  ),
  'sft.BaseUriSet': ({ args }) => (
    <div className="flex items-center gap-2">
      Metadata URI updated for collectionId: {args?.collectionId} to {args?.metadataScheme}
    </div>
  ),
  // "erc20Peg.Erc20Deposit": "",
  // "erc20Peg.PaymentDelaySet": "",
  // "erc20Peg.Erc20DepositFail": "",
  // "erc20Peg.SetRootPegContract": "",
  // "erc20Peg.Erc20Withdraw": "",
  // "nftPeg.Erc721Mint": "",
  // "nftPeg.Erc721Withdraw": "",
  // "nftPeg.Erc721Deposit": "",
  'assets.Transferred': ({ args, token }) => (
    <div className="flex flex-wrap items-center gap-2">
      Transfer of
      <TokenDisplay token={token} amount={args?.amount} />
      from
      <AddressDisplay address={args?.from} useShortenedAddress />{' '}
      <ChevronRight className="text-muted-foreground size-4" />{' '}
      <AddressDisplay address={args?.to} useShortenedAddress />
    </div>
  ),
  'assets.Issued': ({ args, token }) => (
    <div className="flex flex-wrap gap-2">
      Issued <TokenDisplay token={token} amount={args?.totalSupply} /> to
      <AddressDisplay address={args?.owner} useShortenedAddress />
    </div>
  ),
  'assets.ApprovedTransfer': ({ args, token }) => (
    <div className="flex flex-wrap gap-2">
      Delegate <AddressDisplay address={args?.delegate} useShortenedAddress /> was approved to spend{' '}
      <TokenDisplay token={token} amount={args?.amount} />
      from
      <AddressDisplay address={args?.source} useShortenedAddress />
    </div>
  ),
  'assets.ForceCreated': ({ args, token }) => (
    <div className="flex flex-wrap gap-2">
      <TokenDisplay token={token} /> was force created by
      <AddressDisplay address={args?.owner} useShortenedAddress />
    </div>
  ),
  'assets.MetadataSet': ({ args, token }) => (
    <div className="flex flex-col flex-wrap gap-2">
      Metadata for <TokenDisplay token={token} amount={args?.amount} /> was updated to:
      <span>Name: {args?.name}</span>
      <span>Symbol: {args?.symbol}</span>
      <span>Decimals: {args?.decimals}</span>
      <span>Is Frozen: {args?.isFrozen ? 'Yes' : 'No'}</span>
    </div>
  ),
  'assets.Burned': ({ args, token }) => (
    <div className="flex flex-wrap gap-2">
      <TokenDisplay token={token} amount={args?.balance} /> burned from
      <AddressDisplay address={args?.owner} useShortenedAddress />
    </div>
  ),
  // "offences.Offence": "",
  // "assetsExt.SplitTransfer": "",
  // "assetsExt.InternalDeposit": "",
  // "assetsExt.InternalWithdraw": "",
  // "assetsExt.AssetDepositSet": "",
  // "assetsExt.SpendHold": "",
  // "assetsExt.PlaceHold": "",
  'assetsExt.CreateAsset': ({ args }) => (
    <div className="flex flex-wrap gap-2">
      A new asset with assetId: {args?.assetId} was created by{' '}
      <AddressDisplay address={args?.creator} useShortenedAddress /> with an initial supply of {args?.initialBalance}.
    </div>
  ),
  // "assetsExt.ReleaseHold": "",
  // "ethBridge.ProcessingFailed": "",
  // "ethBridge.EventSend": "",
  // "ethBridge.EventSubmit": "",
  // "ethBridge.ProcessingOk": "",
  // "ethBridge.AuthoritySetChange": "",
  // "ethBridge.ProofDelayed": "",
  // "system.ExtrinsicFailed": "",
  'system.ExtrinsicSuccess': ({ args }) => (
    <div className="flex flex-wrap gap-2">
      An extrinsic has succeeded with a weight of {args?.dispatchInfo?.weight}.
    </div>
  ),
  'system.NewAccount': ({ args }) => (
    <div className="flex flex-wrap gap-2">
      Account <AddressDisplay address={args?.account} useShortenedAddress /> was created by the system.
    </div>
  ),
  // "system.CodeUpdated": "",
  // "system.Remarked": "",
  'system.KilledAccount': ({ args }) => (
    <div className="flex flex-wrap gap-2">
      Account <AddressDisplay address={args?.account} useShortenedAddress /> was killed by the system.
    </div>
  ),
  // "staking.Withdrawn": "",
  // "staking.ValidatorPrefsSet": "",
  // "staking.Unbonded": "",
  // "staking.StakersElected": "",
  // "staking.Chilled": "",
  // "staking.EraPaid": "",
  // "staking.Bonded": "",
  // "sudo.Sudid": "",
  // "sudo.SudoAsDone": "",
  // "evm.Executed": "",
  // "evm.Log": "",
  // "evm.ExecutedFailed": "",
  // "nft.AuctionSold": "",
  // "nft.OfferAccept": "",
  // "nft.FixedPriceSaleClose": "",
  // "nft.OfferCancel": "",
  // "nft.CollectionCreate": "",
  // "nft.AuctionOpen": "",
  // "nft.Offer": "",
  'nft.Mint': ({ args }) => (
    <div className="flex flex-wrap gap-2">
      NFTs from collectionId: {args?.collectionId} were minted from tokenId: {args?.start} to tokenId: {args?.end} to{' '}
      <AddressDisplay address={args?.owner} useShortenedAddress />
    </div>
  ),
  'nft.Transfer': (event) => (
    <Fragment>
      {event?.args?.serialNumbers.map((tokenId, _) => (
        <div className="flex flex-wrap items-center gap-2" key={_}>
          Transfer of <NftThumbnail contractAddress={event?.nftCollection?.contractAddress} tokenId={tokenId} /> TokenID{' '}
          {tokenId}
          <TokenDisplay token={event?.nftCollection} hideCopyButton /> from{' '}
          <AddressDisplay address={event?.args?.previousOwner} useShortenedAddress />
          to
          <AddressDisplay address={event?.args?.newOwner} useShortenedAddress />
        </div>
      ))}
    </Fragment>
  ),
  // "nft.FixedPriceSalePriceUpdate": "",
  'nft.AuctionClose': ({ args }) => (
    <div className="flex max-w-full flex-wrap gap-1 whitespace-pre-line">
      Auction on listingId {args?.listingId} for collectionId {args?.collectionId} has closed with reason:{' '}
      {args?.reason}.
    </div>
  ),
  'nft.BaseUriSet': ({ args }) => (
    <div className="flex max-w-full flex-wrap gap-1 whitespace-pre-line">
      NFT (ERC721) base URI for collectionId: {args?.collectionId} was updated to{' '}
      <span className="block max-w-full truncate whitespace-pre-line">{args?.baseUri}</span>
    </div>
  ),
  'nft.OwnerSet': ({ args }) => (
    <div className="flex flex-wrap gap-2">
      Owner of collectionId: {args?.collectionId} was updated to{' '}
      <AddressDisplay address={args?.newOwner} useShortenedAddress />
    </div>
  ),
  'nft.RoyaltiesScheduleSet': ({ args }) => (
    <div className="flex flex-col flex-wrap gap-2">
      Royalties of collectionId: {args?.collectionId} was updated to:{' '}
      {args?.royaltiesSchedule?.entitlements.map((item, _) => (
        <div key={_} className="flex flex-wrap items-center gap-2">
          <AddressDisplay address={item?.[0]} useShortenedAddress />{' '}
          <ChevronRight className="text-muted-foreground size-4" />
          {item?.[1]}
        </div>
      ))}
    </div>
  ),
  'nft.NameSet': ({ args }) => (
    <div className="flex flex-wrap gap-2">
      Name of collectionId: {args?.collectionId} was updated to: {args?.name}
    </div>
  ),
  // "nft.Bid": "",
  // "nft.BridgedMint": "",
  // "nft.FixedPriceSaleList": "",
  // "nft.FixedPriceSaleComplete": "",
  'nft.CollectionClaimed': ({ args }) => (
    <div className="flex flex-wrap gap-2">
      An NFT (ERC721) collection with collectionId: {args?.collectionId} has been claimed by:{' '}
      <AddressDisplay address={args?.account} useShortenedAddress />
    </div>
  ),
  // "vortexDistribution.VtxDistCreated": "",
  // "vortexDistribution.RewardRegistered": "",
  'vortexDistribution.VtxDistPaidOut': ({ args }) => (
    <div className="flex flex-wrap gap-2">
      {args?.amount} (unformatted) tokens were successfully paid out for Vortex distribution of id: {args?.id} by{' '}
      <AddressDisplay address={args?.who} useShortenedAddress />
    </div>
  ),
  'vortexDistribution.VtxDistDone': ({ args }) => (
    <div className="flex flex-wrap gap-2">Vortex distribution is done for id: {args?.id}</div>
  ),
  // "vortexDistribution.AdminAccountChanged": "",
  'vortexDistribution.VtxDistStarted': ({ args }) => (
    <div className="flex flex-wrap gap-2">Vortex distribution has started for id: {args?.id}</div>
  ),
  // "vortexDistribution.SetAssetPrices": "",
  // "vortexDistribution.TriggerVtxDistribution": "",
  // "xrplBridge.WithdrawRequest": "",
  'xrplBridge.ProcessingOk': ({ args }) => (
    <div className="max-w-full whitespace-pre-line break-words">
      A bridge transaction with incoming transaction hash:{' '}
      <Link href={`https://xrpscan.com/tx/${args?.XrplTxHash}`} target="_blank" className="flex items-center gap-1">
        {args?.XrplTxHash} <ExternalLink className="size-5" />
      </Link>{' '}
      (Ledger Index: {args?.LedgerIndex}) has finished processing.
    </div>
  ),
  // "xrplBridge.TicketSequenceThresholdReached": "",
  // "xrplBridge.TransactionAdded": "",
  // "xrplBridge.DoorNextTicketSequenceParamSet": "",
  // "grandpa.NewAuthorities": "",
  // "maintenanceMode.CallBlocked": "",
  // "xls20.Xls20MintRequest": "",
  // "xls20.Xls20CompatibilityEnabled": "",
  'xls20.Xls20MappingSet': ({ args }) => (
    <div className="flex flex-col gap-2">
      <span>XLS20 Mapping Set was updated for collectionId: {args.collectionId}</span>

      {args?.mappings?.map((item, _) => (
        <div className="flex flex-wrap items-center gap-2" key={_}>
          <span>TokenId {item?.[0]}</span> <ChevronRight className="text-muted-foreground size-4" />{' '}
          <span className="truncate">XLS20: {item?.[1]}</span>
        </div>
      ))}
    </div>
  ),
  'session.NewSession': ({ args }) => (
    <div className="flex flex-wrap gap-2">A new session was started with session index: {args?.sessionIndex}</div>
  ),
  // "ethereum.Executed": "",
  // "imOnline.HeartbeatReceived": "",
  // "imOnline.SomeOffline": "",
  // "imOnline.AllGood": "",
  // "marketplace.AuctionSold": "",
  // "marketplace.OfferAccept": "",
  // "marketplace.FixedPriceSaleClose": "",
  // "marketplace.Bid": "",
  // "marketplace.OfferCancel": "",
  // "marketplace.FixedPriceSaleComplete": "",
  // "marketplace.FixedPriceSaleList": "",
  // "marketplace.FixedPriceSalePriceUpdate": "",
  // "marketplace.Offer": "",
  // "marketplace.AuctionOpen": "",
  // "marketplace.AuctionClose": "",
  // "scheduler.Scheduled": "",
  // "scheduler.Dispatched": "",
  // "voterList.Rebagged": "",
  // "voterList.ScoreUpdated": "",
  // "dex.RemoveLiquidity": "",
  // "dex.AddLiquidity": "",
  'dex.Swap': (event) => (
    <div className="flex flex-wrap gap-2">
      Swapped
      <TokenDisplay
        token={event?.swapFromToken}
        amount={event?.args?.supply_Asset_amount}
        priceData={event?.swapFromToken?.priceData}
      />{' '}
      to
      <TokenDisplay
        token={event?.swapToToken}
        amount={event?.args?.target_Asset_amount}
        priceData={event?.swapFromToken?.priceData}
      />
    </div>
  ),
};

const allowedInExtrinsics = [
  'balances.Unreserved',
  'balances.Reserved',
  'balances.Transfer',
  // "balances.Endowed",

  'sft.Mint',
  'nft.Mint',
  'nft.Transfer',
  'sft.Transfer',

  'assets.Transferred',
  'assets.Issued',
  'assets.ApprovedTransfer',
  'assets.Burned',

  'dex.Swap',
  'dex.RemoveLiquidity',
  'dex.AddLiquidity',

  'marketplace.AuctionSold',
  'marketplace.OfferAccept',
  'marketplace.FixedPriceSaleClose',
  'marketplace.Bid',
  'marketplace.OfferCancel',
  'marketplace.FixedPriceSaleComplete',
  'marketplace.FixedPriceSaleList',
  'marketplace.FixedPriceSalePriceUpdate',
  'marketplace.Offer',
  'marketplace.AuctionOpen',
  'marketplace.AuctionClose',
];

export const isAllowedEventInExtrinsic = (props) => {
  const key = `${props.section}.${props.method}`;

  if (components?.[key] && allowedInExtrinsics.includes(key)) {
    return true;
  }

  return false;
};

export const hasParsedEventsAvailableExtrinsics = (events) => {
  let state = false;

  for (const event of events) {
    const a = isAllowedEventInExtrinsic(event);
    if (a) {
      state = a;
    }
  }

  return state;
};

export const getEventComponent = (props, extrinsicsMode = false) => {
  const key = `${props.section}.${props.method}`;
  if (extrinsicsMode && !allowedInExtrinsics.includes(key)) {
    return null;
  }

  const eventDetails = components?.[key]?.(props);
  if (!eventDetails) {
    return <div>No parsed event found. Please refer to raw arguments.</div>;
  }
  return <div>{eventDetails}</div>;
};
