# Vercel + Database Deployment - 30-Minute Quick Start

Complete step-by-step guide to deploy your marketplace to Vercel with a production database.

## Prerequisites Checklist

- [ ] GitHub account (https://github.com)
- [ ] Vercel account (https://vercel.com)
- [ ] Database service account (PlanetScale recommended)
- [ ] Project pushed to GitHub
- [ ] All environment variables ready

---

## Step 1: Prepare Your Project (5 minutes)

### 1.1 Push to GitHub

```bash
# Initialize git (if not done)
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit: Premium Marketplace"

# Create repo on GitHub, then:
git remote add origin https://github.com/YOUR_USERNAME/premium-marketplace.git
git branch -M main
git push -u origin main
```

### 1.2 Create vercel.json

```bash
# In project root, create vercel.json
cat > vercel.json << 'EOF'
{
  "buildCommand": "pnpm build",
  "devCommand": "pnpm dev",
  "installCommand": "pnpm install",
  "framework": "vite"
}
EOF
```

### 1.3 Verify .gitignore

```bash
# Ensure sensitive files are ignored
echo ".env.local" >> .gitignore
echo ".env.*.local" >> .gitignore
git add .gitignore
git commit -m "Update gitignore"
git push
```

---

## Step 2: Set Up Database (5 minutes)

### Option A: PlanetScale (Recommended)

#### 2A.1 Create Database

1. Go to https://planetscale.com
2. Click "Create a new database"
3. Name: `premium-marketplace`
4. Region: Closest to your users
5. Click "Create database"

#### 2A.2 Get Connection String

1. Click your database
2. Click "Connect" button
3. Select "Node.js"
4. Copy the connection string

**Save this for later:**
```
mysql://[user]:[password]@[host]/premium-marketplace
```

#### 2A.3 Test Locally (Optional)

```bash
# Update .env.local
DATABASE_URL=mysql://[user]:[password]@[host]/premium-marketplace

# Test
pnpm drizzle-kit generate
pnpm drizzle-kit migrate
```

### Option B: Neon (PostgreSQL)

#### 2B.1 Create Project

1. Go to https://neon.tech
2. Create new project
3. Select PostgreSQL
4. Choose region

#### 2B.2 Get Connection String

1. Click "Connection String"
2. Copy the PostgreSQL URI

**Save this for later:**
```
postgresql://[user]:[password]@[host]:5432/[database]
```

#### 2B.3 Update Schema (If Using Neon)

Your current schema uses MySQL. For PostgreSQL, update `drizzle/schema.ts`:

```typescript
// Change imports
import { pgTable, pgEnum } from "drizzle-orm/pg-core";

// Update table definitions
export const users = pgTable("users", {
  // ... same fields
});
```

Then:
```bash
pnpm drizzle-kit generate
pnpm drizzle-kit migrate
```

---

## Step 3: Deploy to Vercel (10 minutes)

### 3.1 Connect GitHub Repository

1. Go to https://vercel.com/dashboard
2. Click "Add New" → "Project"
3. Click "Import Git Repository"
4. Search for `premium-marketplace`
5. Click "Import"

### 3.2 Configure Build Settings

1. **Framework Preset**: Select "Other"
2. **Build Command**: `pnpm build`
3. **Output Directory**: `dist`
4. **Install Command**: `pnpm install`
5. Click "Continue"

### 3.3 Add Environment Variables

1. Click "Environment Variables"
2. Add all these variables:

```
DATABASE_URL = mysql://[user]:[password]@[host]/premium-marketplace
JWT_SECRET = [generate with: openssl rand -base64 32]
VITE_APP_ID = [from Manus dashboard]
OAUTH_SERVER_URL = https://api.manus.im
VITE_OAUTH_PORTAL_URL = https://portal.manus.im
OWNER_NAME = Your Business Name
OWNER_OPEN_ID = [from Manus dashboard]
BUILT_IN_FORGE_API_URL = https://api.manus.im
BUILT_IN_FORGE_API_KEY = [from Manus dashboard]
VITE_FRONTEND_FORGE_API_KEY = [from Manus dashboard]
VITE_FRONTEND_FORGE_API_URL = https://api.manus.im
VITE_APP_TITLE = Premium Marketplace
VITE_APP_LOGO = https://your-logo-url.com/logo.png
```

### 3.4 Deploy

1. Click "Deploy"
2. Wait 5-10 minutes for build
3. You'll get a URL like: `https://premium-marketplace.vercel.app`

---

## Step 4: Run Database Migrations (5 minutes)

### 4.1 Connect to Vercel

```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Pull environment variables
vercel env pull
```

### 4.2 Run Migrations

```bash
# Get your production DATABASE_URL from Vercel dashboard
# Then run:
DATABASE_URL="mysql://[user]:[password]@[host]/premium-marketplace" \
pnpm drizzle-kit migrate
```

### 4.3 Verify

```bash
# Check tables were created
mysql -u [user] -p -h [host] -e "SHOW TABLES;" premium-marketplace
```

---

## Step 5: Test Your Deployment (5 minutes)

### 5.1 Test Public Pages

1. Visit your Vercel URL
2. Test:
   - [ ] Homepage loads
   - [ ] Listings page works
   - [ ] Search functionality
   - [ ] Listing detail page

### 5.2 Test Admin Panel

1. Go to `/admin`
2. Test:
   - [ ] Login works
   - [ ] Dashboard loads
   - [ ] Can create test listing
   - [ ] Images upload
   - [ ] Database operations work

### 5.3 Check Logs

```bash
# View deployment logs
vercel logs [your-project-name]

# Or in Vercel dashboard:
# Project → Deployments → Click latest → View logs
```

---

## Step 6: Configure Custom Domain (Optional, 5 minutes)

### 6.1 Add Domain in Vercel

1. Go to Vercel project settings
2. Click "Domains"
3. Enter your domain: `yourdomain.com`
4. Click "Add"

### 6.2 Update DNS

Vercel will show you DNS records to add:

```
CNAME yourdomain.com → cname.vercel.app
```

Or use Vercel nameservers:
```
NS1: ns1.vercel-dns.com
NS2: ns2.vercel-dns.com
NS3: ns3.vercel-dns.com
NS4: ns4.vercel-dns.com
```

### 6.3 Verify

Wait 5-30 minutes for DNS to propagate, then visit your domain.

---

## Troubleshooting

### Build Fails

**Error**: `Command "pnpm build" exited with 1`

**Fix**:
1. Check logs in Vercel dashboard
2. Run locally: `pnpm build`
3. Fix any errors
4. Push to GitHub
5. Vercel will auto-redeploy

### Database Connection Error

**Error**: `ECONNREFUSED` or `ER_ACCESS_DENIED_FOR_USER`

**Fix**:
1. Verify DATABASE_URL in Vercel environment variables
2. For PlanetScale: Check IP whitelisting (usually automatic)
3. Test connection locally first
4. Redeploy after fixing

### Pages Show 404

**Error**: `404 - Not Found`

**Fix**:
1. Check build logs
2. Verify output directory is `dist`
3. Ensure all routes are in `client/src/App.tsx`
4. Rebuild and redeploy

### Images Not Loading

**Error**: Images appear broken

**Fix**:
1. Check S3 bucket configuration
2. Verify AWS credentials in environment
3. Check CORS settings
4. Test image upload in admin panel

---

## Post-Deployment Checklist

- [ ] All pages load correctly
- [ ] Admin login works
- [ ] Can create listings
- [ ] Images upload successfully
- [ ] Database operations work
- [ ] WhatsApp integration works
- [ ] Custom domain configured (if applicable)
- [ ] SSL certificate active (automatic)
- [ ] Analytics enabled
- [ ] Error tracking configured

---

## Next Steps

1. **Add content** - Create your first listings
2. **Invite team** - Add admin users
3. **Monitor** - Check Vercel analytics
4. **Optimize** - Add custom domain, enable caching
5. **Scale** - Plan for growth

---

## Quick Reference

### Vercel Dashboard
- View deployments: https://vercel.com/dashboard
- Check logs: Project → Deployments → Click deployment
- Add environment variables: Project → Settings → Environment Variables
- Configure domain: Project → Settings → Domains

### Database Management
- PlanetScale: https://app.planetscale.com
- Neon: https://console.neon.tech
- Drizzle Studio: `pnpm drizzle-kit studio`

### Useful Commands

```bash
# View Vercel logs
vercel logs [project-name]

# Pull environment variables
vercel env pull

# Redeploy latest
vercel --prod

# Check build locally
pnpm build

# Test database connection
pnpm drizzle-kit studio
```

---

## Support

- **Vercel Help**: https://vercel.com/docs
- **PlanetScale Help**: https://planetscale.com/docs
- **Neon Help**: https://neon.tech/docs
- **Project Docs**: See DEPLOYMENT_GUIDE.md and DATABASE_SETUP.md

---

**Time to Deploy**: ~30 minutes
**Difficulty**: Beginner-friendly
**Cost**: Free tier available for all services

**Last Updated**: March 2026
