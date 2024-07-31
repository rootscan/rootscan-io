import { Extrinsic } from '@polkadot/types/interfaces';
import { getAddress, Address, formatUnits } from 'viem';
import { BlockBaseParams, EventExecutedEthereum, EventTransactionFeePaid, IEvent, IExtrinsicWithEvents } from './types';

import {} from '@polkadot/api/base';
import { ApiPromise } from '@polkadot/api';
import { decodeBridgeMessage, decodeEventText } from './utils';

function findByMethod<T = IEvent>(
  events: { section: string; method: string }[],
  _section: string,
  _method: string,
): T | undefined {
  return events?.find(({ section, method }) => section === _section && method === _method) as T;
}

const C_EXTRINSIC_PARSERS = [
  /** @dev - Parse proxied extrinsics properly */
  {
    expression: ({ method }: IExtrinsicWithEvents) => ['proxyExtrinsic', 'callWithFeePreferences'].includes(method),
    handler(extrinsic: IExtrinsicWithEvents, api: ApiPromise) {
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
    expression: ({ method, section }: IExtrinsicWithEvents) =>
      ['batch', 'batchAll'].includes(method.toString()) && section === 'utility',
    handler(extrinsic: IExtrinsicWithEvents, api: ApiPromise) {
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
    handler(extrinsic: IExtrinsicWithEvents) {
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
    handler(extrinsic: IExtrinsicWithEvents, api: ApiPromise) {
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
    expression: ({ method, section }: IExtrinsicWithEvents) => method === 'transact' && section === 'ethereum',
    handler(extrinsic: IExtrinsicWithEvents, api: ApiPromise) {
      const executedEvent = findByMethod<EventExecutedEthereum>(extrinsic.events, 'ethereum', 'Executed');
      if (executedEvent) {
        extrinsic.args.transactionHash = executedEvent.args.transactionHash;
      }
    },
  },

  // /** @dev - Figure out if there was a CallWithFeePreferences event */
  {
    expression: ({ events }: IExtrinsicWithEvents) =>
      findByMethod<IEvent>(events, 'feeProxy', 'CallWithFeePreferences'),
    async handler(extrinsic: IExtrinsicWithEvents, api: ApiPromise) {
      //   const swapFeeEvent = events?.find((a) => {
      //     const isSwap = a?.event?.method === 'Swap' && a?.event?.section === 'dex';
      //     if (isSwap) {
      //       const args = extraArgsFromEvent(a.event, this.api);
      //       return Number(args?.target_Asset_amount) === Number(data?.fee?.actualFee);
      //     } else {
      //       return false;
      //     }
      //   });
      //   if (swapFeeEvent) {
      //     const swapFeeEventArgs = extraArgsFromEvent(swapFeeEvent.event, this.api);
      //     const swappedAssetId = swapFeeEventArgs.trading_path[0];
      //     const amount = swapFeeEventArgs.supply_Asset_amount;
      //     const tokenDetails = await getTokenDetails(getAddress(assetIdToERC20Address(swappedAssetId)));
      //     extrinsic.proxyFee = {
      //       who: swapFeeEventArgs.trader,
      //       paymentAsset: swapFeeEventArgs.trading_path[0],
      //       swappedAmount: Number(amount),
      //       swappedAmountFormatted: Number(formatUnits(amount, tokenDetails?.decimals)),
      //     };
      //   }
      // }
    },
  },

  /** @dev - Parse all information from the ethBridge */
  {
    expression: ({ method, section }: IExtrinsicWithEvents) => method === 'submitEvent' && section === 'ethBridge',
    async handler(extrinsic: IExtrinsicWithEvents, api: ApiPromise) {
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

export function parseExtrinsic(
  extrinsic: Extrinsic,
  index: number,
  block: BlockBaseParams,
  events?: IEvent[],
  api?: ApiPromise,
): IExtrinsicWithEvents {
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

  C_EXTRINSIC_PARSERS.forEach((parser) => {
    if (!parser.expression || parser.expression(res)) {
      parser.handler(res, api);
    }
  });

  return res;
}
