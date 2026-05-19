import { createClient } from '@/lib/supabase/server';
import { logInfo, logError, logWarning } from '@/lib/error-handler';

export interface PerformanceMetrics {
  timestamp: number;
  endpoint: string;
  method: string;
  responseTime: number;
  statusCode: number;
  memoryUsage: NodeJS.MemoryUsage;
  cpuUsage?: number;
  userId?: string;
  tenantId?: string;
  userAgent?: string;
  ip?: string;
}

export interface AnalyticsData {
  activeUsers: number;
  totalRequests: number;
  averageResponseTime: number;
  errorRate: number;
  topEndpoints: Array<{
    endpoint: string;
    count: number;
    avgResponseTime: number;
  }>;
  tenantMetrics: Record<string, {
    requestCount: number;
    errorCount: number;
    avgResponseTime: number;
  }>;
}

class PerformanceMonitor {
  private metrics: PerformanceMetrics[] = [];
  private maxMetrics = 1000; // Keep last 1000 metrics
  private startTime: number = Date.now();

  // Track API performance
  trackRequest(
    endpoint: string,
    method: string,
    responseTime: number,
    statusCode: number,
    userId?: string,
    tenantId?: string,
    userAgent?: string,
    ip?: string
  ): void {
    const metric: PerformanceMetrics = {
      timestamp: Date.now(),
      endpoint,
      method,
      responseTime,
      statusCode,
      memoryUsage: process.memoryUsage(),
      userId,
      tenantId,
      userAgent,
      ip,
    };

    this.metrics.push(metric);
    
    // Keep only recent metrics
    if (this.metrics.length > this.maxMetrics) {
      this.metrics = this.metrics.slice(-this.maxMetrics);
    }

    // Log slow requests
    if (responseTime > 5000) { // 5 seconds
      logWarning('Slow request detected', {
        endpoint,
        method,
        responseTime,
        statusCode,
        userId,
        tenantId,
      });
    }

    // Log errors
    if (statusCode >= 400) {
      logError(new Error('API error request'), {
        endpoint,
        method,
        statusCode,
        userId,
        tenantId,
      });
    }
  }

  // Get performance analytics
  getAnalytics(): AnalyticsData {
    const recentMetrics = this.metrics.filter(
      m => Date.now() - m.timestamp < 300000 // Last 5 minutes
    );

    const totalRequests = recentMetrics.length;
    const averageResponseTime = totalRequests > 0 
      ? recentMetrics.reduce((sum, m) => sum + m.responseTime, 0) / totalRequests 
      : 0;

    const errorCount = recentMetrics.filter(m => m.statusCode >= 400).length;
    const errorRate = totalRequests > 0 ? (errorCount / totalRequests) * 100 : 0;

    // Top endpoints by request count
    const endpointCounts = new Map<string, number>();
    recentMetrics.forEach(m => {
      const key = `${m.method} ${m.endpoint}`;
      endpointCounts.set(key, (endpointCounts.get(key) || 0) + 1);
    });

    const topEndpoints = Array.from(endpointCounts.entries())
      .map(([endpoint, count]) => ({
        endpoint,
        count,
        avgResponseTime: recentMetrics
          .filter(m => `${m.method} ${m.endpoint}` === endpoint)
          .reduce((sum, m) => sum + m.responseTime, 0) / 
          recentMetrics.filter(m => `${m.method} ${m.endpoint}` === endpoint).length || 1,
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    // Tenant-specific metrics
    const tenantMetrics: Record<string, any> = {};
    recentMetrics.forEach(m => {
      if (m.tenantId) {
        if (!tenantMetrics[m.tenantId]) {
          tenantMetrics[m.tenantId] = {
            requestCount: 0,
            errorCount: 0,
            avgResponseTime: 0,
          };
        }
        tenantMetrics[m.tenantId].requestCount++;
        if (m.statusCode >= 400) {
          tenantMetrics[m.tenantId].errorCount++;
        }
        tenantMetrics[m.tenantId].avgResponseTime += m.responseTime;
      }
    });

    // Calculate per-tenant averages
    Object.keys(tenantMetrics).forEach(tenantId => {
      const metrics = tenantMetrics[tenantId];
      metrics.avgResponseTime = metrics.requestCount > 0 
        ? metrics.avgResponseTime / metrics.requestCount 
        : 0;
    });

    // Active users estimate (based on unique users in recent requests)
    const activeUsers = new Set(
      recentMetrics
        .filter(m => m.userId)
        .map(m => m.userId)
    ).size;

    return {
      activeUsers,
      totalRequests,
      averageResponseTime,
      errorRate,
      topEndpoints,
      tenantMetrics,
    };
  }

  // Get system health metrics
  getSystemHealth() {
    const uptime = Date.now() - this.startTime;
    const memUsage = process.memoryUsage();
    const memoryUsagePercent = (memUsage.heapUsed / memUsage.heapTotal) * 100;

    return {
      uptime,
      uptimeFormatted: this.formatUptime(uptime),
      memoryUsage: {
        used: Math.round(memUsage.heapUsed / 1024 / 1024), // MB
        total: Math.round(memUsage.heapTotal / 1024 / 1024), // MB
        percentage: Math.round(memoryUsagePercent),
      },
      metricsCollected: this.metrics.length,
      averageResponseTime: this.getAnalytics().averageResponseTime,
      errorRate: this.getAnalytics().errorRate,
    };
  }

  // Format uptime for human readability
  private formatUptime(ms: number): string {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) {
      return `${days}d ${hours % 24}h ${minutes % 60}m`;
    } else if (hours > 0) {
      return `${hours}h ${minutes % 60}m`;
    } else {
      return `${minutes}m ${seconds % 60}s`;
    }
  }

  // Store metrics in database periodically
  async storeMetrics(): Promise<void> {
    try {
      const supabase = await createClient();
      const analytics = this.getAnalytics();

      // Store analytics snapshot
      await supabase
        .from('performance_analytics')
        .insert({
          timestamp: new Date().toISOString(),
          active_users: analytics.activeUsers,
          total_requests: analytics.totalRequests,
          average_response_time: analytics.averageResponseTime,
          error_rate: analytics.errorRate,
          top_endpoints: analytics.topEndpoints,
          tenant_metrics: analytics.tenantMetrics,
        });

      // Clean old metrics (keep only last 24 hours)
      const cutoffTime = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
      await supabase
        .from('performance_analytics')
        .delete()
        .lt('timestamp', cutoffTime);

      logInfo('Performance metrics stored', {
        activeUsers: analytics.activeUsers,
        totalRequests: analytics.totalRequests,
        averageResponseTime: analytics.averageResponseTime,
      });
    } catch (error: any) {
      logError(new Error('Failed to store performance metrics'), { error: error?.message });
    }
  }

  // Get metrics history
  async getMetricsHistory(hours: number = 24): Promise<any[]> {
    try {
      const supabase = await createClient();
      const cutoffTime = new Date(Date.now() - hours * 60 * 60 * 1000).toISOString();

      const { data, error } = await supabase
        .from('performance_analytics')
        .select('*')
        .gte('timestamp', cutoffTime)
        .order('timestamp', { ascending: false })
        .limit(100);

      return data || [];
    } catch (error: any) {
      logError(new Error('Failed to fetch metrics history'), { error: error?.message });
      return [];
    }
  }

  // Reset metrics
  reset(): void {
    this.metrics = [];
    this.startTime = Date.now();
  }
}

// Singleton instance
export const performanceMonitor = new PerformanceMonitor();

// Middleware helper
export function withPerformanceTracking(
  handler: (request: Request, ...args: any[]) => Promise<Response>
) {
  return async (request: Request, ...args: any[]) => {
    const startTime = Date.now();
    const url = new URL(request.url);
    
    // Extract user info from request headers
    const userId = request.headers.get('x-user-id');
    const tenantId = request.headers.get('x-tenant-id');
    const userAgent = request.headers.get('user-agent');
    const ip = request.headers.get('x-forwarded-for') || 
                 request.headers.get('x-real-ip') || 
                 'unknown';

    try {
      const response = await handler(request, ...args);
      const responseTime = Date.now() - startTime;

      // Track the request
      performanceMonitor.trackRequest(
        url.pathname,
        request.method,
        responseTime,
        response.status,
        userId || undefined,
        tenantId || undefined,
        userAgent || undefined,
        ip || undefined
      );

      return response;
    } catch (error) {
      const responseTime = Date.now() - startTime;
      
      performanceMonitor.trackRequest(
        url.pathname,
        request.method,
        responseTime,
        500, // Error status
        userId || undefined,
        tenantId || undefined,
        userAgent || undefined,
        ip || undefined
      );

      throw error;
    }
  };
}
