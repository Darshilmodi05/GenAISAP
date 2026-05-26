import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

// Mock authentication for development server-side
export async function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const isMock = !supabaseUrl || 
    supabaseUrl.includes('mock.supabase.co') || 
    supabaseUrl.includes('demo.supabase.co') || 
    supabaseUrl.includes('your-project') || 
    supabaseUrl.includes('your_supabase');

  if (isMock) {
    return createMockClient() as any;
  }

  const cookieStore = await cookies();
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'mock-key';

  return createServerClient(
    supabaseUrl,
    supabaseKey,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
      },
    }
  );
}

export function createMockClient() {
  return {
    auth: {
      signInWithPassword: async (credentials: any) => {
        return {
          data: {
            user: { id: 'demo-user', email: credentials.email },
            session: { access_token: 'demo-token' }
          },
          error: null
        };
      },
      signOut: async () => {
        return { error: null };
      },
      getUser: async (token?: string) => {
        return { 
          data: { 
            user: { 
              id: 'demo-user', 
              email: 'demo@demo.com', 
              name: 'Demo User',
              user_metadata: { tenant_id: 'tenant-123' }
            } 
          }, 
          error: null 
        };
      },
      getSession: async () => {
        return {
          data: {
            session: {
              user: {
                id: 'demo-user',
                email: 'demo@demo.com',
              }
            }
          },
          error: null
        };
      }
    },
    from: (table: string) => {
      const queryBuilder: any = {
        select: (columns: string) => queryBuilder,
        eq: (col: string, val: any) => queryBuilder,
        neq: (col: string, val: any) => queryBuilder,
        gt: (col: string, val: any) => queryBuilder,
        gte: (col: string, val: any) => queryBuilder,
        lt: (col: string, val: any) => queryBuilder,
        lte: (col: string, val: any) => queryBuilder,
        like: (col: string, val: any) => queryBuilder,
        ilike: (col: string, val: any) => queryBuilder,
        is: (col: string, val: any) => queryBuilder,
        in: (col: string, val: any[]) => queryBuilder,
        contains: (col: string, val: any) => queryBuilder,
        or: (filters: string) => queryBuilder,
        order: (col: string, options: any) => queryBuilder,
        limit: (n: number) => queryBuilder,
        range: (from: number, to: number) => queryBuilder,
        single: () => Promise.resolve({ data: null, error: null }),
        maybeSingle: () => Promise.resolve({ data: null, error: null }),
        then: (onfulfilled: any) => Promise.resolve({ data: [], error: null }).then(onfulfilled),
        insert: (data: any) => Promise.resolve({ data: null, error: null }),
        upsert: (data: any) => Promise.resolve({ data: null, error: null }),
        update: (data: any) => queryBuilder,
        delete: () => queryBuilder,
      };
      return queryBuilder;
    },
    rpc: (fn: string, params: any) => Promise.resolve({ data: [], error: null }),
  };
}
