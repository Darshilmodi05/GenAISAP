import redis, { RedisCache, type CacheOptions } from '../redis';

/**
 * Enterprise Caching Abstraction Layer for SAP OData Integrations.
 * Mitigates API rate-limiting bottlenecks and ensures fast sub-second
 * rendering under high concurrent multi-tenant loads.
 */
export class SAPODataCache {
  private static readonly ODATA_CACHE_PREFIX = 'sap:odata:';
  private static readonly DEFAULT_TTL = 300; // 5 minutes standard TTL

  /**
   * Generates a deterministic cache key based on the OData endpoint, parameters, and organization context.
   */
  public static generateKey(orgId: string, endpoint: string, params: Record<string, any> = {}): string {
    const sortedParams = Object.keys(params)
      .sort()
      .map((k) => `${k}=${encodeURIComponent(String(params[k]))}`)
      .join('&');
    return `${this.ODATA_CACHE_PREFIX}${orgId}:${endpoint}:${sortedParams}`;
  }

  /**
   * Retrieves a cached SAP OData response if present and unexpired.
   */
  public static async get<T>(orgId: string, endpoint: string, params: Record<string, any> = {}): Promise<T | null> {
    const key = this.generateKey(orgId, endpoint, params);
    try {
      const cached = await RedisCache.get(key);
      if (cached) {
        console.log(`[SAP CACHE HIT] Endpoint: ${endpoint} for Org: ${orgId}`);
        return cached as T;
      }
    } catch (err) {
      console.error(`[SAP CACHE ERROR] Failed to read from Redis:`, err);
    }
    return null;
  }

  /**
   * Writes the SAP OData response to Redis with a dynamic or fallback Time-To-Live (TTL).
   */
  public static async set<T>(
    orgId: string,
    endpoint: string,
    data: T,
    params: Record<string, any> = {},
    options: CacheOptions = {}
  ): Promise<void> {
    const key = this.generateKey(orgId, endpoint, params);
    const ttl = options.ttl ?? this.DEFAULT_TTL;
    try {
      await RedisCache.set(key, data, { ttl });
      console.log(`[SAP CACHE WRITE] Cached endpoint: ${endpoint} (TTL: ${ttl}s)`);
    } catch (err) {
      console.error(`[SAP CACHE ERROR] Failed to write to Redis:`, err);
    }
  }

  /**
   * Explicit cache invalidation for specific endpoints or tenants.
   */
  public static async invalidateTenantCache(orgId: string): Promise<void> {
    const pattern = `${this.ODATA_CACHE_PREFIX}${orgId}:*`;
    try {
      await RedisCache.invalidatePattern(pattern);
      console.log(`[SAP CACHE INVALIDATION] Cleared cache for Org: ${orgId}`);
    } catch (err) {
      console.error(`[SAP CACHE ERROR] Failed to invalidate pattern:`, err);
    }
  }
}
