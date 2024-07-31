import { Extrinsic } from '@polkadot/types/interfaces';
import { getAddress, Address, formatUnits } from 'viem';
import { BlockBaseParams, EventExecutedEthereum, EventTransactionFeePaid, IEvent, IExtrinsicWithEvents } from './types';

import {} from '@polkadot/api/base';
import { ApiPromise } from '@polkadot/api';
import { decodeBridgeMessage, decodeEventText, extraArgsFromEvent } from './utils';
import { assetIdToERC20Address } from '@therootnetwork/evm';

function findByMethod<T = IEvent>(
  events: { section: string; method: string }[],
  _section: string,
  _method: string,
): T | undefined {
  return events?.find(({ section, method }) => section === _section && method === _method) as T;
}

interface ExtrinsicParser {
  expression?: (extrinsic: IExtrinsicWithEvents) => boolean;
  handler?: (extrinsic: IExtrinsicWithEvents, api: ApiPromise) => void;
}

const C_EXTRINSIC_PARSERS: ExtrinsicParser[] = [
  /** @dev - Parse proxied extrinsics properly */
  {
    expression: ({ method }) => ['proxyExtrinsic', 'callWithFeePreferences'].includes(method),
    handler(extrinsic, api) {
      extrinsic.isProxy = true;
      let currentArg = extrinsic.args?.call;
      const calls: any[] = [];
      const proxiedSections: string[] = [];
      const proxiedMethods: string[] = [];
      while (currentArg?.callIndex) {
        const _findCall = api.findCall(currentArg?.callIndex);
        currentArg.section = _findCall.section;
        currentArg.method = _findCall.method;
        proxiedSections.push(_findCall.section);
        proxiedMethods.push(_findCall.method);
        calls.push(currentArg);
        if (currentArg?.args?.call) {
          currentArg = currentArg.args.call;
        } else {
          break;
        }
      }
      if (proxiedSections.length) {
        extrinsic.proxiedSections = proxiedSections;
      }
      if (proxiedMethods.length) {
        extrinsic.proxiedMethods = proxiedMethods;
      }
      /** Reparse the args so the various become an array */
    },
  },

  /** @dev In utility for batch and batchAll we should extract the section and method for each callIndex */
  {
    expression: ({ method, section }) => ['batch', 'batchAll'].includes(method.toString()) && section === 'utility',
    handler(extrinsic, api) {
      if (extrinsic?.args?.calls) {
        for (const call of extrinsic.args.calls) {
          const findCall = api.findCall(call.callIndex);
          call.section = findCall.section;
          call.method = findCall.method;
        }
      }
    },
  },

  /** @dev - Determine whether the extrinsic was a success or failure */
  {
    handler(extrinsic) {
      if (findByMethod<IEvent>(extrinsic.events, 'system', 'ExtrinsicSuccess')) {
        extrinsic.isSuccess = true;
      } else {
        const errorEvent = findByMethod<IEvent>(extrinsic.events, 'system', 'ExtrinsicFailed');
        if (errorEvent) {
          extrinsic.isSuccess = false;
          extrinsic.errorInfo = errorEvent?.args?.['errorInfo'];
        }
      }
    },
  },

  /** @dev Figure out the gas fee that was paid for this Extrinsic */
  {
    handler(extrinsic) {
      const txFeeEvent = findByMethod<EventTransactionFeePaid>(
        extrinsic.events,
        'transactionPayment',
        'TransactionFeePaid',
      );
      if (txFeeEvent && txFeeEvent.args?.who && txFeeEvent.args?.actualFee) {
        const { who, actualFee, tip } = txFeeEvent.args;
        extrinsic.fee = {
          who: getAddress(who),
          actualFee: actualFee,
          actualFeeFormatted: Number(formatUnits(actualFee, 6)),
          tip,
          tipFormatted: Number(formatUnits(actualFee, 6)),
        };
      }
    },
  },

  /** @dev - Save the Ethereum Transaction from the event to the extrinsic to make our lives easier */
  {
    expression: ({ method, section }) => method === 'transact' && section === 'ethereum',
    handler(extrinsic) {
      const executedEvent = findByMethod<EventExecutedEthereum>(extrinsic.events, 'ethereum', 'Executed');
      if (executedEvent) {
        extrinsic.args.transactionHash = executedEvent.args.transactionHash;
      }
    },
  },

  // /** @dev - Figure out if there was a CallWithFeePreferences event */
  {
    expression: ({ method, section }) => method === 'callWithFeePreferences' && section === 'feeProxy',
    async handler(extrinsic) {
      const swapFeeEvent = extrinsic.events?.find(
        (event) =>
          event.method === 'Swap' &&
          event.section === 'dex' &&
          Number(event.args?.target_Asset_amount) === Number(extrinsic.fee?.actualFee),
      );

      if (swapFeeEvent) {
        const swapFeeEventArgs = swapFeeEvent.args as any;
        const swappedAssetId = swapFeeEventArgs.trading_path[0];
        const amount = swapFeeEventArgs.supply_Asset_amount;
        // const tokenDetails = await getTokenDetails(getAddress(assetIdToERC20Address(swappedAssetId)));

        extrinsic.proxyFee = {
          who: swapFeeEventArgs.trader,
          paymentAsset: swapFeeEventArgs.trading_path[0],
          swappedAmount: Number(amount),
          swappedAmountFormatted: Number(formatUnits(amount, 6)), // tokenDetails?.decimals)), TODO
        };
      }
    },
  },

  /** @dev - Parse all information from the ethBridge */
  {
    expression: ({ method, section }) => method === 'submitEvent' && section === 'ethBridge',
    async handler(extrinsic) {
      const typeEvent =
        findByMethod(extrinsic.events, 'ethBridge', 'EventSend') ||
        findByMethod(extrinsic.events, 'ethBridge', 'EventSubmit');

      const eventText = extrinsic?.args?.event;

      const { source, message } = decodeEventText(eventText);

      if (typeEvent) {
        const type = typeEvent?.method === 'EventSend' ? 'outbox' : 'inbox';
        extrinsic.args = {
          ...extrinsic.args,
          type,
          ...decodeBridgeMessage(source, message, type),
        };
      }
    },
  },
];

export async function parseExtrinsic(
  extrinsic: Extrinsic,
  index: number,
  block: BlockBaseParams,
  events?: IEvent[],
  api?: ApiPromise,
): Promise<IExtrinsicWithEvents> {
  if (!extrinsic) {
    throw new Error('Extrinsic is null');
  }
  const retroExtrinsicId = `${String(block.number).padStart(10, '0')}-${String(index).padStart(6, '0')}-${String(block.hash).substring(2, 7)}`;
  const method: string = extrinsic.method.method;
  const section: string = extrinsic.method.section;

  const isSigned: boolean = extrinsic.isSigned;
  const signature: string | undefined = isSigned ? extrinsic.signature?.toString() : undefined;
  const signer: Address | undefined =
    isSigned && extrinsic.signer ? getAddress(extrinsic.signer.toString()) : undefined;

  const methodPrim = extrinsic?.method.toPrimitive() as { args?: object };
  const args = methodPrim?.args;

  const res: IExtrinsicWithEvents = {
    hash: extrinsic.hash?.toString(),
    block: block.number,
    extrinsicId: `${block.number}-${index}`,
    retroExtrinsicId,
    method,
    section,
    isSigned,
    signature,
    signer,
    args,
    events: events || [],
    timestamp: block.timestamp,
  };

  for (const parser of C_EXTRINSIC_PARSERS) {
    if (!parser.expression || parser.expression(res)) {
      await parser.handler(res, api);
    }
  }

  return res;
}
