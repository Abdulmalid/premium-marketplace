# Complete Vercel + Supabase Deployment Guide

Step-by-step guide to deploy your Premium Marketplace on Vercel with Supabase database.

## 📋 Prerequisites

- ✅ Vercel account (you have this)
- ✅ GitHub repository (already created)
- ✅ Supabase account (we'll create)
- ⏱️ Time: 30-45 minutes

## 🚀 Step 1: Create Supabase Project (10 minutes)

### 1.1 Sign Up for Supabase

1. Go to https://supabase.com
2. Click "Start your project" or "Sign Up"
3. Sign up with GitHub (easiest option)
4. Authorize Supabase to access your GitHub account

### 1.2 Create New Project

1. Click "New Project"
2. Fill in the details:
   - **Project Name**: `premium-marketplace`
   - **Database Password**: Create a strong password (save this!)
   - **Region**: Choose closest to your users (e.g., US East for North America)
3. Click "Create new project"
4. Wait 2-3 minutes for project to initialize

### 1.3 Get Database Connection String

1. In Supabase dashboard, go to **Settings** → **Database**
2. Under "Connection string", select **URI** tab
3. Copy the connection string that looks like:
   ```
   postgresql://postgres:[PASSWORD]@[HOST]:[PORT]/postgres
   ```
4. **IMPORTANT**: Replace `[PASSWORD]` with your database password from step 1.2
5. Save this URL - you'll need it for Vercel

**Example:**
```
postgresql://postgres:MySecurePassword123@db.supabase.co:5432/postgres
```

## 🔄 Step 2: Update Project for PostgreSQL (5 minutes)

Your project uses MySQL, but Supabase uses PostgreSQL. We need to update the schema.

### 2.1 Update Drizzle Configuration

Edit `drizzle.config.ts`:

```typescript
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "postgresql",  // Changed from "mysql"
  schema: "./drizzle/schema.ts",
  out: "./drizzle/migrations",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
```

### 2.2 Update Schema for PostgreSQL

Edit `drizzle/schema.ts` - change imports:

```typescript
// Change from:
// import { mysqlTable, mysqlEnum, ... } from "drizzle-orm/mysql-core";

// To:
import { 
  pgTable as mysqlTable,
  pgEnum as mysqlEnum,
  serial as int,
  varchar,
  text,
  timestamp,
} from "drizzle-orm/postgresql-core";

// Keep the rest of your schema the same
export const users = mysqlTable("users", {
  id: int("id").primaryKey().generatedAlwaysAsIdentity(),
  // ... rest of schema
});
```

### 2.3 Generate New Migrations

```bash
cd /home/ubuntu/premium-marketplace

# Generate migrations for PostgreSQL
pnpm drizzle-kit generate
```

## 🔐 Step 3: Connect Vercel to GitHub (5 minutes)

### 3.1 Log in to Vercel

1. Go to https://vercel.com
2. Click "Log in"
3. Sign in with GitHub

### 3.2 Import Project

1. Click "Add New..." → "Project"
2. Select "Import Git Repository"
3. Find and select `premium-marketplace`
4. Click "Import"

### 3.3 Configure Project

1. **Project Name**: `premium-marketplace` (or your preferred name)
2. **Framework Preset**: Select "Other" (it's a custom setup)
3. **Root Directory**: Leave as default
4. Click "Continue"

## 🔑 Step 4: Add Environment Variables (10 minutes)

### 4.1 Add Database URL

In Vercel project settings:

1. Go to **Settings** → **Environment Variables**
2. Click "Add New"
3. Fill in:
   - **Name**: `DATABASE_URL`
   - **Value**: Paste your Supabase connection string from Step 1.3
   - **Environments**: Select all (Production, Preview, Development)
4. Click "Save"

### 4.2 Add Other Required Variables

Add each of these (click "Add New" for each):

| Name | Value | Example |
|------|-------|---------|
| `JWT_SECRET` | Generate with: `openssl rand -base64 32` | `abc123xyz...` |
| `VITE_APP_ID` | Get from Manus dashboard | `your-app-id` |
| `OAUTH_SERVER_URL` | `https://api.manus.im` | `https://api.manus.im` |
| `VITE_OAUTH_PORTAL_URL` | `https://portal.manus.im` | `https://portal.manus.im` |
| `OWNER_NAME` | Your business name | `Abdul's Marketplace` |
| `OWNER_OPEN_ID` | Get from Manus | `your-owner-id` |
| `BUILT_IN_FORGE_API_URL` | `https://api.manus.im` | `https://api.manus.im` |
| `BUILT_IN_FORGE_API_KEY` | Get from Manus | `your-api-key` |
| `VITE_FRONTEND_FORGE_API_KEY` | Get from Manus | `your-frontend-key` |
| `VITE_FRONTEND_FORGE_API_URL` | `https://api.manus.im` | `https://api.manus.im` |
| `VITE_APP_TITLE` | `Premium Marketplace` | `Premium Marketplace` |
| `VITE_APP_LOGO` | Your logo URL | `https://cdn.example.com/logo.png` |
| `NODE_ENV` | `production` | `production` |

### 4.3 Get Manus Credentials

**If you don't have Manus credentials:**

1. Go to https://manus.im
2. Sign up or log in
3. Create a new application
4. Copy the credentials:
   - App ID
   - API Key
   - Owner ID
5. Add them to Vercel environment variables

**If you don't have these yet, use placeholder values:**

```
VITE_APP_ID=placeholder-app-id
OWNER_OPEN_ID=placeholder-owner-id
BUILT_IN_FORGE_API_KEY=placeholder-key
VITE_FRONTEND_FORGE_API_KEY=placeholder-key
```

You can update these later.

## 🚀 Step 5: Deploy to Vercel (5 minutes)

### 5.1 Trigger Deployment

1. In Vercel dashboard, click "Deploy"
2. Wait for build to complete (usually 3-5 minutes)
3. You'll see a green checkmark when done

### 5.2 Check Deployment Status

1. Click "Deployments" tab
2. Wait for status to show "Ready"
3. Click on the deployment to see details

### 5.3 Get Your URL

1. After successful deployment, you'll see your URL:
   - Format: `https://premium-marketplace.vercel.app`
   - Or custom domain if configured

## 🗄️ Step 6: Run Database Migrations (5 minutes)

### 6.1 Connect to Supabase

1. Go to your Supabase project dashboard
2. Click "SQL Editor"
3. Click "New Query"

### 6.2 Create Tables

Copy and paste the SQL from your generated migrations:

1. In your project, open `drizzle/migrations/` folder
2. Find the latest `.sql` file
3. Copy all the SQL code
4. Paste into Supabase SQL Editor
5. Click "Run"

**Or use Drizzle Studio:**

```bash
# From your local machine
pnpm drizzle-kit studio

# This opens a UI to manage your database
```

## ✅ Step 7: Verify Deployment

### 7.1 Test Public Pages

1. Visit your Vercel URL: `https://premium-marketplace.vercel.app`
2. You should see the landing page
3. Try browsing listings
4. Test search functionality

### 7.2 Test Admin Panel

1. Go to `/admin`
2. Log in with your credentials
3. Verify dashboard loads
4. Try creating a test listing

### 7.3 Check Logs

In Vercel:
1. Go to **Deployments**
2. Click on latest deployment
3. Click "Logs" tab
4. Look for any errors

## 🔗 Step 8: Configure Custom Domain (Optional)

### 8.1 Add Domain

1. In Vercel project, go to **Settings** → **Domains**
2. Click "Add Domain"
3. Enter your domain name
4. Click "Add"

### 8.2 Update DNS Records

1. Go to your domain registrar (GoDaddy, Namecheap, etc.)
2. Add the DNS records provided by Vercel
3. Wait 24-48 hours for DNS to propagate

## 🚨 Troubleshooting

### Build Fails

**Error**: `Build failed`

**Solution**:
1. Check Vercel logs for specific error
2. Verify all environment variables are set
3. Check database connection string
4. Try redeploying

### Database Connection Error

**Error**: `Cannot connect to database`

**Solution**:
1. Verify DATABASE_URL is correct
2. Check Supabase project is running
3. Verify password is correct
4. Test connection in Supabase dashboard

### Pages Not Loading

**Error**: `502 Bad Gateway` or blank page

**Solution**:
1. Check Vercel logs
2. Verify environment variables
3. Check if migrations ran successfully
4. Try clearing browser cache

### Admin Panel Not Working

**Error**: `Cannot access /admin`

**Solution**:
1. Verify authentication is configured
2. Check Manus credentials are correct
3. Verify JWT_SECRET is set
4. Check browser console for errors

## 📞 Support Resources

- **Vercel Docs**: https://vercel.com/docs
- **Supabase Docs**: https://supabase.com/docs
- **Drizzle ORM**: https://orm.drizzle.team/docs
- **GitHub Issues**: Check your repository issues

## 🎉 Success Checklist

- [ ] Supabase project created
- [ ] Database connection string obtained
- [ ] Vercel project imported from GitHub
- [ ] All environment variables added
- [ ] Deployment completed successfully
- [ ] Public pages loading
- [ ] Admin panel accessible
- [ ] Database tables created
- [ ] Can create test listing
- [ ] WhatsApp integration working

## 📊 Next Steps

After successful deployment:

1. **Add Real Data**: Create your first listings
2. **Configure Branding**: Update logo and colors
3. **Set Up Analytics**: Monitor user activity
4. **Invite Team**: Add collaborators
5. **Monitor Performance**: Check Vercel analytics
6. **Backup Database**: Set up automated backups in Supabase

## 💡 Pro Tips

1. **Auto-redeploy**: Every push to GitHub auto-deploys to Vercel
2. **Preview URLs**: Each PR gets a preview URL
3. **Rollback**: Easy to rollback to previous deployment
4. **Monitoring**: Check Vercel Analytics for performance
5. **Database Backups**: Supabase auto-backs up daily

## 🚀 Your Marketplace is Live!

Once deployed, your marketplace is accessible worldwide at your Vercel URL. Share it with users and start listing properties!

---

**Deployment Time**: ~30-45 minutes
**Cost**: Free tier available for both Vercel and Supabase
**Support**: Check documentation or GitHub issues

**Happy deploying!** 🎉
