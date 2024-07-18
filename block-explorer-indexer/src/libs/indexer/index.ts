import ABIs from '@/constants/abi';
import { calculateTransactionFee, getEVMTransaction, parseEventsFromEvmTx } from '@/evm-parser';
import { NftOwnersIndexer } from '@/nft-indexer/nft-owners-indexer';
import { evmClient } from '@/rpc';
import {
  IAddress,
  IBulkWriteDeleteOp,
  IBulkWriteUpdateOp,
  IEVMTransaction,
  IEvent,
  IExtrinsic,
  INativeBalance,
  IVerifiedContract,
  TExtrinsicId,
  TRetroExtrinsicId,
} from '@/types';
import {
  createTransactionsJobs,
  decodeBridgeMessage,
  extraArgsFromEvent,
  isExtrinsicSuccess,
  refetchBalancesForAddressesInObject,
} from '@/utils';
import { getTokenDetails } from '@/utils/tokenInformation';
import queue from '@/workerpool';
import { ApiPromise } from '@polkadot/api';
import { BlockHash, Extrinsic } from '@polkadot/types/interfaces';
import { assetIdToERC20Address, collectionIdToERC721Address, collectionIdToERC1155Address } from '@therootnetwork/evm';
import { Interface, InterfaceAbi, formatUnits } from 'ethers';
import { Models } from 'mongoose';
import {
  Abi,
  Address,
  Hash,
  Hex,
  Log,
  PublicClient,
  decodeAbiParameters,
  decodeDeployData,
  decodeFunctionData,
  getAddress,
  parseEventLogs,
  slice,
} from 'viem';
import { DecodeFunctionDataReturnType } from 'viem/_types/utils/abi/decodeFunctionData';

export default class Indexer {
  client: PublicClient;
  api: ApiPromise;
  DB: Models;
  skipSections = ['none'];

  constructor(client: PublicClient, api: ApiPromise, DB: Models) {
    if (!client) throw new Error('EVM Client parameter missing');
    this.client = client;
    if (!api) throw new Error('API parameter missing');
    this.api = api;
    if (!DB) throw new Error('Database models parameter missing');
    this.DB = DB;
  }

  /** Indexes the block based on nujmber */
  async processBlock(blockNumber: bigint): Promise<boolean> {
    const blockHash: BlockHash = await this.api.rpc.chain.getBlockHash(blockNumber);
    // Get the EVM Block

    const [block, substrateBlock, at] = await Promise.all([
      this.client.getBlock({
        blockNumber,
      }),
      this.api.rpc.chain.getBlock(blockHash),
      this.api.at(blockHash),
    ]);

    // Check out the extrinsics in this block
    const blockExtrinsics = substrateBlock?.block?.extrinsics;

    const [chainEvents, runtimeVersion, timestamp] = await Promise.all([
      at.query.system.events(),
      at.query.system.lastRuntimeUpgrade(),
      at.query.timestamp.now(),
    ]);

    const spec = `${runtimeVersion.value.specName}/${runtimeVersion.value.specVersion}`;

    const extrinsics: IExtrinsic[] = [];

    const parseExtrinsic = async (
      extrinsicId: TExtrinsicId,
      extrinsic: Extrinsic,
      events,
      index: number,
      retroExtrinsicId: TRetroExtrinsicId,
    ) => {
      try {
        const method: string = extrinsic.method.method;
        const section: string = extrinsic.method.section;
        if (this.skipSections.includes(section)) return;
        const isSigned: boolean = extrinsic?.isSigned;
        const signature: string | undefined =
          isSigned && extrinsic?.signature ? extrinsic?.signature?.toString() : undefined;
        const signer: Address | undefined =
          isSigned && extrinsic?.signer ? getAddress(extrinsic?.signer?.toString()) : undefined;

        const methodPrim = extrinsic?.method.toPrimitive() as { args?: object };
        const args = methodPrim?.args;

        const data: IExtrinsic = {
          block: Number(blockNumber),
          timestamp: Number(block.timestamp),
          extrinsicId,
          retroExtrinsicId,
          hash: extrinsic?.hash ? extrinsic?.hash?.toString() : undefined,
          args,
          method,
          section,
          isSigned,
        };

        if (isSigned) {
          data.signature = signature;
          data.signer = signer;
        }

        /** @dev - Parse proxied extrinsics properly */
        const proxiedSections: string[] = [];
        const proxiedMethods: string[] = [];
        data.isProxy = false;
        if (method === 'proxyExtrinsic' || method === 'callWithFeePreferences') {
          data.isProxy = true;
          let currentArg = data?.args?.call;
          const calls: any[] = [];
          while (currentArg?.callIndex) {
            const findCall = this.api.findCall(currentArg?.callIndex);
            currentArg.section = findCall.section;
            currentArg.method = findCall.method;

            proxiedSections.push(findCall.section);
            proxiedMethods.push(findCall.method);

            calls.push(currentArg);
            if (currentArg?.args?.call) {
              currentArg = currentArg.args.call;
            } else {
              break;
            }
          }

          if (proxiedSections) {
            data.proxiedSections = proxiedSections;
          }
          if (proxiedMethods) {
            data.proxiedMethods = proxiedMethods;
          }

          /** Reparse the args so the various become an array */
        }

        /** @dev In utility for batch and batchAll we should extract the section and method for each callIndex */
        if ((method === 'batch' || method === 'batchAll') && section === 'utility') {
          if (data?.args?.calls) {
            for (const call of data.args.calls) {
              const findCall = this.api.findCall(call.callIndex);
              call.section = findCall.section;
              call.method = findCall.method;
            }
          }
        }

        /** @dev - Determine whether the extrinsic was a success or failure */
        const parseExtrinsicSuccess = isExtrinsicSuccess(events, index, this.api);
        if (parseExtrinsicSuccess) {
          data.isSuccess = parseExtrinsicSuccess?.isSuccess;
          if (parseExtrinsicSuccess?.errorInfo && !parseExtrinsicSuccess?.isSuccess) {
            data.errorInfo = parseExtrinsicSuccess.errorInfo;
          }
        }

        if (events?.length) {
          /** @dev Figure out the gas fee that was paid for this Extrinsic */
          const txFeeEvent = events?.find(
            (a) => a?.event?.method === 'TransactionFeePaid' && a?.event?.section === 'transactionPayment',
          );
          if (txFeeEvent) {
            const { event, phase } = txFeeEvent;
            const { data: eventData } = event;
            if (phase?.isApplyExtrinsic && phase?.asApplyExtrinsic.eq(index)) {
              if (eventData?.who && eventData?.actualFee && eventData?.tip) {
                const { who, actualFee, tip } = eventData;
                data.fee = {
                  who: getAddress(who.toPrimitive()),
                  actualFee: actualFee.toPrimitive(),
                  actualFeeFormatted: Number(formatUnits(actualFee.toPrimitive(), 6)),
                  tip: tip.toPrimitive(),
                  tipFormatted: Number(formatUnits(actualFee.toPrimitive(), 6)),
                };
              }
            }
          }

          /** @dev - Figure out if there was a CallWithFreePreferences event */
          const additionalTxFeeEvent = events?.find(
            (a) => a?.event?.method === 'CallWithFeePreferences' && a?.event?.section === 'feeProxy',
          );

          if (additionalTxFeeEvent) {
            const { phase } = additionalTxFeeEvent;
            if (phase?.isApplyExtrinsic && phase?.asApplyExtrinsic.eq(index)) {
              const swapFeeEvent = events?.find((a) => {
                const isSwap = a?.event?.method === 'Swap' && a?.event?.section === 'dex';
                if (isSwap) {
                  const args = extraArgsFromEvent(a.event, this.api);
                  return Number(args?.target_Asset_amount) === Number(data?.fee?.actualFee);
                } else {
                  return false;
                }
              });

              if (swapFeeEvent) {
                const swapFeeEventArgs = extraArgsFromEvent(swapFeeEvent.event, this.api);
                const swappedAssetId = swapFeeEventArgs.trading_path[0];
                const amount = swapFeeEventArgs.supply_Asset_amount;
                const tokenDetails = await getTokenDetails(getAddress(assetIdToERC20Address(swappedAssetId)));

                data.proxyFee = {
                  who: swapFeeEventArgs.trader,
                  paymentAsset: swapFeeEventArgs.trading_path[0],
                  swappedAmount: Number(amount),
                  swappedAmountFormatted: Number(formatUnits(amount, tokenDetails?.decimals)),
                };
              }
            }
          }

          /** @dev - Save the Ethereum Transaction from the event to the extrinsic to make our lives easier */
          if (method === 'transact' && section === 'ethereum') {
            const executedEvent = events?.find(
              (a) => a?.event?.method === 'Executed' && a?.event?.section === 'ethereum',
            );
            if (executedEvent) {
              const { event, phase } = executedEvent;
              const { data: eventData } = event;
              if (phase?.isApplyExtrinsic && phase?.asApplyExtrinsic.eq(index)) {
                data.args.transactionHash = eventData?.transactionHash?.toPrimitive();
              }
            }
          }

          /** @dev - Parse all information from the ethBridge */
          if (method === 'submitEvent' && section === 'ethBridge') {
            const typeEvent = events?.find(
              (a) => a?.event?.method === 'EventSend' || a?.event?.method === 'EventSubmit',
            );
            const eventText = data?.args?.event;

            const [, source, , message] = decodeAbiParameters(
              [
                { name: 'messageId', type: 'uint' },
                { name: 'source', type: 'address' },
                { name: 'destination', type: 'address' },
                { name: 'message', type: 'bytes' },
                { name: 'fee', type: 'uint256' },
              ],
              eventText as Hex,
            );

            if (typeEvent) {
              const { phase } = typeEvent;
              if (phase?.isApplyExtrinsic && phase?.asApplyExtrinsic.eq(index)) {
                const type = typeEvent?.method === 'EventSend' ? 'outbox' : 'inbox';

                data.args = {
                  ...data.args,
                  type,
                  ...decodeBridgeMessage(source, message, type),
                };
              }
            }
          }
        }
        extrinsics.push(data);
      } catch (e) {
        console.error(e);
      }
    };

    // If there are extrinsics we should parse them
    if (!blockExtrinsics?.isEmpty) {
      let index = 0;
      for (const extrinsic of blockExtrinsics) {
        const extrinsicId: TExtrinsicId = `${String(block.number)}-${String(index)}`;
        const retroExtrinsicId: TRetroExtrinsicId = `${String(block.number).padStart(10, '0')}-${String(index).padStart(
          6,
          '0',
        )}-${String(blockHash).substring(2, 7)}`;

        if (extrinsic?.method?.section !== 'timestamp' && extrinsic?.method?.method !== 'set') {
          await parseExtrinsic(extrinsicId, extrinsic, chainEvents, index, retroExtrinsicId);
        }
        index++;
      }
    }

    /** @dev - Parse all events in this block */
    let eventIndex = 0;
    const parsedEvents: IEvent[] = [];
    const eventsOps: IBulkWriteUpdateOp<IEvent>[] = [];
    for (const record of chainEvents) {
      // extract the phase, event and the event types
      const { event, phase } = record;
      /** Determine the extrinsicId */
      let extrinsicId: string | null = null;
      let extrinsicIndex: number = 999;
      if (phase?.isApplyExtrinsic && phase?.asApplyExtrinsic) {
        extrinsicIndex = Number(phase?.asApplyExtrinsic);
        extrinsicId = `${block.number}-${phase?.asApplyExtrinsic}`;
      }

      const { method, section, meta } = event;

      const args = extraArgsFromEvent(event, this.api);

      const parsedEvent: IEvent = {
        eventId: `${block.number}-${eventIndex}`,
        hash: event.hash.toString(),
        blockNumber: Number(blockNumber),
        timestamp: Number(block?.timestamp),
        method,
        section,
        doc: meta?.docs?.[0]?.toString() || undefined,
        args,
      };
      if (extrinsicId) {
        parsedEvent.extrinsicId = extrinsicId;
      }

      // Nft.CollectionCreate
      if (section === 'nft' && method === 'CollectionCreate') {
        await getTokenDetails(collectionIdToERC721Address(args?.collectionUuid) as Address, true);
      }
      // sft.CollectionCreate
      if (section === 'sft' && method === 'CollectionCreate') {
        await getTokenDetails(collectionIdToERC1155Address(args?.collectionId) as Address, true);
      }
      // assets.ForceCreated
      if (section === 'assets' && method === 'ForceCreated') {
        await getTokenDetails(assetIdToERC20Address(args?.assetId) as Address, true);
      }
      // assets.MetadataSet;
      if (section === 'assets' && method === 'MetadataSet') {
        await getTokenDetails(assetIdToERC20Address(args?.assetId) as Address, true);
      }
      // sft.BaseUriSet;
      if (section === 'sft' && method === 'BaseUriSet') {
        await getTokenDetails(collectionIdToERC1155Address(args?.collectionId) as Address, true);
      }
      // sft.TokenCreate
      if (section === 'sft' && method === 'TokenCreate') {
        const collectionId = args?.tokenId?.[0];
        if (collectionId) {
          await getTokenDetails(collectionIdToERC1155Address(collectionId) as Address, true);
        }
      }
      // nft.BaseUriSet;
      if (section === 'nft' && method === 'BaseUriSet') {
        await getTokenDetails(collectionIdToERC721Address(args?.collectionId) as Address, true);
      }

      // @dev - Skip extrinsicSuccess of timestamp.set
      if (extrinsicIndex != 0) {
        await refetchBalancesForAddressesInObject(parsedEvent);

        parsedEvents.push(parsedEvent);

        eventsOps.push({
          updateOne: {
            filter: { eventId: parsedEvent.eventId },
            update: {
              $set: parsedEvent,
            },
            upsert: true,
          },
        });
      }
      eventIndex++;
    }

    if (eventsOps?.length) {
      await this.DB.Event.bulkWrite(eventsOps);
      // process nft owners from events
      const nftOwnersIndexer = new NftOwnersIndexer(this.DB, evmClient);
      await nftOwnersIndexer.processEvents(eventsOps.map((i) => i.updateOne.filter.eventId as string));
    }

    const substrateBlockHuman = substrateBlock.toHuman() as {
      block: {
        header: {
          parentHash: string;
          stateRoot: string;
          extrinsicsRoot: string;
          hash: string;
        };
      };
    };

    const blockData = {
      number: Number(block.number),
      hash: substrateBlock?.block?.header?.hash.toString(),
      timestamp: Number(timestamp),
      parentHash: substrateBlockHuman?.block?.header?.parentHash.toString(),
      stateRoot: substrateBlockHuman?.block.header?.stateRoot.toString(),
      extrinsicsRoot: substrateBlockHuman?.block.header?.extrinsicsRoot.toString(),
      evmBlock: {
        hash: block?.hash?.toString(),
        parentHash: block?.parentHash?.toString(),
        stateRoot: block?.stateRoot?.toString(),
        miner: getAddress(block?.miner),
      },
      extrinsicsCount: extrinsics?.length,
      transactionsCount: block?.transactions?.length,
      eventsCount: parsedEvents?.length,
      spec,
    };

    await this.DB.Block.updateOne(
      { number: blockData.number },
      {
        $set: blockData,
      },
      { upsert: true },
    );

    if (extrinsics?.length) {
      const ops: IBulkWriteUpdateOp[] = [];
      for (const extrinsic of extrinsics) {
        /** @dev For every address that appears in the extrinsic we should refresh all balances */
        await refetchBalancesForAddressesInObject(extrinsic);
        ops.push({
          updateOne: {
            filter: { extrinsicId: extrinsic.extrinsicId },
            update: {
              $set: extrinsic,
            },
            upsert: true,
          },
        });
      }

      await this.DB.Extrinsic.bulkWrite(ops);
    }
    /** @dev - Create index tasks for every transaction hash that we have found */
    if (block?.transactions?.length) {
      await createTransactionsJobs(block?.transactions);
    }

    return true;
  }
  /** Indexes transactions based on hashes */
  async processTransactions(hashes: Hash[]): Promise<boolean> {
    for (const hash of hashes) {
      const { tx, txBlock } = await getEVMTransaction(this.client, hash);
      let tags: string[] = [];
      let events: object[] = [];

      /** Check if this transaction has deployed a contract */
      if (tx?.creates) {
        tx.to = tx.creates;

        await this.DB.Address.updateOne(
          {
            address: getAddress(tx.creates),
          },
          {
            $set: {
              address: getAddress(tx.creates),
              isContract: true,
            },
          },
          {
            upsert: true,
          },
        );

        await this.DB.VerifiedContract.updateOne(
          {
            address: getAddress(tx.creates),
          },
          {
            address: getAddress(tx.creates),
            deployer: getAddress(tx.from),
            deployedBlock: Number(tx.blockNumber),
          },
        );

        /** If it just got deployed, we should try to fetch tokenDetails */
        await getTokenDetails(getAddress(tx.creates));

        /** Since we created a contract, we can name it contract deployment */
        tx.functionName = 'Contract Deployment';
      }

      const isVerifiedContract: IVerifiedContract | null = await this.DB.VerifiedContract.findOne({
        address: getAddress(tx.to as Address),
      }).lean();
      const verifiedAbi = isVerifiedContract?.abi as Abi;

      // Get function signature
      let functionSignature;
      let functionData;
      let deployData;
      // let errorResult;
      if (tx?.input) {
        functionSignature = String(slice(tx?.input, 0, 4));
        if (verifiedAbi) {
          try {
            const decoded: DecodeFunctionDataReturnType = decodeFunctionData({
              abi: verifiedAbi,
              data: tx.input,
            });
            if (decoded?.functionName) {
              tx.functionName = decoded.functionName;
            }
          } catch {
            /*eslint no-empty: "error"*/
          }

          // TODO - Figure out a way to make this work
          if (tx?.status === 'reverted') {
            try {
              // errorResult = decodeErrorResult({
              //   abi: verifiedAbi,
              //   data: tx?.input
              // });
              // console.log(errorResult);
            } catch {
              /*eslint no-empty: "error"*/
            }
          }

          try {
            const iface = new Interface(verifiedAbi as InterfaceAbi);
            const parsedTx = iface.parseTransaction({ data: tx.input });
            functionData = {
              args: parsedTx?.args ? parsedTx?.args?.toObject() : {},
              inputs: parsedTx?.fragment?.inputs ? JSON.parse(JSON.stringify(parsedTx?.fragment?.inputs)) : {},
              name: parsedTx?.name,
              selector: parsedTx?.selector,
              signature: parsedTx?.signature,
            };
          } catch {
            /*eslint no-empty: "error"*/
          }

          if (tx?.creates && verifiedAbi) {
            try {
              const code = await evmClient.getBytecode({
                address: tx?.creates,
              });
              if (code) {
                /** Since we have now know the bytecode let's save it */
                await this.DB.VerifiedContract.updateOne(
                  { address: getAddress(tx.creates) },
                  { bytecode: String(code) },
                );
                deployData = decodeDeployData({
                  abi: verifiedAbi,
                  bytecode: code,
                  data: tx?.input,
                });
              }
            } catch {
              /* eslint no-empty: "error" */
            }
          }
        } else {
          /** @dev - Since we dont have the verifiedAbi, try to figure out the function name by using one our abi's */
          for (const abiKey of Object.keys(ABIs)) {
            const abi = ABIs[abiKey];
            try {
              const decoded: DecodeFunctionDataReturnType = decodeFunctionData({
                abi,
                data: tx.input,
              });
              if (decoded?.functionName) {
                tx.functionName = decoded.functionName;
                break;
              }
            } catch {
              /*eslint no-empty: "error"*/
            }
          }
        }
      }

      /** @dev - Decode logs with our supported ABI's, used to display transfer data and more */
      if (tx?.logs?.length) {
        const parsedEvmTxs = await parseEventsFromEvmTx(tx);
        if (parsedEvmTxs?.tags) {
          tags = [...tags, ...parsedEvmTxs.tags];
        }
        if (parsedEvmTxs?.events) {
          events = [...events, ...parsedEvmTxs.events];
        }

        /** @dev - Parse logs against verified ABI if we have one */
        if (verifiedAbi) {
          const parsedLogs = parseEventLogs({
            abi: verifiedAbi,
            logs: tx.logs,
          });
          if (parsedLogs?.length) {
            tx.logs = parsedLogs;
          }
        } else {
          for (const abiKey of Object.keys(ABIs)) {
            try {
              const parsedLogs = parseEventLogs({
                abi: ABIs[abiKey],
                logs: tx.logs,
              });
              if (parsedLogs?.length) {
                tx.logs = parsedLogs;
              }
            } catch {
              /*eslint no-empty: "error"*/
            }
          }
        }
      }

      /** Calculate the transaction fee */
      const fee = calculateTransactionFee(tx);

      /** It might be that this is just a native transfer */
      if (!events?.length && Number(tx?.value) > 0 && Number(tx?.gasUsed) === Number(21000) && tx?.input === '0x') {
        const event = {
          eventName: 'Transfer',
          type: 'NATIVE',
          from: tx?.from,
          to: tx?.to,
          value: Number(tx.value),
          valueFormatted: tx.value ? formatUnits(tx.value, 18) : '0',
        };

        tx.functionName = 'Transfer';
        events.push(event);
        tags.push('Token Transfer');
      }

      const logs: Log[] = tx?.logs ? tx?.logs : [];
      const finalTransaction: IEVMTransaction = {
        hash: tx.hash,
        accessList: tx.accessList,
        timestamp: txBlock?.timestamp ? Number(txBlock.timestamp * BigInt(1000)) : undefined,
        blockNumber: Number(tx.blockNumber),
        contractAddress: tx.contractAddress ? getAddress(tx.contractAddress) : undefined,
        gas: Number(tx.gas),
        gasUsed: Number(tx.gasUsed),
        gasPrice: formatUnits(tx.gasPrice, 'gwei'),
        status: tx.status,
        maxPriorityFeePerGas: tx?.maxPriorityFeePerGas ? formatUnits(tx?.maxPriorityFeePerGas, 'gwei') : undefined,
        effectiveGasPrice: tx?.effectiveGasPrice ? formatUnits(tx?.effectiveGasPrice, 'gwei') : undefined,
        functionName: tx.functionName ? tx.functionName : undefined,
        functionSignature,
        functionData,
        deployData,
        value: Number(tx.value),
        valueFormatted: tx.value ? formatUnits(tx.value, 18) : '0',
        type: tx.type,
        transactionIndex: tx?.transactionIndex >= 0 ? Number(tx.transactionIndex) : undefined,
        tags,
        events,
        transactionFee: fee,
        nonce: Number(tx.nonce),
        logs,
        input: tx?.input,
        from: getAddress(tx.from),
        to: tx?.to ? getAddress(tx.to) : null,
      };

      await this.DB.EvmTransaction.updateOne(
        { hash: hash },
        {
          $set: finalTransaction,
        },
        { upsert: true },
      );

      /** Refetch the balances for every address that was involved in this transaction */
      await refetchBalancesForAddressesInObject(finalTransaction);
    }

    // process nft owners from transactions
    const nftOwnersIndexer = new NftOwnersIndexer(this.DB, evmClient);
    await nftOwnersIndexer.processEvmTransactions(hashes);
    return true;
  }

  async refetchBalance(address: Address): Promise<boolean> {
    /** Fetch Native Substrate Balance */
    const account = await this.api.query.system.account(address);
    const nativeBalancePrimitive = account?.data?.toPrimitive();
    // Root Native Balance

    // TODO: in trn-seed with new substrate need to modify logic for frozen parameter
    // https://github.com/futureversecom/trn-seed/issues/860
    const nativeDecimals = 6;
    const nativeBalance: INativeBalance = {
      free: nativeBalancePrimitive?.free as number,
      freeFormatted: formatUnits(String(nativeBalancePrimitive?.free), nativeDecimals),
      reserved: nativeBalancePrimitive?.reserved as number,
      reservedFormatted: formatUnits(String(nativeBalancePrimitive?.reserved), nativeDecimals),
      frozen: nativeBalancePrimitive?.frozen as number,
      frozenFormatted: nativeBalancePrimitive?.frozen
        ? formatUnits(String(nativeBalancePrimitive?.frozen), nativeDecimals)
        : null,
      miscFrozen: nativeBalancePrimitive?.miscFrozen as number,
      miscFrozenFormatted: nativeBalancePrimitive?.miscFrozen
        ? formatUnits(String(nativeBalancePrimitive?.miscFrozen), nativeDecimals)
        : null,
      feeFrozen: nativeBalancePrimitive?.feeFrozen as number,
      feeFrozenFormatted: nativeBalancePrimitive?.feeFrozen
        ? formatUnits(String(nativeBalancePrimitive?.feeFrozen), nativeDecimals)
        : null,
    };

    await this.DB.Address.updateOne(
      { address: getAddress(address) },
      {
        $set: {
          address: getAddress(address),
          balance: nativeBalance,
        },
      },
      {
        upsert: true,
      },
    );

    /** Fetch all ERC20's that we know of */
    const ops: (IBulkWriteDeleteOp | IBulkWriteUpdateOp)[] = [];
    const [tokens, currentBalances] = await Promise.all([
      this.DB.Token.find({ type: 'ERC20', totalSupply: { $gt: 0 } }).lean(),
      this.DB.Balance.find({ address: getAddress(address) })
        .select('contractAddress address')
        .lean(),
    ]);

    if (!tokens?.length) return true;

    const multicall = await this.client.multicall({
      contracts: tokens?.map((token) => ({
        address: token.contractAddress,
        abi: ABIs.ERC20_ORIGINAL as Abi,
        functionName: 'balanceOf',
        args: [address],
      })),
      allowFailure: true,
    });

    for (let i = 0; i < multicall.length; i++) {
      const token = tokens[i];
      const call = multicall[i];
      if (call?.status !== 'success') continue;
      const balance = call?.result;

      if (Number(balance) > 0) {
        ops.push({
          updateOne: {
            filter: {
              address: getAddress(address),
              contractAddress: getAddress(token.contractAddress),
            },
            update: {
              $set: {
                address: getAddress(address),
                contractAddress: getAddress(token.contractAddress),
                balance: Number(balance),
                balanceFormatted: formatUnits(String(balance), token.decimals),
              },
            },
            upsert: true,
          },
        });
      } else if (Number(balance) === 0) {
        const hadBalance = currentBalances?.find(
          (a) =>
            getAddress(a.address) === getAddress(address) &&
            getAddress(a.contractAddress) === getAddress(token.contractAddress),
        );
        if (hadBalance) {
          ops.push({
            deleteOne: {
              filter: {
                address: getAddress(address),
                contractAddress: getAddress(token.contractAddress),
              },
            },
          });
        }
      }
    }

    if (ops?.length) {
      await this.DB.Balance.bulkWrite(ops);
    }

    return true;
  }

  async checkFinalizedBlocks() {
    const finalizedHeadHash = await this.api.rpc.chain.getFinalizedHead();
    const blockLookUp = await this.api.rpc.chain.getBlock(finalizedHeadHash);
    const blockH = blockLookUp?.block?.header?.toPrimitive();
    const blockNumber = Number(blockH?.number);

    await this.DB.Block.updateMany(
      { isFinalized: { $ne: true }, number: { $lte: blockNumber } },
      {
        $set: {
          isFinalized: true,
        },
      },
    );
  }

  async reindexBlockRange(from: number, to: number) {
    for (let blockNumber = from; blockNumber < to; blockNumber++) {
      await queue.add(
        'PROCESS_BLOCK',
        { blocknumber: blockNumber },
        {
          priority: 1,
          jobId: `BLOCK_${blockNumber}`,
        },
      );
    }
    return true;
  }

  async refetchAllBalances() {
    const options = {
      page: 1,
      limit: 1000,
      allowDiskUse: true,
      skipFullCount: true,
      select: 'address',
      lean: true,
    };
    // @ts-expect-error paginate is defined
    let data = await this.DB.Address.paginate({}, options);

    while (data?.hasNextPage && data?.docs?.length) {
      const addresses = data?.docs?.map((a: IAddress) => getAddress(a.address));
      options.page = options.page + 1;
      // @ts-expect-error paginate is defined
      data = await this.DB.Address.paginate({}, options);
      await refetchBalancesForAddressesInObject(addresses);
    }

    return true;
  }
}
