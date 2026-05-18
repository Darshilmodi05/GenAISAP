import { createClient } from '@/lib/supabase/client';

export interface RevenueData {
  month: string;
  actual: number;
  forecast: number;
}

export async function getRevenueAnalysis(): Promise<RevenueData[]> {
  // In a real scenario, this would call SAP OData or fetch from Supabase
  // We simulate dynamic data that varies over time
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
  return months.map(m => ({
    month: m,
    actual: Math.floor(Math.random() * 500000 + 200000),
    forecast: Math.floor(Math.random() * 500000 + 250000),
  }));
}

export interface ModuleHealth {
  module: string;
  status: 'healthy' | 'warning' | 'critical';
  latency: string;
}

export async function getModuleHealth(): Promise<ModuleHealth[]> {
  return [
    { module: 'FICO', status: 'healthy', latency: '12ms' },
    { module: 'SD', status: 'healthy', latency: '18ms' },
    { module: 'MM', status: 'warning', latency: '145ms' },
  ];
}
