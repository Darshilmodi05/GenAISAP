# GenAISAP Enterprise Deployment Guide

This document describes how to deploy GenAISAP to local development, containerized environments, and serverless production structures (Vercel & Supabase).

---

## 1. Environment Variable Configuration

Create a `.env` file in the workspace root. Refer to `.env.example` for baseline keys.

```ini
# Next.js Server & Client Keys
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Machine Learning Engine Link
NEXT_PUBLIC_ML_SERVICE_URL=http://localhost:8000
ML_SERVICE_PORT=8000

# Sentry Telemetry Controls
NEXT_PUBLIC_SENTRY_DSN=https://example.ingest.sentry.io/keys
SENTRY_AUTH_TOKEN=sentry_auth_token_string

# Vercel Deployment Target
VERCEL_ORG_ID=org_your_org_id
VERCEL_PROJECT_ID=prj_your_project_id
```

---

## 2. Local Environment Setup

### 2.1. Next.js Web App Setup
Ensure Node.js v18+ is active on the workstation.
```bash
# 1. Install workspace dependencies via npm
npm install

# 2. Start Turbo development daemon
npm run dev
```
The client dashboard will compile and host locally on `http://localhost:3000`.

### 2.2. Python Machine Learning Service Setup
Configure a virtual environment to host standard Python modules.
```bash
# 1. Access ML directory boundaries
cd apps/ml-service

# 2. Form virtual python space
python -m venv venv
source venv/bin/activate  # On Windows: .\venv\Scripts\activate

# 3. Pull required packages
pip install -r requirements.txt

# 4. Fire the HTTPServer
python app/main.py
```
The ML API exposes operations locally on `http://localhost:8000`.

---

## 3. Containerized Deployments (Docker Compose)

To orchestrate and fire both the client application and the ML engine in a single, local virtual ecosystem, leverage `docker-compose.yml`:

```yaml
version: '3.8'

services:
  web:
    build:
      context: .
      dockerfile: apps/web/Dockerfile
    ports:
      - "3000:3000"
    environment:
      - NEXT_PUBLIC_SUPABASE_URL=${NEXT_PUBLIC_SUPABASE_URL}
      - NEXT_PUBLIC_SUPABASE_ANON_KEY=${NEXT_PUBLIC_SUPABASE_ANON_KEY}
      - NEXT_PUBLIC_ML_SERVICE_URL=http://ml-service:8000
    depends_on:
      - ml-service

  ml-service:
    build:
      context: ./apps/ml-service
      dockerfile: Dockerfile
    ports:
      - "8000:8000"
```

To run:
```bash
docker-compose up --build
```

---

## 4. Production Cloud Deployment (Vercel & Supabase)

### 4.1. Serverless Web Deployment via Vercel CLI
We leverage the official Vercel CLI pipeline to deploy the monorepo:

```bash
# 1. Authenticate with Vercel Cloud
npx vercel login

# 2. Link local workspace to project metadata
npx vercel link

# 3. Compile and push a release directly to production
npx vercel --prod
```

### 4.2. Database & Vector Index Migrations (Supabase)
Deploy Postgres tables, indexes, and PL/pgSQL matches using the Supabase CLI:

```bash
# 1. Log into your remote Supabase account
npx supabase login

# 2. Link your local project
npx supabase link --project-ref your-supabase-project-id

# 3. Apply SQL migrations sequence
npx supabase db push
```

---

## 5. Security & System Hardening

Before moving a deployment into active enterprise production, verify the following configuration checklists:

1.  **Multi-Factor Authentication (MFA)**: Ensure TOTP MFA enrollment is toggled to `"Active"` within the System Settings panel to guard FICO closing tasks.
2.  **IP Allowlist Controls**: Restrict Next.js backend traffic to your corporate CIDR IP ranges by configuring security lists on Vercel.
3.  **Client Encryption**: Set up 256-bit AES quantum-safe encryption keys for all S/4HANA OData connections in the Institutional Connectivity Mesh.
