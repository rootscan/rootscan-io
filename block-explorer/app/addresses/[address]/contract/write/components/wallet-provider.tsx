'use client';

import { porcini, root } from '@/lib/viem-client';
import { RainbowKitProvider, darkTheme, getDefaultWallets, lightTheme } from '@rainbow-me/rainbowkit';
import '@rainbow-me/rainbowkit/styles.css';
import { useTheme } from 'next-themes';
import { WagmiConfig, configureChains, createConfig } from 'wagmi';
import { publicProvider } from 'wagmi/providers/public';

export default function WalletProvider({ children, chainId }) {
  const { theme } = useTheme();
  const { chains, publicClient } = configureChains([Number(chainId) === 7668 ? root : porcini], [publicProvider()]);

  const { connectors } = getDefaultWallets({
    appName: 'TRN - Block Explorer',
    projectId: 'ee5ec4836ac4632e246a6097fe333c11',
    chains,
  });

  const wagmiConfig = createConfig({
    autoConnect: true,
    connectors,
    publicClient,
  });
  return (
    <WagmiConfig config={wagmiConfig}>
      <RainbowKitProvider chains={chains} theme={theme === 'dark' ? darkTheme() : lightTheme()} modalSize="compact">
        {children}
      </RainbowKitProvider>
    </WagmiConfig>
  );
}
