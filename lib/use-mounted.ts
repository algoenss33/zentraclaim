"use client"

import { useEffect, useState } from "react"

/** Returns true only after the component has mounted (avoids SSR/client mismatches). */
export function useMounted() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return mounted
}
