import { createPublicClient, defineChain, http } from "viem"
import {addresses} from "./rootnameservice";
export const CHAIN_ID = Number(process?.env?.CHAIN_ID)

export function isRootChain(chainId: number) {
  return ([7668, 17668].includes(Number(chainId)))
}

export const root = defineChain({
  id: 7668,
  name: "The Root Network - Mainnet",
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
    ...addresses[7668]
  },
  rpcUrls: {
    default: {
      http: ["https://root.rootnet.live/archive"],
      webSocket: ["wss://root.rootnet.live/archive/ws"],
    },
    public: {
      http: ["https://root.rootnet.live/archive"],
      webSocket: ["wss://root.rootnet.live/archive/ws"],
    },
  },
  subgraphs: {
    ens: {
      url: 'https://subgraph.rootnameservice.com/subgraphs/name/graphprotocol/rns/graphql',
    },
  },
  blockExplorerUrls: ["https://rootscan.io/"],
})

export const porcini = defineChain({
  id: 7672,
  name: "The Root Network - Porcini",
  network: "trn-porcini",
  nativeCurrency: {
    decimals: 18,
    name: "Ripple",
    symbol: "XRP",
  },
  contracts: {
    multicall3: {
      address: "0xFC8bd6469c65d58fBf969512Be1564579cEc4855",
      blockCreated: 859439,
    },
    ...addresses[7672]
  },
  rpcUrls: {
    default: {
      http: ["https://porcini.rootnet.app/archive"],
      webSocket: ["wss://porcini.rootnet.app/archive/ws"],
    },
    public: {
      http: ["https://porcini.rootnet.app/archive"],
      webSocket: ["wss://porcini.rootnet.app/archive/ws"],
    },
  },
  subgraphs: {
    ens: {
      url: 'https://subgraph.rootnameservice.com/subgraphs/name/graphprotocol/rns/graphql',
    },
  },
  testnet: true,
  blockExplorersUrls: ["https://porcini.rootscan.io/"],
})

export const rootClient = createPublicClient({
  chain: root,
  transport: http(),
})

export const porciniClient = createPublicClient({
  chain: porcini,
  transport: http(),
})
