"use client"
import "@rainbow-me/rainbowkit/styles.css"

import { root } from "@/lib/viem-client"
import { getDefaultWallets, RainbowKitProvider } from "@rainbow-me/rainbowkit"
import { configureChains, createConfig, WagmiConfig } from "wagmi"
import { publicProvider } from "wagmi/providers/public"

const { chains, publicClient } = configureChains([root], [publicProvider()])

const { connectors } = getDefaultWallets({
  appName: "TRN - Block Explorer",
  projectId: "ee5ec4836ac4632e246a6097fe333c11",
  chains,
})

const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
})

export default function WalletProvider({ children }) {
  return (
    <WagmiConfig config={wagmiConfig}>
      <RainbowKitProvider chains={chains}>{children}</RainbowKitProvider>
    </WagmiConfig>
  )
}
