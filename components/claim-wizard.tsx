"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { ClaimForm } from "@/components/claim-form"
import { CountdownTimer } from "@/components/countdown-timer"
import { CLAIM_END_LABEL } from "@/lib/claim-deadline"
import { StatusChecker } from "@/components/status-checker"

const STEPS = [
  {
    id: 1,
    title: "Submit Claim",
    subtitle: "Register your wallet and email address",
    glow: "wizard-step-glow-cyan",
    ring: "border-zentra-cyan/50",
    bg: "bg-zentra-cyan/15",
    text: "text-zentra-cyan",
    dot: "bg-zentra-cyan",
  },
  {
    id: 2,
    title: "Track Progress",
    subtitle: "Monitor time remaining until the claim period ends",
    glow: "wizard-step-glow-green",
    ring: "border-zentra-green/50",
    bg: "bg-zentra-green/15",
    text: "text-zentra-green",
    dot: "bg-zentra-green",
  },
  {
    id: 3,
    title: "Verify Status",
    subtitle: "Confirm your allocation and claim status",
    glow: "wizard-step-glow-coral",
    ring: "border-zentra-coral/50",
    bg: "bg-zentra-coral/15",
    text: "text-zentra-coral",
    dot: "bg-zentra-coral",
  },
] as const

const STATUS_CARDS = [
  {
    label: "Eligible",
    desc: "Wallet registered and ready for distribution",
    border: "border-zentra-green/30",
    bg: "bg-zentra-green/5",
  },
  {
    label: "Pending",
    desc: "Under review by the team",
    border: "border-amber-400/30",
    bg: "bg-amber-400/5",
  },
  {
    label: "Not Found",
    desc: "Not registered on the whitelist",
    border: "border-zentra-coral/30",
    bg: "bg-zentra-coral/5",
  },
] as const

export function ClaimWizard() {
  const [currentStep, setCurrentStep] = useState(1)
  const [claimSubmitted, setClaimSubmitted] = useState(false)
  const [maxReachedStep, setMaxReachedStep] = useState(1)
  const [submittedWallet, setSubmittedWallet] = useState("")

  const theme = STEPS[currentStep - 1]

  const goToStep = (step: number) => {
    if (step < 1 || step > 3 || step > maxReachedStep) return
    setCurrentStep(step)
  }

  const handleClaimSuccess = (wallet: string) => {
    setSubmittedWallet(wallet)
    setClaimSubmitted(true)
    setMaxReachedStep(2)
    setTimeout(() => setCurrentStep(2), 1200)
  }

  const handleNext = () => {
    if (currentStep === 1 && !claimSubmitted) return
    const next = currentStep + 1
    if (next > 3) return
    setMaxReachedStep((prev) => Math.max(prev, next))
    setCurrentStep(next)
  }

  const handleBack = () => goToStep(currentStep - 1)

  const handleReset = () => {
    setCurrentStep(1)
    setClaimSubmitted(false)
    setSubmittedWallet("")
    setMaxReachedStep(1)
  }

  return (
    <section className="mb-10 sm:mb-16 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200 w-full min-w-0">
      <div className="text-center mb-6 sm:mb-10 px-1">
        <span className="inline-block px-3 py-1 rounded-full text-[10px] sm:text-xs font-semibold uppercase tracking-widest border border-zentra-cyan/25 text-zentra-cyan bg-zentra-cyan/5 mb-3 sm:mb-4">
          3-Step Flow
        </span>
        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground mb-2 uppercase">
          Airdrop Claim Process
        </h2>
        <p className="text-sm sm:text-base text-muted-foreground max-w-xl mx-auto px-2">
          Complete the following steps to claim your ZNTR tokens
        </p>
      </div>

      <div className="mb-6 sm:mb-8 max-w-3xl mx-auto px-1 sm:px-2">
        <div className="flex items-start justify-between relative gap-1">
          <div
            className="absolute top-5 sm:top-6 left-0 right-0 h-px bg-white/10 mx-10 sm:mx-14 md:mx-20"
            aria-hidden
          />
          <div
            className="absolute top-5 sm:top-6 left-10 sm:left-14 md:left-20 right-10 sm:right-14 md:right-20 h-px overflow-hidden"
            aria-hidden
          >
            <div
              className="h-full bg-gradient-to-r from-zentra-cyan via-zentra-green to-zentra-coral transition-all duration-700 ease-out"
              style={{
                width: `${((currentStep - 1) / (STEPS.length - 1)) * 100}%`,
              }}
            />
          </div>

          {STEPS.map((step) => {
            const isActive = currentStep === step.id
            const isCompleted =
              maxReachedStep > step.id && currentStep !== step.id
            const isClickable = step.id <= maxReachedStep

            return (
              <button
                key={step.id}
                type="button"
                onClick={() => isClickable && goToStep(step.id)}
                disabled={!isClickable}
                className={cn(
                  "relative z-10 flex flex-col items-center gap-1.5 sm:gap-2.5 flex-1 min-w-0 transition-all duration-300",
                  isClickable ? "cursor-pointer" : "cursor-default opacity-60"
                )}
              >
                <div
                  className={cn(
                    "w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl flex items-center justify-center border-2 text-xs sm:text-sm font-bold transition-all duration-300",
                    isActive && [step.ring, step.bg, step.text, "scale-110 shadow-lg"],
                    isCompleted &&
                      !isActive &&
                      "border-zentra-green/40 bg-zentra-green/10 text-zentra-green",
                    !isActive &&
                      !isCompleted &&
                      "border-white/10 bg-black/50 text-muted-foreground"
                  )}
                >
                  {isCompleted && !isActive ? "✓" : step.id}
                </div>
                <div className="text-center w-full min-w-0 px-0.5">
                  <p
                    className={cn(
                      "text-[9px] sm:text-[10px] font-bold uppercase tracking-wider sm:tracking-widest",
                      isActive ? step.text : "text-muted-foreground/70"
                    )}
                  >
                    Step {step.id}
                  </p>
                  <p
                    className={cn(
                      "text-[10px] sm:text-sm font-semibold mt-0.5 leading-tight truncate max-w-[5.5rem] sm:max-w-none mx-auto",
                      isActive ? "text-foreground" : "text-muted-foreground"
                    )}
                  >
                    {step.title}
                  </p>
                </div>
              </button>
            )
          })}
        </div>
      </div>

      <div className="wizard-frame max-w-4xl mx-auto w-full min-w-0">
        <div className="wizard-inner overflow-hidden">
          <div
            className={cn(
              "relative border-b border-white/5 px-4 py-5 sm:px-6 sm:py-6 md:px-8 md:py-7",
              theme.glow
            )}
          >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
              <div className="min-w-0">
                <span
                  className={cn(
                    "text-[10px] font-bold uppercase tracking-widest mb-1.5 block",
                    theme.text
                  )}
                >
                  Step {currentStep} of 3
                </span>
                <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-foreground">
                  {theme.title}
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground mt-1 max-w-md leading-relaxed">
                  {theme.subtitle}
                </p>
              </div>
              <div className="flex gap-2 self-start sm:self-center">
                {STEPS.map((s) => (
                  <div
                    key={s.id}
                    className={cn(
                      "h-2 rounded-full transition-all duration-500",
                      s.id === currentStep
                        ? cn("w-10", s.dot)
                        : s.id < currentStep
                          ? "w-3 bg-zentra-green/60"
                          : "w-3 bg-white/10"
                    )}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="p-4 sm:p-6 md:p-8 min-h-[280px] sm:min-h-[340px] relative">
            {currentStep === 1 && (
              <div
                key="step-1"
                className="animate-in fade-in slide-in-from-right-4 duration-500"
              >
                <div className="p-4 md:p-5 rounded-2xl border border-zentra-cyan/20 bg-gradient-to-r from-zentra-cyan/10 via-transparent to-zentra-green/5 mb-8">
                  <p className="font-semibold text-foreground text-sm">
                    Connect your Zentra Wallet
                  </p>
                    <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
                      Click <strong className="text-foreground">Connect Wallet</strong>{" "}
                      in the header (MetaMask, Trust Wallet, etc.). Your address
                      will appear automatically in the form below.
                    </p>
                </div>
                <ClaimForm
                  onSubmitSuccess={handleClaimSuccess}
                  resetOnSuccess={false}
                />
              </div>
            )}

            {currentStep === 2 && (
              <div
                key="step-2"
                className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500"
              >
                <div className="rounded-2xl border border-zentra-green/20 bg-gradient-to-b from-zentra-green/8 to-transparent p-4 sm:p-6 md:p-8 text-center">
                  <p className="text-zentra-green text-[10px] sm:text-xs font-semibold uppercase tracking-widest mb-2 sm:mb-3">
                    Live Countdown
                  </p>
                  <h4 className="text-base sm:text-lg font-bold text-foreground mb-1 uppercase">
                    Claim Ends In
                  </h4>
                  <p className="text-xs sm:text-sm text-muted-foreground mb-5 sm:mb-8 px-1">
                    Submit your claim before {CLAIM_END_LABEL}
                  </p>
                  <CountdownTimer />
                </div>

                {claimSubmitted && (
                  <div className="p-5 rounded-2xl bg-zentra-green/10 border border-zentra-green/25">
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      <span className="text-foreground font-semibold">
                        Claim submitted successfully.
                      </span>{" "}
                      Continue to verification to check your allocation status.
                    </p>
                  </div>
                )}
              </div>
            )}

            {currentStep === 3 && (
              <div
                key="step-3"
                className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500"
              >
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {STATUS_CARDS.map((item) => (
                    <div
                      key={item.label}
                      className={cn(
                        "rounded-2xl border p-5 text-center",
                        item.border,
                        item.bg
                      )}
                    >
                      <p className="font-bold text-foreground">{item.label}</p>
                      <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
                        {item.desc}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="rounded-2xl border border-zentra-coral/20 bg-gradient-to-b from-zentra-coral/8 to-transparent p-4 sm:p-6 md:p-7">
                  <h4 className="text-base sm:text-lg font-bold text-foreground mb-1">
                    Check Your Status
                  </h4>
                  <p className="text-xs sm:text-sm text-muted-foreground mb-4 sm:mb-5 leading-relaxed">
                    Enter your wallet address to view eligibility and allocation.
                  </p>
                  <StatusChecker
                    variant="coral"
                    initialWallet={submittedWallet}
                  />
                </div>
              </div>
            )}
          </div>

          <div className="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between gap-3 px-4 py-4 sm:px-6 sm:py-5 md:px-8 border-t border-white/5 bg-black/40">
            <button
              type="button"
              onClick={handleBack}
              disabled={currentStep === 1}
              className={cn(
                "w-full sm:w-auto px-5 py-3 sm:py-2.5 rounded-xl font-medium text-sm transition-all duration-300",
                currentStep === 1
                  ? "hidden sm:opacity-0 sm:pointer-events-none"
                  : "text-muted-foreground hover:text-foreground border border-white/10 hover:border-white/20 hover:bg-white/5"
              )}
            >
              Back
            </button>

            {currentStep === 3 ? (
              <button
                type="button"
                onClick={handleReset}
                className="w-full sm:w-auto px-6 py-3 sm:py-2.5 rounded-xl font-semibold text-sm border border-white/15 text-foreground hover:bg-white/5 transition-all duration-300"
              >
                New Claim
              </button>
            ) : (
              <button
                type="button"
                onClick={handleNext}
                disabled={currentStep === 1 && !claimSubmitted}
                className="group relative w-full sm:w-auto px-6 py-3 sm:py-2.5 rounded-xl font-semibold text-sm text-black transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                <div className="absolute inset-0 rounded-xl brand-gradient opacity-95 group-hover:opacity-100 group-disabled:opacity-40 transition-opacity" />
                <span className="relative block text-center">
                  {currentStep === 1 ? (
                    <>
                      <span className="sm:hidden">Continue</span>
                      <span className="hidden sm:inline">Continue after submit</span>
                    </>
                  ) : (
                    <>
                      <span className="sm:hidden">To verification</span>
                      <span className="hidden sm:inline">Continue to verification</span>
                    </>
                  )}
                </span>
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
