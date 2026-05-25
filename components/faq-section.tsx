"use client"

import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"
import { useMounted } from "@/lib/use-mounted"

const faqs = [
  {
    category: "Overview",
    question: "What is the Zentra Airdrop Claim Portal?",
    answer:
      "This portal lets eligible Zentra Wallet users register their wallet and email, then claim ZNTR directly on BNB Smart Chain through our airdrop smart contract. Tokens are received in your wallet when the on-chain claim succeeds — there is no separate off-chain distribution phase.",
  },
  {
    category: "Eligibility",
    question: "Who can claim and what do I need?",
    answer:
      "You must use the same email you registered during the Zentra Wallet airdrop period, plus the wallet you connect on this site. In Step 1 you register wallet + email. In Step 3 you confirm your fixed ZNTR allocation, then complete the on-chain claim with that exact amount before the deadline.",
  },
  {
    category: "Timeline",
    question: "When does the claim period end?",
    answer:
      "On-chain claims must be completed before 8 June 2026. Step 2 shows a live countdown until the claim window closes. Register early, then use Claim ZNTR in Step 3 while time remains — after the deadline the contract will no longer accept new claims.",
  },
  {
    category: "Wallets",
    question: "Which network and wallets are supported?",
    answer:
      "Claims run on BNB Smart Chain (BSC). Connect an EVM wallet such as MetaMask, OKX Wallet, Trust Wallet, or Coinbase Wallet via the header button. Your connected address must match the wallet you registered in Step 1 when you press Claim ZNTR.",
  },
  {
    category: "Rules",
    question: "Can I claim more than once?",
    answer:
      "No. Each wallet can register only once in our records, and the smart contract allows one on-chain claim per address. Do not submit duplicate registrations or retry with a different email for the same wallet.",
  },
  {
    category: "Process",
    question: "How do I claim ZNTR from start to finish?",
    answer:
      "Step 1 — Connect wallet on BSC, enter your Zentra Wallet airdrop email, and register. Step 2 — Track the countdown until 8 June 2026. Step 3 — Check status to see your allocation, connect the same wallet, and tap Claim ZNTR. Confirm the transaction in your wallet; the claim amount must match your displayed allocation and may require a small BNB network fee set by the contract.",
  },
] as const

export function FAQSection() {
  const mounted = useMounted()
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  useEffect(() => {
    if (mounted) {
      setOpenIndex(0)
    }
  }, [mounted])

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <div className="faq-frame">
      <div className="faq-inner overflow-hidden">
        <div className="relative px-6 md:px-10 pt-8 pb-6 border-b border-white/5">
          <div
            className="absolute inset-0 opacity-40 pointer-events-none"
            style={{
              background:
                "radial-gradient(ellipse 60% 80% at 50% -20%, rgba(34,211,238,0.25), transparent)",
            }}
          />
          <div className="relative">
            <p className="text-xs font-semibold uppercase tracking-widest text-zentra-cyan mb-1">
              Support
            </p>
            <h3 className="text-xl md:text-2xl font-bold text-foreground">
              Frequently Asked Questions
            </h3>
            <p className="text-sm text-muted-foreground mt-1 max-w-md">
              Quick answers about registering, claiming on BSC, and deadlines.
            </p>
          </div>
        </div>

        <div className="p-4 md:p-6 space-y-2">
          {faqs.map((faq, index) => {
            const isOpen = mounted && openIndex === index

            return (
              <div
                key={faq.question}
                className={cn(
                  "rounded-xl border transition-all duration-300 overflow-hidden",
                  isOpen
                    ? "faq-item-open border-zentra-cyan/25"
                    : "border-white/5 bg-white/[0.02] hover:border-zentra-cyan/20 hover:bg-white/[0.04]"
                )}
              >
                <button
                  type="button"
                  onClick={() => toggleFAQ(index)}
                  className="w-full px-4 md:px-5 py-4 flex items-center justify-between gap-4 text-left"
                  aria-expanded={isOpen}
                >
                  <div className="flex-1 min-w-0">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-zentra-green/90">
                      {faq.category}
                    </span>
                    <p className="font-semibold text-foreground mt-0.5 leading-snug">
                      {faq.question}
                    </p>
                  </div>
                  <span
                    className={cn(
                      "shrink-0 text-lg font-light text-muted-foreground transition-transform duration-300 w-6 text-center",
                      isOpen && "rotate-45 text-zentra-cyan"
                    )}
                    aria-hidden
                  >
                    +
                  </span>
                </button>

                <div
                  className={cn(
                    "grid transition-[grid-template-rows] duration-300 ease-out",
                    isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                  )}
                >
                  <div className="overflow-hidden">
                    <p className="px-4 md:px-5 pb-5 text-sm text-muted-foreground leading-relaxed border-t border-white/5 pt-4">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        <div className="px-6 md:px-10 py-5 border-t border-white/5 bg-white/[0.02] text-center sm:text-left">
          <p className="text-sm text-muted-foreground">
            Need more help? Reach out via our official Zentra Wallet channels.
          </p>
        </div>
      </div>
    </div>
  )
}
