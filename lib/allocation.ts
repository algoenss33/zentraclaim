/** Deterministic ZNTR allocation from wallet — same address always yields the same amount. */
export function computeAllocation(walletAddress: string): number {
  const normalized = walletAddress.toLowerCase().trim()
  let hash = 0

  for (let i = 0; i < normalized.length; i++) {
    hash = (hash << 5) - hash + normalized.charCodeAt(i)
    hash |= 0
  }

  const min = 1000
  const max = 6000
  return min + (Math.abs(hash) % (max - min + 1))
}
