import { bsc } from "wagmi/chains"

/** Airdrop claim contract on BNB Smart Chain */
export const AIRDROP_CLAIM_ADDRESS =
  (process.env.NEXT_PUBLIC_AIRDROP_CLAIM_ADDRESS ??
    "0x771852af0b4c0157FEFa899B700E44027A62b4D9") as `0x${string}`

export const AIRDROP_CLAIM_CHAIN_ID = bsc.id

/** ZNTR token decimals for claimAirdrop(uint256 amount) */
export const ZNTR_DECIMALS = 18

export const BSCSCAN_TX_URL = "https://bscscan.com/tx"
