import { Address, Hash } from 'viem';

export type TIndexStatus = 'INDEXED' | 'NOT_INDEXED';

export interface IEvent {
  eventId: string;
  hash: string;
  extrinsicId?: string;
  blockNumber: number;
  timestamp: number;
  method: string;
  section: string;
  doc?: string;
  args: Record<string, any>;
  _nftOwnersProcessed?: boolean;
}

export interface IExtrinsic {
  block: number;
  hash?: string;
  timestamp: number;
  extrinsicId: string;
  retroExtrinsicId: string;
  args: any;
  method: string;
  section: string;
  isSigned: boolean;
  signature?: string;
  signer?: Address;
  fee?: {
    who: string;
    actualFee: number;
    actualFeeFormatted: number;
    tip: number;
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

export type TTokenType = 'ERC20' | 'ERC721' | 'ERC1155';
export interface IToken {
  type: TTokenType;
  name: string;
  symbol: string;
  decimals?: number;
  ethereumContractAddress?: string;
  uri?: string;
  contractAddress: Address;
  assetId?: number;
  collectionId?: number;
  totalSupply?: number;
  totalSupplyFormatted?: number;
  priceData?: object;
}

export interface INFT {
  contractAddress: string;
  type: 'ERC721' | 'ERC1155';
  tokenId: number;
  amount?: number;
  owner: Address;
  image?: string;
  animation_url?: string;
  attributes?: object;
}
export interface INftOwner {
  contractAddress: string;
  collectionId?: number;
  type: 'ERC721' | 'ERC1155';
  tokenId: number;
  amount?: number;
  owner: Address;
  blockNumber?: number;
  method?: string;
  eventId?: string;
  timestamp?: number;
  image?: string;
  animation_url?: string;
  attributes?: object;
  transactionHash?: string;
}

export interface INativeBalance {
  free: number;
  freeFormatted: string;
  reserved: number;
  reservedFormatted: string;
  frozen?: number;
  frozenFormatted?: string | null;
  // parameters bottom are deprecated with new substrate version 1.0
  miscFrozen?: number;
  miscFrozenFormatted?: string | null;
  feeFrozen?: number;
  feeFrozenFormatted?: string | null;
}

export interface IAddress {
  address: Address;
  rns?: string;
  nameTag: string;
  isContract?: boolean;
  balance: INativeBalance;
}
export interface IStakingValidator {
  era: number;
  validatorName?: string;
  validator: Address;
  nominators: number;
  totalRootNominated: number;
  isOversubscribed?: boolean;
}

export interface IVerifiedContract {
  address: Address;
  contractName: string;
  bytecode?: string;
  deployedBlock?: number;
  deployer?: string;
  abi: object;
}

export interface IBalance {
  address: Address;
  contractAddress: Address;
  balance: number;
  balanceFormatted: string;
}

export interface IBlock {
  number: number;
  isFinalized: boolean;
  hash: string;
  timestamp: number;
  parentHash: string;
  stateRoot: string;
  extrinsicsRoot: string;
  evmBlock: {
    hash: string;
    parentHash: string;
    stateRoot: string;
    miner: string;
  };
  extrinsicsCount: number;
  transactionsCount: number;
  eventsCount: number;
  spec: string;
}

export interface IEVMTransaction {
  hash: Hash;
  status: string;
  accessList: string[];
  functionSignature?: string;
  functionData?: object;
  deployData?: object;
  blockNumber: number;
  transactionIndex?: number;
  contractAddress?: Address;
  gas: number;
  gasUsed: number;
  gasPrice: string;
  maxPriorityFeePerGas?: string;
  effectiveGasPrice?: string;
  functionName?: string;
  value: number;
  valueFormatted?: string;
  type: string;
  transactionFee: string;
  timestamp?: number;
  tags?: string[];
  events?: object[];
  nonce: number;
  logs: any[];
  input?: string;
  from: Address;
  to?: Address | null;
  _nftOwnersProcessed?: boolean;
}

export interface IBulkWriteUpdateOp<T = object> {
  updateOne: { filter: Partial<T>; update: { $set: Partial<T>; $inc?: Partial<T> }; upsert?: boolean };
}

export interface IBulkWriteDeleteOp {
  deleteOne: { filter: object };
}
export interface IActiveEra {
  index: number;
  start: number;
}
export type TExtrinsicId = `${string}-${string}`;
export type TRetroExtrinsicId = `${string}-${string}-${string}`;
