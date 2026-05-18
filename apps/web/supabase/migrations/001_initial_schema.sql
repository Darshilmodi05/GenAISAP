-- Initial schema for GenAISAP application
-- Enables multi-tenant architecture with Row Level Security

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

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
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  tenant_id TEXT DEFAULT 'default' NOT NULL,
  message TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Dashboard metrics table with RLS
CREATE TABLE IF NOT EXISTS public.dashboard_metrics (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
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

-- Job status tracking table with RLS
CREATE TABLE IF NOT EXISTS public.job_status (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  job_id TEXT NOT NULL,
  tenant_id TEXT DEFAULT 'default' NOT NULL,
  user_id UUID REFERENCES auth.users(id),
  type TEXT NOT NULL CHECK (type IN ('report_generation', 'data_sync', 'notification')),
  status TEXT NOT NULL CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
  parameters JSONB,
  result JSONB,
  error TEXT,
  started_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Notifications table with RLS
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  tenant_id TEXT DEFAULT 'default' NOT NULL,
  user_id UUID REFERENCES auth.users(id),
  type TEXT NOT NULL CHECK (type IN ('email', 'in_app', 'webhook')),
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  priority TEXT NOT NULL CHECK (priority IN ('low', 'medium', 'high')),
  status TEXT NOT NULL CHECK (status IN ('pending', 'sent', 'failed')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- SAP companies table with RLS
CREATE TABLE IF NOT EXISTS public.sap_companies (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  tenant_id TEXT DEFAULT 'default' NOT NULL,
  company_code TEXT NOT NULL,
  company_name TEXT NOT NULL,
  fiscal_year_variant TEXT DEFAULT 'K4' NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- SAP business areas table with RLS
CREATE TABLE IF NOT EXISTS public.sap_business_areas (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  tenant_id TEXT DEFAULT 'default' NOT NULL,
  business_area TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dashboard_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_status ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
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

-- Users can only access their own jobs
CREATE POLICY "Users can view own jobs" ON public.job_status
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own jobs" ON public.job_status
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can only access their own notifications
CREATE POLICY "Users can view own notifications" ON public.notifications
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own notifications" ON public.notifications
  FOR INSERT WITH CHECK (auth.uid() = user_id);

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
CREATE INDEX IF NOT EXISTS idx_profiles_user_id ON public.profiles(id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_user_id ON public.chat_messages(user_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_tenant_id ON public.chat_messages(tenant_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_created_at ON public.chat_messages(created_at);
CREATE INDEX IF NOT EXISTS idx_dashboard_metrics_tenant_id ON public.dashboard_metrics(tenant_id);
CREATE INDEX IF NOT EXISTS idx_job_status_user_id ON public.job_status(user_id);
CREATE INDEX IF NOT EXISTS idx_job_status_tenant_id ON public.job_status(tenant_id);
CREATE INDEX IF NOT EXISTS idx_job_status_job_id ON public.job_status(job_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON public.notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_tenant_id ON public.notifications(tenant_id);
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
