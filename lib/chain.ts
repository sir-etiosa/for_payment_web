import { defineChain } from 'viem'

export const appChain = defineChain({
  id: 8453,
  name: 'Base',
  nativeCurrency: { name: 'Ether', symbol: 'ETH', decimals: 18 },
  rpcUrls: {
    default: {
      http: [process.env.NEXT_PUBLIC_RPC_URL!],
      webSocket: [process.env.NEXT_PUBLIC_WS_RPC_URL!],
    },
  },
  blockExplorers: {
    default: {
      name: 'Basescan',
      url: process.env.NEXT_PUBLIC_EXPLORER_URL!,
    },
  },
})
