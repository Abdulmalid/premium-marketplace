# Database Setup & Management Guide

Complete guide for setting up and managing your marketplace database for production.

## Quick Start: Choose Your Database

### For Beginners: PlanetScale (Recommended)

**Best for**: Quick setup, MySQL compatibility, free tier

```bash
# 1. Sign up at https://planetscale.com
# 2. Create database: premium-marketplace
# 3. Get connection string from "Connect" button
# 4. Add to .env.local:
DATABASE_URL=mysql://[user]:[password]@[host]/premium-marketplace

# 5. Run migrations
pnpm drizzle-kit generate
pnpm drizzle-kit migrate
```

### For Advanced Users: Neon (PostgreSQL)

**Best for**: Advanced features, better performance, PostgreSQL

```bash
# 1. Sign up at https://neon.tech
# 2. Create project
# 3. Get connection string
# 4. Update schema for PostgreSQL (see below)
# 5. Deploy
```

---

## Database Schema Overview

Your marketplace uses these main tables:

### Users Table
```sql
CREATE TABLE users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  openId VARCHAR(64) UNIQUE NOT NULL,
  name TEXT,
  email VARCHAR(320),
  loginMethod VARCHAR(64),
  role ENUM('user', 'admin') DEFAULT 'user',
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  lastSignedIn TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Listings Table
```sql
CREATE TABLE listings (
  id INT PRIMARY KEY AUTO_INCREMENT,
  title VARCHAR(255) NOT NULL,
  description LONGTEXT,
  category VARCHAR(50) NOT NULL,
  subcategory VARCHAR(50),
  price BIGINT,
  priceOnRequest BOOLEAN DEFAULT FALSE,
  condition VARCHAR(50),
  status ENUM('available', 'pending', 'reserved', 'sold') DEFAULT 'available',
  featured BOOLEAN DEFAULT FALSE,
  images JSON,
  specifications JSON,
  locationAddress VARCHAR(255),
  locationArea VARCHAR(100),
  virtualTourUrl VARCHAR(500),
  videoUrl VARCHAR(500),
  viewCount INT DEFAULT 0,
  createdBy INT,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (createdBy) REFERENCES users(id),
  INDEX idx_category (category),
  INDEX idx_status (status),
  INDEX idx_featured (featured)
);
```

### Inquiries Table
```sql
CREATE TABLE inquiries (
  id INT PRIMARY KEY AUTO_INCREMENT,
  listingId INT NOT NULL,
  customerName VARCHAR(255) NOT NULL,
  customerEmail VARCHAR(320),
  customerPhone VARCHAR(20),
  message LONGTEXT,
  status ENUM('new', 'contacted', 'viewing_scheduled', 'negotiating', 'closed_won', 'closed_lost') DEFAULT 'new',
  assignedTo INT,
  notes LONGTEXT,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (listingId) REFERENCES listings(id),
  FOREIGN KEY (assignedTo) REFERENCES users(id),
  INDEX idx_listing (listingId),
  INDEX idx_status (status),
  INDEX idx_assigned (assignedTo)
);
```

### Activity Logs Table
```sql
CREATE TABLE activity_logs (
  id INT PRIMARY KEY AUTO_INCREMENT,
  userId INT,
  action VARCHAR(100) NOT NULL,
  entityType VARCHAR(50),
  entityId INT,
  changes JSON,
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (userId) REFERENCES users(id),
  INDEX idx_user (userId),
  INDEX idx_timestamp (timestamp)
);
```

### Status History Table
```sql
CREATE TABLE status_history (
  id INT PRIMARY KEY AUTO_INCREMENT,
  listingId INT NOT NULL,
  previousStatus VARCHAR(50),
  newStatus VARCHAR(50) NOT NULL,
  reason VARCHAR(255),
  changedBy INT,
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (listingId) REFERENCES listings(id),
  FOREIGN KEY (changedBy) REFERENCES users(id),
  INDEX idx_listing (listingId),
  INDEX idx_timestamp (timestamp)
);
```

---

## Setup Instructions by Database Service

### PlanetScale Setup (MySQL)

#### Step 1: Create Account & Database

1. Go to https://planetscale.com
2. Sign up with GitHub
3. Click "Create a new database"
4. Name it: `premium-marketplace`
5. Select region closest to your users

#### Step 2: Get Connection String

1. Click your database
2. Click "Connect" button
3. Select "Node.js"
4. Copy the connection string

#### Step 3: Configure Locally

```bash
# Update .env.local
DATABASE_URL=mysql://[user]:[password]@[host]/premium-marketplace

# Test connection
pnpm drizzle-kit generate
pnpm drizzle-kit migrate

# Verify tables
pnpm drizzle-kit studio
```

#### Step 4: Deploy to Vercel

```bash
# Add to Vercel environment variables
DATABASE_URL=mysql://[user]:[password]@[host]/premium-marketplace

# Run migrations on production
DATABASE_URL=[prod-url] pnpm drizzle-kit migrate
```

#### Step 5: Manage via Drizzle Studio

```bash
# Open visual database manager
pnpm drizzle-kit studio

# Or use PlanetScale web console
# Go to your database > "Console" tab
```

---

### Neon Setup (PostgreSQL)

#### Step 1: Create Account & Project

1. Go to https://neon.tech
2. Sign up with GitHub
3. Create new project
4. Select PostgreSQL
5. Choose region

#### Step 2: Update Schema for PostgreSQL

Your current schema uses MySQL. For PostgreSQL:

```typescript
// drizzle/schema.ts
import {
  integer,
  text,
  timestamp,
  varchar,
  pgTable,      // Change from mysqlTable
  pgEnum        // Change from mysqlEnum
} from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: pgEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

// Update all other tables similarly
```

#### Step 3: Get Connection String

1. Go to your Neon project
2. Click "Connection String"
3. Copy the PostgreSQL URI

```
postgresql://[user]:[password]@[host]:5432/[database]
```

#### Step 4: Configure Locally

```bash
# Update .env.local
DATABASE_URL=postgresql://[user]:[password]@[host]:5432/[database]

# Generate migrations
pnpm drizzle-kit generate

# Run migrations
pnpm drizzle-kit migrate
```

#### Step 5: Deploy to Vercel

```bash
# Add to Vercel environment variables
DATABASE_URL=postgresql://[user]:[password]@[host]:5432/[database]

# Run migrations on production
DATABASE_URL=[prod-url] pnpm drizzle-kit migrate
```

---

### Supabase Setup (PostgreSQL + Real-time)

#### Step 1: Create Supabase Project

1. Go to https://supabase.com
2. Sign up with GitHub
3. Create new project
4. Choose region
5. Set database password

#### Step 2: Update Schema for PostgreSQL

Same as Neon setup above.

#### Step 3: Get Connection String

1. Go to project settings
2. Click "Database"
3. Copy "Connection string" (URI format)
4. Replace `[YOUR-PASSWORD]` with your password

#### Step 4: Configure Locally

```bash
# Update .env.local
DATABASE_URL=postgresql://postgres:[password]@[host]:5432/postgres

# Generate and run migrations
pnpm drizzle-kit generate
pnpm drizzle-kit migrate
```

#### Step 5: Use Supabase Features

Supabase provides additional features:

```typescript
// Real-time subscriptions
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

// Subscribe to listing changes
supabase
  .from("listings")
  .on("*", (payload) => {
    console.log("Change received!", payload);
  })
  .subscribe();
```

---

## Database Operations

### Create Tables

```bash
# Generate migration files
pnpm drizzle-kit generate

# Apply migrations
pnpm drizzle-kit migrate

# Or manually
mysql -u user -p -h host < migrations/0001_initial.sql
```

### Backup Database

#### PlanetScale Automatic Backups
- Automatic daily backups included
- Access via PlanetScale console
- Restore with one click

#### Manual Backup

```bash
# MySQL
mysqldump -u user -p -h host database_name > backup.sql

# PostgreSQL
pg_dump postgresql://user:password@host/database > backup.sql
```

### Restore Database

```bash
# MySQL
mysql -u user -p -h host database_name < backup.sql

# PostgreSQL
psql postgresql://user:password@host/database < backup.sql
```

### Optimize Tables

```sql
-- MySQL
OPTIMIZE TABLE listings;
OPTIMIZE TABLE inquiries;
OPTIMIZE TABLE activity_logs;

-- PostgreSQL
VACUUM ANALYZE listings;
VACUUM ANALYZE inquiries;
VACUUM ANALYZE activity_logs;
```

### Monitor Database Size

```sql
-- MySQL
SELECT 
  table_name,
  ROUND(((data_length + index_length) / 1024 / 1024), 2) AS size_mb
FROM information_schema.TABLES
WHERE table_schema = 'premium_marketplace'
ORDER BY size_mb DESC;

-- PostgreSQL
SELECT 
  schemaname,
  tablename,
  pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size
FROM pg_tables
WHERE schemaname != 'pg_catalog'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
```

---

## Performance Optimization

### Add Indexes

```sql
-- Search optimization
CREATE INDEX idx_listings_search ON listings(title, locationArea);
CREATE INDEX idx_listings_price ON listings(price);
CREATE INDEX idx_listings_created ON listings(createdAt DESC);

-- Inquiry pipeline
CREATE INDEX idx_inquiries_pipeline ON inquiries(status, createdAt);
CREATE INDEX idx_inquiries_user ON inquiries(assignedTo, status);

-- Activity tracking
CREATE INDEX idx_activity_user_time ON activity_logs(userId, timestamp DESC);
```

### Query Optimization

```typescript
// Bad: N+1 query problem
const listings = await db.select().from(listings);
for (const listing of listings) {
  const inquiries = await db.select().from(inquiries)
    .where(eq(inquiries.listingId, listing.id));
}

// Good: Single query with join
const listingsWithInquiries = await db
  .select()
  .from(listings)
  .leftJoin(inquiries, eq(listings.id, inquiries.listingId));
```

### Pagination

```typescript
// Always paginate large datasets
const page = 1;
const pageSize = 20;

const results = await db
  .select()
  .from(listings)
  .limit(pageSize)
  .offset((page - 1) * pageSize);
```

---

## Monitoring & Alerts

### PlanetScale Monitoring

1. Go to your database
2. Click "Insights" tab
3. View:
   - Query performance
   - Slow queries
   - Connection count
   - Storage usage

### Set Up Alerts

```bash
# Monitor database size
# Alert if > 80% of quota

# Monitor connections
# Alert if > 100 concurrent connections

# Monitor slow queries
# Alert if query takes > 5 seconds
```

---

## Troubleshooting

### Connection Refused

```
Error: connect ECONNREFUSED
```

**Solution**:
1. Verify DATABASE_URL is correct
2. Check database is running
3. Verify IP whitelisting (for cloud databases)
4. Test with: `mysql -u user -p -h host -e "SELECT 1"`

### Authentication Failed

```
Error: ER_ACCESS_DENIED_FOR_USER
```

**Solution**:
1. Verify username and password
2. Check database user has correct permissions
3. Reset password in database console

### Table Not Found

```
Error: Table 'database.listings' doesn't exist
```

**Solution**:
1. Run migrations: `pnpm drizzle-kit migrate`
2. Verify migrations ran successfully
3. Check table exists: `SHOW TABLES;`

### Slow Queries

**Solution**:
1. Add indexes to frequently queried columns
2. Use pagination for large result sets
3. Optimize JOIN queries
4. Check query execution plan: `EXPLAIN SELECT ...`

---

## Database Maintenance Checklist

### Weekly
- [ ] Check database size
- [ ] Review slow query logs
- [ ] Verify backups completed
- [ ] Monitor connection count

### Monthly
- [ ] Optimize tables
- [ ] Analyze query performance
- [ ] Update statistics
- [ ] Review and add indexes

### Quarterly
- [ ] Full backup test
- [ ] Disaster recovery drill
- [ ] Update database version
- [ ] Review security settings

---

## Connection String Reference

### MySQL (PlanetScale)
```
mysql://[username]:[password]@[host]/[database]
```

### PostgreSQL (Neon, Supabase)
```
postgresql://[username]:[password]@[host]:5432/[database]
```

### AWS RDS
```
mysql://[username]:[password]@[endpoint]:3306/[database]
```

---

## Next Steps

1. **Choose your database** - Pick from PlanetScale, Neon, or Supabase
2. **Set up locally** - Test migrations and connections
3. **Deploy to Vercel** - Follow VERCEL_DEPLOYMENT.md
4. **Monitor performance** - Set up alerts and monitoring
5. **Plan scaling** - Prepare for growth

---

**Last Updated**: March 2026
**Version**: 1.0.0
