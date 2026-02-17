/**
 * In-memory sliding window rate limiter.
 * Tracks requests per IP within a 60-second window.
 */

interface RateLimitEntry {
  timestamps: number[];
}

const store = new Map<string, RateLimitEntry>();

const WINDOW_MS = 60_000; // 1 minute
const CLEANUP_INTERVAL = 5 * 60_000; // 5 minutes

// Periodic cleanup to prevent memory leaks
if (typeof globalThis !== "undefined") {
  const cleanup = () => {
    const now = Date.now();
    for (const [key, entry] of store) {
      entry.timestamps = entry.timestamps.filter((t) => now - t < WINDOW_MS);
      if (entry.timestamps.length === 0) {
        store.delete(key);
      }
    }
  };

  // Only set interval in server context
  if (typeof setInterval !== "undefined") {
    setInterval(cleanup, CLEANUP_INTERVAL);
  }
}

/**
 * Check and record a request for rate limiting.
 * @param key - Unique identifier (usually IP address)
 * @param limit - Max requests per minute (default 60)
 * @returns { allowed, remaining, retryAfter }
 */
export function rateLimit(
  key: string,
  limit: number = 60
): { allowed: boolean; remaining: number; retryAfter: number } {
  const now = Date.now();

  let entry = store.get(key);
  if (!entry) {
    entry = { timestamps: [] };
    store.set(key, entry);
  }

  // Remove timestamps outside the window
  entry.timestamps = entry.timestamps.filter((t) => now - t < WINDOW_MS);

  if (entry.timestamps.length >= limit) {
    const oldestInWindow = entry.timestamps[0];
    const retryAfter = Math.ceil((oldestInWindow + WINDOW_MS - now) / 1000);
    return { allowed: false, remaining: 0, retryAfter };
  }

  entry.timestamps.push(now);
  const remaining = limit - entry.timestamps.length;

  return { allowed: true, remaining, retryAfter: 0 };
}
