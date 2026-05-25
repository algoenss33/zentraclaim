import fs from "fs/promises"
import path from "path"
import { computeAllocation } from "@/lib/allocation"
import { normalizeEmail, normalizeWallet } from "@/lib/validation"

export interface Submission {
  wallet: string
  email: string
  allocation: number
  submittedAt: string
}

const DATA_DIR = path.join(process.cwd(), "data")
const SUBMISSIONS_FILE = path.join(DATA_DIR, "airdrop-submissions.txt")

const FILE_HEADER = `# Zentra Airdrop Submissions
# Format: wallet|email|allocation_zntr|submitted_at (ISO 8601)
# Used for future on-chain airdrop claims — do not edit wallet/allocation pairs manually.
`

function parseLine(line: string): Submission | null {
  const trimmed = line.trim()
  if (!trimmed || trimmed.startsWith("#")) return null

  const parts = trimmed.split("|")
  if (parts.length < 4) return null

  const wallet = parts[0].trim().toLowerCase()
  const email = parts[1].trim().toLowerCase()
  const allocation = Number.parseInt(parts[2].trim(), 10)
  const submittedAt = parts[3].trim()

  if (!wallet || !email || Number.isNaN(allocation)) return null

  return { wallet, email, allocation, submittedAt }
}

function formatLine(submission: Submission): string {
  return `${submission.wallet}|${submission.email}|${submission.allocation}|${submission.submittedAt}`
}

async function ensureDataFile(): Promise<void> {
  await fs.mkdir(DATA_DIR, { recursive: true })
  try {
    await fs.access(SUBMISSIONS_FILE)
  } catch {
    await fs.writeFile(SUBMISSIONS_FILE, FILE_HEADER, "utf-8")
  }
}

export async function readAllSubmissions(): Promise<Submission[]> {
  await ensureDataFile()
  const content = await fs.readFile(SUBMISSIONS_FILE, "utf-8")
  const submissions: Submission[] = []

  for (const line of content.split("\n")) {
    const parsed = parseLine(line)
    if (parsed) submissions.push(parsed)
  }

  return submissions
}

export async function findSubmission(
  walletAddress: string
): Promise<Submission | null> {
  const wallet = normalizeWallet(walletAddress)
  const all = await readAllSubmissions()
  return all.find((s) => s.wallet === wallet) ?? null
}

export async function saveSubmission(
  walletAddress: string,
  email: string
): Promise<{ submission: Submission; created: boolean }> {
  await ensureDataFile()
  const wallet = normalizeWallet(walletAddress)
  const normalizedEmail = normalizeEmail(email).replace(/\|/g, "")

  const existing = await findSubmission(wallet)

  if (existing) {
    return { submission: existing, created: false }
  }

  const submission: Submission = {
    wallet,
    email: normalizedEmail,
    allocation: computeAllocation(wallet),
    submittedAt: new Date().toISOString(),
  }

  const line = formatLine(submission) + "\n"
  await fs.appendFile(SUBMISSIONS_FILE, line, "utf-8")

  return { submission, created: true }
}
