import { Address, Hash } from 'viem';

export type TIndexStatus = 'INDEXED' | 'NOT_INDEXED';

export interface IBlock {
  number: number;
  isFinalized: boolean;
  hash: Hash;
  timestamp: number;
  parentHash: Hash;
  stateRoot: string;
  extrinsicsRoot: string;
  evmBlock: {
    hash: Hash;
    parentHash: Hash;
    stateRoot: string;
    miner: Address;
  };
  extrinsicsCount: number;
  transactionsCount: number;
  eventsCount: number;
  spec: string;
}

export interface IEVMTransaction {
  hash: Hash;
  status: 'pending' | 'reverted' | 'success';
  accessList: string[];
  functionSignature?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  functionData?: any;
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
  // TODO
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  events?: any[];
  nonce: number;
  // TODO
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  logs: any[];
  input?: string;
  from: Address;
  to?: Address | null;
  fromLookup?: IAddress;
  toLookup?: IAddress;
}

export interface IEvent {
  eventId: string;
  hash: string;
  extrinsicId?: string;
  blockNumber: number;
  timestamp: number;
  method: string;
  section: string;
  signer: Address;
  doc?: string;
  args: Record<string, unknown>;
}

type ExtrinsicSectionType = 'xrplBridge' | 'ethBridge' | string;

type ExtrinsicSectionArgsType<T extends ExtrinsicSectionType> = T extends 'xrplBridge'
  ? {
      transaction: {
        payment: { address: Address; amount: number };
        currencyPayment: { address: Address; amount: number };
      };
      destination: Address;
      amount: number;
      transaction_hash: string;
    }
  : T extends 'ethBridge'
  ? {
      type: string;
      to: Address;
      erc20Value: { amount: number };
      ethValue: { amount: number };
      erc721Value: { tokenIds: string[]; tokenAddress: Address }[];
      tx_hash: string;
    }
  : // TODO
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Record<string, any>;

export interface IExtrinsic<T extends ExtrinsicSectionType = string> {
  block: number;
  hash?: string;
  timestamp: number;
  extrinsicId: string;
  retroExtrinsicId: string;
  args: ExtrinsicSectionArgsType<T>;
  method: string;
  section: T;
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

  events: IEvent[];
  proxyFeeToken?: IToken;
  allEvents?: IEvent[];
  xrplProcessingOk?: IEvent;
  bridgeErc721Token?: IToken;
  bridgeErc20Token?: IToken;
}

export type TTokenType = 'ERC20' | 'ERC721' | 'ERC1155';
export interface IToken {
  type?: TTokenType;
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
  priceData?: Record<string, number>;
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
  isVerifiedContract?: IVerifiedContract;
  token?: IToken;
}

export interface IStakingValidator {
  era: number;
  validatorName?: string;
  validator: Address;
  nominators: number;
  blocksValidated: number;
  totalRootNominated: number;
  isOversubscribed?: boolean;
}

export interface IVerifiedContract {
  address: Address;
  contractName: string;
  bytecode?: string;
  deployedBlock?: number;
  deployer?: Address;
  abi: object;
}

export interface IBalance {
  address: Address;
  contractAddress: Address;
  balance: number;
  balanceFormatted: string;
  tokenDetails?: IToken;
}
