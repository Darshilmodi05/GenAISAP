/**
 * Strict TypeScript Schema Type Definitions
 * Aligned precisely with the Supabase / PostgreSQL database model.
 */

export interface Database {
  public: {
    Tables: {
      organizations: {
        Row: Organization;
        Insert: Omit<Organization, 'id' | 'created_at'>;
        Update: Partial<Omit<Organization, 'id'>>;
      };
      profiles: {
        Row: Profile;
        Insert: Omit<Profile, 'created_at'>;
        Update: Partial<Omit<Profile, 'id'>>;
      };
      chat_sessions: {
        Row: ChatSession;
        Insert: Omit<ChatSession, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<ChatSession, 'id'>>;
      };
      messages: {
        Row: Message;
        Insert: Omit<Message, 'id' | 'created_at'>;
        Update: Partial<Omit<Message, 'id'>>;
      };
      embeddings: {
        Row: Embedding;
        Insert: Omit<Embedding, 'id' | 'created_at'>;
        Update: Partial<Omit<Embedding, 'id'>>;
      };
      reports: {
        Row: Report;
        Insert: Omit<Report, 'id' | 'created_at'>;
        Update: Partial<Omit<Report, 'id'>>;
      };
      analytics_cache: {
        Row: AnalyticsCache;
        Insert: Omit<AnalyticsCache, 'id' | 'computed_at'>;
        Update: Partial<Omit<AnalyticsCache, 'id'>>;
      };
      alerts: {
        Row: Alert;
        Insert: Omit<Alert, 'id' | 'detected_at'>;
        Update: Partial<Omit<Alert, 'id'>>;
      };
      audit_logs: {
        Row: AuditLog;
        Insert: Omit<AuditLog, 'id' | 'created_at'>;
        Update: Partial<Omit<AuditLog, 'id'>>;
      };
    };
  };
}

export interface Organization {
  id: string;
  name: string;
  slug: string;
  plan: 'free' | 'pro' | 'enterprise';
  sap_instance_url: string | null;
  sap_credentials_encrypted: string | null;
  settings: Record<string, any>;
  created_at: string;
}

export interface Profile {
  id: string;
  organization_id: string | null;
  full_name: string | null;
  role: 'admin' | 'analyst' | 'viewer';
  avatar_url: string | null;
  preferences: {
    theme: 'dark' | 'light';
    language: string;
    notifications?: Record<string, boolean>;
    [key: string]: any;
  };
  last_seen_at: string | null;
  created_at: string;
}

export interface ChatSession {
  id: string;
  user_id: string;
  organization_id: string | null;
  title: string;
  sap_module: 'FICO' | 'SD' | 'MM' | 'HR' | 'PP' | null;
  status: 'active' | 'archived';
  metadata: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface Message {
  id: string;
  session_id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  content_type: 'text' | 'text/markdown' | 'structured';
  ai_model: string | null;
  tokens_used: number | null;
  latency_ms: number | null;
  confidence_score: number | null;
  citations: Array<{
    title: string;
    url?: string;
    source_type?: string;
    [key: string]: any;
  }>;
  created_at: string;
}

export interface Embedding {
  id: string;
  organization_id: string;
  source_type: 'sap_document' | 'report' | 'knowledge_base';
  source_id: string | null;
  content_chunk: string;
  embedding: number[]; // 1536 float array representing semantic vectors
  metadata: Record<string, any>;
  created_at: string;
}

export interface Report {
  id: string;
  organization_id: string | null;
  created_by: string | null;
  title: string;
  description: string | null;
  sap_module: 'FICO' | 'SD' | 'MM' | 'HR' | 'PP' | null;
  report_type: string | null;
  status: 'draft' | 'processing' | 'ready' | 'failed';
  content: Record<string, any>;
  file_url: string | null;
  scheduled_at: string | null;
  created_at: string;
}

export interface AnalyticsCache {
  id: string;
  organization_id: string | null;
  metric_key: string;
  sap_module: 'FICO' | 'SD' | 'MM' | 'HR' | 'PP' | null;
  value: Record<string, any>;
  computed_at: string;
  expires_at: string;
}

export interface Alert {
  id: string;
  organization_id: string | null;
  alert_type: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  description: string | null;
  sap_module: 'FICO' | 'SD' | 'MM' | 'HR' | 'PP' | null;
  affected_entities: Array<Record<string, any>>;
  status: 'open' | 'acknowledged' | 'resolved';
  detected_at: string;
  resolved_at: string | null;
}

export interface AuditLog {
  id: string;
  organization_id: string | null;
  user_id: string | null;
  action: string;
  resource_type: string;
  resource_id: string | null;
  metadata: Record<string, any>;
  ip_address: string | null;
  user_agent: string | null;
  created_at: string;
}
