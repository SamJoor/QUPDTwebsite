const attempts = new Map<string, { count: number; resetAt: number }>();

/**
 * Simple in-memory rate limiter. Works per-instance on Vercel serverless —
 * good enough to block sustained brute-force within a single instance lifetime.
 * Returns true if the request is allowed, false if it should be blocked.
 */
export function checkRateLimit(key: string, maxAttempts = 5, windowMs = 10 * 60 * 1000): boolean {
  const now = Date.now();
  const record = attempts.get(key);

  if (!record || now > record.resetAt) {
    attempts.set(key, { count: 1, resetAt: now + windowMs });
    return true;
  }

  if (record.count >= maxAttempts) {
    return false;
  }

  record.count++;
  return true;
}

export function clearRateLimit(key: string) {
  attempts.delete(key);
}
