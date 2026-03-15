# Vercel + Supabase Deployment Checklist

Quick reference checklist for deploying Premium Marketplace to Vercel.

## ✅ Pre-Deployment Checklist

### Accounts & Access
- [ ] Vercel account created and logged in
- [ ] GitHub repository pushed (https://github.com/Abdulmalid/premium-marketplace)
- [ ] Supabase account created
- [ ] Manus account with credentials (or placeholder values)

### Local Setup
- [ ] Project extracted and ready
- [ ] Dependencies installed (`pnpm install`)
- [ ] Environment file created (`.env.local`)
- [ ] Project runs locally (`pnpm dev`)

---

## 🚀 Deployment Steps (In Order)

### Step 1: Supabase Setup (10 min)

**Location**: https://supabase.com

- [ ] Create new Supabase project
  - Project name: `premium-marketplace`
  - Set database password (save it!)
  - Choose region
- [ ] Wait for project to initialize (2-3 min)
- [ ] Go to Settings → Database
- [ ] Copy PostgreSQL connection string
- [ ] Replace `[PASSWORD]` with your password
- [ ] Save the full connection string

**Your Connection String:**
```
postgresql://postgres:YOUR_PASSWORD@YOUR_HOST:5432/postgres
```

### Step 2: Update Project for PostgreSQL (5 min)

**Location**: Your local project or GitHub

- [ ] Update `drizzle.config.ts`:
  ```typescript
  dialect: "postgresql"
  ```

- [ ] Update `drizzle/schema.ts`:
  ```typescript
  import { pgTable, pgEnum, ... } from "drizzle-orm/postgresql-core"
  ```

- [ ] Generate migrations:
  ```bash
  pnpm drizzle-kit generate
  ```

- [ ] Commit and push to GitHub:
  ```bash
  git add .
  git commit -m "Update for PostgreSQL/Supabase"
  git push
  ```

### Step 3: Vercel Project Setup (5 min)

**Location**: https://vercel.com

- [ ] Log in to Vercel
- [ ] Click "Add New" → "Project"
- [ ] Select "Import Git Repository"
- [ ] Find and select `premium-marketplace`
- [ ] Click "Import"
- [ ] Set project name: `premium-marketplace`
- [ ] Framework: Select "Other"
- [ ] Click "Continue"

### Step 4: Environment Variables (10 min)

**Location**: Vercel → Settings → Environment Variables

Add these variables (click "Add New" for each):

#### Database
- [ ] `DATABASE_URL` = Your Supabase connection string

#### Authentication
- [ ] `JWT_SECRET` = Generate: `openssl rand -base64 32`
- [ ] `VITE_APP_ID` = Your Manus app ID (or placeholder)
- [ ] `OAUTH_SERVER_URL` = `https://api.manus.im`
- [ ] `VITE_OAUTH_PORTAL_URL` = `https://portal.manus.im`

#### Owner Info
- [ ] `OWNER_NAME` = Your business name
- [ ] `OWNER_OPEN_ID` = Your Manus owner ID (or placeholder)

#### API Keys
- [ ] `BUILT_IN_FORGE_API_URL` = `https://api.manus.im`
- [ ] `BUILT_IN_FORGE_API_KEY` = Your Manus API key (or placeholder)
- [ ] `VITE_FRONTEND_FORGE_API_KEY` = Your frontend key (or placeholder)
- [ ] `VITE_FRONTEND_FORGE_API_URL` = `https://api.manus.im`

#### App Config
- [ ] `VITE_APP_TITLE` = `Premium Marketplace`
- [ ] `VITE_APP_LOGO` = Your logo URL (or leave blank)
- [ ] `NODE_ENV` = `production`

**Set all to**: Production, Preview, Development

### Step 5: Deploy (5 min)

**Location**: Vercel Dashboard

- [ ] Click "Deploy" button
- [ ] Wait for build to complete (3-5 min)
- [ ] Check for green checkmark
- [ ] Verify no build errors in logs

**Your Deployment URL**: 
```
https://premium-marketplace.vercel.app
```

### Step 6: Database Migrations (5 min)

**Location**: Supabase Dashboard

- [ ] Go to SQL Editor
- [ ] Click "New Query"
- [ ] Open your project's `drizzle/migrations/` folder
- [ ] Copy the latest `.sql` file content
- [ ] Paste into Supabase SQL Editor
- [ ] Click "Run"
- [ ] Verify tables created in "Table Editor"

**Tables to verify:**
- [ ] `users`
- [ ] `listings`
- [ ] `inquiries`
- [ ] `activity_logs`
- [ ] `status_history`

### Step 7: Verification (5 min)

**Location**: Your browser

- [ ] Visit: `https://premium-marketplace.vercel.app`
- [ ] Homepage loads correctly
- [ ] Search bar visible
- [ ] Browse listings works
- [ ] Go to `/admin`
- [ ] Admin panel loads
- [ ] Dashboard displays

---

## 📋 Environment Variables Reference

### Required Variables

```env
# Database (REQUIRED)
DATABASE_URL=postgresql://postgres:password@host:5432/postgres

# Authentication (REQUIRED)
JWT_SECRET=your-random-secret-key
VITE_APP_ID=your-manus-app-id
OAUTH_SERVER_URL=https://api.manus.im
VITE_OAUTH_PORTAL_URL=https://portal.manus.im

# Owner (REQUIRED)
OWNER_NAME=Your Business Name
OWNER_OPEN_ID=your-owner-id

# API Keys (REQUIRED)
BUILT_IN_FORGE_API_URL=https://api.manus.im
BUILT_IN_FORGE_API_KEY=your-api-key
VITE_FRONTEND_FORGE_API_KEY=your-frontend-key
VITE_FRONTEND_FORGE_API_URL=https://api.manus.im

# App Config (REQUIRED)
VITE_APP_TITLE=Premium Marketplace
NODE_ENV=production

# Optional
VITE_APP_LOGO=https://your-logo-url.com/logo.png
```

### Generate JWT_SECRET

```bash
# On your local machine or VPS
openssl rand -base64 32

# Copy the output and paste into Vercel
```

---

## 🔗 Important Links

| Service | URL |
|---------|-----|
| Vercel Dashboard | https://vercel.com/dashboard |
| Supabase Dashboard | https://app.supabase.com |
| Your Marketplace | https://premium-marketplace.vercel.app |
| GitHub Repository | https://github.com/Abdulmalid/premium-marketplace |
| Manus Dashboard | https://manus.im |

---

## 🚨 Common Issues & Solutions

### Build Fails

**Check**: Vercel logs for specific error
```
Vercel → Deployments → Click latest → Logs tab
```

**Common causes**:
- Missing environment variables
- Database connection string incorrect
- Node version mismatch

**Fix**:
1. Verify all env vars are set
2. Check database URL format
3. Redeploy

### Database Connection Error

**Error**: `Cannot connect to database`

**Fix**:
1. Verify DATABASE_URL is correct
2. Check Supabase project is running
3. Verify password in connection string
4. Test in Supabase SQL Editor

### Pages Not Loading

**Error**: `502 Bad Gateway`

**Fix**:
1. Check Vercel logs
2. Verify environment variables
3. Check database migrations ran
4. Clear browser cache

### Admin Panel Not Working

**Error**: Cannot access `/admin`

**Fix**:
1. Verify JWT_SECRET is set
2. Check Manus credentials
3. Check browser console for errors
4. Verify authentication flow

---

## 📞 Getting Help

### If Deployment Fails

1. **Check Vercel Logs**:
   - Vercel Dashboard → Deployments → Click deployment → Logs

2. **Check Supabase Status**:
   - Supabase Dashboard → Check project status

3. **Verify Environment Variables**:
   - Vercel → Settings → Environment Variables
   - Make sure all are set correctly

4. **Check GitHub Push**:
   - Make sure latest code is pushed to GitHub
   - Vercel deploys from GitHub

5. **Review Documentation**:
   - See `VERCEL_SUPABASE_SETUP.md` for detailed steps
   - Check troubleshooting section

---

## ✨ Success Indicators

When everything is working:

- ✅ Vercel shows "Ready" status
- ✅ Homepage loads at your URL
- ✅ Admin panel accessible at `/admin`
- ✅ Database tables visible in Supabase
- ✅ Can create test listings
- ✅ No errors in browser console
- ✅ No errors in Vercel logs

---

## 🎯 Next Steps After Deployment

1. **Add Real Data**: Create your first listings
2. **Configure Branding**: Update logo and colors
3. **Test Features**: Try all marketplace functions
4. **Invite Users**: Share marketplace URL
5. **Monitor Performance**: Check Vercel Analytics
6. **Set Up Backups**: Configure Supabase backups

---

## 💾 Backup & Recovery

### Backup Database

In Supabase:
1. Go to Settings → Backups
2. Enable automated backups
3. Backups stored for 7 days (free tier)

### Rollback Deployment

In Vercel:
1. Go to Deployments
2. Find previous working deployment
3. Click "Redeploy"
4. Confirms you want to rollback
5. Done!

---

## 🚀 You're Ready!

Follow the checklist above in order, and your marketplace will be live on Vercel in 30-45 minutes!

**Questions?** Check `VERCEL_SUPABASE_SETUP.md` for detailed instructions.

**Happy deploying!** 🎉

---

**Last Updated**: March 2026
**Version**: 1.0.0
**Estimated Time**: 30-45 minutes
