# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

FirstStep is a SaaS B2B platform for business management in Morocco, built with Next.js 16.1 (App Router), TypeScript, Prisma ORM, and Tailwind CSS v4. The platform provides modular business solutions: Restaurant ordering/POS, Cabinet (medical/professional practice), and other services.

## Commands

```bash
# Development
npm run dev              # Start development server (localhost:3000)
npm run build            # Build for production (includes prisma generate)
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

- `app/page.tsx` — Landing page (public)
- `app/actions/*.ts` — Server Actions for all mutations
- `app/admin/**` — Admin dashboard pages (role: ADMIN)
- `app/dashboard/**` — User dashboard pages (role: CLIENT)
- `app/[tenantSlug]/**` — Tenant-specific pages (public-facing websites, waiter portal)
- `app/demo/**` — Demo pages for Restaurant and Cabinet systems (fully mocked)

### Authentication

Custom session-based auth using cookies:
- Session stored in cookie `session_token` containing user ID
- Session duration: 24 hours
- Roles: `ADMIN` (admin dashboard), `CLIENT` (user dashboard)
- Auth utilities in `lib/auth.ts` (hashPassword, verifyPassword)
- Auth actions in `app/actions/auth.ts` (signUp, signIn, getCurrentUser, signOut)

### Database (Prisma + SQLite/LibSQL)

The Prisma client is a singleton (`lib/prisma.ts`) that supports both:
1. Local SQLite via `better-sqlite3` adapter (development)
2. Turso/LibSQL remote database (production)

Key models:
- `User` — User accounts with role-based access
- `Service` — Available SaaS services (restaurant, cabinet, etc.)
- `TenantWebsite` — Tenant configuration (multi-tenant architecture)
- `Restaurant*` — Restaurant domain models (Category, Dish, Table, Order, Waiter)
- `Cabinet*` — Cabinet domain models (Client, Appointment, Service, Invoice, MedicalRecord)

### Styling

- Tailwind CSS v4 with `@theme` directive for custom properties
- Fonts: Syne (headlines), Figtree (body) loaded via `next/font/google`
- Color scheme: Cyan/teal accents on dark background (`#030712`)
- Custom utilities in `globals.css`: `.glass`, `.glass-card`, `.font-syne`, `.font-figtree`
- Spline 3D viewer loaded via script for hero animations

### Multi-tenant Architecture

Each tenant has a `TenantWebsite` with:
- `slug` — URL path for public site (e.g., `/restaurant-name`)
- `designTemplate` — Template selection (classic, modern, minimal)
- Domain-specific data: Restaurant (categories, dishes, tables, orders) or Cabinet (clients, appointments, services, invoices)

## Development Notes

### Server Components vs Client Components

- Pages default to Server Components (async functions)
- Use `'use client'` for interactive components (forms, state, event handlers)
- Server Actions in `app/actions/` are marked `'use server'`

### Tenant Page Patterns

Tenant public pages use dynamic routes:
- `app/[tenantSlug]/page.tsx` — Public website homepage
- `app/[tenantSlug]/book/page.tsx` — Booking page
- `app/[tenantSlug]/waiter/page.tsx` — Waiter portal entry

Use `app/actions/tenant.ts` for tenant data fetching.

### Email Service

Email via Nodemailer (Hostinger SMTP). Templates in `lib/email/templates.ts`. Configure:
```
EMAIL_HOST=smtp.hostinger.com
EMAIL_PORT=465
EMAIL_SECURE=true
EMAIL_USER=contact@firststepco.com
EMAIL_PASSWORD=<password>
```

### Default Admin Credentials

After seeding: `admin@firststepco.com` / `@@12raquibi`

### Key UI Patterns

- Landing components in `components/landing/`
- Dashboard components in `components/dashboard/`
- Shared UI in `components/ui/` (Button, Card, Input, Badge)
- Context providers: `CartContext` for restaurant ordering cart state