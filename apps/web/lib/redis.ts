import { Redis } from '@upstash/redis';

// Detect if Upstash Redis environment variables are configured
const isRedisConfigured = 
  process.env.UPSTASH_REDIS_REST_URL && 
  process.env.UPSTASH_REDIS_REST_URL !== 'your_redis_url_here' &&
  process.env.UPSTASH_REDIS_REST_TOKEN;

// Initialize real Upstash client only if configured
const realRedis = isRedisConfigured
  ? new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL!,
      token: process.env.UPSTASH_REDIS_REST_TOKEN!,
    })
  : null;

// High-performance in-memory mock client for development/missing env bypass
class InMemoryRedisMock {
  private store: Map<string, { value: any; expiresAt?: number }> = new Map();
  private lists: Map<string, any[]> = new Map();
  private sortedSets: Map<string, Array<{ score: number; member: string }>> = new Map();

  private isExpired(key: string): boolean {
    const item = this.store.get(key);
    if (!item) return true;
    if (item.expiresAt && Date.now() > item.expiresAt) {
      this.store.delete(key);
      this.lists.delete(key);
      this.sortedSets.delete(key);
      return true;
    }
    return false;
  }

  async set(key: string, value: any): Promise<string> {
    this.store.set(key, { value });
    return 'OK';
  }

  async setex(key: string, ttl: number, value: any): Promise<string> {
    const expiresAt = Date.now() + (ttl * 1000);
    this.store.set(key, { value, expiresAt });
    return 'OK';
  }

  async get(key: string): Promise<any | null> {
    if (this.isExpired(key)) return null;
    return this.store.get(key)?.value ?? null;
  }

  async del(...keys: string[]): Promise<number> {
    let count = 0;
    for (const key of keys) {
      if (this.store.has(key) || this.lists.has(key) || this.sortedSets.has(key)) {
        this.store.delete(key);
        this.lists.delete(key);
        this.sortedSets.delete(key);
        count++;
      }
    }
    return count;
  }

  async exists(key: string): Promise<number> {
    return (!this.isExpired(key) || this.lists.has(key) || this.sortedSets.has(key)) ? 1 : 0;
  }

  async keys(pattern: string): Promise<string[]> {
    const result: string[] = [];
    const cleanPattern = pattern.replace('*', '');
    
    // Clean expired keys first
    for (const key of Array.from(this.store.keys())) {
      this.isExpired(key);
    }
    
    for (const key of Array.from(this.store.keys())) {
      if (key.includes(cleanPattern)) {
        result.push(key);
      }
    }
    return result;
  }

  async incrby(key: string, amount: number): Promise<number> {
    const current = await this.get(key);
    const num = current ? parseInt(String(current)) : 0;
    const next = num + amount;
    await this.set(key, next);
    return next;
  }

  async lpush(key: string, value: any): Promise<number> {
    if (!this.lists.has(key)) {
      this.lists.set(key, []);
    }
    const list = this.lists.get(key)!;
    list.unshift(value);
    return list.length;
  }

  async rpop(key: string): Promise<any | null> {
    const list = this.lists.get(key);
    if (!list || list.length === 0) return null;
    return list.pop();
  }

  async llen(key: string): Promise<number> {
    return this.lists.get(key)?.length ?? 0;
  }

  // Rate-limiting ZSET operations
  async zremrangebyscore(key: string, min: number, max: number): Promise<number> {
    if (!this.sortedSets.has(key)) return 0;
    const set = this.sortedSets.get(key)!;
    const initialLen = set.length;
    const filtered = set.filter(item => item.score < min || item.score > max);
    this.sortedSets.set(key, filtered);
    return initialLen - filtered.length;
  }

  async zcard(key: string): Promise<number> {
    return this.sortedSets.get(key)?.length ?? 0;
  }

  async zadd(key: string, option: { score: number; member: string }): Promise<number> {
    if (!this.sortedSets.has(key)) {
      this.sortedSets.set(key, []);
    }
    const set = this.sortedSets.get(key)!;
    set.push(option);
    return 1;
  }

  async expire(key: string, seconds: number): Promise<number> {
    const item = this.store.get(key);
    if (item) {
      item.expiresAt = Date.now() + (seconds * 1000);
      return 1;
    }
    return 0;
  }

  async ttl(key: string): Promise<number> {
    const item = this.store.get(key);
    if (!item || !item.expiresAt) return -1;
    const diff = item.expiresAt - Date.now();
    return diff > 0 ? Math.floor(diff / 1000) : 0;
  }
}

// Active client is either real Redis or the memory mock
const activeClient = realRedis ?? (new InMemoryRedisMock() as unknown as Redis);

export interface CacheOptions {
  ttl?: number; // Time to live in seconds
}

export class RedisCache {
  // Rate limiting
  static async rateLimit(
    key: string,
    limit: number,
    window: number
  ): Promise<{ success: boolean; remaining: number; resetTime: number }> {
    try {
      const now = Math.floor(Date.now() / 1000);
      const windowStart = now - window;
      
      // Clean old entries
      await activeClient.zremrangebyscore(key, 0, windowStart);
      
      // Count current requests
      const current = await activeClient.zcard(key);
      
      if (current >= limit) {
        const ttl = await activeClient.ttl(key);
        return {
          success: false,
          remaining: 0,
          resetTime: now + (ttl > 0 ? ttl : window),
        };
      }
      
      // Add new request
      await activeClient.zadd(key, { score: now, member: `${now}-${Math.random()}` });
      await activeClient.expire(key, window);
      
      return {
        success: true,
        remaining: Math.max(0, limit - current - 1),
        resetTime: now + window,
      };
    } catch (error) {
      console.warn('[REDIS WARNING] Rate limiter operating in offline mock mode:', error);
      const fallbackNow = Math.floor(Date.now() / 1000);
      return { success: true, remaining: 999, resetTime: fallbackNow + window };
    }
  }

  // Session caching
  static async setSession(
    userId: string,
    sessionData: any,
    options: CacheOptions = {}
  ): Promise<void> {
    const key = `session:${userId}`;
    const value = JSON.stringify(sessionData);
    
    if (options.ttl) {
      await activeClient.setex(key, options.ttl, value);
    } else {
      await activeClient.set(key, value);
    }
  }

  static async getSession(userId: string): Promise<any | null> {
    const key = `session:${userId}`;
    const value = await activeClient.get(key);
    return value ? (typeof value === 'string' ? JSON.parse(value) : value) : null;
  }

  static async deleteSession(userId: string): Promise<void> {
    const key = `session:${userId}`;
    await activeClient.del(key);
  }

  // General caching
  static async set(
    key: string,
    value: any,
    options: CacheOptions = {}
  ): Promise<void> {
    const serializedValue = JSON.stringify(value);
    
    if (options.ttl) {
      await activeClient.setex(key, options.ttl, serializedValue);
    } else {
      await activeClient.set(key, serializedValue);
    }
  }

  static async get(key: string): Promise<any | null> {
    const value = await activeClient.get(key);
    return value ? (typeof value === 'string' ? JSON.parse(value) : value) : null;
  }

  static async delete(key: string): Promise<void> {
    await activeClient.del(key);
  }

  static async exists(key: string): Promise<boolean> {
    const result = await activeClient.exists(key);
    return result === 1;
  }

  // Cache invalidation
  static async invalidatePattern(pattern: string): Promise<void> {
    const keys = await activeClient.keys(pattern);
    if (keys.length > 0) {
      await activeClient.del(...keys);
    }
  }

  // Metrics and analytics
  static async incrementCounter(
    key: string,
    amount: number = 1,
    options: CacheOptions = {}
  ): Promise<number> {
    const result = await activeClient.incrby(key, amount);
    
    if (options.ttl) {
      await activeClient.expire(key, options.ttl);
    }
    
    return result;
  }

  static async getCounter(key: string): Promise<number> {
    const value = await activeClient.get(key);
    return value ? parseInt(value as string) : 0;
  }

  // Background job queue helpers
  static async enqueueJob(
    queueName: string,
    jobData: any,
    options: { delay?: number; priority?: number } = {}
  ): Promise<string> {
    const job = {
      id: `${Date.now()}-${Math.random()}`,
      data: jobData,
      createdAt: Date.now(),
      ...options,
    };
    
    const key = `queue:${queueName}`;
    await activeClient.lpush(key, JSON.stringify(job));
    
    return job.id;
  }

  static async dequeueJob(queueName: string): Promise<any | null> {
    const key = `queue:${queueName}`;
    const jobJson = await activeClient.rpop(key);
    return jobJson ? JSON.parse(jobJson) : null;
  }

  static async getQueueLength(queueName: string): Promise<number> {
    const key = `queue:${queueName}`;
    return await activeClient.llen(key);
  }
}

export default activeClient;
