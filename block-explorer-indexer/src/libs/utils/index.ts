import queue from '@/workerpool';
import { ApiPromise } from '@polkadot/api';
import { Address, Hash, Hex, decodeAbiParameters, getAddress, isAddress, zeroAddress } from 'viem';

export function isRootChain(chainId: number) {
  return [7668, 17668].includes(Number(chainId));
}

export const sleep = (ms: number): Promise<void> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, ms);
  });
};

export const getAllAddressesFromObject = (obj: object): Address[] => {
  const getObjValues = (obj: object) =>
    obj && typeof obj === 'object'
      ? Object.values(obj)
          .map(getObjValues)
          .reduce((a, b) => a.concat(b), [])
      : [obj];

  const all = getObjValues(obj);
  const addresses: Address[] = all?.filter((item) => isAddress(item))?.map((address) => getAddress(address));

  return [...new Set(addresses)];
};

export const refetchBalancesForAddressesInObject = async (obj: object) => {
  /** Refetch the balances for every address that was involved in this transaction */
  const involvedAddresses = getAllAddressesFromObject(obj);

  const jobName = 'FETCH_BALANCES';
  const jobs = involvedAddresses.map((involvedAddress) => {
    return {
      name: jobName,
      data: { address: involvedAddress },
      opts: {
        priority: 4,
        jobId: `FETCH_BALANCES_${involvedAddress}`,
      },
    };
  });
  if (jobs?.length) {
    await queue.addBulk(jobs);
  }
};

export const createTransactionsJobs = async (transactions: Hash[]) => {
  const jobName = 'PROCESS_TRANSACTION';
  const jobs = transactions.map((hash) => {
    return {
      name: jobName,
      data: { hash },
      opts: {
        lifo: true, // Process transactions first
        jobId: `PROCESS_TRANSACTION_${hash}`,
      },
    };
  });
  if (jobs?.length) {
    await queue.addBulk(jobs);
  }
};

export const contractAddressToNativeId = (contractAddress: Address): number | null => {
  const startPrefix = contractAddress?.substring(0, 10);
  const allowed = ['0xaaaaaaaa', '0xcccccccc', '0xbbbbbbbb'];
  if (!allowed?.includes(startPrefix?.toLowerCase())) {
    return null;
  }
  return parseInt(contractAddress?.substring(10, contractAddress?.length - 24), 16);
};

export const extractUnknownFields = (section, method) => {
  if (section === 'dex' && method === 'Swap') {
    return ['trader', 'trading_path', 'supply_Asset_amount', 'target_Asset_amount', 'to'];
  }

  if (section === 'dex' && method === 'AddLiquidity') {
    return ['who', 'asset_id_0', 'reserve_0_increment', 'asset_id_1', 'reserve_1_increment', 'share_increment', 'to'];
  }

  if (section === 'dex' && method === 'RemoveLiquidity') {
    return ['who', 'asset_id_0', 'reserve_0_decrement', 'asset_id_1', 'reserve_1_decrement', 'share_decrement', 'to'];
  }

  return [];
};

export const extraArgsFromEvent = (event, api): { [key: string]: any } => {
  const { method, section, meta, data } = event;
  const args = {};

  if (data) {
    const extractedFields = extractUnknownFields(section, method);
    const fields = meta?.fields || [];
    const fieldsHuman = extractedFields?.length > 0 ? extractedFields : meta?.fields?.toPrimitive();
    const names = fields.map(({ name }) => api.registry.lookup.sanitizeField(name)[0]).filter((n) => !!n);

    data.forEach((data, index) => {
      const value = data.toPrimitive();
      const name = names[index]
        ? names[index]
        : fieldsHuman[index]?.typeName
        ? fieldsHuman[index]?.typeName
        : fieldsHuman[index];
      args[name] = value;
    });
  }

  return args;
};

export const isExtrinsicSuccess = (
  events,
  index: number,
  api: ApiPromise,
): { isSuccess?: boolean; errorInfo?: string } => {
  for (const curEvent of events) {
    const { event, phase } = curEvent;
    if (phase.isApplyExtrinsic && phase.asApplyExtrinsic.eq(index)) {
      if (api.events.system.ExtrinsicSuccess.is(event)) {
        return {
          isSuccess: true,
        };
      } else if (api.events.system.ExtrinsicFailed.is(event)) {
        // extract the data for this event
        const [dispatchError] = event.data;
        let errorInfo;

        // decode the error
        if (dispatchError.isModule) {
          // for module errors, we have the section indexed, lookup
          // (For specific known errors, we can also do a check against the
          // api.errors.<module>.<ErrorName>.is(dispatchError.asModule) guard)
          const decoded = api.registry.findMetaError(dispatchError.asModule);

          errorInfo = `${decoded.section}.${decoded.name}`;
        } else {
          // Other, CannotLookup, BadOrigin, no extra info
          errorInfo = dispatchError.toString();
        }

        return {
          isSuccess: false,
          errorInfo,
        };
      }
    }
  }

  return {};
};

export const isValidHttpUrl = (string) => {
  try {
    const newUrl = new URL(string);
    return newUrl.protocol === 'http:' || newUrl.protocol === 'https:';
  } catch (err) {
    return false;
  }
};

export function decodeBridgeMessage(pegAddress: string, message: string, direction: string) {
  const pegPalletAddress = {
    rootTokenPeg: '0x7556085E8e6A1Dabbc528fbcA2C7699fA5Ee6e11',
    erc20: '0xe9410b5aa32b270154c37752ecc0607c8c7abc5f',
    erc721: '0xc90Eda4C3aF49717dfCeb4CB237A05ee4DfE3C4d',
    bridge: '0x110fd9a44a056cb418d07f7d9957d0303f0020e4',
  };
  switch (pegAddress.toLowerCase()) {
    case pegPalletAddress.rootTokenPeg.toLowerCase(): {
      const [tokenAddress, amount, to] = decodeAbiParameters(
        [{ type: 'address' }, { type: 'uint128' }, { type: 'address' }],
        message as Hex,
      ) as [string, bigint, string];
      const value = {
        amount: amount.toString(),
        tokenAddress,
      };

      return {
        to,
        erc20Value: value,
      };
    }
    case pegPalletAddress.erc20.toLowerCase(): {
      const [tokenAddress, amount, to] = decodeAbiParameters(
        [{ type: 'address' }, { type: 'uint128' }, { type: 'address' }],
        message as Hex,
      ) as [string, bigint, string];
      const value = {
        amount: amount.toString(),
        tokenAddress,
      };

      if (tokenAddress === zeroAddress) {
        return {
          to,
          ethValue: value,
        };
      }

      return {
        to,
        erc20Value: value,
      };
    }

    case pegPalletAddress.erc721.toLowerCase(): {
      const [tokenAddresses, tokenIds, to] = (() => {
        if (direction === 'inbox') {
          const [, arg2, arg3, arg4] = decodeAbiParameters(
            [{ type: 'uint256' }, { type: 'address[]' }, { type: 'uint256[][]' }, { type: 'address' }],
            message as Hash,
          );

          return [arg2, arg3, arg4];
        }

        return decodeAbiParameters(
          [{ type: 'address[]' }, { type: 'uint256[][]' }, { type: 'address' }],
          message as Hex,
        );
      })() as [string[], bigint[][], string];

      const erc721Value = tokenAddresses.map((tokenAddress, index) => {
        return {
          tokenAddress,
          tokenIds: tokenIds[index].map((item) => item.toString()),
        };
      });

      return { to, erc721Value };
    }

    case pegPalletAddress.bridge.toLowerCase(): {
      const [setValue, setId] = decodeAbiParameters(['address[]', 'uint32'], message as Hash) as [string[], number];

      return { authSetValue: { setId, setValue } };
    }
  }
}
