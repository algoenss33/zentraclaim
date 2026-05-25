"use client"

import { useEffect, useState } from "react"
import { CLAIM_END_DATE } from "@/lib/claim-deadline"
import { useMounted } from "@/lib/use-mounted"

interface TimeLeft {
  days: number
  hours: number
  minutes: number
  seconds: number
}

const EMPTY: TimeLeft = { days: 0, hours: 0, minutes: 0, seconds: 0 }

export function CountdownTimer() {
  const mounted = useMounted()
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(EMPTY)
  const [ended, setEnded] = useState(false)

  useEffect(() => {
    if (!mounted) return

    const calculateTimeLeft = () => {
      const distance = CLAIM_END_DATE.getTime() - Date.now()

      if (distance > 0) {
        setEnded(false)
        setTimeLeft({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor(
            (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
          ),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000),
        })
      } else {
        setEnded(true)
        setTimeLeft(EMPTY)
      }
    }

    calculateTimeLeft()
    const timer = setInterval(calculateTimeLeft, 1000)
    return () => clearInterval(timer)
  }, [mounted])

  const display = mounted ? timeLeft : EMPTY

  const timeUnits = [
    { label: "Days", value: display.days },
    { label: "Hours", value: display.hours },
    { label: "Min", value: display.minutes },
    { label: "Sec", value: display.seconds },
  ]

  return (
    <div className="space-y-3 sm:space-y-4 w-full max-w-md mx-auto">
      {mounted && ended && (
        <p className="text-xs sm:text-sm font-semibold text-zentra-coral uppercase tracking-wide px-2">
          Claim period has ended
        </p>
      )}
      <div className="grid grid-cols-4 gap-2 sm:gap-3 w-full">
        {timeUnits.map((unit) => (
          <div key={unit.label} className="flex flex-col items-center min-w-0">
            <div className="relative w-full">
              <div className="absolute inset-0 rounded-lg sm:rounded-xl bg-zentra-cyan/15 blur-lg sm:blur-xl" />
              <div className="relative glass rounded-lg sm:rounded-xl px-2 py-2.5 sm:px-4 sm:py-3 md:px-6 md:py-4 w-full text-center border border-zentra-cyan/25">
                <span className="text-lg sm:text-2xl md:text-4xl font-bold text-white text-glow tabular-nums leading-none">
                  {String(unit.value).padStart(2, "0")}
                </span>
              </div>
            </div>
            <span className="text-[10px] sm:text-xs md:text-sm text-muted-foreground mt-1.5 sm:mt-2 uppercase tracking-wide">
              {unit.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
