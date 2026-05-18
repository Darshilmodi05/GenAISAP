I'll give you a comprehensive production-level blueprint — everything you need before writing a single line of code.

---

# GenAISAP — Institutional Intelligence Hub
## Complete Production Blueprint

---

## 1. Project Vision & Core Concept

GenAISAP is an enterprise-grade AI assistant platform built specifically for SAP S/4HANA ecosystems. It acts as an intelligent middleware layer between SAP's complex modules (FICO, SD, MM, HR, PP) and business users — translating raw SAP data into executive-grade insights, forecasts, and actionable directives through a conversational AI interface backed by real ML pipelines.

**Target Users:** SAP consultants, finance controllers, supply chain managers, C-suite executives, and IT administrators inside large enterprises.

**Core Value Proposition:** Instead of navigating SAP's notoriously complex UI, users ask plain-language questions and receive structured, audit-ready analytical responses — powered by Claude/GPT, grounded in live SAP data via Supabase.

---

## 2. Full Technology Stack

**Frontend**
- Next.js 15 (App Router, Server Components, Server Actions)
- TypeScript (strict mode throughout)
- Tailwind CSS v4 with custom design tokens
- Framer Motion for animations and transitions
- Zustand for client-side global state
- TanStack Query v5 for server state and caching
- React Hook Form + Zod for all form validation
- next-themes for dark/light theme management

**Backend & Infrastructure**
- Next.js API Routes + Server Actions as the application backend
- Supabase for PostgreSQL database, Auth, Realtime, and Storage
- Supabase Row Level Security (RLS) for multi-tenant data isolation
- Redis (Upstash) for rate limiting and session caching
- BullMQ for background job queues (report generation, data sync)

**AI & ML Layer**
- Anthropic Claude API (claude-sonnet-4) as the primary reasoning engine
- OpenAI Embeddings (text-embedding-3-large) for semantic search
- LangChain.js for RAG pipeline orchestration
- Pinecone (or pgvector via Supabase) as the vector store
- Vercel AI SDK for streaming chat responses
- Python microservice (FastAPI) for heavy ML workloads (anomaly detection, forecasting)

**Auth & Security**
- Supabase Auth with OAuth2 (Google, Microsoft Entra ID)
- TOTP-based MFA via Supabase Auth
- JWT with refresh token rotation
- Middleware-level route protection in Next.js
- Helmet.js equivalent headers via Next.js config
- OWASP-compliant input sanitization

**DevOps & Monitoring**
- Vercel for Next.js deployment
- GitHub Actions for CI/CD pipelines
- Sentry for error tracking and performance monitoring
- PostHog for product analytics
- Datadog or Grafana for infrastructure metrics
- Docker + Docker Compose for local development parity

**Testing**
- Vitest for unit and integration tests
- React Testing Library for component tests
- Playwright for end-to-end tests
- MSW (Mock Service Worker) for API mocking in tests

---

## 3. Complete Project Structure

```
genaisap/
│
├── .github/
│   └── workflows/
│       ├── ci.yml                        # Lint, type-check, test on every PR
│       ├── deploy-staging.yml            # Auto-deploy to staging on main merge
│       └── deploy-production.yml         # Manual production deployment gate
│
├── apps/
│   ├── web/                              # Main Next.js application
│   │   ├── app/
│   │   │   ├── (auth)/                   # Auth route group (no sidebar layout)
│   │   │   │   ├── login/
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── register/
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── verify/
│   │   │   │   │   └── page.tsx          # MFA verification page
│   │   │   │   ├── forgot-password/
│   │   │   │   │   └── page.tsx
│   │   │   │   ├── reset-password/
│   │   │   │   │   └── page.tsx
│   │   │   │   └── layout.tsx            # Centered auth layout
│   │   │   │
│   │   │   ├── (dashboard)/              # Protected app route group
│   │   │   │   ├── home/
│   │   │   │   │   └── page.tsx          # Executive overview + KPI hero
│   │   │   │   ├── dashboard/
│   │   │   │   │   ├── page.tsx          # AI chat workspace
│   │   │   │   │   └── loading.tsx       # Skeleton loader
│   │   │   │   ├── analytics/
│   │   │   │   │   ├── page.tsx          # Charts, metrics, module usage
│   │   │   │   │   ├── fico/
│   │   │   │   │   │   └── page.tsx      # FICO-specific analytics
│   │   │   │   │   ├── sd/
│   │   │   │   │   │   └── page.tsx      # Sales & Distribution analytics
│   │   │   │   │   └── mm/
│   │   │   │   │       └── page.tsx      # Materials Management analytics
│   │   │   │   ├── history/
│   │   │   │   │   ├── page.tsx          # Query history + audit logs
│   │   │   │   │   └── [sessionId]/
│   │   │   │   │       └── page.tsx      # Individual session replay
│   │   │   │   ├── reports/
│   │   │   │   │   ├── page.tsx          # Report library
│   │   │   │   │   ├── generate/
│   │   │   │   │   │   └── page.tsx      # AI report generation wizard
│   │   │   │   │   └── [reportId]/
│   │   │   │   │       └── page.tsx      # Report viewer
│   │   │   │   ├── data-nodes/
│   │   │   │   │   ├── page.tsx          # SAP data node explorer (Folders)
│   │   │   │   │   └── [nodeId]/
│   │   │   │   │       └── page.tsx      # Individual node detail
│   │   │   │   ├── alerts/
│   │   │   │   │   └── page.tsx          # ML anomaly alerts + notifications
│   │   │   │   ├── team/
│   │   │   │   │   └── page.tsx          # Team management + roles
│   │   │   │   ├── profile/
│   │   │   │   │   └── page.tsx          # User profile + preferences
│   │   │   │   ├── settings/
│   │   │   │   │   ├── page.tsx          # General settings
│   │   │   │   │   ├── integrations/
│   │   │   │   │   │   └── page.tsx      # SAP + third-party connectors
│   │   │   │   │   ├── ai-config/
│   │   │   │   │   │   └── page.tsx      # AI model settings, prompts
│   │   │   │   │   ├── security/
│   │   │   │   │   │   └── page.tsx      # MFA, sessions, audit
│   │   │   │   │   └── billing/
│   │   │   │   │       └── page.tsx      # Plan + usage billing
│   │   │   │   ├── help/
│   │   │   │   │   └── page.tsx          # Help center + docs
│   │   │   │   └── layout.tsx            # Main app shell (sidebar + topbar)
│   │   │   │
│   │   │   ├── api/
│   │   │   │   ├── auth/
│   │   │   │   │   └── [...supabase]/
│   │   │   │   │       └── route.ts      # Supabase Auth callback handler
│   │   │   │   ├── ai/
│   │   │   │   │   ├── chat/
│   │   │   │   │   │   └── route.ts      # Streaming AI chat endpoint
│   │   │   │   │   ├── embed/
│   │   │   │   │   │   └── route.ts      # Generate and store embeddings
│   │   │   │   │   └── summarize/
│   │   │   │   │       └── route.ts      # Document summarization
│   │   │   │   ├── analytics/
│   │   │   │   │   ├── kpi/
│   │   │   │   │   │   └── route.ts      # KPI data endpoint
│   │   │   │   │   └── modules/
│   │   │   │   │       └── route.ts      # SAP module usage stats
│   │   │   │   ├── reports/
│   │   │   │   │   ├── generate/
│   │   │   │   │   │   └── route.ts      # Trigger AI report generation
│   │   │   │   │   └── export/
│   │   │   │   │       └── route.ts      # PDF/Excel export
│   │   │   │   ├── webhooks/
│   │   │   │   │   ├── sap/
│   │   │   │   │   │   └── route.ts      # SAP event webhooks
│   │   │   │   │   └── stripe/
│   │   │   │   │       └── route.ts      # Billing webhooks
│   │   │   │   └── health/
│   │   │   │       └── route.ts          # Health check endpoint
│   │   │   │
│   │   │   ├── globals.css               # Global styles + Tailwind base
│   │   │   ├── layout.tsx                # Root layout (providers, fonts, meta)
│   │   │   ├── not-found.tsx             # 404 page
│   │   │   └── error.tsx                 # Global error boundary
│   │   │
│   │   ├── components/
│   │   │   ├── ui/                       # Base design system primitives
│   │   │   │   ├── button.tsx
│   │   │   │   ├── input.tsx
│   │   │   │   ├── textarea.tsx
│   │   │   │   ├── select.tsx
│   │   │   │   ├── checkbox.tsx
│   │   │   │   ├── switch.tsx
│   │   │   │   ├── badge.tsx
│   │   │   │   ├── avatar.tsx
│   │   │   │   ├── tooltip.tsx
│   │   │   │   ├── popover.tsx
│   │   │   │   ├── dialog.tsx
│   │   │   │   ├── drawer.tsx
│   │   │   │   ├── dropdown-menu.tsx
│   │   │   │   ├── tabs.tsx
│   │   │   │   ├── card.tsx
│   │   │   │   ├── separator.tsx
│   │   │   │   ├── skeleton.tsx
│   │   │   │   ├── spinner.tsx
│   │   │   │   ├── progress.tsx
│   │   │   │   ├── scroll-area.tsx
│   │   │   │   ├── table.tsx
│   │   │   │   ├── toast.tsx
│   │   │   │   └── theme-toggle.tsx      # Dark/light toggle button
│   │   │   │
│   │   │   ├── layout/                   # Shell components
│   │   │   │   ├── sidebar.tsx           # Main navigation sidebar
│   │   │   │   ├── sidebar-item.tsx      # Individual nav item
│   │   │   │   ├── sidebar-group.tsx     # Nav section group
│   │   │   │   ├── topbar.tsx            # Top header bar
│   │   │   │   ├── topbar-search.tsx     # Global command palette
│   │   │   │   ├── topbar-notifications.tsx
│   │   │   │   ├── topbar-user-menu.tsx
│   │   │   │   ├── breadcrumb.tsx
│   │   │   │   ├── mobile-nav.tsx        # Slide-out mobile nav
│   │   │   │   └── page-header.tsx       # Consistent page title + actions
│   │   │   │
│   │   │   ├── auth/
│   │   │   │   ├── login-form.tsx
│   │   │   │   ├── register-form.tsx
│   │   │   │   ├── mfa-grid.tsx          # 6-digit OTP input
│   │   │   │   ├── google-account-chooser.tsx
│   │   │   │   ├── auth-card.tsx         # Wrapper card for auth pages
│   │   │   │   └── oauth-buttons.tsx     # Google + Microsoft buttons
│   │   │   │
│   │   │   ├── dashboard/
│   │   │   │   ├── chat-window.tsx       # Main AI chat container
│   │   │   │   ├── chat-message.tsx      # Individual message bubble
│   │   │   │   ├── chat-input.tsx        # Prompt input + actions
│   │   │   │   ├── chat-suggestions.tsx  # Quick prompt suggestions
│   │   │   │   ├── chat-toolbar.tsx      # Model selector, settings
│   │   │   │   ├── streaming-indicator.tsx # "AI is thinking" animation
│   │   │   │   ├── message-actions.tsx   # Copy, share, regenerate
│   │   │   │   ├── context-panel.tsx     # Right panel: data context
│   │   │   │   ├── module-selector.tsx   # SAP module filter
│   │   │   │   └── session-header.tsx    # Session title + metadata
│   │   │   │
│   │   │   ├── analytics/
│   │   │   │   ├── kpi-card.tsx          # KPI metric card
│   │   │   │   ├── kpi-grid.tsx          # Grid of KPI cards
│   │   │   │   ├── trend-chart.tsx       # Line/area trend chart
│   │   │   │   ├── bar-chart.tsx         # Bar/column chart
│   │   │   │   ├── donut-chart.tsx       # Donut/pie chart
│   │   │   │   ├── heatmap.tsx           # Activity heatmap
│   │   │   │   ├── module-usage-chart.tsx # FICO/SD/MM usage comparison
│   │   │   │   ├── forecast-chart.tsx    # ML forecast with confidence bands
│   │   │   │   ├── anomaly-chart.tsx     # Anomaly detection overlay
│   │   │   │   └── chart-skeleton.tsx    # Loading state for charts
│   │   │   │
│   │   │   ├── reports/
│   │   │   │   ├── report-card.tsx
│   │   │   │   ├── report-table.tsx
│   │   │   │   ├── report-generator-wizard.tsx
│   │   │   │   ├── report-preview.tsx
│   │   │   │   └── export-options.tsx
│   │   │   │
│   │   │   ├── alerts/
│   │   │   │   ├── alert-card.tsx
│   │   │   │   ├── alert-feed.tsx
│   │   │   │   ├── anomaly-badge.tsx
│   │   │   │   └── alert-filters.tsx
│   │   │   │
│   │   │   ├── ai/
│   │   │   │   ├── model-badge.tsx       # Shows active AI model
│   │   │   │   ├── confidence-score.tsx  # AI confidence indicator
│   │   │   │   ├── citation-block.tsx    # Data source citations
│   │   │   │   ├── reasoning-trace.tsx   # Show AI reasoning steps
│   │   │   │   └── feedback-widget.tsx   # Thumbs up/down for responses
│   │   │   │
│   │   │   └── shared/
│   │   │       ├── empty-state.tsx
│   │   │       ├── error-state.tsx
│   │   │       ├── data-table.tsx        # Full-featured sortable table
│   │   │       ├── date-range-picker.tsx
│   │   │       ├── command-palette.tsx   # Cmd+K global search
│   │   │       ├── confirm-dialog.tsx
│   │   │       └── copy-button.tsx
│   │   │
│   │   ├── hooks/
│   │   │   ├── use-auth.ts               # Auth state + actions
│   │   │   ├── use-chat.ts               # Chat session management
│   │   │   ├── use-streaming.ts          # AI stream handling
│   │   │   ├── use-theme.ts              # Theme state
│   │   │   ├── use-analytics.ts          # Analytics data fetching
│   │   │   ├── use-reports.ts            # Report CRUD
│   │   │   ├── use-alerts.ts             # Real-time alert subscriptions
│   │   │   ├── use-debounce.ts
│   │   │   ├── use-local-storage.ts
│   │   │   ├── use-media-query.ts
│   │   │   ├── use-keyboard-shortcut.ts
│   │   │   └── use-copy-to-clipboard.ts
│   │   │
│   │   ├── lib/
│   │   │   ├── supabase/
│   │   │   │   ├── client.ts             # Browser Supabase client
│   │   │   │   ├── server.ts             # Server-side Supabase client
│   │   │   │   ├── middleware.ts         # Auth session refresh middleware
│   │   │   │   └── admin.ts              # Admin client (service role)
│   │   │   ├── ai/
│   │   │   │   ├── claude.ts             # Anthropic client setup
│   │   │   │   ├── openai.ts             # OpenAI client setup
│   │   │   │   ├── rag-pipeline.ts       # Full RAG orchestration
│   │   │   │   ├── prompt-templates.ts   # System prompts per SAP module
│   │   │   │   ├── embeddings.ts         # Embedding generation + storage
│   │   │   │   ├── vector-search.ts      # Similarity search via pgvector
│   │   │   │   └── stream-handler.ts     # Vercel AI SDK stream utilities
│   │   │   ├── sap/
│   │   │   │   ├── odata-client.ts       # SAP OData v4 connector
│   │   │   │   ├── fico.ts               # FICO module queries
│   │   │   │   ├── sd.ts                 # Sales & Distribution queries
│   │   │   │   ├── mm.ts                 # Materials Management queries
│   │   │   │   └── transformers.ts       # SAP data → normalized schema
│   │   │   ├── ml/
│   │   │   │   ├── anomaly-detector.ts   # Calls Python ML microservice
│   │   │   │   ├── forecaster.ts         # Time-series forecast requests
│   │   │   │   └── classifier.ts         # Query intent classification
│   │   │   ├── validations/
│   │   │   │   ├── auth.schema.ts
│   │   │   │   ├── chat.schema.ts
│   │   │   │   ├── report.schema.ts
│   │   │   │   └── settings.schema.ts
│   │   │   ├── utils/
│   │   │   │   ├── format.ts             # Number, currency, date formatters
│   │   │   │   ├── cn.ts                 # Tailwind class merger (clsx + twMerge)
│   │   │   │   ├── sanitize.ts           # HTML + input sanitization
│   │   │   │   ├── export.ts             # PDF + Excel export utilities
│   │   │   │   └── retry.ts              # Exponential backoff utility
│   │   │   └── constants/
│   │   │       ├── sap-modules.ts        # SAP module definitions
│   │   │       ├── nav-items.ts          # Sidebar navigation config
│   │   │       ├── ai-models.ts          # Available AI model configs
│   │   │       └── routes.ts             # App route constants
│   │   │
│   │   ├── stores/
│   │   │   ├── auth.store.ts             # User session state (Zustand)
│   │   │   ├── chat.store.ts             # Chat messages + session state
│   │   │   ├── ui.store.ts               # Sidebar open, modals, toasts
│   │   │   ├── theme.store.ts            # Theme preference
│   │   │   └── filters.store.ts          # Global filters (module, date range)
│   │   │
│   │   ├── types/
│   │   │   ├── auth.types.ts
│   │   │   ├── chat.types.ts
│   │   │   ├── analytics.types.ts
│   │   │   ├── report.types.ts
│   │   │   ├── sap.types.ts
│   │   │   ├── ai.types.ts
│   │   │   └── api.types.ts
│   │   │
│   │   ├── middleware.ts                 # Next.js middleware (auth guard, headers)
│   │   ├── next.config.ts                # Next.js config
│   │   ├── tailwind.config.ts            # Tailwind + custom tokens
│   │   ├── tsconfig.json
│   │   └── package.json
│   │
│   └── ml-service/                       # Python FastAPI microservice
│       ├── app/
│       │   ├── main.py
│       │   ├── routers/
│       │   │   ├── anomaly.py            # Anomaly detection endpoints
│       │   │   ├── forecast.py           # Time-series forecasting
│       │   │   └── classify.py           # NLP classification
│       │   ├── models/
│       │   │   ├── isolation_forest.py
│       │   │   ├── prophet_model.py
│       │   │   └── bert_classifier.py
│       │   └── utils/
│       │       ├── preprocessing.py
│       │       └── validators.py
│       ├── requirements.txt
│       └── Dockerfile
│
├── packages/                             # Shared across monorepo
│   ├── ui/                               # Shared component library (future)
│   ├── config/                           # Shared ESLint, TypeScript configs
│   │   ├── eslint/
│   │   │   └── index.js
│   │   └── typescript/
│   │       └── base.json
│   └── types/                            # Shared cross-app types
│       └── index.ts
│
├── supabase/
│   ├── migrations/                       # Database migration files
│   │   ├── 001_init_auth.sql
│   │   ├── 002_create_organizations.sql
│   │   ├── 003_create_users_profiles.sql
│   │   ├── 004_create_chat_sessions.sql
│   │   ├── 005_create_messages.sql
│   │   ├── 006_create_reports.sql
│   │   ├── 007_create_analytics_cache.sql
│   │   ├── 008_create_alerts.sql
│   │   ├── 009_create_audit_logs.sql
│   │   ├── 010_create_embeddings.sql
│   │   └── 011_rls_policies.sql
│   ├── seed/
│   │   ├── demo_organization.sql
│   │   └── demo_data.sql
│   ├── functions/                        # Supabase Edge Functions
│   │   ├── process-sap-webhook/
│   │   │   └── index.ts
│   │   └── generate-report-async/
│   │       └── index.ts
│   └── config.toml
│
├── docs/
│   ├── architecture.md
│   ├── api-reference.md
│   ├── database-schema.md
│   ├── ai-pipeline.md
│   └── deployment.md
│
├── docker-compose.yml                    # Local dev: Supabase, Redis, ML service
├── .env.example                          # All required env variables documented
├── turbo.json                            # Turborepo pipeline config
└── package.json                          # Root monorepo package
```

---

## 4. Database Schema (Supabase / PostgreSQL)

**organizations** — Multi-tenant root entity
- id, name, slug, plan (free/pro/enterprise), sap_instance_url, sap_credentials_encrypted, created_at, settings (jsonb)

**profiles** — Extends Supabase auth.users
- id (references auth.users), organization_id, full_name, role (admin/analyst/viewer), avatar_url, preferences (jsonb: theme, language, notification settings), last_seen_at

**chat_sessions** — A conversation thread
- id, user_id, organization_id, title (AI-generated), sap_module (FICO/SD/MM/HR/PP), status (active/archived), metadata (jsonb), created_at, updated_at

**messages** — Individual chat messages
- id, session_id, role (user/assistant/system), content (text), content_type (text/markdown/structured), ai_model, tokens_used, latency_ms, confidence_score, citations (jsonb array), created_at

**embeddings** — Vector store for RAG
- id, organization_id, source_type (sap_document/report/knowledge_base), source_id, content_chunk, embedding (vector 1536), metadata (jsonb), created_at

**reports** — AI-generated or user-created reports
- id, organization_id, created_by, title, description, sap_module, report_type, status (draft/processing/ready/failed), content (jsonb), file_url, scheduled_at, created_at

**analytics_cache** — Cached SAP metric snapshots
- id, organization_id, metric_key, sap_module, value (jsonb), computed_at, expires_at

**alerts** — ML anomaly alerts
- id, organization_id, alert_type, severity (low/medium/high/critical), title, description, sap_module, affected_entities (jsonb), status (open/acknowledged/resolved), detected_at, resolved_at

**audit_logs** — Immutable audit trail
- id, organization_id, user_id, action, resource_type, resource_id, metadata (jsonb), ip_address, user_agent, created_at

---

## 5. Complete UI Design System

### Color Tokens

**Dark Theme (Midnight Navy — Default)**
- Background Primary: `#060E28` — deepest page background
- Background Secondary: `#0C1636` — sidebar, cards
- Background Tertiary: `#111E45` — elevated surfaces, inputs
- Background Hover: `#162254` — interactive hover states
- Accent Primary: `#0014FF` — corporate blue, CTAs
- Accent Secondary: `#2A3FFF` — hover state of accent
- Accent Muted: `rgba(0,20,255,0.12)` — subtle accent fills
- Gold Accent: `#C9A96E` — premium highlights, tier badges
- Text Primary: `#E8ECF8` — headings
- Text Secondary: `#8A93B5` — body, descriptions
- Text Muted: `#4A5278` — placeholders, disabled
- Border Subtle: `rgba(255,255,255,0.06)` — card edges
- Border Default: `rgba(255,255,255,0.10)` — input borders
- Border Emphasis: `rgba(255,255,255,0.18)` — focused elements
- Success: `#00C97D` — positive metrics, confirmations
- Warning: `#F5A623` — caution states, anomalies
- Danger: `#FF4D6D` — errors, critical alerts
- Info: `#3D9EFF` — informational, links

**Light Theme (Executive White)**
- Background Primary: `#FFFFFF`
- Background Secondary: `#F4F6FC`
- Background Tertiary: `#E8ECFA`
- Background Hover: `#DDE3F5`
- Accent Primary: `#0014FF`
- Accent Secondary: `#0010CC`
- Accent Muted: `rgba(0,20,255,0.08)`
- Gold Accent: `#9A7340`
- Text Primary: `#0A0F2E`
- Text Secondary: `#3D4470`
- Text Muted: `#7C85B0`
- Border Subtle: `rgba(0,0,0,0.06)`
- Border Default: `rgba(0,0,0,0.10)`
- Border Emphasis: `rgba(0,0,0,0.20)`
- Success, Warning, Danger, Info: Same hex, slightly darker saturation

### Typography

- Display Font: **Syne** — for hero headings, executive titles, large metrics
- Body Font: **DM Sans** — for all UI text, labels, descriptions
- Monospace Font: **DM Mono** — for code blocks, data values, terminal output

**Type Scale:**
- xs: 11px / DM Sans 400
- sm: 13px / DM Sans 400
- base: 15px / DM Sans 400
- md: 17px / DM Sans 500
- lg: 20px / DM Sans 500
- xl: 24px / Syne 600
- 2xl: 32px / Syne 600
- 3xl: 42px / Syne 700
- 4xl: 56px / Syne 700

### Spacing System
4px base unit — spacing scale: 4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80, 96

### Border Radius
- sm: 4px (badges, chips)
- md: 8px (buttons, inputs)
- lg: 12px (cards, panels)
- xl: 16px (modals, drawers)
- 2xl: 24px (large feature cards)
- full: 9999px (avatars, pills)

### Shadow System (Dark Mode)
- sm: `0 1px 3px rgba(0,0,0,0.4)`
- md: `0 4px 12px rgba(0,0,0,0.5)`
- lg: `0 8px 32px rgba(0,0,0,0.6)`
- glow-accent: `0 0 24px rgba(0,20,255,0.25)`
- glow-success: `0 0 20px rgba(0,201,125,0.20)`
- glow-danger: `0 0 20px rgba(255,77,109,0.20)`

---

## 6. Page-by-Page UI Specification

### Login Page
- Full-page split layout: left 55% is an animated abstract visualization of SAP data flows, right 45% is the auth panel
- Logo + "GenAISAP" wordmark at top of right panel
- Tagline: "Institutional Intelligence for SAP Ecosystems"
- Google OAuth button (primary), Microsoft Entra ID button (secondary)
- Email/password form below with a subtle divider
- "Remember this device" toggle
- Footer: privacy policy, terms of service
- Subtle animated particle network in the left panel using canvas

### MFA Verification Page
- Centered card layout
- Shows user avatar + email at top (pulled from previous step)
- 6 individual OTP input boxes that auto-advance on type
- "Resend code" timer with countdown
- Backup code option
- Device trust option

### Home Page (Executive Overview)
- Greeting header with user name + current time
- Full-width hero KPI strip: 4–6 large metric cards (Revenue, Open POs, Fiscal Variance, Active Users, System Health)
- "Recent Activity" feed showing last 5 AI query sessions
- "Trending Insights" — AI-surfaced anomalies and recommendations
- Quick action buttons: New Query, Generate Report, View Alerts
- Module health grid: FICO, SD, MM, HR, PP — each showing connectivity status and last sync

### Dashboard (AI Chat Workspace)
- Three-column layout on desktop: left sidebar (session list), center (chat), right (context panel)
- Session list shows AI-generated titles, module tags, timestamps
- Chat area: messages with alternating user/AI bubbles, AI messages support markdown with tables, code blocks, citations
- AI messages show: model badge, confidence score, data sources used, token count
- Chat input: rich text area, file attachment (PDFs, CSVs), SAP module selector, model selector
- Quick suggestions bar above input: pre-built common SAP queries
- Right context panel: shows SAP data referenced in current session, related past queries, active filters
- Streaming response with animated cursor and "Synthesizing data..." indicator
- Message actions: copy, share, regenerate, thumbs up/down, create report from response

### Analytics Page
- Top: Date range picker + SAP module multi-select filter + refresh button
- KPI grid: 8 cards covering FICO (GL Balance, Open Items, Variance), SD (Revenue, Orders, OTIF), MM (Inventory, PO Cycle Time)
- Main chart area: tabbed between Trend, Comparison, Distribution views
- Module usage heatmap showing which SAP modules are queried most by hour/day
- ML Forecast section: next 30/60/90 day projections with confidence intervals
- Anomaly timeline: flagged data points with severity indicators
- Export button: PDF or Excel of current view

### History Page
- Full-width data table with: session title, module, date, query count, status, actions
- Filters: by module, date range, status, user (for admins)
- Search bar for semantic search across past queries (powered by embeddings)
- Row expansion: shows message preview
- Click-through to full session replay
- Bulk actions: archive, export, delete
- Audit log tab (admins only): all user actions with IP, timestamp, action details

### Reports Page
- Card grid of existing reports with: title, module, type, status badge, date, actions
- "Generate Report" wizard button
- Wizard steps: choose module → choose metrics → set date range → choose format → AI generates
- Report viewer: rendered markdown with charts, export options
- Scheduled reports: set recurring generation (daily/weekly/monthly)

### Alerts Page
- Alert feed sorted by severity: critical → high → medium → low
- Each alert card: severity badge, title, description, affected SAP entities, detected timestamp, action buttons (Acknowledge, Investigate, Dismiss)
- "Investigate" opens a pre-populated AI chat session contextualised to that anomaly
- Filter by severity, module, status, date range
- Alert settings: configure ML thresholds per module

### Settings — AI Configuration
- Active model selector (Claude Sonnet, Claude Opus, GPT-4o)
- System prompt editor per SAP module — customize AI behavior
- RAG configuration: toggle knowledge base sources
- Response format preferences: verbosity, citation style, language
- Token budget per session

### Settings — Integrations
- SAP S/4HANA connector: instance URL, credentials, test connection button
- Connection status indicator with last sync timestamp
- Available modules to enable/disable
- Third-party connectors: Slack (alert notifications), Email (report delivery), Teams

---

## 7. AI & ML Architecture

### RAG Pipeline Flow
1. User submits query in Dashboard
2. Query is classified by intent (analytical, transactional, explanatory) via a fast classifier model
3. Relevant SAP module is identified from context + explicit selection
4. Query is embedded using OpenAI text-embedding-3-large
5. Vector similarity search in pgvector retrieves top-K relevant document chunks (past reports, SAP schema docs, knowledge base)
6. Live SAP data is fetched via OData for the relevant module and time range
7. All context is assembled into a structured prompt with the module-specific system prompt
8. Claude Sonnet streams the response with citations
9. Response + embeddings are stored in Supabase for future retrieval

### ML Microservice (Python FastAPI)
- **Anomaly Detection:** Facebook Prophet + Isolation Forest on FICO/SD/MM time-series data. Runs on a schedule (every hour) and publishes alerts to Supabase via webhook.
- **Forecasting:** Prophet model for 30/60/90-day projections of revenue, inventory, and PO cycle time. Confidence intervals returned alongside point estimates.
- **Intent Classification:** Fine-tuned DistilBERT model classifying user queries into SAP module + query type — improves RAG retrieval precision.

### AI Response Structure
Every AI response includes structured metadata:
- Confidence score (0–100%)
- Data freshness indicator (how recent the SAP data is)
- Citations list (which SAP records or documents were referenced)
- Suggested follow-up queries
- Flag if the response requires human verification

---

## 8. Authentication & Security Architecture

### Auth Flow
1. User lands on /login → selects Google or Microsoft or Email
2. OAuth redirect → Supabase Auth handles token exchange → callback to `/api/auth/callback`
3. On first login: profile record created, organization linked, role assigned
4. MFA enforced for admin roles and enterprise plan users
5. JWT stored in httpOnly cookie (not localStorage)
6. Middleware runs on every protected route — validates session, refreshes if near expiry
7. RLS policies in Supabase ensure users only see their organization's data at the database level

### Security Measures
- All SAP credentials stored encrypted at rest (AES-256 via Supabase Vault)
- Rate limiting on all AI endpoints (Upstash Redis) — 100 requests/hour per user
- Input sanitization on all user content before AI processing
- Content Security Policy headers set in next.config.ts
- All API routes validate user session and organization membership
- Audit log written for every sensitive action (data export, settings change, user management)
- OWASP Top 10 checklist applied during security review phase

---

## 9. Environment Variables Required

**Supabase**
- NEXT_PUBLIC_SUPABASE_URL
- NEXT_PUBLIC_SUPABASE_ANON_KEY
- SUPABASE_SERVICE_ROLE_KEY

**AI**
- ANTHROPIC_API_KEY
- OPENAI_API_KEY

**Redis**
- UPSTASH_REDIS_REST_URL
- UPSTASH_REDIS_REST_TOKEN

**ML Service**
- ML_SERVICE_URL
- ML_SERVICE_API_KEY

**SAP**
- SAP_DEFAULT_INSTANCE_URL (for dev/demo)

**Monitoring**
- SENTRY_DSN
- POSTHOG_API_KEY

**App**
- NEXTAUTH_SECRET
- NEXT_PUBLIC_APP_URL

---

## 10. Development Phases

**Phase 1 — Foundation (Weeks 1–3)**
Monorepo setup, Supabase schema + migrations, auth flow end-to-end (Google OAuth + MFA), Next.js middleware and route protection, base design system and theme toggle, sidebar + topbar layout shell

**Phase 2 — Core Product (Weeks 4–7)**
AI chat with streaming (Claude API + Vercel AI SDK), RAG pipeline with pgvector, SAP OData connector (mock data initially), KPI cards and basic charts on Analytics, chat history storage and retrieval, session management

**Phase 3 — Intelligence Layer (Weeks 8–11)**
Python ML microservice deployment, anomaly detection + alert system, ML forecasting on Analytics page, semantic search across history, AI report generation wizard, real-time alerts via Supabase Realtime

**Phase 4 — Enterprise Hardening (Weeks 12–15)**
Multi-tenant RLS policies and organization management, team management + role-based access control, audit logs page, settings — integrations (real SAP connector), export (PDF, Excel), performance optimization + caching strategy

**Phase 5 — Polish & Launch (Weeks 16–18)**
End-to-end Playwright tests, Sentry integration, PostHog analytics, accessibility audit, mobile responsiveness pass, documentation, staging → production deployment pipeline

---

## 11. Feature Expansion: Month-End Close Agent

### Orchestration & Components
- **Main View (`/close`):** Central dashboard for monitoring the close progress across all company codes.
- **Progress Tracker:** Visual horizontal timeline showing the transition from Reconciliation → Validation → Reporting.
- **Blocker Management:** Prioritized list of items preventing closure, scored by financial impact and time risk.
- **AI Variance Commentary:** Automatically generated narratives explaining month-over-month or budget-vs-actual variances.
- **Agent Integration:** A dedicated chat trigger allowing users to ask specific questions like "What is blocking the FICO close for entity 1000?"

### Data & Logic
- **Close Orchestrator:** Manages phase dependencies and sequencing.
- **Automated Checks:** Background routines for GL reconciliation, AP/AR open item analysis, and intercompany matching.

---

## 12. Feature Expansion: Autonomous Anomaly Detection

### Predictive Narrative Alerts
- **Story-based Alerts:** Instead of simple badges, the system generates "Alert Narratives" that explain the *who, what, and why* of an anomaly.
- **Confidence & Evidence:** Every alert displays a confidence probability and an expandable evidence trace (posting docs, user history, pattern matches).
- **Proactive Action Proposals:** AI suggests fixes (e.g., "Reversing entry suggested") with one-click execution capability.
- **Smart Escalation:** Auto-routing of anomalies based on severity—sending critical FICO errors to the CFO vs. minor variances to a Controller.

### Real-time Intelligence
- **Streaming Feed:** A live-updated feed of anomalies pushed via WebSockets/SSE.
- **Baseline Profiler:** Learns "normal" behavior per account and user to reduce false positives.
- **Hybrid Agent:** When the Close Agent detects a variance, it automatically triggers the Anomaly Agent to investigate before flagging it to human management.

---

This is your complete north star document. Every decision here is justified for an enterprise production system — not a prototype. Want me to now go module by module and generate the actual code starting from whichever phase or file you want to tackle first?
