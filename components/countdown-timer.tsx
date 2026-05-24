"use client"

import { useEffect, useState } from "react"
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
  const [targetDate] = useState(() => {
    const date = new Date()
    date.setDate(date.getDate() + 7)
    return date
  })

  const [timeLeft, setTimeLeft] = useState<TimeLeft>(EMPTY)

  useEffect(() => {
    if (!mounted) return

    const calculateTimeLeft = () => {
      const distance = targetDate.getTime() - Date.now()

      if (distance > 0) {
        setTimeLeft({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor(
            (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
          ),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000),
        })
      } else {
        setTimeLeft(EMPTY)
      }
    }

    calculateTimeLeft()
    const timer = setInterval(calculateTimeLeft, 1000)
    return () => clearInterval(timer)
  }, [mounted, targetDate])

  const display = mounted ? timeLeft : EMPTY

  const timeUnits = [
    { label: "Days", value: display.days },
    { label: "Hours", value: display.hours },
    { label: "Minutes", value: display.minutes },
    { label: "Seconds", value: display.seconds },
  ]

  return (
    <div className="flex items-center justify-center gap-3 md:gap-4">
      {timeUnits.map((unit, index) => (
        <div key={unit.label} className="flex items-center gap-3 md:gap-4">
          <div className="flex flex-col items-center">
            <div className="relative">
              <div className="absolute inset-0 rounded-xl bg-zentra-cyan/15 blur-xl" />
              <div className="relative glass rounded-xl px-4 py-3 md:px-6 md:py-4 min-w-[60px] md:min-w-[80px] text-center border border-zentra-cyan/25">
                <span className="text-2xl md:text-4xl font-bold text-white text-glow tabular-nums">
                  {String(unit.value).padStart(2, "0")}
                </span>
              </div>
            </div>
            <span className="text-xs md:text-sm text-muted-foreground mt-2 uppercase tracking-wider">
              {unit.label}
            </span>
          </div>
          {index < timeUnits.length - 1 && (
            <span className="text-2xl md:text-4xl font-bold text-zentra-cyan/50 mb-6">
              :
            </span>
          )}
        </div>
      ))}
    </div>
  )
}
