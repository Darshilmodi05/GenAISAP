import { NextRequest } from 'next/server';

interface RateLimitResult {
  success: boolean;
  limit?: number;
  remaining?: number;
  reset?: number;
}

// Simple in-memory rate limiting for development
// In production, this should use Redis/Upstash
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

export async function rateLimit(
  request: NextRequest,
  options: {
    windowMs?: number;
    max?: number;
  } = {}
): Promise<RateLimitResult> {
  const { windowMs = 15 * 60 * 1000, max = 100 } = options; // 15 minutes, 100 requests
  
  const ip = request.headers.get('x-forwarded-for') || 
             request.headers.get('x-real-ip') || 
             'unknown';
  const now = Date.now();
  const key = `rate-limit:${ip}`;
  
  const existing = rateLimitStore.get(key);
  
  if (!existing || now > existing.resetTime) {
    rateLimitStore.set(key, {
      count: 1,
      resetTime: now + windowMs,
    });
    return {
      success: true,
      limit: max,
      remaining: max - 1,
      reset: now + windowMs,
    };
  }
  
  if (existing.count >= max) {
    return {
      success: false,
      limit: max,
      remaining: 0,
      reset: existing.resetTime,
    };
  }
  
  rateLimitStore.set(key, {
    count: existing.count + 1,
    resetTime: existing.resetTime,
  });
  
  return {
    success: true,
    limit: max,
    remaining: max - existing.count - 1,
    reset: existing.resetTime,
  };
}

// Clean up expired entries periodically
setInterval(() => {
  const now = Date.now();
  const entries = Array.from(rateLimitStore.entries());
  for (const [key, value] of entries) {
    if (now > value.resetTime) {
      rateLimitStore.delete(key);
    }
  }
}, 5 * 60 * 1000); // Clean every 5 minutes
