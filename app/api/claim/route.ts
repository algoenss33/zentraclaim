import { NextResponse } from "next/server"
import { saveSubmission } from "@/lib/submissions"
import { isValidEmail, isValidEvmAddress } from "@/lib/validation"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const walletAddress =
      typeof body.walletAddress === "string" ? body.walletAddress : ""
    const email = typeof body.email === "string" ? body.email : ""

    if (!walletAddress.trim() || !email.trim()) {
      return NextResponse.json(
        { error: "Wallet address and email are required" },
        { status: 400 }
      )
    }

    if (!isValidEvmAddress(walletAddress)) {
      return NextResponse.json(
        { error: "Invalid EVM wallet address format" },
        { status: 400 }
      )
    }

    if (!isValidEmail(email)) {
      return NextResponse.json(
        { error: "Invalid email address format" },
        { status: 400 }
      )
    }

    const { submission, created } = await saveSubmission(walletAddress, email)

    return NextResponse.json({
      success: true,
      created,
      wallet: submission.wallet,
      email: submission.email,
      allocation: submission.allocation,
      submittedAt: submission.submittedAt,
    })
  } catch (error) {
    console.error("[api/claim]", error)
    return NextResponse.json(
      { error: "Failed to save submission" },
      { status: 500 }
    )
  }
}
