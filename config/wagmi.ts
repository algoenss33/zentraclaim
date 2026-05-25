import { defaultWagmiConfig } from "@web3modal/wagmi/react/config"
import { bsc } from "wagmi/chains"

export const projectId =
  process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID ?? ""

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"

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
})

export const isWalletConnectConfigured = Boolean(projectId)
