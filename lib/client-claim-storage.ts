import { computeAllocation } from "@/lib/allocation"
import { SUBMITTED_WALLET_KEY } from "@/lib/storage-keys"
import { isValidEvmAddress, normalizeWallet } from "@/lib/validation"

export interface ClientSubmission {
  wallet: string
  email: string
  allocation: number
  submittedAt: string
}

const REGISTRATIONS_KEY = "zentra_claim_registrations"

function readAll(): Record<string, ClientSubmission> {
  if (typeof window === "undefined") return {}
  try {
    const raw = localStorage.getItem(REGISTRATIONS_KEY)
    if (!raw) return {}
    const parsed = JSON.parse(raw) as Record<string, ClientSubmission>
    return parsed && typeof parsed === "object" ? parsed : {}
  } catch {
    return {}
  }
}

function writeAll(data: Record<string, ClientSubmission>) {
  localStorage.setItem(REGISTRATIONS_KEY, JSON.stringify(data))
}

export function saveClientRegistration(
  walletAddress: string,
  email: string
): ClientSubmission {
  const wallet = normalizeWallet(walletAddress)
  const submission: ClientSubmission = {
    wallet,
    email: email.trim(),
    allocation: computeAllocation(wallet),
    submittedAt: new Date().toISOString(),
  }

  const all = readAll()
  all[wallet] = submission
  writeAll(all)
  localStorage.setItem(SUBMITTED_WALLET_KEY, wallet)

  return submission
}

export function findClientRegistration(
  walletAddress: string
): ClientSubmission | null {
  if (!isValidEvmAddress(walletAddress)) return null
  const wallet = normalizeWallet(walletAddress)
  return readAll()[wallet] ?? null
}
