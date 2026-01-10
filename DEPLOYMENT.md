# 🚀 Deployment Guide - Vercel

## Prerequisites
- GitHub/GitLab account with your repository
- Vercel account (free tier works)

## Step-by-Step Deployment

### 1. Push Code to GitHub
```bash
git init
git add .
git commit -m "Initial commit - Ready for Vercel"
git branch -M main
git remote add origin <your-github-repo-url>
git push -u origin main
```

### 2. Connect to Vercel

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click "Add New Project"
3. Import your GitHub repository
4. Vercel will auto-detect Next.js settings

### 3. Create Postgres Database

**Option A: Vercel Postgres (Recommended)**
1. In your Vercel project → "Storage" tab
2. Click "Create Database" → "Postgres"
3. Name your database (e.g., `firststep-db`)
4. Copy the connection strings

**Option B: External Provider**
- [Neon](https://neon.tech) - Free serverless Postgres
- [Supabase](https://supabase.com) - Free Postgres with extras
- [Railway](https://railway.app) - Easy Postgres hosting

### 4. Configure Environment Variables

In Vercel Dashboard → Project Settings → Environment Variables, add:

```env
# Database (from Vercel Postgres or your provider)
DATABASE_URL="postgresql://username:password@host/database?sslmode=require"

# Email Configuration (Hostinger SMTP)
EMAIL_HOST=smtp.hostinger.com
EMAIL_PORT=465
EMAIL_SECURE=true
EMAIL_USER=contact@firststepco.com
EMAIL_PASSWORD=your_actual_password
EMAIL_FROM=contact@firststepco.com

# App URL (will be your Vercel domain)
NEXT_PUBLIC_APP_URL=https://your-project.vercel.app
```

### 5. Initialize Database

After deployment, run migrations via Vercel CLI or locally:

**Local (pointing to production DB):**
```bash
# Install Vercel CLI
npm i -g vercel

# Link to your project
vercel link

# Pull environment variables
vercel env pull .env.local

# Run migrations
npx prisma migrate deploy

# Seed database (optional)
npx tsx prisma/seed.ts
```

**Or use Vercel's command:**
```bash
vercel env pull
npx prisma migrate deploy
```

### 6. Deploy

**Automatic:**
- Push to `main` branch → Auto-deploys

**Manual:**
```bash
vercel --prod
```

## 🔧 Post-Deployment

### Update App URL
After first deployment, update `NEXT_PUBLIC_APP_URL` in Vercel environment variables to your actual domain.

### Custom Domain (Optional)
1. Vercel Dashboard → Project Settings → Domains
2. Add your custom domain
3. Update DNS records as instructed
4. Update `NEXT_PUBLIC_APP_URL` to your custom domain

### Run Migrations on Changes
Whenever you modify `schema.prisma`:
```bash
# Create migration locally
npx prisma migrate dev --name your_migration_name

# Push to GitHub (triggers auto-deploy)
git add .
git commit -m "Database migration"
git push

# Or manually deploy migrations
vercel env pull
npx prisma migrate deploy
```

## 🐛 Troubleshooting

### Build Fails
- Check Vercel build logs
- Ensure all dependencies are in `dependencies` (not `devDependencies`)
- Verify `postinstall` script runs: `prisma generate`

### Database Connection Issues
- Verify `DATABASE_URL` is correctly set
- Ensure connection string includes `?sslmode=require` for Postgres
- Check if database is publicly accessible

### Email Not Sending
- Verify all `EMAIL_*` variables are set
- Test SMTP credentials locally first
- Check Vercel function logs for errors

### 500 Errors
- Check Vercel function logs: Project → Deployments → Click deployment → Functions
- Verify Prisma Client is generated: should see "Prisma Client generated" in build logs

## 📊 Monitoring

- **Logs**: Vercel Dashboard → Project → Deployments → Functions
- **Analytics**: Built-in Vercel Analytics (upgrade for more)
- **Errors**: Add [Sentry](https://sentry.io) for error tracking

## 💰 Costs

- **Vercel Pro**: Free for hobby projects
- **Vercel Postgres**: 
  - Free tier: 256MB storage, 60 compute hours
  - Pro: $20/month for more resources
- **Bandwidth**: 100GB/month free

## 🎯 Optimization Tips

1. **Enable Edge Runtime** for faster response:
   ```typescript
   export const runtime = 'edge'
   ```

2. **Image Optimization**: Already enabled by Next.js

3. **Caching**: Configure in `next.config.ts`:
   ```typescript
   {
     images: {
       remotePatterns: [/* your CDN */]
     }
   }
   ```

4. **Environment**: Set `NODE_ENV=production` (Vercel does this automatically)

## ✅ Checklist

- [ ] Code pushed to GitHub
- [ ] Vercel project created and connected
- [ ] Postgres database created
- [ ] All environment variables configured
- [ ] Database migrations deployed
- [ ] Database seeded (admin user created)
- [ ] Test login with admin credentials
- [ ] Custom domain configured (optional)
- [ ] Email functionality tested
- [ ] Monitoring setup

## 🔗 Useful Links

- [Vercel Documentation](https://vercel.com/docs)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Prisma on Vercel](https://www.prisma.io/docs/guides/deployment/deployment-guides/deploying-to-vercel)
- [Vercel Postgres](https://vercel.com/docs/storage/vercel-postgres)

---

**Need Help?** Check Vercel's support or their Discord community.
