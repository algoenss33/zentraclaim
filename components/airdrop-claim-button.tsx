"use client"

import { useEffect, useState } from "react"
import {
  useAccount,
  useChainId,
  useReadContract,
  useSwitchChain,
  useWaitForTransactionReceipt,
  useWriteContract,
} from "wagmi"
import { bsc } from "wagmi/chains"
import { formatEther, parseUnits } from "viem"
import { cn } from "@/lib/utils"
import { AIRDROP_CLAIM_ABI } from "@/lib/contracts/airdrop-claim-abi"
import {
  AIRDROP_CLAIM_ADDRESS,
  AIRDROP_CLAIM_CHAIN_ID,
  BSCSCAN_TX_URL,
  ZNTR_DECIMALS,
} from "@/config/contracts"

interface AirdropClaimButtonProps {
  walletAddress: string
  allocation: number
  className?: string
}

export function AirdropClaimButton({
  walletAddress,
  allocation,
  className,
}: AirdropClaimButtonProps) {
  const { address, isConnected } = useAccount()
  const chainId = useChainId()
  const { switchChainAsync } = useSwitchChain()
  const [localError, setLocalError] = useState("")

  const registeredWallet = walletAddress.toLowerCase()
  const connectedMatches =
    isConnected &&
    address?.toLowerCase() === registeredWallet

  const { data: claimFee } = useReadContract({
    address: AIRDROP_CLAIM_ADDRESS,
    abi: AIRDROP_CLAIM_ABI,
    functionName: "claimFee",
    chainId: AIRDROP_CLAIM_CHAIN_ID,
  })

  const { data: hasClaimedOnChain, refetch: refetchHasClaimed } =
    useReadContract({
      address: AIRDROP_CLAIM_ADDRESS,
      abi: AIRDROP_CLAIM_ABI,
      functionName: "hasClaimed",
      args: [registeredWallet as `0x${string}`],
      chainId: AIRDROP_CLAIM_CHAIN_ID,
    })

  const {
    writeContract,
    data: txHash,
    isPending: isWritePending,
    error: writeError,
    reset: resetWrite,
  } = useWriteContract()

  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash: txHash,
      chainId: AIRDROP_CLAIM_CHAIN_ID,
    })

  useEffect(() => {
    if (writeError) {
      setLocalError(writeError.shortMessage ?? writeError.message)
    }
  }, [writeError])

  useEffect(() => {
    if (isConfirmed) {
      refetchHasClaimed()
    }
  }, [isConfirmed, refetchHasClaimed])

  const claimAmount = parseUnits(String(allocation), ZNTR_DECIMALS)
  const busy = isWritePending || isConfirming
  const alreadyClaimed = hasClaimedOnChain === true

  const handleClaim = async () => {
    setLocalError("")
    resetWrite()

    if (!isConnected || !address) {
      setLocalError("Connect your wallet using the header button first.")
      return
    }

    if (!connectedMatches) {
      setLocalError(
        "Connected wallet must match the registered address for this allocation."
      )
      return
    }

    if (chainId !== AIRDROP_CLAIM_CHAIN_ID) {
      try {
        await switchChainAsync({ chainId: AIRDROP_CLAIM_CHAIN_ID })
      } catch {
        setLocalError("Please switch to BNB Smart Chain (BSC) to claim.")
        return
      }
    }

    if (alreadyClaimed) {
      setLocalError("This wallet has already claimed on-chain.")
      return
    }

    if (allocation <= 0) {
      setLocalError("Invalid allocation amount.")
      return
    }

    try {
      writeContract({
        address: AIRDROP_CLAIM_ADDRESS,
        abi: AIRDROP_CLAIM_ABI,
        functionName: "claimAirdrop",
        args: [claimAmount],
        value: claimFee ?? 0n,
        chainId: AIRDROP_CLAIM_CHAIN_ID,
      })
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Transaction failed. Try again."
      setLocalError(message)
    }
  }

  const feeLabel =
    claimFee !== undefined
      ? `${formatEther(claimFee)} BNB`
      : "loading…"

  return (
    <div className={cn("space-y-3 pt-3 border-t border-white/10 w-full min-w-0", className)}>
      {alreadyClaimed ? (
        <p className="text-sm font-medium text-zentra-green">
          On-chain claim completed for this wallet.
        </p>
      ) : (
        <>
          <p className="text-xs text-muted-foreground leading-relaxed break-words">
            Claim {allocation.toLocaleString()} ZNTR on BNB Smart Chain. Network
            fee: {feeLabel}
            {chainId !== AIRDROP_CLAIM_CHAIN_ID && isConnected && (
              <span className="block mt-1 text-amber-300/90">
                Switch to {bsc.name} to continue.
              </span>
            )}
          </p>
          <button
            type="button"
            onClick={handleClaim}
            disabled={busy || !isConnected || alreadyClaimed}
            className="group relative w-full sm:w-auto px-8 py-3.5 sm:py-3 rounded-xl font-bold text-black text-sm transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            <div className="absolute inset-0 rounded-xl brand-gradient opacity-95 group-hover:opacity-100 group-disabled:opacity-40 transition-opacity" />
            <span className="relative">
              {busy
                ? isConfirming
                  ? "Confirming…"
                  : "Claiming…"
                : "Claim ZNTR"}
            </span>
          </button>
        </>
      )}

      {!isConnected && (
        <p className="text-xs text-muted-foreground">
          Connect the registered wallet ({walletAddress.slice(0, 6)}…
          {walletAddress.slice(-4)}) to claim.
        </p>
      )}

      {isConnected && !connectedMatches && (
        <p className="text-xs text-amber-300/90">
          Wrong wallet connected. Use {walletAddress.slice(0, 6)}…
          {walletAddress.slice(-4)}.
        </p>
      )}

      {localError && (
        <p className="text-sm text-zentra-coral p-3 rounded-xl bg-zentra-coral/10 border border-zentra-coral/25">
          {localError}
        </p>
      )}

      {isConfirmed && txHash && (
        <p className="text-sm text-zentra-green">
          Claim successful.{" "}
          <a
            href={`${BSCSCAN_TX_URL}/${txHash}`}
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-zentra-cyan"
          >
            View on BscScan
          </a>
        </p>
      )}
    </div>
  )
}
