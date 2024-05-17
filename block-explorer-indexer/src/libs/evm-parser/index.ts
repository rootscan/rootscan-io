import ABIs from '@/constants/abi';
import { IEVMTransaction, IToken, TTokenType } from '@/types';
import { getTokenDetails } from '@/utils/tokenInformation';
import BigNumber from 'bignumber.js';
import { BigNumberish, formatUnits } from 'ethers';
import { Address, Hash, PublicClient, Transaction, TransactionReceipt, decodeEventLog, getAddress } from 'viem';

export const getEVMTransaction = async (client: PublicClient, hash: Hash) => {
  const [txRaw, txReceipt] = await Promise.all([
    client.getTransaction({ hash }),
    client.getTransactionReceipt({ hash }),
  ]);
  const tx: Transaction & TransactionReceipt & { creates?: Address } & IEVMTransaction = {
    ...txRaw,
    ...txReceipt,
  };
  const txBlock = await client.getBlock({ blockNumber: txRaw.blockNumber as bigint });
  return { tx, txBlock };
};

export const calculateTransactionFee = (tx: Transaction & TransactionReceipt) => {
  // Calculate the transaction fees manually
  let fee = '0';
  if (tx.typeHex == '0x0') {
    const gasLimit = new BigNumber(tx.gas as unknown as number);
    const gasPrice = new BigNumber(formatUnits(String(tx.gasPrice), 'gwei'));
    const totalFee = gasLimit.multipliedBy(gasPrice);
    const divisor = new BigNumber(10).pow(9);
    fee = totalFee.dividedBy(divisor).toString();
  }

  //  Gas Fees = Units of Gas Used * (BaseFee + PriorityFee)
  if (tx.typeHex == '0x2') {
    const gasLimit = new BigNumber(tx.gas as unknown as number);
    let gasPrice = new BigNumber(String(formatUnits(String(tx.effectiveGasPrice), 'gwei')));
    const maxPriorityFeePerGas = new BigNumber(
      tx.maxPriorityFeePerGas ? String(formatUnits(String(tx.maxPriorityFeePerGas), 'gwei')) : '0',
    );
    gasPrice = gasPrice.plus(maxPriorityFeePerGas);
    const totalFee = gasLimit.multipliedBy(gasPrice); // Number(gasLimit) * Number(gasPrice);
    const divisor = new BigNumber(10).pow(9);
    fee = totalFee.dividedBy(divisor).toString();
  }

  return fee;
};

export const parseEventsFromEvmTx = async (tx: TransactionReceipt & Transaction) => {
  const tags: string[] = [];
  const events: any[] = [];
  for (const log of tx.logs) {
    for (const abiKey of Object.keys(ABIs)) {
      const abi = ABIs[abiKey];
      let topics;
      try {
        topics = decodeEventLog({
          abi,
          data: log.data,
          topics: log.topics,
        });
      } catch {
        /*eslint no-empty: "error"*/
      }
      if (topics) {
        const event: {
          address?: Address;
          formattedAmount?: string;
          formattedValue?: string;
          tokenId?: BigNumberish | bigint | number;
          name?: string;
          id?: string | number;
          symbol?: string;
          type?: TTokenType;
          eventName?: string;
          value?: BigNumberish | bigint | number;
        } = {
          ...topics.args,
          eventName: topics.eventName,
          address: getAddress(log.address),
        };
        const matchedAbi = abiKey;
        const tokenDetails: Omit<IToken, 'contractAddress'> | null = await getTokenDetails(log.address);

        // ERC20 Transfer
        if (tokenDetails?.type === 'ERC20' && event?.eventName === 'Transfer') {
          if (!tokenDetails) break;
          if (event?.value && tokenDetails?.decimals) {
            event.formattedAmount = formatUnits(event.value, tokenDetails.decimals);
          }
          event.name = tokenDetails.name;
          event.symbol = tokenDetails.symbol;
          event.type = 'ERC20';
          const tag = 'Token Transfer';
          if (!tags?.includes(tag)) {
            tags.push(tag);
          }
        }

        // ERC20 Approval
        if (tokenDetails?.type === 'ERC20' && event?.eventName === 'Approval') {
          if (!tokenDetails) break;
          if (event?.value && tokenDetails?.decimals) {
            event.formattedValue = formatUnits(event.value, tokenDetails.decimals);
          }
          event.name = tokenDetails.name;
          event.symbol = tokenDetails.symbol;
          event.type = 'ERC20';
          const tag = 'Approval';
          if (!tags?.includes(tag)) {
            tags.push(tag);
          }
        }

        // ERC721 Transfer
        if (tokenDetails?.type === 'ERC721' && event?.eventName === 'Transfer') {
          const tokenId = event?.value || event?.tokenId;
          event.tokenId = String(tokenId).length > 9 ? tokenId?.toString() : Number(tokenId);
          event.name = tokenDetails.name;
          event.symbol = tokenDetails.symbol;
          event.type = 'ERC721';
          const tag = 'NFT Transfer';
          if (!tags?.includes(tag)) {
            tags.push(tag);
          }
        }

        // ERC721 ApprovalForAll
        if (tokenDetails?.type === 'ERC721' && event?.eventName === 'ApprovalForAll') {
          event.name = tokenDetails.name;
          event.symbol = tokenDetails.symbol;
          event.type = 'ERC721';
          const tag = 'Approval for All';
          if (!tags?.includes(tag)) {
            tags.push(tag);
          }
        }

        // ERC721 Approval
        if (tokenDetails?.type === 'ERC721' && event?.eventName === 'Approval') {
          event.name = tokenDetails.name;
          event.symbol = tokenDetails.symbol;
          event.type = 'ERC721';
          const tag = 'Approval';
          if (!tags?.includes(tag)) {
            tags.push(tag);
          }
        }

        // ERC1155
        if (
          tokenDetails?.type === 'ERC1155' &&
          (event?.eventName === 'Transfer' ||
            event?.eventName === 'TransferSingle' ||
            event?.eventName === 'TransferBatch')
        ) {
          event.name = tokenDetails.name;
          event.id = String(event.id).length > 9 ? event.id?.toString() : Number(event.id);
          event.symbol = tokenDetails.symbol;
          event.type = 'ERC1155';
          const tag = 'NFT Transfer';
          if (!tags?.includes(tag)) {
            tags.push(tag);
          }
        }

        if (matchedAbi?.includes('FUTUREPASS_REGISTRAR') && event?.eventName === 'FuturepassCreated') {
          const tag = 'Futurepass Created';
          if (!tags?.includes(tag)) {
            tags.push(tag);
          }
        }
        events.push(event);
        break;
      }
    }
  }

  return { tags, events };
};
