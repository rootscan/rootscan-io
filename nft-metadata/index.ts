import { program } from "commander";
import {
  Abi,
  Address,
  PublicClient,
  createPublicClient,
  defineChain,
  getAddress,
  http,
  isAddress,
  parseAbi,
} from "viem";

import ERC1155_ABI from "./abi/erc1155.json";
import ERC721_ABI from "./abi/erc721.json";
import fs from "node:fs/promises";

program.option("--network"); // 0
program.option("--contractaddress"); // 1
program.option("--type"); // 2

program.parse();

const options = program.opts();

if (!options?.network || !options?.contractaddress || !options?.type) {
  console.error(`Missing one of the required arguments.`);
  // @ts-expect-error
  process.exit(1);
}

const network = program?.args?.[0]?.toLowerCase();
if (network !== "porcini" && network !== "root") {
  console.error(`Network can only be root or porcini`);
  // @ts-expect-error
  process.exit(1);
}

let contractAddress = program?.args?.[1];
if (!isAddress(contractAddress)) {
  console.error(`Provided contractAddress is an invalid address`);
  // @ts-expect-error
  process.exit(1);
} else {
  contractAddress = getAddress(program?.args?.[1]);
}

const tokenType = program?.args?.[2]?.toLowerCase();
if (tokenType !== "erc721" && tokenType !== "erc1155") {
  console.error(`Provided type can obly be erc721 or erc1155`);
  // @ts-expect-error
  process.exit(1);
}

console.log({ network, contractAddress, tokenType });

const WS_URL =
  network === "root"
    ? "wss://root.rootnet.live/archive/ws"
    : "wss://porcini.rootnet.app/archive/ws";
const HTTP_URL =
  network === "root"
    ? "https://root.rootnet.live/archive"
    : "https://porcini.rootnet.app/archive";

export const root = defineChain({
  id: 7668,
  name: "TRN - Mainnet",
  network: "trn-mainnet",
  nativeCurrency: {
    decimals: 18,
    name: "Ripple",
    symbol: "XRP",
  },
  contracts: {
    multicall3: {
      address: "0xc9C2E2429AeC354916c476B30d729deDdC94988d",
      blockCreated: 9218338,
    },
  },
  rpcUrls: {
    default: {
      http: [HTTP_URL],
      webSocket: [WS_URL],
    },
    public: {
      http: [HTTP_URL],
      webSocket: [WS_URL],
    },
  },
});

export const porcini = defineChain({
  id: 7672,
  name: "TRN - Porcini",
  network: "trn-porcini",
  nativeCurrency: {
    decimals: 18,
    name: "Ripple",
    symbol: "XRP",
  },
  contracts: {
    multicall3: {
      address: "0xc9c2e2429aec354916c476b30d729deddc94988d",
      blockCreated: 10555692,
    },
  },
  rpcUrls: {
    default: {
      http: [HTTP_URL],
      webSocket: [WS_URL],
    },
    public: {
      http: [HTTP_URL],
      webSocket: [WS_URL],
    },
  },
});

export const evmClient: PublicClient = createPublicClient({
  chain: network === "root" ? root : porcini,
  transport: http(),
});

const detectedUriUrl = async () => {
  if (tokenType === "erc721") {
    const data = (await evmClient.readContract({
      address: contractAddress as Address,
      abi: ERC721_ABI,
      functionName: "tokenURI",
      args: [1],
    })) as string;
    if (!data) {
      throw new Error("Unable to determine uri for contract");
    }
    const uri = data.substring(0, data?.length - 1);
    return uri;
  }
  if (tokenType === "erc1155") {
    return "https://";
  }
};

const getTotalSupply = async () => {
  const data = (await evmClient.readContract({
    address: contractAddress as Address,
    abi: ERC721_ABI,
    functionName: "totalSupply",
  })) as string;
  if (!data) {
    throw new Error("Unable to determine totalSupply for contract");
  }
  return Number(data);
};

const sleep = (ms: number) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, ms);
  });
};

const run = async () => {
  const uri = await detectedUriUrl();
  const totalSupply = await getTotalSupply();
  console.log(`Detected ${uri} as URI with a totalSupply of ${totalSupply}`);
  const fileDir = `./blockchains/${network}/${contractAddress}.json`;
  const exists = await fs.stat(fileDir).catch(() => {
    return false;
  });

  let data: any = [];
  if (exists) {
    const readData = await fs.readFile(fileDir, "utf-8");
    data = structuredClone(JSON.parse(readData));
  }

  for (let tokenId = 0; tokenId < totalSupply; tokenId++) {
    const url = `${uri}${tokenId}`;
    console.log(`Fetching ${tokenId}`);
    const exists = data?.find((a) => Number(a.tokenId) === tokenId);
    if (exists) {
      console.log(`EXISTS.. ${tokenId}`);
      continue;
    }
    const res = await fetch(url);
    if (res?.ok) {
      let jsonData: any = undefined;
      try {
        jsonData = await res.json();
      } catch {
        /* eslint no-empty: "error" */
      }
      if (!jsonData) return true;
      if (jsonData?.tokenId === undefined) {
        jsonData.tokenId = Number(tokenId);
      }
      data.push(jsonData);
    }

    await fs.writeFile(fileDir, JSON.stringify(data, null, 2));

  }
};

run();
