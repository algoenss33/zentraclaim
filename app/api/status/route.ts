import { NextResponse } from "next/server"
import { findSubmission } from "@/lib/submissions"
import { isValidEvmAddress } from "@/lib/validation"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const address = searchParams.get("address") ?? ""

    if (!address.trim()) {
      return NextResponse.json(
        { error: "Wallet address is required" },
        { status: 400 }
      )
    }

    if (!isValidEvmAddress(address)) {
      return NextResponse.json(
        { error: "Invalid EVM wallet address format" },
        { status: 400 }
      )
    }

    const submission = await findSubmission(address)

    if (!submission) {
      return NextResponse.json({
        status: "not-found" as const,
        message: "This wallet has not submitted a claim yet.",
      })
    }

    return NextResponse.json({
      status: "eligible" as const,
      wallet: submission.wallet,
      email: submission.email,
      allocation: submission.allocation,
      submittedAt: submission.submittedAt,
    })
  } catch (error) {
    console.error("[api/status]", error)
    return NextResponse.json(
      { error: "Failed to check status" },
      { status: 500 }
    )
  }
}
