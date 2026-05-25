"use client"

import { createWeb3Modal } from "@web3modal/wagmi/react"
import { bsc } from "wagmi/chains"
import { projectId, wagmiConfig } from "@/config/wagmi"

createWeb3Modal({
  wagmiConfig,
  defaultChain: bsc,
  projectId: projectId || "00000000000000000000000000000000",
  themeMode: "dark",
  themeVariables: {
    "--w3m-accent": "#22d3ee",
    "--w3m-border-radius-master": "12px",
  },
})
