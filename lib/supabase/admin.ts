// Mock Admin client for development
export const supabaseAdmin = {
  from: (table: string) => ({
    select: (columns: string) => ({
      eq: (col: string, val: any) => Promise.resolve({ data: [], error: null }),
      single: () => Promise.resolve({ data: null, error: null })
    }),
    insert: (data: any) => Promise.resolve({ error: null }),
    upsert: (data: any) => Promise.resolve({ error: null }),
    update: (data: any) => ({
      eq: (col: string, val: any) => Promise.resolve({ error: null })
    }),
    delete: () => ({
      eq: (col: string, val: any) => Promise.resolve({ error: null })
    })
  }),
  auth: {
    admin: {
      createUser: async (data: any) => ({ data: { user: { id: 'new-user' } }, error: null }),
      deleteUser: async (id: string) => ({ error: null }),
    }
  }
} as any;
