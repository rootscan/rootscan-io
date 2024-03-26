import { program } from 'commander';
import { Address, PublicClient, createPublicClient, defineChain, getAddress, http, isAddress } from 'viem';

import fs from 'node:fs/promises';
import ERC1155_ABI from './abi/erc1155.json';
import ERC721_ABI from './abi/erc721.json';

program.option('--network'); // 0
program.option('--contractaddress'); // 1
program.option('--type'); // 2
program.option('--totalsupply'); //4

program.parse();

const options = program.opts();

const C_REGEX_NORMAL_TOKEN_METADATA_URL = /^.*\/(\d+)$/;

// a polyfill for it would be:
AbortSignal.timeout ??= function timeout(ms) {
  const ctrl = new AbortController()
  setTimeout(() => ctrl.abort(), ms)
  return ctrl.signal
}


if (!options?.network || !options?.contractaddress || !options?.type) {
  console.error(`Missing one of the required arguments.`);
  process.exit(1);
}

const network = program?.args?.[0]?.toLowerCase();
if (network !== 'porcini' && network !== 'root') {
  console.error(`Network can only be root or porcini`);
  process.exit(1);
}

let contractAddress = program?.args?.[1];
let ethereumContractAddress = '';
if (!isAddress(contractAddress)) {
  console.error(`Provided contractAddress is an invalid address`);
  process.exit(1);
} else {
  contractAddress = getAddress(program?.args?.[1]);
}

const tokenType = program?.args?.[2]?.toLowerCase();
if (tokenType !== 'erc721' && tokenType !== 'erc1155') {
  console.error(`Provided type can only be erc721 or erc1155`);
  process.exit(1);
}

const predefinedTotalSupply = program?.args?.[3] ? Number(program?.args?.[3]) : null;
if (tokenType === 'erc1155') {
  if (!predefinedTotalSupply) {
    console.error(`Type is erc1155 please provide --totalsupply`);
    process.exit(1);
  }
}

console.log({ network, contractAddress, tokenType });

const WS_URL = network === 'root' ? 'wss://root.rootnet.live/archive/ws' : 'wss://porcini.rootnet.app/archive/ws';
const HTTP_URL = network === 'root' ? 'https://root.rootnet.live/archive' : 'https://porcini.rootnet.app/archive';
const HTTP_ETHEREUM_URL = 'https://cloudflare-eth.com/';

export const root = defineChain({
  id: 7668,
  name: 'TRN - Mainnet',
  network: 'trn-mainnet',
  nativeCurrency: {
    decimals: 18,
    name: 'Ripple',
    symbol: 'XRP'
  },
  contracts: {
    multicall3: {
      address: '0xc9C2E2429AeC354916c476B30d729deDdC94988d',
      blockCreated: 9218338
    }
  },
  rpcUrls: {
    default: {
      http: [HTTP_URL],
      webSocket: [WS_URL]
    },
    public: {
      http: [HTTP_URL],
      webSocket: [WS_URL]
    }
  }
});

export const porcini = defineChain({
  id: 7672,
  name: 'TRN - Porcini',
  network: 'trn-porcini',
  nativeCurrency: {
    decimals: 18,
    name: 'Ripple',
    symbol: 'XRP'
  },
  contracts: {
    multicall3: {
      address: '0xc9c2e2429aec354916c476b30d729deddc94988d',
      blockCreated: 10555692
    }
  },
  rpcUrls: {
    default: {
      http: [HTTP_URL],
      webSocket: [WS_URL]
    },
    public: {
      http: [HTTP_URL],
      webSocket: [WS_URL]
    }
  }
});

export const ethereumChain = defineChain({
  id: 1,
  name: 'Ethereum',
  network: 'ethereum',
  nativeCurrency: {
    decimals: 18,
    name: 'ETH',
    symbol: 'ETH'
  },
  rpcUrls: {
    default: {
      http: [HTTP_ETHEREUM_URL],
    },
    public: {
      http: [HTTP_ETHEREUM_URL],
    }
  }
});


export const evmClient: PublicClient = createPublicClient({
  chain: network === 'root' ? root : porcini,
  transport: http()
});
export const ethereumClient: PublicClient = createPublicClient({
  chain: ethereumChain,
  transport: http()
});

const getTokenMetadataUrl = async (tokenId = 1): Promise<string> => {
  let data
  if (tokenType === 'erc721') {
     data = (await evmClient.readContract({
      address: contractAddress as Address,
      abi: ERC721_ABI,
      functionName: 'tokenURI',
      args: [tokenId]
    })) as string;
  
    if (data?.startsWith('ethereum://')) {
      // get ethereum address from url string
      const parts = data.split(/[:/]/).filter(part => part !== '');
      ethereumContractAddress = getAddress(parts[1]);

      data = (await ethereumClient.readContract({
        address: ethereumContractAddress as Address,
        abi: ERC721_ABI,
        functionName: 'tokenURI',
        args: [tokenId]
      })) as string;
    }
    return data;
  }

  if (tokenType === 'erc1155') {
    data = (await evmClient.readContract({
      address: contractAddress as Address,
      abi: ERC1155_ABI,
      functionName: 'uri',
      args: [tokenId]
    })) as string;
  }
  if (!data) {
    throw new Error('Unable to determine uri for contract');
  }
  return data;
};

const getTotalSupply = async () => {
  if (tokenType === 'erc1155') {
    return Number(predefinedTotalSupply);
  }
  let data;
  if (ethereumContractAddress) {
    data = (await ethereumClient.readContract({
      address: ethereumContractAddress as Address,
      abi: ERC721_ABI,
      functionName: 'totalSupply'
    })) as string;
  } else {
    data = (await evmClient.readContract({
      address: contractAddress as Address,
      abi: tokenType === 'erc721' ? ERC721_ABI : ERC1155_ABI,
      functionName: 'totalSupply'
    })) as string;
  }
  console.log('Total tokens: ', data);
  if (!data) {
    throw new Error('Unable to determine totalSupply for contract');
  }
  return Number(data);
};

const run = async () => {
  const uri = await getTokenMetadataUrl(1);
  const getTokenMetadataUrlFn = 
    C_REGEX_NORMAL_TOKEN_METADATA_URL.test(uri!) ?
      (tokenId) => {
        const uri2 = uri.substring(0, uri?.length - 1);
        return `${uri2}${tokenId}`
      }: 
      getTokenMetadataUrl;
  
  const totalSupply = await getTotalSupply();
  console.log(`Detected ${uri} as URI with a totalSupply of ${totalSupply}`);
  const fileDir = `./blockchains/${network}/${contractAddress}.json`;
  const exists = await fs.stat(fileDir).catch(() => {
    return false;
  });

  let data: Record<string, unknown>[] = [];
  if (exists) {
    const readData = await fs.readFile(fileDir, 'utf-8');
    data = structuredClone(JSON.parse(readData));
  }

  for (let tokenId = 0; tokenId < totalSupply; tokenId++) {
    const url = await getTokenMetadataUrlFn(tokenId)
    console.log(`Fetching ${tokenId} ${url}`);
    const exists = data?.find((a) => Number(a.tokenId) === tokenId);
    if (exists) {
      console.log(`EXISTS.. ${tokenId}`);
    } else {
      let res;
      try {
        res = await fetch(url, { signal: AbortSignal.timeout(5000) });
      } catch {
        /* eslint no-empty: "error" */
      }
      if (res?.ok) {
        let jsonData: Record<string, unknown> | undefined = undefined;
        try {
          jsonData = await res.json();
        } catch {
          /* eslint no-empty: "error" */
        }
        if (!jsonData) return true;
        if (jsonData?.tokenId === undefined) {
          jsonData.tokenId = Number(tokenId);
        }
        console.log(`Fetched ${tokenId} success.`);
        delete jsonData.attributes;
        delete jsonData.properties;
        delete jsonData._id;
        data.push(jsonData);
      }
    }
    if (tokenId % 100 === 0 || tokenId + 1 >= totalSupply) {
      await fs.writeFile(fileDir, JSON.stringify(data, null, 0));
      console.log('saved')
    }
  }
};

run();
