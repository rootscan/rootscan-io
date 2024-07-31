import { decodeAbiParameters, Hash, Hex, zeroAddress } from 'viem';

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
      const [setValue, setId] = decodeAbiParameters([{ type: 'address[]' }, { type: 'uint32' }], message as Hash);
      return { authSetValue: { setId, setValue } };
    }
  }
}

export function decodeEventText(eventText): { source: string; message: string } {
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
  return { source, message };
}
