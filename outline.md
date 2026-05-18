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
