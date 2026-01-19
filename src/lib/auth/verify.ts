const privyAppId = process.env.NEXT_PUBLIC_PRIVY_APP_ID!

export interface VerifiedUser {
  userId: string
}

interface PrivyTokenPayload {
  sub?: string
  aud?: string
  iss?: string
  sid?: string
}

/**
 * Decode JWT payload without verification (for MVP)
 * In production, use proper verification with JWKS
 */
function decodeJwtPayload(token: string): PrivyTokenPayload | null {
  try {
    const parts = token.split('.')
    if (parts.length !== 3) return null

    const payload = Buffer.from(parts[1], 'base64url').toString('utf-8')
    return JSON.parse(payload)
  } catch (e) {
    console.error('Failed to decode JWT:', e)
    return null
  }
}

/**
 * Verify Privy auth token from request headers
 * For MVP, decodes the JWT and extracts user info
 * In production, should verify signature using Privy's JWKS
 */
export async function verifyAuthToken(authHeader: string | null): Promise<VerifiedUser | null> {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    console.log('No auth header or invalid format')
    return null
  }

  const token = authHeader.replace('Bearer ', '')

  try {
    // Decode token to get user ID
    const payload = decodeJwtPayload(token)

    if (!payload?.sub) {
      console.log('No sub in token payload')
      return null
    }

    // Verify the token is for our app (aud can be the app ID or issuer URL)
    const isValidAudience = payload.aud === privyAppId ||
      payload.iss?.includes('privy.io') ||
      payload.aud?.includes(privyAppId)

    if (!isValidAudience) {
      console.log('Invalid audience:', payload.aud, 'expected:', privyAppId)
      return null
    }

    return {
      userId: payload.sub,
    }
  } catch (error) {
    console.error('Failed to verify auth token:', error)
    return null
  }
}
