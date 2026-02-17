const CACHE_PREFIX = "imsakia_cache_";
const DEFAULT_TTL = 6 * 60 * 60 * 1000; // 6 hours in ms

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
}

/**
 * Get cached data from localStorage.
 * Returns null if not found or expired.
 */
export function getCached<T>(key: string): { data: T; stale: boolean } | null {
  if (typeof window === "undefined") return null;

  try {
    const raw = localStorage.getItem(CACHE_PREFIX + key);
    if (!raw) return null;

    const entry: CacheEntry<T> = JSON.parse(raw);
    const age = Date.now() - entry.timestamp;
    const stale = age > entry.ttl;

    return { data: entry.data, stale };
  } catch {
    return null;
  }
}

/**
 * Store data in localStorage cache with TTL.
 */
export function setCache<T>(key: string, data: T, ttl: number = DEFAULT_TTL): void {
  if (typeof window === "undefined") return;

  try {
    const entry: CacheEntry<T> = {
      data,
      timestamp: Date.now(),
      ttl,
    };
    localStorage.setItem(CACHE_PREFIX + key, JSON.stringify(entry));
  } catch {
    // localStorage full — clear expired entries and retry
    clearExpiredCache();
    try {
      const entry: CacheEntry<T> = { data, timestamp: Date.now(), ttl };
      localStorage.setItem(CACHE_PREFIX + key, JSON.stringify(entry));
    } catch {
      // Still full — give up silently
    }
  }
}

/**
 * Remove all expired cache entries from localStorage.
 */
export function clearExpiredCache(): void {
  if (typeof window === "undefined") return;

  const now = Date.now();
  const keysToRemove: string[] = [];

  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (!key?.startsWith(CACHE_PREFIX)) continue;

    try {
      const raw = localStorage.getItem(key);
      if (!raw) continue;
      const entry: CacheEntry<unknown> = JSON.parse(raw);
      if (now - entry.timestamp > entry.ttl) {
        keysToRemove.push(key);
      }
    } catch {
      keysToRemove.push(key!);
    }
  }

  for (const key of keysToRemove) {
    localStorage.removeItem(key);
  }
}
