"use client"

import { useEffect, useState } from "react"
import { useAccount } from "wagmi"
import { cn } from "@/lib/utils"
import { findClientRegistration } from "@/lib/client-claim-storage"
import { SUBMITTED_WALLET_KEY } from "@/lib/storage-keys"
import { isValidEvmAddress } from "@/lib/validation"
import { useMounted } from "@/lib/use-mounted"
import { AirdropClaimButton } from "@/components/airdrop-claim-button"

type Status = "eligible" | "not-found" | null

interface StatusCheckerProps {
  variant?: "cyan" | "coral"
  initialWallet?: string
}

export function StatusChecker({
  variant = "cyan",
  initialWallet = "",
}: StatusCheckerProps) {
  const mounted = useMounted()
  const { address: connectedAddress, isConnected } = useAccount()
  const [address, setAddress] = useState("")
  const [status, setStatus] = useState<Status>(null)
  const [isChecking, setIsChecking] = useState(false)
  const [allocation, setAllocation] = useState(0)
  const [email, setEmail] = useState("")
  const [submittedAt, setSubmittedAt] = useState("")
  const [submittedAtLabel, setSubmittedAtLabel] = useState("")
  const [error, setError] = useState("")

  const isCoral = variant === "coral"

  useEffect(() => {
    if (!mounted) return

    if (isConnected && connectedAddress) {
      setAddress(connectedAddress)
      return
    }

    const stored = initialWallet || localStorage.getItem(SUBMITTED_WALLET_KEY)
    if (stored) {
      setAddress(stored)
    }
  }, [mounted, initialWallet, isConnected, connectedAddress])

  const runCheck = (walletToCheck: string) => {
    const trimmed = walletToCheck.trim()
    if (!trimmed) return

    setIsChecking(true)
    setStatus(null)
    setError("")

    if (!isValidEvmAddress(trimmed)) {
      setError("Invalid EVM wallet address format")
      setIsChecking(false)
      return
    }

    const submission = findClientRegistration(trimmed)

    if (submission) {
      setStatus("eligible")
      setAllocation(submission.allocation)
      setEmail(submission.email)
      setSubmittedAt(submission.submittedAt)
      setSubmittedAtLabel("")
    } else {
      setStatus("not-found")
      setAllocation(0)
      setEmail("")
      setSubmittedAt("")
      setSubmittedAtLabel("")
    }

    setIsChecking(false)
  }

  const handleCheck = () => runCheck(address)

  useEffect(() => {
    if (submittedAt) {
      setSubmittedAtLabel(
        new Date(submittedAt).toLocaleString(undefined, {
          dateStyle: "medium",
          timeStyle: "short",
        })
      )
    } else {
      setSubmittedAtLabel("")
    }
  }, [submittedAt])

  useEffect(() => {
    if (mounted && initialWallet) {
      runCheck(initialWallet)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mounted, initialWallet])

  const getStatusDisplay = () => {
    switch (status) {
      case "eligible":
        return (
          <div className="p-5 rounded-2xl bg-zentra-green/10 border border-zentra-green/30 animate-in fade-in duration-300 space-y-2">
            <p className="font-bold text-zentra-green">Registered for Airdrop</p>
            <p className="text-sm text-muted-foreground">
              Email:{" "}
              <span className="text-foreground font-medium">{email}</span>
            </p>
            <p className="text-sm text-muted-foreground">
              Allocation:{" "}
              <span className="text-foreground font-bold text-lg">
                {allocation.toLocaleString()} ZNTR
              </span>
            </p>
            <p className="text-xs text-muted-foreground/80 pt-1 border-t border-white/5 leading-relaxed">
              You are eligible to claim your ZNTR on BNB Smart Chain. Connect
              the registered wallet below and use{" "}
              <span className="text-foreground font-medium">Claim ZNTR</span> to
              complete your on-chain airdrop — the amount must match your
              allocation above.
              {submittedAtLabel && (
                <> Registration submitted {submittedAtLabel}.</>
              )}
            </p>
            <AirdropClaimButton
              walletAddress={address}
              allocation={allocation}
            />
          </div>
        )
      case "not-found":
        return (
          <div className="p-5 rounded-2xl bg-zentra-coral/10 border border-zentra-coral/30 animate-in fade-in duration-300">
            <p className="font-bold text-zentra-coral">Not Found</p>
            <p className="text-sm text-muted-foreground mt-1">
              No registration found for this wallet on this device. Complete
              Step 1 to register your wallet and email, then check again.
            </p>
          </div>
        )
      default:
        return null
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3">
        <input
          type="text"
          placeholder="Enter wallet address (0x...)"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          className={cn(
            "input-brand flex-1 px-4 py-3.5 rounded-xl text-foreground placeholder:text-muted-foreground/60",
            isCoral && "input-brand-coral"
          )}
        />
        <button
          type="button"
          onClick={handleCheck}
          disabled={isChecking || !address.trim()}
          className="group relative px-8 py-3.5 rounded-xl font-bold text-black text-sm shrink-0 transition-all duration-300 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
        >
          <div className="absolute inset-0 rounded-xl brand-gradient opacity-95 group-hover:opacity-100 group-disabled:opacity-40 transition-opacity" />
          <span className="relative min-w-[80px] inline-block text-center">
            {isChecking ? "Checking..." : "Check"}
          </span>
        </button>
      </div>

      {error && (
        <p className="text-sm text-zentra-coral p-3 rounded-xl bg-zentra-coral/10 border border-zentra-coral/25">
          {error}
        </p>
      )}

      {getStatusDisplay()}
    </div>
  )
}
