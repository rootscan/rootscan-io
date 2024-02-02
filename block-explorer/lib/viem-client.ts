import { createPublicClient, defineChain, http } from "viem"
export const CHAIN_ID = Number(process?.env?.CHAIN_ID)

const WS_URL =
  CHAIN_ID === 7668
    ? "wss://root.rootnet.live/archive/ws"
    : "wss://porcini.rootnet.app/archive/ws"
const HTTP_URL =
  CHAIN_ID === 7668
    ? "https://root.rootnet.live/archive"
    : "https://porcini.rootnet.app/archive"

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
})

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
      address: "0xFC8bd6469c65d58fBf969512Be1564579cEc4855",
      blockCreated: 859439,
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
})

export const publicClient = createPublicClient({
  chain: CHAIN_ID === 7668 ? root : porcini,
  transport: http(),
})
