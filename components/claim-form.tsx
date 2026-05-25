"use client"

import { useEffect, useState } from "react"
import { useAccount } from "wagmi"
import { cn } from "@/lib/utils"
import { saveClientRegistration } from "@/lib/client-claim-storage"
import { isValidEmail, isValidEvmAddress } from "@/lib/validation"
import { useMounted } from "@/lib/use-mounted"

interface ClaimFormProps {
  onSubmitSuccess?: (wallet: string, allocation: number) => void
  resetOnSuccess?: boolean
}

export function ClaimForm({
  onSubmitSuccess,
  resetOnSuccess = true,
}: ClaimFormProps) {
  const mounted = useMounted()
  const { address, isConnected } = useAccount()
  const [walletAddress, setWalletAddress] = useState("")
  const [email, setEmail] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    if (mounted && isConnected && address) {
      setWalletAddress(address)
    }
  }, [mounted, isConnected, address])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess(false)

    if (!isConnected || !address) {
      setError("Connect your wallet using the button in the header first")
      return
    }

    if (!walletAddress.trim() || !email.trim()) {
      setError("Please fill in all fields")
      return
    }

    if (walletAddress.toLowerCase() !== address.toLowerCase()) {
      setError("Wallet address must match your connected wallet")
      return
    }

    if (!isValidEvmAddress(walletAddress)) {
      setError("Invalid EVM wallet address format")
      return
    }

    if (!isValidEmail(email)) {
      setError("Please enter your email")
      return
    }

    setIsSubmitting(true)

    try {
      const submission = saveClientRegistration(
        walletAddress.trim(),
        email.trim()
      )

      setSuccess(true)
      onSubmitSuccess?.(submission.wallet, submission.allocation)

      if (resetOnSuccess) {
        setTimeout(() => {
          setWalletAddress("")
          setEmail("")
          setSuccess(false)
        }, 3000)
      }
    } catch {
      setError("Could not save registration. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="relative">
      {success && (
        <div className="absolute inset-0 z-10 flex items-center justify-center rounded-2xl bg-black/85 backdrop-blur-md animate-in fade-in duration-300">
          <div className="text-center p-8 max-w-sm">
            <div className="w-16 h-16 mx-auto mb-5 rounded-2xl brand-gradient flex items-center justify-center">
              <span className="text-2xl font-bold text-black/90">✓</span>
            </div>
            <h3 className="text-2xl font-bold text-foreground mb-2">
              Claim Submitted
            </h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Registration saved. Continue to Step 3 to verify your allocation
              and claim ZNTR on BNB Smart Chain.
            </p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="rounded-2xl border border-zentra-cyan/15 bg-zentra-cyan/[0.03] p-4 sm:p-5 space-y-4 sm:space-y-5">
          <p className="text-xs font-semibold uppercase tracking-widest text-zentra-cyan">
            Claim Details
          </p>

          <div className="space-y-2">
            <label
              htmlFor="wallet"
              className="block text-sm font-medium text-foreground/90"
            >
              Wallet Address
            </label>
            <input
              id="wallet"
              type="text"
              placeholder="Connect wallet in header first"
              value={mounted && isConnected && address ? walletAddress : walletAddress}
              onChange={(e) => setWalletAddress(e.target.value)}
              readOnly={mounted && isConnected}
              disabled={isSubmitting || !mounted || !isConnected}
              className={cn(
                "input-brand w-full min-w-0 px-4 py-3.5 rounded-xl text-base sm:text-sm text-foreground break-all",
                "placeholder:text-muted-foreground/60 disabled:opacity-50",
                mounted && isConnected && "cursor-default opacity-90"
              )}
            />
            {mounted && isConnected && address && (
              <p className="text-xs text-zentra-green mt-1">
                Filled from your connected wallet
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-foreground/90"
            >
              Email
            </label>
            <div className="rounded-xl border border-zentra-cyan/20 bg-zentra-cyan/[0.06] px-4 py-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-zentra-cyan mb-1">
                Email requirement
              </p>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Enter any email address linked to your Zentra Wallet account.
                Registration is saved on this device and does not require a
                server database.
              </p>
            </div>
            <input
              id="email"
              type="text"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isSubmitting}
              autoComplete="email"
              className={cn(
                "input-brand w-full min-w-0 px-4 py-3.5 rounded-xl text-base sm:text-sm text-foreground",
                "placeholder:text-muted-foreground/60 disabled:opacity-50"
              )}
            />
          </div>
        </div>

        {error && (
          <p className="text-sm font-medium text-zentra-coral p-4 rounded-xl bg-zentra-coral/10 border border-zentra-coral/25 animate-in fade-in duration-300">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="group relative w-full py-3.5 sm:py-4 rounded-xl font-bold text-black text-base sm:text-lg transition-all duration-300 hover:scale-[1.01] active:scale-[0.99] hover:shadow-[0_0_30px_rgba(34,211,238,0.35)] disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:shadow-none"
        >
          <div className="absolute inset-0 rounded-xl brand-gradient opacity-95 group-hover:opacity-100 transition-opacity" />
          <span className="relative">
            {isSubmitting ? "Registering..." : "Register Claim"}
          </span>
        </button>
      </form>
    </div>
  )
}
