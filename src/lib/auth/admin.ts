import { cookies } from 'next/headers'
import { createHash } from 'crypto'

const ADMIN_SECRET = process.env.ADMIN_SECRET_CODE!
const ADMIN_COOKIE_NAME = 'admin_session'
const SESSION_DURATION = 24 * 60 * 60 * 1000 // 24 hours

/**
 * Hash the admin code
 */
function hashCode(code: string): string {
  return createHash('sha256').update(code).digest('hex')
}

/**
 * Verify admin code
 */
export function verifyAdminCode(code: string): boolean {
  return code === ADMIN_SECRET
}

/**
 * Create admin session token
 */
export function createAdminSession(): string {
  const expiry = Date.now() + SESSION_DURATION
  const payload = `admin:${expiry}`
  const signature = hashCode(payload + ADMIN_SECRET)

  return Buffer.from(JSON.stringify({ payload, signature, expiry })).toString('base64')
}

/**
 * Verify admin session token
 */
export function verifyAdminSession(token: string): boolean {
  try {
    const decoded = JSON.parse(Buffer.from(token, 'base64').toString())
    const { payload, signature, expiry } = decoded

    // Check expiry
    if (Date.now() > expiry) {
      return false
    }

    // Verify signature
    const expectedSignature = hashCode(payload + ADMIN_SECRET)
    return signature === expectedSignature
  } catch {
    return false
  }
}

/**
 * Check if current request has valid admin session
 */
export async function isAdminAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies()
  const sessionCookie = cookieStore.get(ADMIN_COOKIE_NAME)

  if (!sessionCookie) {
    return false
  }

  return verifyAdminSession(sessionCookie.value)
}

/**
 * Get admin cookie name for setting
 */
export function getAdminCookieName(): string {
  return ADMIN_COOKIE_NAME
}
