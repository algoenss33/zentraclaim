"use client"

import { ParticlesBackground } from "@/components/particles-background"
import { ConnectWallet } from "@/components/connect-wallet-button"
import { ClaimWizard } from "@/components/claim-wizard"
import { FAQSection } from "@/components/faq-section"
import { Footer } from "@/components/footer"
import { ZentraBrand, ZentraLogo } from "@/components/zentra-logo"

export default function Home() {
  return (
    <div className="min-h-screen bg-background grid-bg relative overflow-hidden">
      <ParticlesBackground />

      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-zentra-cyan/15 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-zentra-green/12 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-zentra-coral/8 rounded-full blur-3xl" />
      </div>

      <header className="relative z-10 border-b border-border/50 bg-background/30 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <ZentraBrand compact logoClassName="w-10 h-10" />
          <ConnectWallet />
        </div>
      </header>

      <main className="relative z-10 max-w-6xl mx-auto px-4 py-12 md:py-20">
        <section className="text-center mb-12 md:mb-16">
          <div className="flex justify-center mb-8">
            <ZentraLogo
              className="w-28 h-28 md:w-36 md:h-36"
              src="/wallet.png"
              plain
              priority
            />
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-4 text-balance">
            <span className="text-glow uppercase">Zentra Wallet</span>
            <span className="block mt-1 text-2xl md:text-4xl font-semibold text-brand-gradient uppercase">
              Airdrop Claim Portal
            </span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto text-pretty">
            Complete 3 simple steps — submit your claim, track progress, then verify
            your allocation status.
          </p>
        </section>

        <ClaimWizard />

        <section className="mb-16 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300 max-w-4xl mx-auto">
          <FAQSection />
        </section>
      </main>

      <Footer />
    </div>
  )
}
