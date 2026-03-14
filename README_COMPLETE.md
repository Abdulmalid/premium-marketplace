# Premium Property & Auto Marketplace - Complete Setup Guide

Welcome to your Premium Property & Auto Marketplace! This is a production-ready full-stack application for listing and selling properties and vehicles.

## 📋 What's Included

This package contains:

- **Complete React + TypeScript Frontend** - Modern UI with Tailwind CSS
- **Express.js + tRPC Backend** - Type-safe API with real-time features
- **MySQL Database Schema** - Optimized for real estate/vehicle listings
- **Admin Dashboard** - Manage listings, inquiries, and analytics
- **Public Website** - Browse listings, make inquiries, WhatsApp integration
- **Comprehensive Documentation** - Setup guides for all deployment options

## 🚀 Quick Start (Choose Your Path)

### Path 1: Local Development (5 minutes)

```bash
# Extract the archive
tar -xzf premium-marketplace-vps.tar.gz
cd premium-marketplace

# Install dependencies
pnpm install

# Create environment file
cp .env.example .env.local

# Edit .env.local with your database credentials
nano .env.local

# Run migrations
pnpm drizzle-kit migrate

# Start development server
pnpm dev

# Visit http://localhost:3000
```

### Path 2: Deploy to Vercel (30 minutes)

**Best for**: Quick cloud deployment with automatic scaling

1. Read: `VERCEL_QUICK_DEPLOY.md`
2. Follow the 6-step guide
3. Your app is live in 30 minutes

### Path 3: Deploy to Your VPS (1-2 hours)

**Best for**: Full control, custom domain, lower costs

1. Read: `VPS_DEPLOYMENT.md`
2. Follow step-by-step instructions
3. Your app runs on your own server

### Path 4: Docker Deployment (45 minutes)

**Best for**: Containerized deployment, easy scaling

```bash
# Build Docker image
docker build -t premium-marketplace .

# Run container
docker run -p 3000:3000 \
  -e DATABASE_URL=your-database-url \
  -e JWT_SECRET=your-secret \
  premium-marketplace
```

## 📚 Documentation Guide

### For First-Time Setup
- **START HERE**: `QUICK_START.md` - 5-minute overview
- **THEN READ**: `DEPLOYMENT_GUIDE.md` - Detailed setup instructions

### For Database Setup
- `DATABASE_SETUP.md` - Database configuration and management
- Includes PlanetScale, Neon, Supabase, AWS RDS options

### For Specific Deployment
- `VERCEL_DEPLOYMENT.md` - Complete Vercel guide
- `VERCEL_QUICK_DEPLOY.md` - 30-minute quick start
- `VPS_DEPLOYMENT.md` - Self-hosted VPS guide

### For Development
- `DEPLOYMENT_GUIDE.md` - Full technical documentation
- Schema in `drizzle/schema.ts`
- API routes in `server/routers.ts`
- Components in `client/src/components/`

## 🏗️ Project Structure

```
premium-marketplace/
├── client/                    # React frontend
│   ├── src/
│   │   ├── pages/            # Page components
│   │   ├── components/       # Reusable components
│   │   ├── hooks/            # Custom React hooks
│   │   ├── lib/              # Utilities and helpers
│   │   └── App.tsx           # Main app component
│   ├── index.html            # HTML entry point
│   └── src/index.css         # Global styles
├── server/                    # Express backend
│   ├── routers.ts            # tRPC procedures
│   ├── db.ts                 # Database queries
│   ├── _core/                # Core infrastructure
│   └── storage.ts            # S3 file storage
├── drizzle/                   # Database schema
│   └── schema.ts             # Table definitions
├── shared/                    # Shared types
├── package.json              # Dependencies
└── Documentation/
    ├── QUICK_START.md
    ├── DEPLOYMENT_GUIDE.md
    ├── DATABASE_SETUP.md
    ├── VERCEL_DEPLOYMENT.md
    ├── VERCEL_QUICK_DEPLOY.md
    └── VPS_DEPLOYMENT.md
```

## 🔑 Key Features

### Public Website
- ✅ Landing page with hero section and search
- ✅ Advanced listing filters (category, price, location)
- ✅ Listing detail pages with image gallery
- ✅ WhatsApp inquiry integration
- ✅ View tracking and analytics
- ✅ Responsive mobile design

### Admin Dashboard
- ✅ Role-based access control (admin, editor, viewer)
- ✅ Dashboard analytics with key metrics
- ✅ Inventory management with bulk actions
- ✅ Multi-step listing creation wizard
- ✅ Image uploader with drag-and-drop
- ✅ Leads management with status pipeline
- ✅ Real-time activity feed
- ✅ Settings and configuration

### Technical Features
- ✅ Type-safe API with tRPC
- ✅ Real-time subscriptions (Supabase)
- ✅ OAuth authentication
- ✅ Row-level security (RLS)
- ✅ NGN currency formatting
- ✅ Activity logging and audit trail
- ✅ S3 file storage integration
- ✅ Email notifications

## 🛠️ Technology Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 19, TypeScript, Tailwind CSS 4 |
| **Backend** | Express.js, tRPC 11, Node.js |
| **Database** | MySQL (Drizzle ORM) |
| **Authentication** | Manus OAuth |
| **Real-time** | Supabase subscriptions |
| **Storage** | AWS S3 |
| **Deployment** | Vercel, Docker, VPS |

## 📦 Installation

### Prerequisites

- Node.js 18+ ([Download](https://nodejs.org))
- pnpm ([Install](https://pnpm.io/installation))
- Git ([Download](https://git-scm.com))
- Database account (PlanetScale, Neon, or local MySQL)

### Step 1: Extract Archive

```bash
tar -xzf premium-marketplace-vps.tar.gz
cd premium-marketplace
```

### Step 2: Install Dependencies

```bash
pnpm install
```

### Step 3: Configure Environment

```bash
# Copy example file
cp .env.example .env.local

# Edit with your values
nano .env.local
```

Required environment variables:
```env
DATABASE_URL=mysql://user:password@host/database
JWT_SECRET=your-secret-key
VITE_APP_ID=your-app-id
OAUTH_SERVER_URL=https://api.manus.im
VITE_OAUTH_PORTAL_URL=https://portal.manus.im
OWNER_NAME=Your Business Name
OWNER_OPEN_ID=your-owner-id
VITE_APP_TITLE=Premium Marketplace
VITE_APP_LOGO=https://your-logo-url.com/logo.png
```

### Step 4: Setup Database

```bash
# Generate migrations
pnpm drizzle-kit generate

# Run migrations
pnpm drizzle-kit migrate

# Verify tables created
pnpm drizzle-kit studio
```

### Step 5: Start Development

```bash
# Development mode
pnpm dev

# Production build
pnpm build

# Production start
pnpm start
```

## 🚀 Deployment Options

### Quick Comparison

| Option | Time | Cost | Control | Best For |
|--------|------|------|---------|----------|
| **Vercel** | 30 min | Free tier | Low | Quick launch |
| **VPS** | 2 hours | $5-60/mo | High | Full control |
| **Docker** | 45 min | Variable | High | Scaling |
| **Manus** | 5 min | Included | Medium | Integrated |

### Recommended Path

1. **Start**: Local development with `pnpm dev`
2. **Test**: Use Vercel for free testing
3. **Scale**: Move to VPS or Docker for production

## 📖 Common Tasks

### Add a New Listing

1. Go to `/admin`
2. Click "Add Listing"
3. Follow 5-step wizard:
   - Select category (Real Estate, Vehicle, etc.)
   - Enter details (title, description, price)
   - Upload images
   - Add location
   - Review and publish

### Manage Inquiries

1. Go to `/admin/leads`
2. View inquiries in pipeline
3. Assign to team members
4. Update status and add notes
5. Send WhatsApp messages

### Configure Settings

1. Go to `/admin/settings`
2. Update business information
3. Configure notification preferences
4. Manage team members

### Monitor Analytics

1. Go to `/admin`
2. View dashboard cards:
   - Total listings
   - Active/sold/pending counts
   - Recent inquiries
   - Activity feed

## 🔐 Security

### Built-in Security Features

- ✅ HTTP-only session cookies
- ✅ CSRF protection
- ✅ Role-based access control
- ✅ Row-level security (RLS)
- ✅ Input validation with Zod
- ✅ SQL injection prevention
- ✅ XSS protection

### Security Best Practices

1. **Keep secrets secure** - Never commit `.env.local`
2. **Use strong passwords** - Generate with `openssl rand -base64 32`
3. **Enable HTTPS** - Use Let's Encrypt (free)
4. **Regular backups** - Automate daily backups
5. **Monitor logs** - Check activity feed regularly
6. **Update dependencies** - Run `pnpm update` monthly
7. **Limit access** - Use role-based permissions

## 🐛 Troubleshooting

### Build Fails

```bash
# Clear cache and rebuild
rm -rf dist node_modules/.vite
pnpm install
pnpm build
```

### Database Connection Error

```bash
# Test connection
mysql -u user -p -h host -e "SELECT 1;"

# Check environment variables
cat .env.local | grep DATABASE_URL
```

### Port Already in Use

```bash
# Find process using port 3000
lsof -i :3000

# Kill the process
kill -9 <PID>

# Or use different port
PORT=3001 pnpm dev
```

### Images Not Uploading

```bash
# Check S3 credentials
echo $AWS_ACCESS_KEY_ID
echo $AWS_SECRET_ACCESS_KEY

# Verify bucket exists
aws s3 ls s3://your-bucket-name/
```

## 📞 Support & Resources

### Documentation
- [React Documentation](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [tRPC Documentation](https://trpc.io/docs)
- [Drizzle ORM](https://orm.drizzle.team/docs)

### Database Services
- [PlanetScale](https://planetscale.com/docs)
- [Neon](https://neon.tech/docs)
- [Supabase](https://supabase.com/docs)
- [AWS RDS](https://docs.aws.amazon.com/rds/)

### Deployment
- [Vercel Docs](https://vercel.com/docs)
- [Docker Docs](https://docs.docker.com)
- [Nginx Docs](https://nginx.org/en/docs/)
- [Ubuntu Server](https://ubuntu.com/server/docs)

### Community
- GitHub Issues: [Report bugs](https://github.com)
- Stack Overflow: [Ask questions](https://stackoverflow.com)
- Discord: [Join community](https://discord.com)

## 📝 License

This project is provided as-is for your use.

## 🎯 Next Steps

### Immediate (Today)
1. ✅ Extract and explore the project
2. ✅ Read `QUICK_START.md`
3. ✅ Set up local development environment
4. ✅ Create first test listing

### Short Term (This Week)
1. ✅ Configure your database
2. ✅ Customize branding (logo, colors, name)
3. ✅ Add your first 5-10 listings
4. ✅ Test admin dashboard
5. ✅ Test WhatsApp integration

### Medium Term (This Month)
1. ✅ Deploy to Vercel or VPS
2. ✅ Configure custom domain
3. ✅ Set up SSL certificate
4. ✅ Enable analytics
5. ✅ Invite team members

### Long Term (Ongoing)
1. ✅ Monitor analytics
2. ✅ Respond to inquiries
3. ✅ Add more listings
4. ✅ Optimize based on data
5. ✅ Plan feature additions

## 🎓 Learning Resources

### Getting Started
- Watch: [React Basics](https://react.dev/learn)
- Read: [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- Practice: Build components in `client/src/components/`

### Backend Development
- Learn: [tRPC Basics](https://trpc.io/docs/quickstart)
- Explore: `server/routers.ts` for API examples
- Extend: Add new procedures for custom features

### Database
- Study: `drizzle/schema.ts` for table structure
- Practice: Write queries in `server/db.ts`
- Optimize: Add indexes for performance

### Deployment
- Follow: `VPS_DEPLOYMENT.md` for self-hosting
- Try: `VERCEL_QUICK_DEPLOY.md` for cloud deployment
- Monitor: Check logs and analytics regularly

## ✨ Tips for Success

1. **Start small** - Get one feature working perfectly before adding more
2. **Test thoroughly** - Test all pages and features before deploying
3. **Monitor performance** - Check analytics and logs regularly
4. **Backup regularly** - Automate daily database backups
5. **Keep it secure** - Follow security best practices
6. **Document changes** - Keep track of customizations
7. **Stay updated** - Update dependencies monthly
8. **Get feedback** - Ask users for feature requests

## 🎉 You're Ready!

Your Premium Marketplace is ready to launch. Choose your deployment path and get started:

- **Local Dev**: `pnpm dev` and start building
- **Vercel**: Follow `VERCEL_QUICK_DEPLOY.md` (30 min)
- **VPS**: Follow `VPS_DEPLOYMENT.md` (2 hours)
- **Manus**: Use built-in hosting (5 min)

**Questions?** Check the documentation files or review the code comments.

**Happy building!** 🚀

---

**Last Updated**: March 2026
**Version**: 1.0.0
**Status**: Production Ready
