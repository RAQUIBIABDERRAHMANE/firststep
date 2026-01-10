# 🚀 FirstStep - Business Management Platform

<div align="center">

![FirstStep Logo](https://img.shields.io/badge/FirstStep-Platform-8B5CF6?style=for-the-badge&logo=rocket&logoColor=white)

**Modern SaaS platform delivering comprehensive business management solutions**

[![Next.js](https://img.shields.io/badge/Next.js-16.1-black?style=flat&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat&logo=typescript)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748?style=flat&logo=prisma)](https://www.prisma.io/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC?style=flat&logo=tailwind-css)](https://tailwindcss.com/)

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Getting Started](#-getting-started)
- [Project Structure](#-project-structure)
- [Available Services](#-available-services)
- [Authentication](#-authentication)
- [Database](#-database)
- [Environment Variables](#-environment-variables)
- [Scripts](#-scripts)
- [Contributing](#-contributing)

---

## 🎯 Overview

**FirstStep** is a modern SaaS platform built with Next.js 14+ that provides modular business management solutions for restaurants, retail, healthcare, and professional services. The platform features a clean, professional design with a focus on user experience and scalability.

### Key Highlights

- 🎨 **Modern UI/UX** - Professional design with gradient effects, animations, and glassmorphism
- 🔐 **Secure Authentication** - Custom auth system with password reset functionality
- 📧 **Email Integration** - Automated email notifications via Nodemailer
- 🗄️ **Type-Safe Database** - Prisma ORM with SQLite (production-ready for PostgreSQL/MySQL)
- ⚡ **Server Components** - Leveraging Next.js 14+ App Router with Server Actions
- 🎭 **Role-Based Access** - Admin and user role management
- 📱 **Fully Responsive** - Mobile-first design approach

---

## ✨ Features

### 🏠 Landing Page
- Hero section with animated background effects
- Services overview with professional card designs
- "How It Works" section
- Sign-up section with service selection
- Animated floating elements and gradients

### 🔐 Authentication System
- User login and registration
- Password reset with 6-digit verification code
- Email verification
- Session-based authentication
- Admin dashboard access control

### 👨‍💼 Admin Dashboard
- User management (view, edit, delete)
- Service management (CRUD operations)
- Service assignment to users
- Analytics and monitoring

### 👤 User Dashboard
- Personal service overview
- Notifications system
- Settings management
- Access to subscribed services

### 📦 Services
- **Restaurant Website & Online Ordering** (AVAILABLE) - **2,500 DH lifetime**
  - Public website with online menu
  - Ordering system
  - AI analytics
  - **Special Offer**: 20% off on POS when it launches
  
- **Restaurant POS System** (COMING SOON)
- **Stock Management System** (COMING SOON)
- **Car Rental Management** (COMING SOON)
- **Hotel Management System** (COMING SOON)
- **Hospital Management System** (COMING SOON)
- **Cabinet Management System** (COMING SOON)

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 16.1 (App Router, Server Components)
- **Language**: TypeScript 5.0
- **Styling**: Tailwind CSS v4
- **UI Components**: Custom components with shadcn/ui pattern
- **Icons**: Lucide React
- **Animations**: Custom CSS animations and transitions

### Backend
- **Runtime**: Node.js
- **API**: Next.js Server Actions
- **Authentication**: Custom implementation with bcryptjs
- **Email**: Nodemailer with Hostinger SMTP

### Database
- **ORM**: Prisma
- **Database**: SQLite (development) - Compatible with PostgreSQL, MySQL
- **Adapter**: Better-SQLite3

### Development Tools
- **Linting**: ESLint
- **Code Quality**: TypeScript strict mode
- **Package Manager**: npm/yarn/pnpm

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ installed
- npm, yarn, or pnpm package manager
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd firststep
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Set up environment variables**
   
   Create a `.env` file in the root directory:
   ```env
   # Database
   DATABASE_URL="file:./dev.db"
   
   # Email Configuration (Hostinger SMTP)
   EMAIL_HOST=smtp.hostinger.com
   EMAIL_PORT=465
   EMAIL_SECURE=true
   EMAIL_USER=contact@firststepco.com
   EMAIL_PASSWORD=your_email_password
   EMAIL_FROM=contact@firststepco.com
   
   # App Configuration
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

4. **Initialize the database**
   ```bash
   # Generate Prisma Client
   npx prisma generate
   
   # Run migrations
   npx prisma migrate dev
   
   # Seed the database
   npx tsx prisma/seed.ts
   ```

5. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

6. **Open the application**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

### Default Admin Credentials

After seeding the database:
- **Email**: admin@firststepco.com
- **Password**: @@12raquibi

---

## 📁 Project Structure

```
firststep/
├── app/
│   ├── actions/          # Server Actions
│   │   ├── admin.ts      # Admin operations
│   │   ├── auth.ts       # Authentication
│   │   └── services.ts   # Service operations
│   ├── admin/            # Admin dashboard pages
│   ├── dashboard/        # User dashboard pages
│   ├── login/            # Login page
│   ├── forgot-password/  # Password reset request
│   ├── reset-password/   # Password reset with code
│   ├── services/         # Services listing page
│   ├── layout.tsx        # Root layout
│   ├── page.tsx          # Landing page
│   └── globals.css       # Global styles & animations
├── components/
│   ├── admin/            # Admin components
│   ├── dashboard/        # Dashboard components
│   ├── landing/          # Landing page components
│   │   ├── Navbar.tsx
│   │   ├── HeroSection.tsx
│   │   ├── ServicesOverview.tsx
│   │   ├── HowItWorks.tsx
│   │   └── SignupSection.tsx
│   └── ui/               # Reusable UI components
│       ├── Button.tsx
│       ├── Card.tsx
│       ├── Input.tsx
│       └── Badge.tsx
├── lib/
│   ├── auth.ts           # Auth utilities
│   ├── mail.ts           # Email service
│   ├── prisma.ts         # Prisma client
│   ├── utils.ts          # Helper functions
│   └── email/
│       └── templates.ts  # Email templates
├── prisma/
│   ├── schema.prisma     # Database schema
│   ├── seed.ts           # Database seeder
│   └── migrations/       # Database migrations
├── public/               # Static assets
├── .env                  # Environment variables
├── next.config.ts        # Next.js configuration
├── tailwind.config.ts    # Tailwind configuration
├── tsconfig.json         # TypeScript configuration
└── package.json          # Dependencies
```

---

## 📦 Available Services

### 🍽️ Restaurant Website & Online Ordering
**Status**: ✅ LIVE | **Price**: 2,500 DH (one-time payment)

Public website with online menu, ordering system, and AI analytics. Perfect for restaurants looking to establish an online presence.

**Special Launch Offer**: Get 20% OFF on our upcoming Restaurant POS System when it becomes available!

### 🔜 Coming Soon Services

- **Restaurant POS System** - Point of sale with inventory management
- **Stock Management** - Comprehensive inventory tracking
- **Car Rental Management** - Fleet and reservation management
- **Hotel Management** - Booking and room management system
- **Hospital Management** - Patient and appointment tracking
- **Cabinet System** - Professional practice management

---

## 🔐 Authentication

### Password Reset Flow

1. User requests password reset at `/forgot-password`
2. System generates 6-digit verification code
3. Code sent via email (valid for 15 minutes)
4. User enters code at `/reset-password`
5. User sets new password with confirmation
6. Password updated and user can login

### Email Templates

Custom HTML email templates with branding:
- Welcome email for new users
- Password reset verification code

---

## 🗄️ Database

### Schema Overview

**Models:**
- `User` - User accounts with role-based access
- `Service` - Available business solutions
- `UserService` - User-to-service assignments
- `Notification` - User notifications system
- `PasswordReset` - Password reset tokens

### Prisma Commands

```bash
# Generate Prisma Client
npx prisma generate

# Create migration
npx prisma migrate dev --name migration_name

# Reset database
npx prisma migrate reset

# Open Prisma Studio
npx prisma studio

# Seed database
npx tsx prisma/seed.ts
```

---

## 🌍 Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | Database connection string | `file:./dev.db` |
| `EMAIL_HOST` | SMTP server host | `smtp.hostinger.com` |
| `EMAIL_PORT` | SMTP server port | `465` |
| `EMAIL_SECURE` | Use SSL/TLS | `true` |
| `EMAIL_USER` | SMTP username | `contact@firststepco.com` |
| `EMAIL_PASSWORD` | SMTP password | `your_password` |
| `EMAIL_FROM` | Sender email address | `contact@firststepco.com` |
| `NEXT_PUBLIC_APP_URL` | Application URL | `http://localhost:3000` |

---

## 📜 Scripts

```bash
# Development
npm run dev              # Start development server
npm run build            # Build for production
npm run start            # Start production server
npm run lint             # Run ESLint

# Database
npx prisma generate      # Generate Prisma Client
npx prisma migrate dev   # Run migrations
npx prisma studio        # Open Prisma Studio
npx tsx prisma/seed.ts   # Seed database

# Type Checking
npx tsc --noEmit         # Check TypeScript errors
```

---

## 🎨 Design System

### Color Palette

- **Primary**: `#3B82F6` (Blue)
- **Accent**: Gradient from primary to lighter blue
- **Background**: Dynamic light/dark mode support
- **Success**: Emerald green for active services
- **Muted**: Subtle grays for secondary content

### Animations

- `fade-in` - Smooth element entrance
- `slide-up` / `slide-down` - Vertical transitions
- `scale-in` - Scale entrance effect
- `float` - Floating animation for background elements
- `pulse-glow` - Pulsing glow effect
- `shimmer` - Shimmer overlay effect
- `spin-slow` / `spin-reverse` - Rotating geometric shapes

### Typography

- **Headings**: Bold, tracking-tight
- **Body**: Medium weight, relaxed leading
- **Labels**: Semibold, uppercase with wide tracking

---

## 🤝 Contributing

We welcome contributions! Please follow these guidelines:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Code Style

- Use TypeScript strict mode
- Follow ESLint rules
- Use meaningful variable names
- Add comments for complex logic
- Keep components small and focused

---

## 📄 License

This project is proprietary software. All rights reserved.

---

## 📞 Contact

**FirstStep Platform**
- Website: [firststepco.com](https://firststepco.com)
- Email: contact@firststepco.com

---

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - The React Framework
- [Prisma](https://www.prisma.io/) - Next-generation ORM
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [Lucide Icons](https://lucide.dev/) - Beautiful icon set
- [Vercel](https://vercel.com/) - Deployment platform

---

<div align="center">

**Built with ❤️ by the FirstStep Team**

[⬆ Back to Top](#-firststep---business-management-platform)

</div>
