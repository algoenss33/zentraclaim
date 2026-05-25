import Image from "next/image"
import { cn } from "@/lib/utils"

interface ZentraLogoProps {
  className?: string
  src?: string
  showGlow?: boolean
  plain?: boolean
  priority?: boolean
}

export function ZentraLogo({
  className = "w-10 h-10",
  src = "/zentra.png",
  showGlow = false,
  plain = false,
  priority = false,
}: ZentraLogoProps) {
  return (
    <div
      className={cn(
        "relative shrink-0",
        className,
        showGlow && "logo-glow-ring"
      )}
    >
      <Image
        src={src}
        alt="Zentra Wallet"
        fill
        className={cn(
          "object-contain",
          !plain && "drop-shadow-[0_0_16px_rgba(34,211,238,0.35)]"
        )}
        sizes="(max-width: 768px) 48px, 160px"
        priority={priority}
      />
    </div>
  )
}

interface ZentraBrandProps {
  compact?: boolean
  logoClassName?: string
  className?: string
}

export function ZentraBrand({
  compact = false,
  logoClassName = "w-10 h-10",
  className,
}: ZentraBrandProps) {
  return (
    <div className={cn("flex items-center gap-2 sm:gap-3 min-w-0", className)}>
      <ZentraLogo className={logoClassName} priority />
      <div className="flex flex-col leading-tight min-w-0">
        <span className="text-base sm:text-lg font-bold tracking-tight md:text-xl truncate">
          <span className="text-foreground">Zentra</span>
          <span className="text-brand-gradient">
            {" "}
            Wallet
          </span>
        </span>
        {!compact && (
          <span className="text-xs text-muted-foreground">Airdrop Claim Portal</span>
        )}
      </div>
    </div>
  )
}
