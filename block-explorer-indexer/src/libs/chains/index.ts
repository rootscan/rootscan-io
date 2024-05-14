import dotenv from 'dotenv';
import { defineChain } from 'viem';

dotenv.config();

if (!process?.env?.RPC_WS_URL || !process?.env?.RPC_HTTP_URL) {
  console.error(`Missing RPC_WS_URL or RPC_HTTP_URL`);
  process.exit(1);
}

const WS_URL = process?.env?.RPC_WS_URL;
const HTTP_URL = process?.env?.RPC_HTTP_URL;

const HTTP_ETHEREUM_URL = process?.env?.RPC_ETHEREUM_HTTP_URL || 'https://cloudflare-eth.com/';

export const root = defineChain({
  id: 7668,
  name: 'TRN - Mainnet',
  network: 'trn-mainnet',
  nativeCurrency: {
    decimals: 18,
    name: 'Ripple',
    symbol: 'XRP',
  },
  contracts: {
    multicall3: {
      address: '0xc9C2E2429AeC354916c476B30d729deDdC94988d',
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
  name: 'TRN - Porcini',
  network: 'trn-porcini',
  nativeCurrency: {
    decimals: 18,
    name: 'Ripple',
    symbol: 'XRP',
  },
  contracts: {
    multicall3: {
      address: '0xc9c2e2429aec354916c476b30d729deddc94988d',
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

export const ethereum = defineChain({
  id: 1,
  name: 'Ethereum',
  network: 'ethereum',
  nativeCurrency: {
    decimals: 18,
    name: 'ETH',
    symbol: 'ETH',
  },
  rpcUrls: {
    default: {
      http: [HTTP_ETHEREUM_URL],
    },
    public: {
      http: [HTTP_ETHEREUM_URL],
    },
  },
});
