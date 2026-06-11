export function isValidEvmAddress(address: string): boolean {

  return /^0x[a-fA-F0-9]{40}$/.test(address.trim())

}



export function normalizeWallet(address: string): string {

  return address.trim().toLowerCase()

}



/** Accepts any non-empty email text (no format restriction). */

export function isValidEmail(email: string): boolean {

  return email.trim().length > 0

}



export function normalizeEmail(email: string): string {

  return email.trim().toLowerCase()

}

