# 🚀 FirstStep - Project Initialization Guide

Welcome to the **FirstStep** development repository! This guide will walk you through setting up and initializing the project from scratch for local development or staging/production environments.

---

## 📋 Table of Contents
1. [Prerequisites](#-prerequisites)
2. [Environment Configuration (`.env`)](#-environment-configuration-env)
3. [Database Initialization](#-database-initialization)
   - [Option A: Local Development (SQLite)](#option-a-local-development-sqlite)
   - [Option B: Production/Staging (Turso / LibSQL)](#option-b-productionstaging-turso--libsql)
4. [Running the Application](#-running-the-application)
5. [Default Admin Credentials](#-default-admin-credentials)
6. [Useful Utility Scripts](#-useful-utility-scripts)
7. [Prisma Client Integration Note](#-prisma-client-integration-note)

---

## ⚙️ Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js**: `18.x` or newer (development is fully tested on `20.x+`)
- **Package Manager**: `npm` (default), `yarn`, or `pnpm`
- **Git** (for version control and syncing)

---

## 🔒 Environment Configuration (`.env`)

Create a `.env` file in the root directory. You can copy the template below and adjust the values based on your setup.

```env
# ==============================================================================
# Database URL
# ==============================================================================
# For Local SQLite:
DATABASE_URL="file:./dev.db"

# For Remote Turso / LibSQL (uncomment and populate to override SQLite):
# TURSO_DATABASE_URL="libsql://your-database-name.turso.io"
# TURSO_AUTH_TOKEN="your_turso_auth_token_here"

# ==============================================================================
# Email Configuration (Nodemailer / Hostinger SMTP)
# ==============================================================================
EMAIL_HOST="smtp.hostinger.com"
EMAIL_PORT=465
EMAIL_SECURE=true
EMAIL_USER="contact@firststepco.com"
EMAIL_PASSWORD="your_actual_smtp_password"
EMAIL_FROM="contact@firststepco.com"

# ==============================================================================
# Application URLs
# ==============================================================================
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

---

## 🗄️ Database Initialization

This project uses a unified Prisma ORM instance (`lib/prisma.ts`) that automatically switches adapters:
1. If `TURSO_DATABASE_URL` and `TURSO_AUTH_TOKEN` are defined, it connects to **Turso (LibSQL)**.
2. Otherwise, it defaults to a local **SQLite** database via `better-sqlite3`.

Choose **one** of the options below to initialize your database.

### Option A: Local Development (SQLite)

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Generate the Prisma client**:
   This compiles Prisma types to the custom location (`src/generated/client`):
   ```bash
   npx prisma generate
   ```

3. **Run local migrations**:
   This creates/updates the database schema locally at `./prisma/dev.db` or the location specified in `DATABASE_URL`:
   ```bash
   npx prisma migrate dev
   ```

4. **Seed the database**:
   This inserts default services (Restaurant website, Cabinet system, stock management, etc.) and the default admin user:
   ```bash
   npx tsx prisma/seed.ts
   ```

---

### Option B: Production/Staging (Turso / LibSQL)

Ensure `TURSO_DATABASE_URL` and `TURSO_AUTH_TOKEN` are set in your `.env` file before executing these commands.

1. **Generate the Prisma client**:
   ```bash
   npx prisma generate
   ```

2. **Run remote migration script**:
   This executes the native LibSQL DDL statements to create tables and indexes on Turso:
   ```bash
   npx tsx scripts/init-turso.ts
   ```

3. **Seed remote database**:
   This seeds default services and tables to your remote Turso database instance:
   ```bash
   npx tsx scripts/seed-turso.ts
   ```

---

## 🏃 Running the Application

Once dependencies are installed and the database is migrated and seeded, start the Next.js development server:

```bash
# Start development server
npm run dev
```

Open your browser and navigate to **[http://localhost:3000](http://localhost:3000)**.

For production builds:
```bash
# Build for production (automatically runs prisma generate)
npm run build

# Start production server
npm run start
```

---

## 🔑 Default Admin Credentials

Once the seeding script is executed, you can log in to the admin dashboard using the following credentials:
- **URL**: [http://localhost:3000/auth/login](http://localhost:3000/auth/login) (or via the login screen)
- **Admin Email**: `admin@firststepco.com`
- **Admin Password**: `@@12raquibi`

> [!WARNING]
> It is highly recommended to change the admin password using the reset password utility script in staging and production environments.

---

## 🛠️ Useful Utility Scripts

The project contains several TS/JS utility scripts located in the `scripts/` directory to help diagnose issues, seed specific mock data, or manage users:

| Script Name | Purpose / Command |
| :--- | :--- |
| **Reset Admin Password** | Resets or updates password for the default admin user:<br>`npx tsx scripts/reset-admin-password.ts` |
| **Check Turso Users** | Lists all users currently stored in the remote Turso DB:<br>`npx tsx scripts/check-users.ts` |
| **Check Local DB Tables** | Prints tables and schema info for local SQLite DB:<br>`node check-db.js` |
| **Create Demo Tenant** | Seeds a complete mock restaurant menu and tables for a quick demo:<br>`npx tsx scripts/create-demo-restaurant.ts` |
| **Test SMTP Email** | Verifies email SMTP connection and sends a test email:<br>`npx tsx scripts/test-email.ts` |

---

## 🧩 Prisma Client Integration Note

> [!IMPORTANT]
> Because of code-sharing constraints and multi-platform compilation, this project generates its Prisma client inside the project source tree instead of standard node modules.
>
> Always import the Prisma Client from the generated path:
> ```typescript
> import { PrismaClient } from '../src/generated/client'
> // OR (absolute path aliases configured in tsconfig)
> import { PrismaClient } from '@/generated/client'
> ```
> If you encounter IDE import warnings, run `npx prisma generate` to rebuild the types inside `src/generated/client`.
