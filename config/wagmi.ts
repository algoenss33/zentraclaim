import { defaultWagmiConfig } from "@web3modal/wagmi/react/config"
import { fallback, http } from "viem"
import { bsc } from "wagmi/chains"

export const projectId =
  process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID ?? ""

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"

/** Public BSC RPC — avoids WalletConnect RPC CORS/403 on localhost. */
const bscTransport = fallback(
  [
    process.env.NEXT_PUBLIC_BSC_RPC_URL,
    "https://bsc-dataseed.binance.org",
    "https://bsc-dataseed1.defibit.io",
    "https://bsc-dataseed1.ninicoin.io",
  ]
    .filter(Boolean)
    .map((url) => http(url as string))
)

export const wagmiConfig = defaultWagmiConfig({
  chains: [bsc],
  projectId: projectId || "00000000000000000000000000000000",
  metadata: {
    name: "Zentra Wallet",
    description: "Zentra Airdrop Claim Portal",
    url: siteUrl,
    icons: [`${siteUrl}/zentra.png`],
  },
  enableInjected: true,
  enableWalletConnect: Boolean(projectId),
  enableEIP6963: true,
  transports: {
    [bsc.id]: bscTransport,
  },
})

export const isWalletConnectConfigured = Boolean(projectId)
