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
      className="group relative shrink-0 px-3 py-2 sm:px-6 sm:py-3 rounded-lg sm:rounded-xl text-xs sm:text-base font-semibold text-white transition-all duration-300 hover:scale-105 active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed max-w-[9.5rem] sm:max-w-none"
    >
      <div className="absolute inset-0 rounded-xl animated-gradient opacity-90 group-hover:opacity-100 transition-opacity" />
      <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity glow-brand" />
      <span className="relative truncate block max-w-full">
        {busy
          ? "Connecting..."
          : isConnected && address
            ? formatAddress(address)
            : "Connect Wallet"}
      </span>
    </button>
  )
}
