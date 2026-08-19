/**
 * Simple in-memory rate limiting middleware
 * For production, consider using Redis-based solutions like upstash/ratelimit
 */

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

const rateLimitStore = new Map<string, RateLimitEntry>();

export function rateLimit(maxRequests: number = 5, windowMs: number = 15 * 60 * 1000) {
  return (identifier: string): boolean => {
    const now = Date.now();
    const entry = rateLimitStore.get(identifier);

    if (!entry || now > entry.resetTime) {
      // Create new entry or reset expired one
      rateLimitStore.set(identifier, {
        count: 1,
        resetTime: now + windowMs
      });
      return true;
    }

    if (entry.count >= maxRequests) {
      return false; // Rate limit exceeded
    }

    entry.count++;
    return true;
  };
}

export function getRateLimitHeaders(identifier: string, maxRequests: number, windowMs: number) {
  const entry = rateLimitStore.get(identifier);
  const now = Date.now();
  
  if (!entry || now > entry.resetTime) {
    return {
      'X-RateLimit-Limit': maxRequests.toString(),
      'X-RateLimit-Remaining': (maxRequests - 1).toString(),
      'X-RateLimit-Reset': new Date(now + windowMs).toISOString()
    };
  }

  return {
    'X-RateLimit-Limit': maxRequests.toString(),
    'X-RateLimit-Remaining': Math.max(0, maxRequests - entry.count).toString(),
    'X-RateLimit-Reset': new Date(entry.resetTime).toISOString()
  };
}

// Cleanup expired entries periodically to prevent memory leaks
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of rateLimitStore.entries()) {
    if (now > entry.resetTime) {
      rateLimitStore.delete(key);
    }
  }
}, 60 * 1000); // Cleanup every minute
