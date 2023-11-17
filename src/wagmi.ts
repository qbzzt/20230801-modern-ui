import { getDefaultWallets } from '@rainbow-me/rainbowkit'
import { configureChains, createConfig } from 'wagmi'
import { holesky, sepolia } from 'wagmi/chains'
import { publicProvider } from 'wagmi/providers/public'

import { Chain } from 'wagmi'
import { defineChain } from 'viem'

const walletConnectProjectId = 'c96e690bb92b6311e8e9b2a6a22df575'

const redstoneHolesky = defineChain({
  id: 17_001,
  name: 'Redstone Holesky',
  network: 'redstone-holesky',
  nativeCurrency: {
    decimals: 18,
    name: 'Ether',
    symbol: 'ETH',
  },
  rpcUrls: {
    default: {
      http: ['https://rpc.holesky.redstone.xyz'],
      webSocket: ['wss://rpc.holesky.redstone.xyz/ws'],
  },
  public: {
      http: ['https://rpc.holesky.redstone.xyz'],
      webSocket: ['wss://rpc.holesky.redstone.xyz/ws'],
    },
  },
  blockExplorers: {
    default: { name: 'Explorer', url: 'https://explorer.holesky.redstone.xyz' },
  },
})

const { chains, publicClient, webSocketPublicClient } = configureChains(
  [ holesky, sepolia, redstoneHolesky ],
  [ publicProvider(), ],
)

const { connectors } = getDefaultWallets({
  appName: 'My wagmi + RainbowKit App',
  chains,
  projectId: walletConnectProjectId,
})

export const config = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
  webSocketPublicClient,
})

export { chains }

