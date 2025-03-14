import { porciniClient, rootClient } from '@/lib/viem-client';
import { PaginationParams, PaginationResponse } from '@/types/api-types';
import {
  IAddress,
  IBalance,
  IBlock,
  IEVMTransaction,
  IEvent,
  IExtrinsic,
  INftOwner,
  IStakingValidator,
  IToken,
  IVerifiedContract,
  TTokenType,
} from '@/types/models';
import { ClientWithEns } from '@ensdomains/ensjs/dist/types/contracts/consts';
import { getName } from '@ensdomains/ensjs/public';
import Debug from 'debug';
import { Address, Hash } from 'viem';
import { normalize } from 'viem/ens';
import { logger } from './logger';
import { createServerAction, ServerActionError, ServerActionResult } from './action-utils';

const debug = Debug('rootscan:api');

const BASE_URL = process.env.BASE_URL;

const fetcher = async ({
  url,
  body,
  method = 'POST',
  noBaseUrl = false,
  cacheDuration,
}: {
  url: string;
  body?: BodyInit;
  method?: string;
  noBaseUrl?: boolean;
  cacheDuration?: number;
}) => {
  const useUrl = noBaseUrl ? url : `${BASE_URL}${url}`;
  
  // Use dynamic caching strategy based on the endpoint
  const cache: Partial<RequestInit> = {
    next: { revalidate: cacheDuration || 10 }, // Default to 10 seconds if not specified
  };

  try {
    const response = await fetch(useUrl, {
      method,
      keepalive: false,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      ...cache,
      body,
    });

    if (response.ok) {
      return response.json();
    } else {
      const text = await response.text();
      logger.error('API Error Details:', {
        url: useUrl,
        method,
        status: response.status,
        statusText: response.statusText,
        requestBody: body ? JSON.parse(body.toString()) : null,
        responseBody: text,
        timestamp: new Date().toISOString(),
      });

      let message = '';
      try {
        const err = JSON.parse(text);
        message = err.message;
      } catch (a) {
        message = text;
      }
      throw new Error(message || text);
    }
  } catch (error) {
    logger.error('Fetcher Error:', {
      url: useUrl,
      method,
      requestBody: body ? JSON.parse(body.toString()) : null,
      error: error instanceof Error ? {
        message: error.message,
        stack: error.stack,
      } : error,
      timestamp: new Date().toISOString(),
    });
    throw error;
  }
};

export type ApiIO<Input = Record<string, unknown>, Output = unknown> = {
  input: Input;
  output: Output;
};

export enum ApiCommand {
  // Blocks
  getBlock,
  getBlocks,
  // Extrinsics
  getExtrinsic,
  getExtrinsics,
  getExtrinsicsInBlock,
  getExtrinsicsForAddress,
  // Events
  getEvent,
  getEvents,
  // Transactions
  getTransaction,
  getTransactions,
  getTransactionsInBlock,
  getEVMTransactionsForWallet,
  getNativeTransfersForAddress,
  // addresses
  getAddress,
  getAddresses,
  // Tokens
  getToken,
  getTokens,
  getTokenHolders,
  getTokenBalances,
  getTokenTransfersFromAddress,
  // Nfts
  getNft,
  getNftCollectionsForAddress,
  getNftsForAddress,
  getVerifiedContracts,
  getFuturepasses,
  getChainSummary,
  getStakingValidators,
  getDex,
  getRootPrice,
  getBridgeTransactions,
}

type ApiCommandMap = {
  // Blocks
  [ApiCommand.getBlock]: ApiIO<{ number: number }, IBlock | null>;
  [ApiCommand.getBlocks]: ApiIO<PaginationParams, PaginationResponse<IBlock>>;
  // Extrinsics
  [ApiCommand.getExtrinsic]: ApiIO<{ extrinsicId: string }, IExtrinsic | null>;
  [ApiCommand.getExtrinsics]: ApiIO<PaginationParams, PaginationResponse<IExtrinsic>>;
  [ApiCommand.getExtrinsicsInBlock]: ApiIO<{ number: number }, IExtrinsic[]>;
  [ApiCommand.getExtrinsicsForAddress]: ApiIO<PaginationParams & { address: Address }, PaginationResponse<IExtrinsic>>;
  // Events
  [ApiCommand.getEvent]: ApiIO<{ eventId: string }, IEvent | null>;
  [ApiCommand.getEvents]: ApiIO<
    PaginationParams & { query?: { extrinsicId?: string; blockNumber?: number } },
    PaginationResponse<IEvent>
  >;

  // Transactions
  [ApiCommand.getTransaction]: ApiIO<{ hash: Hash }, IEVMTransaction & { xrpPriceData: IToken['priceData'] }>; // xrpPriceData
  [ApiCommand.getTransactions]: ApiIO<PaginationParams, PaginationResponse<IEVMTransaction>>;
  [ApiCommand.getTransactionsInBlock]: ApiIO<PaginationParams & { block: number }, PaginationResponse<IEVMTransaction>>;
  [ApiCommand.getEVMTransactionsForWallet]: ApiIO<
    PaginationParams & { address: Address },
    PaginationResponse<IEVMTransaction>
  >;
  [ApiCommand.getNativeTransfersForAddress]: ApiIO<PaginationParams & { address: Address }, PaginationResponse<IEvent>>;
  // Blocks
  [ApiCommand.getAddress]: ApiIO<{ address: Address }, (IAddress & { rootPriceData: IToken['priceData'] }) | null>;
  [ApiCommand.getAddresses]: ApiIO<PaginationParams, PaginationResponse<{ xrpBalance?: number } & IAddress>>;
  // Tokens
  [ApiCommand.getToken]: ApiIO<{ contractAddress: Address }, (IToken & { holders: number }) | null>;
  [ApiCommand.getTokens]: ApiIO<PaginationParams & { type: string }, PaginationResponse<IToken>>;
  [ApiCommand.getTokenHolders]: ApiIO<
    PaginationParams & { contractAddress: Address },
    PaginationResponse<IToken> & { type: TTokenType }
  >;
  [ApiCommand.getTokenBalances]: ApiIO<PaginationParams & { address: Address }, PaginationResponse<IBalance>>;
  // Nfts
  [ApiCommand.getNft]: ApiIO<
    { contractAddress: Address; tokenId: number | string },
    INftOwner & {
      nftCollection?: IAddress;
    }
  >;
  [ApiCommand.getNftCollectionsForAddress]: ApiIO<
    PaginationParams & { address: Address },
    PaginationResponse<{
      contractAddress: Address;
      count: number;
      tokenLookUp: IToken;
    }>
  >;
  [ApiCommand.getNftsForAddress]: ApiIO<
    PaginationParams & { address: Address; contractAddress: Address },
    PaginationResponse<INftOwner>
  >;
  [ApiCommand.getVerifiedContracts]: ApiIO<PaginationParams, PaginationResponse<IVerifiedContract>>;
  [ApiCommand.getTokenTransfersFromAddress]: ApiIO<
    PaginationParams & { address: Address },
    PaginationResponse<
      IEVMTransaction & {
        _id: string;
        name: string;
        address: Address;
        symbol: string;
        tokenId: string;
        formattedAmount: string;
      }
    >
  >;
  [ApiCommand.getFuturepasses]: ApiIO<PaginationParams & { address: Address }, PaginationResponse<IEvent>>;
  [ApiCommand.getChainSummary]: ApiIO<never, { addresses: number; signedExtrinsics: number; evmTransactions: number }>;
  [ApiCommand.getStakingValidators]: ApiIO<PaginationParams, PaginationResponse<IStakingValidator>>;
  [ApiCommand.getDex]: ApiIO<
    PaginationParams,
    PaginationResponse<
      IEvent & {
        swapFromToken?: IToken;
        swapToToken?: IToken;
      }
    >
  >;
  [ApiCommand.getRootPrice]: ApiIO<never, IToken['priceData']>;
  [ApiCommand.getBridgeTransactions]: ApiIO<PaginationParams & { address?: Address }, PaginationResponse<IExtrinsic>>;
};

const commandOptions = {
  getChainSummary: {
    cacheDuration: 60 * 15,
  },
  getNft: {
    cacheDuration: 60 * 120,
  },
  getRootPrice: {
    cacheDuration: 60 * 30,
  },
};

export type ValidCommand = keyof ApiCommandMap;

const debugMap: Record<string, Debug.Debugger> = {};

function debugInvoke(mark: string, command: string, args: unknown) {
  if (!debugMap[command]) {
    debugMap[command] = debug.extend(`[${command}]`);
  }
  if (args !== undefined) {
    debugMap[command](`${mark}: %o`, args);
  } else {
    debugMap[command](`${mark}`);
  }
}

export async function request<T extends ValidCommand>(
  cmd: T,
  ...[args]: ApiCommandMap[T]['input'] extends never ? [] : [ApiCommandMap[T]['input']]
): Promise<ServerActionResult<ApiCommandMap[T]['output']>> {
  return createServerAction(async () => {
    const command = ApiCommand[cmd];
    try {
      debugInvoke('request', command, args);
      const result = await fetcher({
        url: '/' + command,
        body: JSON.stringify(args),
        ...commandOptions[command as string],
      });
      debugInvoke('response', command, result);
      return result;
    } catch (err) {
      debugInvoke(`ERROR`, command, err);
      // Convert API errors to ServerActionError
      if (err instanceof Error) {
        throw new ServerActionError(err.message);
      }
      throw new ServerActionError('An unexpected error occurred');
    }
  })();
}

export const getContractVerification = ({ contractAddress }) => {
  const CHAIN_ID = process?.env?.CHAIN_ID;
  return fetcher({
    method: 'GET',
    url: `https://sourcify.dev/server/files/${CHAIN_ID}/${contractAddress}`,
    noBaseUrl: true,
  });
};

export const getRnsName = async (address: Address) => {
  const CHAIN_ID = Number(process?.env?.CHAIN_ID);
  const client = CHAIN_ID === 7668 ? rootClient : porciniClient;
  //todo fix in future ts error
  return getName(client as unknown as ClientWithEns, {
    address: address,
  });
};

export const getAddressFromRnsName = async (rnsName: string) => {
  const CHAIN_ID = Number(process?.env?.CHAIN_ID);
  const client = CHAIN_ID === 7668 ? rootClient : porciniClient;
  return client.getEnsAddress({
    name: normalize(rnsName),
  });
};
