"use client"

import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { WagmiProvider } from "wagmi"
import { isWalletConnectConfigured, wagmiConfig } from "@/config/wagmi"

const queryClient = new QueryClient()

export function Web3Provider({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        {!isWalletConnectConfigured && (
          <div className="bg-amber-500/10 border-b border-amber-500/30 text-center text-xs text-amber-200 px-4 py-2">
            Set{" "}
            <code className="text-amber-100">NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID</code>{" "}
            in <code className="text-amber-100">.env.local</code> for WalletConnect. Browser
            extension wallets still work.
          </div>
        )}
        {children}
      </QueryClientProvider>
    </WagmiProvider>
  )
}
