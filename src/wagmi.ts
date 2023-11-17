import { getDefaultWallets } from '@rainbow-me/rainbowkit'
import { configureChains, createConfig } from 'wagmi'
import { holesky, sepolia } from 'wagmi/chains'
import { publicProvider } from 'wagmi/providers/public'

import { Chain } from 'wagmi'

const walletConnectProjectId = 'c96e690bb92b6311e8e9b2a6a22df575'

const redstoneHolesky = {
  id: 17_001,
  name: 'Redstone Holesky',
  network: 'redstone-holesky',
  nativeCurrency: {
    name: 'Holesky Ether',
    symbol: 'ETH',
    decimals: 18,
  },
  rpcUrls: {
    default: { http: ['https://rpc.holesky.redstone.xyz'], },
    public: { http: ['https://rpc.holesky.redstone.xyz'], },
  },
  blockExplorers: {
    default: { name: 'Redstone Holesky', 
               url: 'https://explorer.holesky.redstone.xyz' },
  },
}  as const satisfies Chain


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

