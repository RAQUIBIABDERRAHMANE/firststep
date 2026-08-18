# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

FirstStep is a SaaS B2B platform for business management in Morocco, built with Next.js 16.1 (App Router), React 19, TypeScript, Prisma ORM 7, and Tailwind CSS v4. The platform provides modular business solutions: Restaurant ordering/POS, Cabinet (medical/professional practice), employment/recruitment, invoicing, and email marketing.

**Important:** the repository contains two architectures side by side.

1. **The live application** — the Next.js app at the repo root. Server Actions talk to Prisma directly. This is what runs in production and what you should modify by default.
2. **The V2 microservices migration** — Laravel services under `gateway/` and `services/`, orchestrated by `docker-compose.yml`. This is scaffolded but **not yet wired into the frontend**. See [V2 Microservices](#v2-microservices-migration-not-yet-active) before touching it.

Unless a task explicitly concerns the migration, work in the Next.js app and use Prisma.

## Commands

```bash
# Development
npm run dev              # Start development server (localhost:3000)
npm run build            # Build for production (runs prisma generate first)
npm run start            # Start production server
npm run lint             # Run ESLint

# Database
npx prisma generate      # Generate Prisma Client (required after schema changes)
npx prisma migrate dev   # Create and apply migrations
npx prisma studio        # Open Prisma Studio GUI
npx tsx prisma/seed.ts   # Seed database with initial data

# Type Checking
npx tsc --noEmit         # Check TypeScript errors
```

## Architecture

### App Router Structure

```
app/
  page.tsx              Landing page (public)
  layout.tsx            Root layout, fonts, providers
  providers.tsx         Client-side context providers
  actions/*.ts          Server Actions — all mutations live here
  api/**                Route handlers (cron, upload, SSE streams, health)
  admin/**              Admin dashboard (role: ADMIN)
  dashboard/**          Client dashboard (role: CLIENT)
  [tenantSlug]/**       Tenant public sites, booking, waiter portal
  demo/**               Fully mocked Restaurant and Cabinet demos
  employment/**         Public job application form
  about, terms, docs    Public content pages
  login, forgot-password, reset-password, unsubscribe
```

**Admin sections:** access, campaigns, custom-requests, email-lists, employment, employment-template, facture-template, factures, marketing, payments, print-requests, services, users, websites.

**Dashboard sections:** ai, cabinet, cabinet-system, custom-website, notifications, payments, restaurant, restaurant-website, services, settings, website.

### Server Actions

All 18 action modules are in `app/actions/`, marked `'use server'`, and query Prisma directly:

`admin` · `ai` · `analytics` · `auth` · `cabinet` · `campaigns` · `chat` · `custom-website-request` · `email-lists` · `invoices` · `medical` · `payments` · `reservations` · `restaurant` · `services` · `tenant` · `unsubscribe` · `waiter`

### API Routes

- `app/api/cron/restaurant-reports` — monthly tenant reports; scheduled in `vercel.json` (`0 8 1 * *`)
- `app/api/cron/process-campaigns` — email campaign dispatch; **not** in `vercel.json`, trigger externally
- `app/api/tenant/[tenantSlug]/orders/[orderId]/stream` — SSE live order status
- `app/api/tenant/[tenantSlug]/tables/[tableId]/cart/stream` — SSE shared table cart
- `app/api/employment/apply` — public job application intake
- `app/api/upload`, `app/api/save-frame`, `app/api/health`, `app/api/admin`

Cron routes authenticate with the `CRON_SECRET` env var.

### Middleware

`middleware.ts` matches only `/`, `/about`, `/terms`. It implements **content negotiation for AI agents**: when a request sends `Accept: text/markdown`, it returns a hand-written Markdown version of the page instead of HTML. It also sets an RFC 8288 `Link` header advertising `/.well-known/api-catalog` and `/docs/api`. See `DNS-AID.md`.

### Authentication

Custom session-based auth using cookies — no NextAuth.

- Cookie `session_token` holds the raw user ID
- Session duration: 24 hours (`SESSION_DURATION` in `lib/auth.ts`)
- Roles: `ADMIN` (admin dashboard), `CLIENT` (user dashboard)
- `lib/auth.ts` — `hashPassword`, `verifyPassword` (bcryptjs), cookie constants
- `app/actions/auth.ts` — `signUp`, `signIn`, `getCurrentUser`, `signOut`
- Password reset via the `PasswordReset` model; recovery codes on `User`

Note: the Laravel migration uses a different cookie (`fs_session_token`). The live app uses `session_token`.

### Database (Prisma + SQLite/Turso)

**The generated client is NOT `@prisma/client`.** `prisma/schema.prisma` sets `output = "../src/generated/client"`. Always import the singleton:

```ts
import prisma from '@/lib/prisma'
```

`lib/prisma.ts` selects an adapter at runtime:

1. **Turso/LibSQL** if `TURSO_DATABASE_URL` and `TURSO_AUTH_TOKEN` are set (production) — wrapped in `withRetry`, an extension that retries network errors with exponential backoff (4 attempts, 200ms doubling)
2. **Local SQLite** via `better-sqlite3` when `DATABASE_URL` starts with `file:` (defaults to `file:./dev.db`)
3. Plain client as fallback

In development the client is cached on a `globalThis` key that is bumped whenever the schema gains models (currently `prisma_v22_employment_templates`). If you add models and see "missing model" errors in dev, bump that key.

The schema (~826 lines) defines 42 models:

- **Platform** — `User`, `Service`, `UserService`, `PasswordReset`, `Notification`, `TenantWebsite`
- **Chat/AI** — `ChatSession`, `ChatMessage`
- **Restaurant** — `RestaurantCategory`, `RestaurantDish`, `RestaurantTable`, `RestaurantSpace`, `RestaurantWaiter`, `RestaurantOrder`, `RestaurantOrderItem`, `BillSplit`, `TableCartSession`, `WaiterShift`, `Ingredient`, `RecipeItem`, `RestaurantReport`, `RestaurantReservation`, `TablePrintRequest`
- **Cabinet** — `CabinetService`, `CabinetClient`, `CabinetAppointment`, `MedicalRecord`, `Prescription`, `MedicalHistory`
- **Billing** — `PaymentRequest`, `BankAccount`, `InvoiceSettings`, `Invoice`, `InvoiceItem`, `FactureTemplate`, `FactureRecord`, `FactureCounter`
- **Marketing** — `Campaign`, `EmailList`, `EmailListMember`
- **Other** — `CustomWebsiteRequest`, `EmploymentApplication`, `EmploymentAgreementTemplate`

### Multi-tenant Architecture

Each tenant has a `TenantWebsite` with:
- `slug` — URL path for the public site (e.g. `/restaurant-name`)
- `designTemplate` — one of six restaurant theme templates
- Domain-specific data: Restaurant (categories, dishes, tables, orders) or Cabinet (clients, appointments, services, invoices)

Tenant routes live under `app/[tenantSlug]/`: `page.tsx` (homepage), `book/` (booking), `waiter/` (waiter portal). Fetch tenant data via `app/actions/tenant.ts` and `lib/tenant.ts`.

Multi-tenant isolation is enforced in the data layer — always scope queries by tenant, never trust a slug from the client without a lookup.

### Libraries (`lib/`)

| File | Purpose |
| --- | --- |
| `prisma.ts` | Prisma singleton with adapter selection + retry |
| `auth.ts` | Password hashing, session constants |
| `tenant.ts` | Tenant resolution helpers |
| `mail.ts`, `email/templates.ts` | Nodemailer transport + HTML templates |
| `r2.ts` | Cloudflare R2 (S3-compatible) uploads |
| `facture-pdf.ts`, `employment-pdf.ts` | PDF generation via `pdf-lib` |
| `restaurant-report.ts` | Monthly report generation |
| `menu-analysis.ts` | AI menu analysis |
| `crypto.ts`, `crypto-client.ts` | Encryption helpers (server/client split) |
| `waiter-offline.ts` | Waiter offline queue |
| `theme-colors.ts`, `translations.ts`, `variables.ts`, `utils.ts` | Theming, i18n, `cn()` |
| `contexts/CartContext.tsx` | Restaurant ordering cart state |

### Styling

- Tailwind CSS v4 with the `@theme` directive for custom properties
- Fonts: Syne (headlines), Figtree (body) via `next/font/google`
- Color scheme: cyan/teal accents on dark background (`#030712`)
- Custom utilities in `globals.css`: `.glass`, `.glass-card`, `.font-syne`, `.font-figtree`
- Animation: `framer-motion`, `gsap`, `tailwindcss-animate`
- 3D: `three` + `@react-three/fiber` / `drei` / `postprocessing`; Spline viewer for hero animations
- Charts: `recharts`. Toasts: `sonner`. Icons: `lucide-react`
- Rich text: TipTap. QR: `qrcode` + `html5-qrcode`

### Key UI Patterns

- `components/landing/` — landing page sections
- `components/dashboard/` — dashboard shell, Sidebar (gates nav by subscribed service slugs)
- `components/admin/`, `components/tenant/`, `components/editor/`
- `components/ui/` — Button, Card, Input, Badge (CVA + `tailwind-merge`)
- Global client state: `zustand`; server cache: React Server Components

### External Services

- **Email** — Nodemailer over Hostinger SMTP
- **AI** — Groq (`groq-sdk`) for email copy, chat, menu analysis; `GOOGLE_AI_API_KEY` also present
- **Storage** — Cloudflare R2 via `@aws-sdk/client-s3` for CVs, photos, contract templates
- **Database** — Turso (LibSQL) in production
- **Hosting** — Vercel (see `vercel.json`, `DEPLOYMENT.md`)

## V2 Microservices Migration (not yet active)

A Laravel 11/12 microservices architecture is scaffolded in the repo but **not connected to the running frontend**:

```
gateway/              Laravel API Gateway — proxies /v1/{auth,tenant,restaurant,pos}/*
services/identity/    Auth & users        (PostgreSQL: firststep_identity)
services/tenant/      Tenant management   (PostgreSQL: firststep_tenant)
services/restaurant/  Restaurant domain   (PostgreSQL: firststep_restaurant)
services/pos/         Point of sale       (PostgreSQL: firststep_pos)
```

- `docker-compose.yml` runs the gateway (port 8000), each service, and a PostgreSQL container per service, with DB passwords via Docker secrets
- `gateway/routes/api.php` forwards requests behind a `TenantResolver` middleware
- Services follow Domain-Driven Design: `app/Domains/<Domain>/{Actions,Contracts,Models,Repositories}`
- `lib/api-fetch.ts` (`serverApiFetch`) is the intended Next.js → Gateway client, and `src/features/restaurant-pos/` holds the offline-first POS store (Zustand + IndexedDB)

**Current status:** `serverApiFetch` is imported by nothing, and all 18 Server Actions still query Prisma directly. Commit `36d1158` ("restore Prisma DB authentication and local tenant lookup") reverted an earlier cutover. Treat the Phase 5 refactor as planned, not done.

Migration plans are documented in `phase1.md` … `phase5.md` and `architecture.md`.

## Development Notes

### Server Components vs Client Components

- Pages default to Server Components (async functions)
- Use `'use client'` for interactivity (forms, state, event handlers)
- Server Actions in `app/actions/` are marked `'use server'`
- `babel-plugin-react-compiler` is enabled — avoid manual `useMemo`/`useCallback` unless profiling shows a need

### Environment Variables

```
# Database (production — omit both for local SQLite at ./dev.db)
TURSO_DATABASE_URL=
TURSO_AUTH_TOKEN=

# Email (Hostinger SMTP) — code accepts EMAIL_PASSWORD or EMAIL_PASS
EMAIL_HOST=smtp.hostinger.com
EMAIL_PORT=465
EMAIL_SECURE=true
EMAIL_USER=contact@firststepco.com
EMAIL_PASSWORD=

# AI
GROQ_API_KEY=
GOOGLE_AI_API_KEY=

# Cloudflare R2
R2_ENDPOINT=
R2_ACCESS_KEY_ID=
R2_SECRET_ACCESS_KEY=
R2_BUCKET_NAME=
R2_PUBLIC_URL=

# Cron authentication
CRON_SECRET=
```

### Default Admin Credentials

After seeding: `admin@firststepco.com` / `@@12raquibi`

⚠️ This is a real credential committed to a tracked file. Rotate it and move it to an env var before this repo is shared.

### Reference Documents

`architecture.md` (V2 architecture) · `phase1.md`–`phase5.md` (migration plans) · `DEPLOYMENT.md` (Vercel) · `DNS-AID.md` (AI discovery) · `RESTAURANT_FEATURES_FR.md` · `planned-features.md` · `README.md`

### Knowledge Graph

`graphify-out/` holds a knowledge graph of this codebase (9,717 nodes · 13,039 edges · 557 communities). Query it with `/graphify query "<question>"` instead of grepping broadly. Rebuild after significant changes with `graphify update .` (free, no LLM). The graph was built at commit `d408fb90`.
