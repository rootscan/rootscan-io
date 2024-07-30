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

export type IEvent =
  | EventExtrinsicSuccess
  | EventInternalWithdraw
  | EventNewAccount
  | EventBalancesEndowed
  | EventBalancesTransfer
  | EventBalancesReserved
  | EventFuturepassCreated
  | BaseEvent;

export interface BlockRpcResponse {
  author: Address;
  baseFeePerGas: number;
  difficulty: number;
  extraData: string;
  gasLimit: number;
  gasUsed: number;
  hash: Hash;
  logsBloom: string;
  miner: Address;
  nonce: string;
  number: 14392427n;
  parentHash: Hash;
  receiptsRoot: string;
  sha3Uncles: string;
  size: number;
  stateRoot: string;
  timestamp: number;
  totalDifficulty: number;
  transactions: Hash[];
  transactionsRoot: Hash;
  uncles: unknown[];
  blobGasUsed: number;
  excessBlobGas: number;
}

export interface BlockHeaderRpcResponse {
  block: {
    header: {
      parentHash: Hash;
      number: number;
      stateRoot: Hash;
      extrinsicsRoot: Hash;
      digest: unknown[];
    };
    extrinsics: string[];
  };
  // justifications: null;
}
