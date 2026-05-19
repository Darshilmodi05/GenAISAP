import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { rateLimit } from '@/lib/rate-limit';

export async function GET(request: NextRequest) {
  try {
    // Rate limiting
    const { success } = await rateLimit(request, { max: 30, windowMs: 60 * 1000 });
    if (!success) {
      return NextResponse.json(
        { error: 'Too many requests' },
        { status: 429 }
      );
    }

    const supabase = await createClient();
    
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get tenant-specific metrics
    const { data: metrics, error } = await supabase
      .from('dashboard_metrics')
      .select('*')
      .eq('tenant_id', user.user_metadata?.tenant_id || 'default')
      .order('created_at', { ascending: false })
      .limit(1);

    if (error) {
      console.error('Metrics fetch error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch metrics' },
        { status: 500 }
      );
    }

    // Return mock data if no real data exists
    const mockMetrics = {
      revenue_mtd: '$2,847,392',
      revenue_trend: '+12.4%',
      open_pos: 47,
      dso: '42.3 days',
      dso_trend: '-3.2%',
      system_health: '99.98%',
      active_users: 247,
      api_calls: 1429,
      data_sync: 'Live',
    };

    return NextResponse.json({ 
      metrics: metrics?.[0] || mockMetrics 
    });
  } catch (error) {
    console.error('Dashboard metrics error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
