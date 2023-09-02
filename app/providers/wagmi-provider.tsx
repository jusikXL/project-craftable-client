"use client";

import { ReactNode } from "react";
import { WagmiConfig, configureChains, createConfig } from "wagmi";
import { celoAlfajores, mantleTestnet } from "wagmi/chains";
import { publicProvider } from "wagmi/providers/public";
import { CoinbaseWalletConnector } from "wagmi/connectors/coinbaseWallet";
import { MetaMaskConnector } from "wagmi/connectors/metaMask";
import { WalletConnectConnector } from "wagmi/connectors/walletConnect";

const { chains, publicClient, webSocketPublicClient } = configureChains(
  [mantleTestnet, celoAlfajores],
  [publicProvider()]
);

const config = createConfig({
  // May cause hydration error, see https://github.com/wagmi-dev/wagmi/issues/542
  autoConnect: true,
  connectors: [
    new MetaMaskConnector({ chains }),
    new CoinbaseWalletConnector({
      chains,
      options: {
        appName: "Project Craftable",
        chainId: mantleTestnet.id,
      },
    }),
    new WalletConnectConnector({
      options: {
        projectId: "906d0696e4075d7b83f9e01c8f78156e",
      },
    }),
  ],
  publicClient,
  webSocketPublicClient,
});

export default function WagmiProvider({ children }: { children: ReactNode }) {
  return <WagmiConfig config={config}>{children}</WagmiConfig>;
}
