"use client"

import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"
import { useMounted } from "@/lib/use-mounted"

const faqs = [
  {
    category: "Overview",
    question: "What is the Zentra Airdrop?",
    answer:
      "The Zentra Airdrop is an exclusive token distribution for community members who previously used the Zentra Wallet. Eligible users can claim ZNTR tokens based on their wallet activity and participation within the Zentra ecosystem.",
  },
  {
    category: "Eligibility",
    question: "How do I qualify for the airdrop?",
    answer:
      "To qualify, you must have registered your wallet address during the registration period with a valid email address. Additional criteria include early participation and community engagement.",
  },
  {
    category: "Timeline",
    question: "When will tokens be distributed?",
    answer:
      "Token distribution will begin after the claim period ends. The countdown timer shows the remaining time until distribution starts. Make sure to submit your claim before the deadline.",
  },
  {
    category: "Wallets",
    question: "What wallet types are supported?",
    answer:
      "We support all EVM-compatible wallets including MetaMask, OKX Wallet, Trust Wallet, Coinbase Wallet, and any wallet that supports Ethereum-based addresses (0x format).",
  },
  {
    category: "Rules",
    question: "Can I claim multiple times?",
    answer:
      "No, each wallet address and email combination can only submit one claim. Multiple submissions from the same wallet will be flagged and may result in disqualification.",
  },
  {
    category: "Process",
    question: "What happens after I submit my claim?",
    answer:
      "After submission, your claim will be verified against our eligibility database. You can use the status checker to monitor your claim status. Approved claims will receive tokens during the distribution phase.",
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
              Quick answers about eligibility, wallets, and the claim process.
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
