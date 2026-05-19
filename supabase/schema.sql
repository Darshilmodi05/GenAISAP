-- Enable RLS (Row Level Security)
ALTER DATABASE postgres SET "app.current_schema" = 'public';
ALTER DATABASE postgres SET "app.tenant_id" = 'tenant_id';

-- Profiles table with RLS
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  tenant_id TEXT DEFAULT 'default' NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  bio TEXT,
  role TEXT DEFAULT 'user' NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Chat messages table with RLS
CREATE TABLE IF NOT EXISTS public.chat_messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  tenant_id TEXT DEFAULT 'default' NOT NULL,
  message TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Dashboard metrics table with RLS
CREATE TABLE IF NOT EXISTS public.dashboard_metrics (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id TEXT DEFAULT 'default' NOT NULL,
  revenue_mtd TEXT,
  revenue_trend TEXT,
  open_pos INTEGER,
  dso TEXT,
  dso_trend TEXT,
  system_health TEXT,
  active_users INTEGER,
  api_calls INTEGER,
  data_sync TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- SAP data tables
CREATE TABLE IF NOT EXISTS public.sap_companies (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id TEXT DEFAULT 'default' NOT NULL,
  company_code TEXT NOT NULL,
  company_name TEXT NOT NULL,
  fiscal_year_variant TEXT DEFAULT 'K4' NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

CREATE TABLE IF NOT EXISTS public.sap_business_areas (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  tenant_id TEXT DEFAULT 'default' NOT NULL,
  business_area TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dashboard_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sap_companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sap_business_areas ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Users can only access their own profile
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- Users can only access their own chat messages
CREATE POLICY "Users can view own messages" ON public.chat_messages
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own messages" ON public.chat_messages
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can only access their tenant's metrics
CREATE POLICY "Users can view tenant metrics" ON public.dashboard_metrics
  FOR SELECT USING (tenant_id = COALESCE(
    (SELECT raw_user_meta_data ->> 'tenant_id' FROM auth.users WHERE id = auth.uid()),
    'default'
  ));

CREATE POLICY "Users can insert tenant metrics" ON public.dashboard_metrics
  FOR INSERT WITH CHECK (tenant_id = COALESCE(
    (SELECT raw_user_meta_data ->> 'tenant_id' FROM auth.users WHERE id = auth.uid()),
    'default'
  ));

-- Users can only access their tenant's SAP data
CREATE POLICY "Users can view tenant SAP companies" ON public.sap_companies
  FOR SELECT USING (tenant_id = COALESCE(
    (SELECT raw_user_meta_data ->> 'tenant_id' FROM auth.users WHERE id = auth.uid()),
    'default'
  ));

CREATE POLICY "Users can view tenant business areas" ON public.sap_business_areas
  FOR SELECT USING (tenant_id = COALESCE(
    (SELECT raw_user_meta_data ->> 'tenant_id' FROM auth.users WHERE id = auth.uid()),
    'default'
  ));

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_profiles_tenant_id ON public.profiles(tenant_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_user_id ON public.chat_messages(user_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_tenant_id ON public.chat_messages(tenant_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_created_at ON public.chat_messages(created_at);
CREATE INDEX IF NOT EXISTS idx_dashboard_metrics_tenant_id ON public.dashboard_metrics(tenant_id);
CREATE INDEX IF NOT EXISTS idx_sap_companies_tenant_id ON public.sap_companies(tenant_id);
CREATE INDEX IF NOT EXISTS idx_sap_business_areas_tenant_id ON public.sap_business_areas(tenant_id);

-- Functions for tenant isolation
CREATE OR REPLACE FUNCTION public.current_tenant_id()
RETURNS TEXT
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT COALESCE(
    raw_user_meta_data ->> 'tenant_id',
    'default'
  )
  FROM auth.users
  WHERE id = auth.uid();
$$;

-- Triggers for automatic timestamps
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

CREATE TRIGGER handle_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
