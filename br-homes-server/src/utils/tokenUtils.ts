import crypto from 'crypto'

/**
 * Generate a raw verification token and its SHA-256 hash.
 * Raw token is sent in the email link; hashed token is stored in DB.
 */
export const generateVerificationToken = (): {
  rawToken: string
  hashedToken: string
} => {
  const rawToken = crypto.randomBytes(32).toString('hex')
  const hashedToken = hashToken(rawToken)
  return { rawToken, hashedToken }
}

/**
 * Hash a token using SHA-256. Used to compare incoming tokens against stored hashes.
 */
export const hashToken = (token: string): string => {
  return crypto.createHash('sha256').update(token).digest('hex')
}
