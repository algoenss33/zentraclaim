"use client"

import "@/lib/web3modal-init"
import { useWeb3Modal } from "@web3modal/wagmi/react"
import { useAccount, useDisconnect } from "wagmi"
import { formatAddress } from "@/lib/format-address"

export function ConnectWallet() {
  const { open } = useWeb3Modal()
  const { address, isConnected, isConnecting, isReconnecting } = useAccount()
  const { disconnect } = useDisconnect()

  const busy = isConnecting || isReconnecting

  const handleClick = () => {
    if (isConnected) {
      disconnect()
      return
    }
    open()
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={busy}
      className="group relative px-6 py-3 rounded-xl font-semibold text-white transition-all duration-300 hover:scale-105 disabled:opacity-70 disabled:cursor-not-allowed"
    >
      <div className="absolute inset-0 rounded-xl animated-gradient opacity-90 group-hover:opacity-100 transition-opacity" />
      <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity glow-brand" />
      <span className="relative">
        {busy
          ? "Connecting..."
          : isConnected && address
            ? formatAddress(address)
            : "Connect Wallet"}
      </span>
    </button>
  )
}
