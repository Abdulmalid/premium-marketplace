# Premium Property & Auto Marketplace - Deployment & Setup Guide

## Table of Contents
1. [Project Overview](#project-overview)
2. [Prerequisites](#prerequisites)
3. [Local Development Setup](#local-development-setup)
4. [Environment Configuration](#environment-configuration)
5. [Database Setup](#database-setup)
6. [Deployment to Production](#deployment-to-production)
7. [Admin Panel Security](#admin-panel-security)
8. [WhatsApp Integration](#whatsapp-integration)
9. [Monitoring & Maintenance](#monitoring--maintenance)
10. [Troubleshooting](#troubleshooting)

---

## Project Overview

The Premium Property & Auto Marketplace is a full-stack web application built with:
- **Frontend**: React 19 + TypeScript + Tailwind CSS 4
- **Backend**: Express.js + tRPC 11
- **Database**: MySQL/TiDB (via Drizzle ORM)
- **Authentication**: Manus OAuth
- **Real-time**: Supabase subscriptions
- **Storage**: S3 for images and media
- **Messaging**: WhatsApp integration for inquiries

### Key Features
- Public listing catalog with advanced filtering and search
- Admin dashboard with inventory management and analytics
- Multi-step listing creation wizard with image upload
- Real-time activity feed and notifications
- WhatsApp inquiry integration
- Role-based access control (admin, editor, viewer)
- View tracking and conversion analytics

---

## Prerequisites

Before you begin, ensure you have:

### Required Software
- Node.js 18+ and npm/pnpm
- Git
- A code editor (VS Code recommended)

### Required Accounts & Services
- **Manus Account** - For OAuth authentication and hosting
- **Database** - MySQL-compatible database (provided by Manus)
- **S3 Storage** - AWS S3 or compatible (provided by Manus)
- **WhatsApp Business Account** - For customer messaging (optional)

### Domain & DNS (Optional)
- Custom domain name
- DNS management access

---

## Local Development Setup

### 1. Clone or Create the Project

If you're starting fresh:
```bash
# Create a new directory
mkdir my-marketplace
cd my-marketplace

# Initialize git
git init

# Copy project files from the checkpoint
```

### 2. Install Dependencies

```bash
# Install Node.js dependencies
pnpm install

# If you don't have pnpm, install it globally
npm install -g pnpm
```

### 3. Start Development Server

```bash
# Start the development server
pnpm dev

# The app will be available at http://localhost:3000
```

### 4. Access the Application

- **Public Site**: http://localhost:3000
- **Admin Panel**: http://localhost:3000/admin (requires login)
- **Listings**: http://localhost:3000/listings

---

## Environment Configuration

### 1. Create Environment Variables File

Create a `.env.local` file in the project root:

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

# Storage (S3)
AWS_ACCESS_KEY_ID=your-aws-key
AWS_SECRET_ACCESS_KEY=your-aws-secret
AWS_REGION=us-east-1
AWS_S3_BUCKET=your-bucket-name

# WhatsApp Integration (Optional)
WHATSAPP_BUSINESS_ACCOUNT_ID=your-account-id
WHATSAPP_API_TOKEN=your-api-token
WHATSAPP_PHONE_NUMBER_ID=your-phone-id

# Analytics
VITE_ANALYTICS_ENDPOINT=https://analytics.example.com
VITE_ANALYTICS_WEBSITE_ID=your-website-id

# API Keys
BUILT_IN_FORGE_API_URL=https://api.manus.im
BUILT_IN_FORGE_API_KEY=your-api-key
VITE_FRONTEND_FORGE_API_URL=https://api.manus.im
VITE_FRONTEND_FORGE_API_KEY=your-frontend-key

# App Configuration
VITE_APP_TITLE=Premium Marketplace
VITE_APP_LOGO=https://cdn.example.com/logo.png
```

### 2. Get Environment Variables

**From Manus Dashboard:**
1. Log in to your Manus account
2. Navigate to Project Settings
3. Copy the provided environment variables
4. Paste them into your `.env.local` file

**Database Connection:**
1. Go to Database section in Manus Dashboard
2. Copy the MySQL connection string
3. Set `DATABASE_URL` in your `.env.local`

---

## Database Setup

### 1. Create Database Tables

The database schema is defined in `drizzle/schema.ts`. To apply migrations:

```bash
# Generate migration files
pnpm drizzle-kit generate

# Apply migrations to database
pnpm drizzle-kit migrate
```

### 2. Database Schema Overview

The marketplace uses the following main tables:

**listings**
- Stores property and vehicle listings
- Fields: id, title, description, price, category, status, featured, images, location, etc.

**inquiries**
- Stores customer inquiries and leads
- Fields: id, listingId, customerName, customerEmail, customerPhone, message, status, etc.

**activity_logs**
- Audit trail of all actions
- Fields: id, userId, action, entityType, entityId, changes, timestamp

**status_history**
- Tracks listing status changes
- Fields: id, listingId, previousStatus, newStatus, reason, timestamp

**users**
- Admin users and team members
- Fields: id, email, name, role, createdAt, lastSignedIn

### 3. Seed Initial Data (Optional)

Create a seed script in `scripts/seed.ts`:

```typescript
import { getDb } from "../server/db";
import { listings } from "../drizzle/schema";

async function seed() {
  const db = await getDb();
  
  // Insert sample listings
  await db.insert(listings).values([
    {
      title: "Luxury Villa in Lekki Phase 1",
      description: "Beautiful 5-bedroom villa with pool",
      price: 250000000,
      category: "real_estate",
      // ... other fields
    },
  ]);
  
  console.log("Seeding complete!");
}

seed().catch(console.error);
```

Run with: `pnpm tsx scripts/seed.ts`

---

## Deployment to Production

### Option 1: Deploy with Manus (Recommended)

Manus provides built-in hosting with automatic SSL, CDN, and scaling.

#### Steps:
1. **Create a Checkpoint**
   ```bash
   # In Manus dashboard, click "Save Checkpoint"
   # This creates a snapshot of your current code
   ```

2. **Publish to Production**
   ```bash
   # In Manus dashboard, click "Publish"
   # Select your checkpoint
   # Choose production environment
   ```

3. **Configure Domain**
   - Go to Settings > Domains
   - Add your custom domain or use the auto-generated Manus domain
   - Update DNS records if using custom domain

#### Manus Deployment Benefits:
- Automatic HTTPS/SSL
- Global CDN
- Auto-scaling
- Built-in database backups
- Environment variable management
- One-click rollbacks

### Option 2: Deploy to External Hosting

If you prefer external hosting (Vercel, Railway, Render, etc.):

#### Vercel Deployment:
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel

# Set environment variables in Vercel dashboard
# Database URL, API keys, etc.
```

#### Railway Deployment:
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login and deploy
railway login
railway up
```

#### Docker Deployment:
```dockerfile
# Dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
```

Build and push:
```bash
docker build -t my-marketplace .
docker push my-registry/my-marketplace
```

### 3. Post-Deployment Checklist

- [ ] Test all public pages (landing, listings, detail)
- [ ] Test admin login and dashboard
- [ ] Verify database connectivity
- [ ] Test image uploads
- [ ] Test WhatsApp integration
- [ ] Check email notifications
- [ ] Monitor error logs
- [ ] Set up backups
- [ ] Configure monitoring/alerts

---

## Admin Panel Security

### 1. Role-Based Access Control

Three role levels are implemented:

| Role | Permissions |
|------|------------|
| **admin** | Full access - create, edit, delete listings; manage users; view all analytics |
| **editor** | Create and edit listings; view inquiries; cannot delete or manage users |
| **viewer** | View-only access to listings and inquiries; no edit permissions |

### 2. Implement Role Checks

In your tRPC procedures:

```typescript
// server/routers.ts
import { protectedProcedure, router } from "./_core/trpc";

const adminProcedure = protectedProcedure.use(async ({ ctx, next }) => {
  if (ctx.user.role !== "admin") {
    throw new TRPCError({ code: "FORBIDDEN" });
  }
  return next({ ctx });
});

export const appRouter = router({
  listings: router({
    delete: adminProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        // Only admins can delete
        return db.deleteListing(input.id);
      }),
  }),
});
```

### 3. Frontend Route Protection

Wrap admin routes with `AdminGuard`:

```typescript
// client/src/App.tsx
import AdminGuard from "@/components/AdminGuard";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/listings" component={Listings} />
      <Route
        path="/admin/*"
        component={() => (
          <AdminGuard requiredRole="admin">
            <AdminDashboard />
          </AdminGuard>
        )}
      />
    </Switch>
  );
}
```

### 4. Session Security

- Sessions are stored in HTTP-only cookies
- CSRF protection enabled by default
- Sessions expire after 30 days
- Automatic logout on browser close (optional)

### 5. Audit Logging

All admin actions are logged:

```typescript
// Automatically logged in activity_logs table
- User login/logout
- Listing creation/update/deletion
- Inquiry status changes
- User role changes
- Settings modifications
```

View logs in Admin Dashboard > Activity Feed

### 6. Security Best Practices

- **Never commit `.env.local`** - Add to `.gitignore`
- **Use strong passwords** for admin accounts
- **Enable 2FA** if available through Manus
- **Regular backups** - Configure in Manus dashboard
- **Monitor logs** - Check activity feed regularly
- **Update dependencies** - Run `pnpm update` monthly
- **API rate limiting** - Implemented on tRPC routes
- **Input validation** - All inputs validated with Zod

---

## WhatsApp Integration

### 1. Setup WhatsApp Business Account

1. **Create WhatsApp Business Account**
   - Go to https://developers.facebook.com
   - Create a new app
   - Add WhatsApp product
   - Get your Business Account ID

2. **Get API Credentials**
   - Business Account ID
   - Phone Number ID
   - API Access Token

### 2. Configure Environment Variables

```env
WHATSAPP_BUSINESS_ACCOUNT_ID=your-account-id
WHATSAPP_API_TOKEN=your-api-token
WHATSAPP_PHONE_NUMBER_ID=your-phone-id
WHATSAPP_ADMIN_PHONE=+234XXXXXXXXXX
```

### 3. Send Messages via WhatsApp

```typescript
// client/src/lib/whatsapp.ts
import { sendInquiryViaWhatsApp } from "@/lib/whatsapp";

// Send inquiry
sendInquiryViaWhatsApp({
  phoneNumber: "+2348012345678",
  customerName: "John Doe",
  listingTitle: "Luxury Villa in Lekki",
  listingPrice: 250000000,
  message: "I'm interested in viewing this property",
});
```

### 4. Receive Messages (Webhook)

Set up webhook in WhatsApp Business API:

```typescript
// server/webhooks.ts
import express from "express";

const app = express();

app.post("/webhooks/whatsapp", (req, res) => {
  const { entry } = req.body;
  
  entry.forEach((e: any) => {
    e.changes.forEach((change: any) => {
      const message = change.value.messages?.[0];
      
      if (message) {
        // Process incoming message
        console.log("Received:", message.text.body);
        
        // Create inquiry or log message
        // db.createInquiry({ ... });
      }
    });
  });
  
  res.sendStatus(200);
});
```

### 5. Test Integration

```bash
# Send test message
curl -X POST https://graph.instagram.com/v18.0/YOUR_PHONE_NUMBER_ID/messages \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -d '{
    "messaging_product": "whatsapp",
    "to": "YOUR_PHONE_NUMBER",
    "type": "text",
    "text": { "body": "Test message" }
  }'
```

---

## Monitoring & Maintenance

### 1. Monitor Application Health

**Check Server Status:**
```bash
# View logs
tail -f /var/log/app.log

# Check uptime
curl https://your-domain.com/health
```

**Manus Dashboard:**
- Go to Dashboard > Analytics
- Monitor page views, unique visitors
- Track conversion rates
- View error rates

### 2. Database Maintenance

```bash
# Backup database
mysqldump -u user -p database_name > backup.sql

# Optimize tables
mysql -u user -p -e "OPTIMIZE TABLE listings, inquiries, activity_logs;"

# Check database size
mysql -u user -p -e "SELECT table_name, ROUND(((data_length + index_length) / 1024 / 1024), 2) AS size_mb FROM information_schema.TABLES WHERE table_schema = 'database_name';"
```

### 3. Performance Optimization

**Image Optimization:**
- Compress images before upload
- Use WebP format where possible
- Implement lazy loading

**Database Indexing:**
```sql
-- Add indexes for common queries
CREATE INDEX idx_listings_category ON listings(category);
CREATE INDEX idx_listings_status ON listings(status);
CREATE INDEX idx_inquiries_listing ON inquiries(listing_id);
CREATE INDEX idx_inquiries_status ON inquiries(status);
```

**Caching:**
- Implement Redis caching for frequently accessed data
- Cache listing search results
- Cache user session data

### 4. Security Updates

```bash
# Check for vulnerabilities
pnpm audit

# Update dependencies
pnpm update

# Update security patches only
pnpm update --depth 3
```

### 5. Monitoring Tools

**Set up monitoring for:**
- Server uptime (UptimeRobot, Pingdom)
- Error tracking (Sentry, Rollbar)
- Performance monitoring (New Relic, DataDog)
- Log aggregation (LogRocket, Loggly)

---

## Troubleshooting

### Common Issues & Solutions

#### 1. Database Connection Error
```
Error: ECONNREFUSED 127.0.0.1:3306
```

**Solution:**
- Check DATABASE_URL in `.env.local`
- Verify database is running
- Check firewall rules
- Verify credentials

#### 2. Images Not Uploading
```
Error: S3 upload failed
```

**Solution:**
- Verify AWS credentials in `.env`
- Check S3 bucket permissions
- Ensure bucket is public (if needed)
- Check file size limits (max 5MB)

#### 3. WhatsApp Messages Not Sending
```
Error: Invalid phone number format
```

**Solution:**
- Use international format: +234XXXXXXXXXX
- Remove spaces and special characters
- Verify phone number is registered with WhatsApp

#### 4. Admin Login Not Working
```
Error: Invalid credentials
```

**Solution:**
- Check Manus OAuth configuration
- Verify VITE_APP_ID is correct
- Clear browser cookies
- Check user role in database

#### 5. Slow Page Load
```
Performance issue: Page takes >3 seconds to load
```

**Solution:**
- Enable database query caching
- Optimize images
- Implement pagination (max 20 items per page)
- Use database indexes
- Enable gzip compression

### Debug Mode

Enable debug logging:

```typescript
// client/src/main.tsx
if (import.meta.env.DEV) {
  window.DEBUG = true;
}

// server/_core/index.ts
if (process.env.DEBUG) {
  console.log("Debug mode enabled");
}
```

### Get Help

- Check logs in Manus Dashboard
- Review error messages in browser console
- Check server logs: `tail -f .manus-logs/devserver.log`
- Contact Manus support: https://help.manus.im

---

## Next Steps

1. **Customize Branding**
   - Update VITE_APP_TITLE and VITE_APP_LOGO
   - Customize color palette in `client/src/index.css`
   - Add your company logo and favicon

2. **Add More Features**
   - Email notifications for inquiries
   - SMS notifications (Twilio integration)
   - Advanced analytics dashboard
   - User profiles and saved listings
   - Payment processing (Stripe integration)

3. **Scale the Application**
   - Set up CDN for images
   - Implement caching strategies
   - Add search indexing (Elasticsearch)
   - Set up load balancing

4. **Marketing & SEO**
   - Add meta tags for SEO
   - Set up Google Analytics
   - Create sitemap.xml
   - Implement Open Graph tags

---

## Support & Resources

- **Manus Documentation**: https://docs.manus.im
- **tRPC Documentation**: https://trpc.io
- **React Documentation**: https://react.dev
- **Tailwind CSS**: https://tailwindcss.com
- **Drizzle ORM**: https://orm.drizzle.team

---

**Last Updated**: March 2026
**Version**: 1.0.0
