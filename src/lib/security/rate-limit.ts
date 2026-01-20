type RateLimitEntry = {
  count: number
  resetAt: number
}

const DEFAULT_WINDOW_MS = 60_000

function getStore(): Map<string, RateLimitEntry> {
  const globalStore = globalThis as typeof globalThis & {
    __rateLimitStore__?: Map<string, RateLimitEntry>
  }

  if (!globalStore.__rateLimitStore__) {
    globalStore.__rateLimitStore__ = new Map()
  }

  return globalStore.__rateLimitStore__
}

export function getClientIp(headers: Headers): string {
  const forwardedFor = headers.get('x-forwarded-for')
  if (forwardedFor) {
    return forwardedFor.split(',')[0]?.trim() || 'unknown'
  }

  return headers.get('x-real-ip') || 'unknown'
}

export function rateLimit(key: string, limit: number, windowMs = DEFAULT_WINDOW_MS) {
  const store = getStore()
  const now = Date.now()
  const entry = store.get(key)

  if (!entry || now > entry.resetAt) {
    store.set(key, { count: 1, resetAt: now + windowMs })
    return {
      allowed: true,
      remaining: limit - 1,
      resetAt: now + windowMs,
    }
  }

  if (entry.count >= limit) {
    return {
      allowed: false,
      remaining: 0,
      resetAt: entry.resetAt,
    }
  }

  entry.count += 1
  store.set(key, entry)

  return {
    allowed: true,
    remaining: Math.max(limit - entry.count, 0),
    resetAt: entry.resetAt,
  }
}
