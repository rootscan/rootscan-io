import { Address, Hash } from 'viem';

export type RuntimeVersion = { specVersion: number; specName: string };

export interface BaseEvent {
  eventId: string;
  extrinsicId?: string;
  blockNumber: number;
  hash: Hash;
  section: string;
  method: string;
  timestamp?: number;
  args: Record<string, unknown>;
  doc?: string;
}

export interface EventExtrinsicSuccess extends BaseEvent {
  method: 'ExtrinsicSuccess';
  section: 'system';
  args: {
    dispatchInfo: {
      weight: number;
      class: string;
      paysFee: string;
    };
  };
}
export interface EventInternalWithdraw extends BaseEvent {
  method: 'InternalWithdraw';
  section: 'assetsExt';
  args: {
    assetId: number;
    who: Address;
    amount: number;
  };
}
export interface EventNewAccount extends BaseEvent {
  method: 'NewAccount';
  section: 'system';
  args: {
    account: Address;
  };
}
export interface EventBalancesEndowed extends BaseEvent {
  method: 'Endowed';
  section: 'balances';
  args: {
    account: Address;
    freeBalance: number;
  };
}
export interface EventBalancesTransfer extends BaseEvent {
  method: 'Transfer';
  section: 'balances';
  args: {
    from: Address;
    to: Address;
    amount: number;
  };
}
export interface EventBalancesReserved extends BaseEvent {
  method: 'Reserved';
  section: 'balances';
  args: {
    who: Address;
    amount: number;
  };
}
export interface EventFuturepassCreated extends BaseEvent {
  method: 'FuturepassCreated';
  section: 'futurepass';
  args: {
    futurepass: Address;
    delegate: Address;
  };
}
export interface EventExecutedEthereum extends BaseEvent {
  method: 'Executed';
  section: 'ethereum';
  args: {
    from: Address;
    to: Address;
    transactionHash: Hash;
    exitReason: {
      succeed: string;
    };
  };
}
export interface EventTransactionFeePaid extends BaseEvent {
  method: 'TransactionFeePaid';
  section: 'transactionPayment';
  args: {
    who: Address;
    actualFee: bigint;
    tip: bigint;
  };
}

export type IEvent =
  | EventExtrinsicSuccess
  | EventInternalWithdraw
  | EventNewAccount
  | EventBalancesEndowed
  | EventBalancesTransfer
  | EventBalancesReserved
  | EventFuturepassCreated
  | EventExecutedEthereum
  | EventTransactionFeePaid
  | BaseEvent;

export interface BlockBaseParams {
  hash: Hash;
  number: number;
  timestamp: number;
}

export interface BlockRpcResponse extends BlockBaseParams {
  author: Address;
  baseFeePerGas: number;
  difficulty: number;
  extraData: string;
  gasLimit: number;
  gasUsed: number;
  logsBloom: string;
  miner: Address;
  nonce: string;
  parentHash: Hash;
  receiptsRoot: string;
  sha3Uncles: string;
  size: number;
  stateRoot: string;
  totalDifficulty: number;
  transactions: Hash[];
  transactionsRoot: Hash;
  uncles: unknown[];
  blobGasUsed: number;
  excessBlobGas: number;
}

export interface BlockResponse {
  block: BlockRpcResponse;
  header: {
    parentHash: Hash;
    number: number;
    stateRoot: Hash;
    extrinsicsRoot: Hash;
    digest: unknown[];
  };
  extrinsics: IExtrinsic[];
}

export interface IExtrinsic {
  block: number;
  hash?: string;
  timestamp: number;
  extrinsicId: string;
  retroExtrinsicId: string;
  args: Record<string, any>;
  method: string;
  section: string;
  isSigned: boolean;
  signature?: string;
  signer?: Address;
  fee?: {
    who: string;
    actualFee: bigint;
    actualFeeFormatted: number;
    tip: bigint;
    tipFormatted: number;
  };
  proxyFee?: {
    who: string;
    paymentAsset: number;
    swappedAmount: number;
    swappedAmountFormatted: number;
  };
  isSuccess?: boolean;
  errorInfo?: string;
  isProxy?: boolean;
  proxiedSections?: string[];
  proxiedMethods?: string[];
}

export interface IExtrinsicWithEvents extends IExtrinsic {
  events: IEvent[];
}
