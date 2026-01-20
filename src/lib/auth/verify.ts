import { PrivyClient, verifyAccessToken } from '@privy-io/node'
import { createRemoteJWKSet } from 'jose'

const privyAppId = process.env.NEXT_PUBLIC_PRIVY_APP_ID
const privyAppSecret = process.env.PRIVY_APP_SECRET
const privyVerificationKey = process.env.PRIVY_VERIFICATION_KEY
const privyJwksUrl = process.env.PRIVY_JWKS_URL

export interface VerifiedUser {
  userId: string
  walletAddresses: string[]
}

function normalizeWalletAddress(walletAddress: string): string {
  return walletAddress.trim().toLowerCase()
}

function getVerificationKey() {
  if (privyVerificationKey) {
    return privyVerificationKey
  }

  if (privyJwksUrl) {
    return createRemoteJWKSet(new URL(privyJwksUrl))
  }

  throw new Error('Privy verification key is not configured')
}

let privyClient: PrivyClient | null = null

function getPrivyClient(): PrivyClient {
  if (!privyAppId || !privyAppSecret) {
    throw new Error('Privy app credentials are not configured')
  }

  if (!privyClient) {
    privyClient = new PrivyClient({
      appId: privyAppId,
      appSecret: privyAppSecret,
    })
  }

  return privyClient
}

/**
 * Verify Privy auth token from request headers
 * Uses Privy JWKS or verification key to validate signature and expiration.
 */
export async function verifyAuthToken(authHeader: string | null): Promise<VerifiedUser | null> {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null
  }

  if (!privyAppId) {
    console.error('NEXT_PUBLIC_PRIVY_APP_ID is not configured')
    return null
  }

  const token = authHeader.replace('Bearer ', '')

  try {
    const verified = await verifyAccessToken({
      access_token: token,
      app_id: privyAppId,
      verification_key: getVerificationKey(),
    })

    const client = getPrivyClient()
    const user = await client.users()._get(verified.user_id)

    const walletAddresses = (user.linked_accounts || [])
      .filter((account) => account.type === 'wallet' || account.type === 'smart_wallet')
      .filter((account) => ('chain_type' in account ? account.chain_type === 'ethereum' : true))
      .map((account) => normalizeWalletAddress(account.address))

    return {
      userId: verified.user_id,
      walletAddresses,
    }
  } catch (error) {
    console.error('Failed to verify auth token:', error)
    return null
  }
}
