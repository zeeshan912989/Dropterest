interface RateLimitRecord {
  count: number;
  resetAt: number;
}

// In-memory store for development and single-instance deployments
const memoryStore = new Map<string, RateLimitRecord>();

// Clean up stale entries every 5 minutes
if (typeof setInterval !== "undefined") {
  setInterval(() => {
    const now = Date.now();
    for (const [key, record] of memoryStore.entries()) {
      if (record.resetAt <= now) {
        memoryStore.delete(key);
      }
    }
  }, 5 * 60 * 1000);
}

export interface RateLimitOptions {
  limit: number;
  windowMs: number;
}

export interface RateLimitResult {
  success: boolean;
  remaining: number;
  reset: number;
  retryAfterSeconds?: number;
}

/**
 * Rate limit abstraction for authentication endpoints.
 * @param identifier IP address or user identifier
 * @param action The auth action being rate-limited (e.g. 'login', 'signup', 'forgot_password')
 * @param options Limit configuration
 */
export async function rateLimit(
  identifier: string,
  action: string,
  options: RateLimitOptions = { limit: 5, windowMs: 60 * 1000 }
): Promise<RateLimitResult> {
  const key = `${action}:${identifier}`;
  const now = Date.now();

  const record = memoryStore.get(key);

  if (!record || record.resetAt <= now) {
    memoryStore.set(key, {
      count: 1,
      resetAt: now + options.windowMs,
    });
    return {
      success: true,
      remaining: options.limit - 1,
      reset: now + options.windowMs,
    };
  }

  if (record.count >= options.limit) {
    const retryAfterSeconds = Math.ceil((record.resetAt - now) / 1000);
    return {
      success: false,
      remaining: 0,
      reset: record.resetAt,
      retryAfterSeconds,
    };
  }

  record.count += 1;
  memoryStore.set(key, record);

  return {
    success: true,
    remaining: options.limit - record.count,
    reset: record.resetAt,
  };
}
