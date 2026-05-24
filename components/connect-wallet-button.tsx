"use client"

import dynamic from "next/dynamic"

function ConnectPlaceholder() {
  return (
    <button
      type="button"
      disabled
      className="relative px-6 py-3 rounded-xl font-semibold text-white opacity-80"
    >
      <div className="absolute inset-0 rounded-xl animated-gradient opacity-90" />
      <span className="relative">Connect Wallet</span>
    </button>
  )
}

export const ConnectWallet = dynamic(
  () => import("./connect-wallet").then((mod) => mod.ConnectWallet),
  {
    ssr: false,
    loading: () => <ConnectPlaceholder />,
  }
)
