# InfinityBio Labs — Setup & Architecture

## Architecture Overview

```
┌─────────────────────────────────────────────────────┐
│                    Local Machine                     │
│                                                      │
│  ┌──────────────┐         ┌──────────────────────┐  │
│  │  Storefront   │         │   Docker Compose      │  │
│  │  (Next.js)    │         │                        │  │
│  │  Port 3000    │────────▶│  API (Saleor 3.22)    │  │
│  │               │ GraphQL │  Port 8000             │  │
│  └──────────────┘         │                        │  │
│                            │  Dashboard (custom)    │  │
│                            │  Port 9000             │  │
│                            │                        │  │
│                            │  PostgreSQL 15          │  │
│                            │  Port 5432             │  │
│                            │                        │  │
│                            │  Valkey (Redis)         │  │
│                            │  Port 6379             │  │
│                            │                        │  │
│                            │  Celery Worker          │  │
│                            │                        │  │
│                            │  Mailpit (dev emails)   │  │
│                            │  Port 8025 (UI)         │  │
│                            │                        │  │
│                            │  Jaeger (tracing)       │  │
│                            │  Port 16686             │  │
│                            └──────────────────────┘  │
└─────────────────────────────────────────────────────┘
```

### Components

| Component      | Location                           | Tech                             | Purpose                      |
| -------------- | ---------------------------------- | -------------------------------- | ---------------------------- |
| **Storefront** | `~/storefront/`                    | Next.js 16, React 19, TypeScript | Customer-facing shop         |
| **API**        | Docker (saleor:3.22)               | Python, Django, GraphQL          | Backend / business logic     |
| **Dashboard**  | `~/saleor-platform/dashboard-src/` | React, TypeScript, Vite          | Admin panel (custom-branded) |
| **Database**   | Docker (postgres:15)               | PostgreSQL                       | Data storage                 |
| **Cache**      | Docker (valkey:8.1)                | Valkey (Redis-compatible)        | Session & cache layer        |
| **Worker**     | Docker (saleor:3.22)               | Celery                           | Async tasks (emails, etc.)   |
| **Mailpit**    | Docker                             | —                                | Dev email capture            |

## Prerequisites

- **Node.js** >= 20 (using v24)
- **pnpm** >= 10
- **Docker Desktop** running

## Quick Start

### 1. Start the backend (Docker)

```bash
cd ~/saleor-platform
docker compose up -d
```

This starts: API, Dashboard, PostgreSQL, Valkey, Worker, Mailpit, Jaeger.

Wait ~15 seconds for all services to be healthy.

### 2. Start the storefront

```bash
cd ~/storefront
pnpm run dev
```

### 3. Access the apps

| App                      | URL                            | Credentials                   |
| ------------------------ | ------------------------------ | ----------------------------- |
| **Storefront**           | http://localhost:3000          | —                             |
| **Admin Dashboard**      | http://localhost:9000          | `admin@example.com` / `admin` |
| **GraphQL Playground**   | http://localhost:8000/graphql/ | —                             |
| **Mailpit (dev emails)** | http://localhost:8025          | —                             |
| **Jaeger (tracing)**     | http://localhost:16686         | —                             |

## Stopping Everything

```bash
# Stop storefront (Ctrl+C in terminal, or):
# kill the pnpm dev process

# Stop all Docker services:
cd ~/saleor-platform
docker compose down
```

## Rebuilding the Dashboard

If you modify the dashboard source code:

```bash
cd ~/saleor-platform/dashboard-src

# Install deps (if needed)
pnpm install

# Generate GraphQL types
API_URL=http://localhost:8000/graphql/ APP_MOUNT_URI=/ pnpm run generate:main

# Build
API_URL=http://localhost:8000/graphql/ APP_MOUNT_URI=/ pnpm exec cross-env NODE_OPTIONS=--max-old-space-size=8192 vite build

# Rebuild Docker image
docker build -t infinitybio-dashboard:latest -f Dockerfile.local .

# Restart the dashboard container
cd ~/saleor-platform
docker compose up -d dashboard
```

## Key Config Files

| File                                             | Purpose                           |
| ------------------------------------------------ | --------------------------------- |
| `~/storefront/.env`                              | Storefront env (API URL, channel) |
| `~/saleor-platform/docker-compose.yml`           | All backend services              |
| `~/saleor-platform/common.env`                   | Shared Saleor config              |
| `~/saleor-platform/backend.env`                  | Backend-specific secrets          |
| `~/storefront/src/config/brand.ts`               | Storefront branding               |
| `~/saleor-platform/dashboard-src/src/index.html` | Dashboard page title              |
