/**
 * Rate Limiter for Admin Authentication — Phase 4B
 *
 * Implements a lightweight in-memory sliding window rate limiter to protect
 * against brute-force login attempts.
 */

interface AttemptRecord {
  count: number
  firstAttemptAt: number
  lockedUntil: number | null
}

const attemptsMap = new Map<string, AttemptRecord>()

const MAX_ATTEMPTS = 5
const WINDOW_MS = 15 * 60 * 1000 // 15 minutes
const LOCKOUT_MS = 15 * 60 * 1000 // 15 minutes lockout

/**
 * Clean up stale records periodically
 */
function cleanupStaleRecords() {
  const now = Date.now()
  for (const [key, record] of attemptsMap.entries()) {
    if (
      (!record.lockedUntil && now - record.firstAttemptAt > WINDOW_MS) ||
      (record.lockedUntil && now > record.lockedUntil)
    ) {
      attemptsMap.delete(key)
    }
  }
}

/**
 * Check if the given rate limit key (username/IP) is blocked
 */
export function checkRateLimit(key: string): {
  allowed: boolean
  retryAfterSeconds?: number
} {
  cleanupStaleRecords()
  const record = attemptsMap.get(key.toLowerCase())

  if (!record) {
    return { allowed: true }
  }

  const now = Date.now()

  if (record.lockedUntil && now < record.lockedUntil) {
    const retryAfterSeconds = Math.ceil((record.lockedUntil - now) / 1000)
    return { allowed: false, retryAfterSeconds }
  }

  if (record.lockedUntil && now >= record.lockedUntil) {
    attemptsMap.delete(key.toLowerCase())
    return { allowed: true }
  }

  if (now - record.firstAttemptAt > WINDOW_MS) {
    attemptsMap.delete(key.toLowerCase())
    return { allowed: true }
  }

  if (record.count >= MAX_ATTEMPTS) {
    record.lockedUntil = now + LOCKOUT_MS
    const retryAfterSeconds = Math.ceil(LOCKOUT_MS / 1000)
    return { allowed: false, retryAfterSeconds }
  }

  return { allowed: true }
}

/**
 * Record a failed login attempt
 */
export function recordFailedAttempt(key: string): void {
  const normalizedKey = key.toLowerCase()
  const now = Date.now()
  const record = attemptsMap.get(normalizedKey)

  if (!record || now - record.firstAttemptAt > WINDOW_MS) {
    attemptsMap.set(normalizedKey, {
      count: 1,
      firstAttemptAt: now,
      lockedUntil: null,
    })
  } else {
    record.count += 1
    if (record.count >= MAX_ATTEMPTS) {
      record.lockedUntil = now + LOCKOUT_MS
    }
  }
}

/**
 * Clear failed attempts on successful login
 */
export function resetRateLimit(key: string): void {
  attemptsMap.delete(key.toLowerCase())
}
