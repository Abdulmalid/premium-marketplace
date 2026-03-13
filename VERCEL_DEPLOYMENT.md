# Deploy Premium Marketplace to Vercel - Complete Guide

This guide walks you through deploying your Premium Property & Auto Marketplace to Vercel with a production-ready database.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Database Setup Options](#database-setup-options)
3. [Prepare Project for Vercel](#prepare-project-for-vercel)
4. [Deploy to Vercel](#deploy-to-vercel)
5. [Configure Environment Variables](#configure-environment-variables)
6. [Database Migration on Vercel](#database-migration-on-vercel)
7. [Post-Deployment Setup](#post-deployment-setup)
8. [Monitoring & Maintenance](#monitoring--maintenance)

---

## Prerequisites

### Required Accounts

1. **Vercel Account** - Sign up at https://vercel.com
2. **GitHub Account** - For connecting your repository
3. **Database Service** - Choose one:
   - **PlanetScale** (MySQL) - Recommended, free tier available
   - **Neon** (PostgreSQL) - Good alternative
   - **AWS RDS** - For more control
   - **Supabase** - PostgreSQL with real-time features

### Required Tools

- Node.js 18+ installed locally
- Git installed and configured
- Vercel CLI (optional but recommended)

```bash
npm install -g vercel
```

---

## Database Setup Options

### Option 1: PlanetScale (Recommended for MySQL)

**Why PlanetScale?**
- Free tier with 5GB storage
- MySQL-compatible (works with your current schema)
- Automatic backups
- Easy to scale
- Branching for development

#### Step 1: Create PlanetScale Account

1. Go to https://planetscale.com
2. Sign up with GitHub
3. Create a new database called `premium-marketplace`

#### Step 2: Get Connection String

1. Click your database
2. Go to "Connect" button
3. Select "Node.js" driver
4. Copy the connection string:

```
mysql://[username]:[password]@[host]/premium-marketplace
```

#### Step 3: Update Environment Variables

Save this for later when configuring Vercel:

```env
DATABASE_URL=mysql://[username]:[password]@[host]/premium-marketplace
```

#### Step 4: Test Connection Locally

```bash
# Update your .env.local
DATABASE_URL=mysql://[username]:[password]@[host]/premium-marketplace

# Test the connection
pnpm drizzle-kit generate
pnpm drizzle-kit migrate
```

---

### Option 2: Neon (PostgreSQL)

**Why Neon?**
- Free tier with 3GB storage
- PostgreSQL (more powerful than MySQL)
- Serverless, scales automatically
- Great for Vercel integration

#### Step 1: Create Neon Account

1. Go to https://neon.tech
2. Sign up with GitHub
3. Create a new project

#### Step 2: Get Connection String

1. Go to "Connection String" tab
2. Copy the PostgreSQL connection string:

```
postgresql://[user]:[password]@[host]/[database]
```

#### Step 3: Update Schema for PostgreSQL

Your current Drizzle schema uses MySQL. For PostgreSQL:

```typescript
// drizzle/schema.ts - Change imports
import { 
  integer, 
  text, 
  timestamp, 
  varchar,
  pgTable,        // Change from mysqlTable
  pgEnum          // Change from mysqlEnum
} from "drizzle-orm/pg-core";

// Update table definitions
export const users = pgTable("users", {
  // ... same fields
});
```

#### Step 4: Update Environment Variables

```env
DATABASE_URL=postgresql://[user]:[password]@[host]/[database]
```

---

### Option 3: Supabase (PostgreSQL + Real-time)

**Why Supabase?**
- Free tier with 500MB storage
- Built-in authentication
- Real-time subscriptions
- PostgreSQL database
- Perfect for your WhatsApp integration

#### Step 1: Create Supabase Project

1. Go to https://supabase.com
2. Sign up with GitHub
3. Create a new project
4. Choose region closest to your users

#### Step 2: Get Connection String

1. Go to "Database" settings
2. Copy the "Connection string" (URI format)
3. Replace `[YOUR-PASSWORD]` with your database password

```
postgresql://postgres:[password]@[host]:5432/postgres
```

#### Step 3: Update Environment Variables

```env
DATABASE_URL=postgresql://postgres:[password]@[host]:5432/postgres
```

---

### Option 4: AWS RDS (Enterprise)

**Why AWS RDS?**
- Full control over database
- Automatic backups
- Multi-AZ for high availability
- Scales to any size

#### Step 1: Create RDS Instance

1. Go to AWS Console
2. Navigate to RDS
3. Create database:
   - Engine: MySQL 8.0
   - Instance class: db.t3.micro (free tier)
   - Storage: 20GB
   - Public accessibility: Yes
   - Database name: `premium_marketplace`

#### Step 2: Get Connection String

After instance is created:

```
mysql://admin:[password]@[endpoint]:3306/premium_marketplace
```

#### Step 3: Update Security Groups

Allow inbound traffic on port 3306 from Vercel IPs.

---

## Prepare Project for Vercel

### Step 1: Create GitHub Repository

```bash
# Initialize git if not already done
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit: Premium Marketplace"

# Create repository on GitHub
# Then add remote
git remote add origin https://github.com/yourusername/premium-marketplace.git
git branch -M main
git push -u origin main
```

### Step 2: Create Vercel Configuration

Create `vercel.json` in project root:

```json
{
  "buildCommand": "pnpm build",
  "devCommand": "pnpm dev",
  "installCommand": "pnpm install",
  "framework": "vite",
  "env": [
    "DATABASE_URL",
    "JWT_SECRET",
    "VITE_APP_ID",
    "OAUTH_SERVER_URL",
    "VITE_OAUTH_PORTAL_URL",
    "OWNER_NAME",
    "OWNER_OPEN_ID",
    "BUILT_IN_FORGE_API_URL",
    "BUILT_IN_FORGE_API_KEY",
    "VITE_FRONTEND_FORGE_API_KEY",
    "VITE_FRONTEND_FORGE_API_URL",
    "VITE_APP_TITLE",
    "VITE_APP_LOGO"
  ],
  "regions": ["iad1"]
}
```

### Step 3: Update package.json

Ensure your build command works:

```json
{
  "scripts": {
    "dev": "NODE_ENV=development tsx watch server/_core/index.ts",
    "build": "vite build && esbuild server/_core/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist",
    "start": "NODE_ENV=production node dist/index.js",
    "preview": "vite preview"
  }
}
```

### Step 4: Create .env.example

```bash
# Copy your .env.local to .env.example (without actual values)
cp .env.local .env.example

# Edit .env.example to remove sensitive values
```

Content of `.env.example`:

```env
# Database
DATABASE_URL=mysql://user:password@host:3306/database_name

# Authentication
JWT_SECRET=your-secret-key-here
VITE_APP_ID=your-manus-app-id
OAUTH_SERVER_URL=https://api.manus.im
VITE_OAUTH_PORTAL_URL=https://portal.manus.im

# Owner Information
OWNER_NAME=Your Business Name
OWNER_OPEN_ID=your-owner-id

# API Keys
BUILT_IN_FORGE_API_URL=https://api.manus.im
BUILT_IN_FORGE_API_KEY=your-api-key
VITE_FRONTEND_FORGE_API_URL=https://api.manus.im
VITE_FRONTEND_FORGE_API_KEY=your-frontend-key

# App Configuration
VITE_APP_TITLE=Premium Marketplace
VITE_APP_LOGO=https://cdn.example.com/logo.png
```

### Step 5: Add to .gitignore

```bash
# Ensure sensitive files are not committed
echo ".env.local" >> .gitignore
echo ".env.*.local" >> .gitignore
echo "dist/" >> .gitignore
echo "node_modules/" >> .gitignore
```

---

## Deploy to Vercel

### Method 1: Using Vercel Dashboard (Easiest)

#### Step 1: Connect GitHub Repository

1. Go to https://vercel.com/dashboard
2. Click "Add New" > "Project"
3. Select "Import Git Repository"
4. Search for your repository
5. Click "Import"

#### Step 2: Configure Project

1. **Framework Preset**: Select "Other"
2. **Build Command**: `pnpm build`
3. **Output Directory**: `dist`
4. **Install Command**: `pnpm install`

#### Step 3: Add Environment Variables

1. Go to "Environment Variables"
2. Add all variables from your `.env.local`:

```
DATABASE_URL = mysql://user:password@host:3306/database_name
JWT_SECRET = your-secret-key
VITE_APP_ID = your-app-id
OAUTH_SERVER_URL = https://api.manus.im
VITE_OAUTH_PORTAL_URL = https://portal.manus.im
OWNER_NAME = Your Business Name
OWNER_OPEN_ID = your-owner-id
BUILT_IN_FORGE_API_URL = https://api.manus.im
BUILT_IN_FORGE_API_KEY = your-api-key
VITE_FRONTEND_FORGE_API_URL = https://api.manus.im
VITE_FRONTEND_FORGE_API_KEY = your-frontend-key
VITE_APP_TITLE = Premium Marketplace
VITE_APP_LOGO = https://cdn.example.com/logo.png
```

#### Step 4: Deploy

1. Click "Deploy"
2. Wait for build to complete (5-10 minutes)
3. Get your Vercel URL (e.g., `https://premium-marketplace.vercel.app`)

### Method 2: Using Vercel CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Deploy
vercel

# Follow the prompts to:
# - Confirm project name
# - Set build command: pnpm build
# - Set output directory: dist
# - Add environment variables

# For production deployment
vercel --prod
```

---

## Configure Environment Variables

### In Vercel Dashboard

1. Go to your project settings
2. Click "Environment Variables"
3. Add each variable with appropriate scope:

| Variable | Scope | Value |
|----------|-------|-------|
| DATABASE_URL | Production, Preview, Development | Your database connection string |
| JWT_SECRET | All | Generate with: `openssl rand -base64 32` |
| VITE_APP_ID | All | From Manus dashboard |
| OAUTH_SERVER_URL | All | https://api.manus.im |
| VITE_OAUTH_PORTAL_URL | All | https://portal.manus.im |
| OWNER_NAME | All | Your business name |
| OWNER_OPEN_ID | All | From Manus dashboard |
| BUILT_IN_FORGE_API_URL | All | https://api.manus.im |
| BUILT_IN_FORGE_API_KEY | All | From Manus dashboard |
| VITE_FRONTEND_FORGE_API_KEY | All | From Manus dashboard |
| VITE_FRONTEND_FORGE_API_URL | All | https://api.manus.im |
| VITE_APP_TITLE | All | Premium Marketplace |
| VITE_APP_LOGO | All | Your logo URL |

### Generate JWT_SECRET

```bash
# On Mac/Linux
openssl rand -base64 32

# On Windows (PowerShell)
[Convert]::ToBase64String([System.Text.Encoding]::UTF8.GetBytes((New-Guid).ToString())) | Select-Object -First 32
```

---

## Database Migration on Vercel

### Step 1: Run Migrations Locally First

```bash
# Generate migrations
pnpm drizzle-kit generate

# Test locally
pnpm drizzle-kit migrate

# Verify tables created
mysql -u user -p -h host -e "SHOW TABLES;" database_name
```

### Step 2: Run Migrations on Vercel

After deployment, you need to run migrations on the production database:

#### Option A: Using Vercel CLI

```bash
# Connect to your Vercel project
vercel env pull

# Run migrations against production database
DATABASE_URL=$(grep DATABASE_URL .env.local) pnpm drizzle-kit migrate
```

#### Option B: Using SSH/Remote Access

For PlanetScale:

```bash
# PlanetScale provides a direct MySQL connection
# Use any MySQL client to connect and run migrations

# Or use Drizzle Studio
pnpm drizzle-kit studio
```

#### Option C: Create Migration Script

Create `scripts/migrate-prod.ts`:

```typescript
import { migrate } from "drizzle-orm/mysql2/migrator";
import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";

async function runMigrations() {
  const connection = await mysql.createConnection(
    process.env.DATABASE_URL!
  );

  const db = drizzle(connection);

  console.log("Running migrations...");
  await migrate(db, { migrationsFolder: "./drizzle" });
  console.log("Migrations completed!");

  await connection.end();
}

runMigrations().catch(console.error);
```

Run with:

```bash
DATABASE_URL=your-prod-url pnpm tsx scripts/migrate-prod.ts
```

### Step 3: Verify Migrations

```bash
# Connect to production database
mysql -u user -p -h host -e "SHOW TABLES;" database_name

# Check table structure
mysql -u user -p -h host -e "DESCRIBE listings;" database_name
```

---

## Post-Deployment Setup

### Step 1: Test Your Deployment

1. Visit your Vercel URL: `https://your-project.vercel.app`
2. Test public pages:
   - Homepage
   - Listings page
   - Listing detail page
3. Test admin panel:
   - Login at `/admin`
   - Create a test listing
   - Verify database operations

### Step 2: Configure Custom Domain

1. Go to Vercel project settings
2. Click "Domains"
3. Add your custom domain
4. Update DNS records:

```
CNAME your-domain.com -> cname.vercel.app
```

Or use Vercel's nameservers:

```
NS1: ns1.vercel-dns.com
NS2: ns2.vercel-dns.com
NS3: ns3.vercel-dns.com
NS4: ns4.vercel-dns.com
```

### Step 3: Enable HTTPS

Vercel automatically provides SSL/TLS certificates.

### Step 4: Set Up Monitoring

#### Vercel Analytics

1. Go to project settings
2. Enable "Web Analytics"
3. View real-time metrics

#### Error Tracking

1. Install Sentry:

```bash
pnpm add @sentry/node @sentry/tracing
```

2. Initialize in `server/_core/index.ts`:

```typescript
import * as Sentry from "@sentry/node";

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 1.0,
});
```

3. Add `SENTRY_DSN` to Vercel environment variables

---

## Monitoring & Maintenance

### Daily Tasks

- [ ] Check Vercel dashboard for errors
- [ ] Monitor database connection health
- [ ] Review new inquiries
- [ ] Respond to customer messages

### Weekly Tasks

- [ ] Check analytics for traffic patterns
- [ ] Review error logs
- [ ] Verify all features working
- [ ] Check database performance

### Monthly Tasks

- [ ] Update dependencies: `pnpm update`
- [ ] Review security advisories: `pnpm audit`
- [ ] Backup database (if not automatic)
- [ ] Review and optimize slow queries

### Database Maintenance

#### For PlanetScale

```bash
# Connect via Vercel CLI
vercel env pull

# Use Drizzle Studio for visual management
pnpm drizzle-kit studio

# Or connect with MySQL client
mysql -u [user] -p -h [host] [database]
```

#### Check Database Size

```sql
SELECT 
  table_name,
  ROUND(((data_length + index_length) / 1024 / 1024), 2) AS size_mb
FROM information_schema.TABLES
WHERE table_schema = 'premium_marketplace'
ORDER BY size_mb DESC;
```

#### Optimize Tables

```sql
OPTIMIZE TABLE listings;
OPTIMIZE TABLE inquiries;
OPTIMIZE TABLE activity_logs;
```

---

## Troubleshooting

### Build Fails on Vercel

**Error**: `Command "pnpm build" exited with 1`

**Solution**:
1. Check build logs in Vercel dashboard
2. Run locally: `pnpm build`
3. Fix TypeScript errors: `pnpm check`
4. Commit and push again

### Database Connection Error

**Error**: `ECONNREFUSED` or `ER_ACCESS_DENIED_FOR_USER`

**Solution**:
1. Verify DATABASE_URL in Vercel environment variables
2. Check database is running and accessible
3. For PlanetScale: Ensure IP whitelisting (usually automatic)
4. Test connection locally first

### Images Not Uploading

**Error**: `S3 upload failed`

**Solution**:
1. Verify AWS credentials in environment variables
2. Check S3 bucket permissions
3. Ensure bucket is configured for CORS
4. Check file size limits (max 5MB)

### WhatsApp Integration Not Working

**Error**: `Invalid phone number` or `API error`

**Solution**:
1. Verify WhatsApp credentials in environment variables
2. Test with correct phone format: `+234XXXXXXXXXX`
3. Check WhatsApp Business Account is active
4. Verify API token hasn't expired

### Slow Performance

**Symptoms**: Pages load slowly, high latency

**Solution**:
1. Enable Vercel Edge Caching
2. Optimize database queries
3. Add database indexes
4. Implement pagination (max 20 items per page)
5. Enable gzip compression

---

## Vercel Environment Variables Reference

### Required for All Deployments

```env
DATABASE_URL=your-database-connection-string
JWT_SECRET=your-jwt-secret
VITE_APP_ID=your-manus-app-id
OAUTH_SERVER_URL=https://api.manus.im
VITE_OAUTH_PORTAL_URL=https://portal.manus.im
OWNER_NAME=Your Business Name
OWNER_OPEN_ID=your-owner-id
BUILT_IN_FORGE_API_URL=https://api.manus.im
BUILT_IN_FORGE_API_KEY=your-api-key
VITE_FRONTEND_FORGE_API_KEY=your-frontend-key
VITE_FRONTEND_FORGE_API_URL=https://api.manus.im
VITE_APP_TITLE=Premium Marketplace
VITE_APP_LOGO=https://your-logo-url.com/logo.png
```

### Optional for Enhanced Features

```env
SENTRY_DSN=your-sentry-dsn
WHATSAPP_BUSINESS_ACCOUNT_ID=your-account-id
WHATSAPP_API_TOKEN=your-api-token
WHATSAPP_PHONE_NUMBER_ID=your-phone-id
AWS_ACCESS_KEY_ID=your-aws-key
AWS_SECRET_ACCESS_KEY=your-aws-secret
AWS_REGION=us-east-1
AWS_S3_BUCKET=your-bucket-name
```

---

## Quick Comparison: Database Services

| Service | Type | Free Tier | Scaling | Setup Time |
|---------|------|-----------|---------|-----------|
| **PlanetScale** | MySQL | 5GB | Excellent | 5 min |
| **Neon** | PostgreSQL | 3GB | Excellent | 5 min |
| **Supabase** | PostgreSQL | 500MB | Good | 10 min |
| **AWS RDS** | MySQL/PostgreSQL | 750 hrs/mo | Excellent | 20 min |

**Recommendation**: Start with **PlanetScale** for ease of use and MySQL compatibility.

---

## Next Steps After Deployment

1. **Set up monitoring** - Enable Vercel Analytics and error tracking
2. **Configure backups** - Set up automated database backups
3. **Add custom domain** - Point your domain to Vercel
4. **Set up CI/CD** - Enable automatic deployments on git push
5. **Add team members** - Invite collaborators to Vercel project
6. **Monitor costs** - Keep track of database and Vercel usage

---

**Last Updated**: March 2026
**Version**: 1.0.0
