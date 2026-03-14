# Download & Installation Instructions

Complete guide to download and set up your Premium Marketplace on your VPS.

## 📥 Download Options

### Option 1: Download from Manus Dashboard (Recommended)

1. Log in to your Manus account
2. Go to your "premium-marketplace" project
3. Click "Code" in the Management UI
4. Click "Download all files"
5. Extract the archive on your local machine

### Option 2: Download via GitHub

```bash
# Clone the repository
git clone https://github.com/yourusername/premium-marketplace.git
cd premium-marketplace
```

### Option 3: Download Archive File

The complete package is available as: `premium-marketplace-complete-package.tar.gz`

**Size**: ~236 KB (without node_modules)
**Includes**: All source code, configuration, and documentation

## 🖥️ Upload to VPS

### Using SCP (Secure Copy)

```bash
# From your local machine
scp premium-marketplace-complete-package.tar.gz root@your-vps-ip:/home/ubuntu/

# Or with specific user
scp premium-marketplace-complete-package.tar.gz ubuntu@your-vps-ip:/home/ubuntu/
```

### Using rsync (Faster for Large Files)

```bash
# From your local machine
rsync -avz --progress premium-marketplace/ root@your-vps-ip:/home/ubuntu/premium-marketplace/
```

### Using SFTP

```bash
# Connect to VPS
sftp root@your-vps-ip

# Upload file
put premium-marketplace-complete-package.tar.gz /home/ubuntu/

# Exit
exit
```

## 📦 Extract on VPS

### Step 1: Connect to VPS

```bash
# SSH into your VPS
ssh root@your-vps-ip

# Or with specific user
ssh ubuntu@your-vps-ip

# Navigate to home directory
cd /home/ubuntu
```

### Step 2: Extract Archive

```bash
# Extract the compressed archive
tar -xzf premium-marketplace-complete-package.tar.gz

# Verify extraction
ls -la premium-marketplace/

# Navigate to project
cd premium-marketplace
```

### Step 3: Verify Files

```bash
# Check main directories
ls -la

# Should see:
# - client/          (React frontend)
# - server/          (Express backend)
# - drizzle/         (Database schema)
# - shared/          (Shared types)
# - package.json     (Dependencies)
# - Documentation files (*.md)

# Check documentation
ls -la *.md
```

## ⚙️ Quick Setup

### Step 1: Install Node.js (If Not Already Installed)

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Verify
node --version
npm --version
```

### Step 2: Install pnpm

```bash
# Install pnpm globally
npm install -g pnpm

# Verify
pnpm --version
```

### Step 3: Install Dependencies

```bash
# Navigate to project
cd /home/ubuntu/premium-marketplace

# Install all dependencies
pnpm install

# This will take 2-5 minutes
```

### Step 4: Configure Environment

```bash
# Create environment file
nano .env.local

# Add your configuration:
# DATABASE_URL=your-database-url
# JWT_SECRET=your-secret-key
# ... (see .env.example for all variables)

# Save: Ctrl+X, Y, Enter
```

### Step 5: Setup Database

```bash
# Generate migrations
pnpm drizzle-kit generate

# Run migrations
pnpm drizzle-kit migrate

# Verify tables
pnpm drizzle-kit studio
```

### Step 6: Start Application

```bash
# Development mode
pnpm dev

# Or production mode
pnpm build
pnpm start
```

## 📋 File Checklist

After extraction, verify you have these key files:

### Documentation
- [ ] `README_COMPLETE.md` - Master guide
- [ ] `QUICK_START.md` - 5-minute setup
- [ ] `DEPLOYMENT_GUIDE.md` - Full deployment
- [ ] `DATABASE_SETUP.md` - Database configuration
- [ ] `VERCEL_DEPLOYMENT.md` - Vercel guide
- [ ] `VERCEL_QUICK_DEPLOY.md` - 30-minute Vercel
- [ ] `VPS_DEPLOYMENT.md` - VPS self-hosting
- [ ] `VPS_SETUP.sh` - Automated setup script

### Source Code
- [ ] `client/` - React frontend
- [ ] `server/` - Express backend
- [ ] `drizzle/` - Database schema
- [ ] `shared/` - Shared types
- [ ] `package.json` - Dependencies

### Configuration
- [ ] `.env.example` - Environment template
- [ ] `.gitignore` - Git ignore rules
- [ ] `vercel.json` - Vercel config
- [ ] `tsconfig.json` - TypeScript config
- [ ] `tailwind.config.js` - Tailwind config

## 🚀 Next Steps

### Choose Your Deployment Path

#### Path 1: Local Development
```bash
cd /home/ubuntu/premium-marketplace
pnpm dev
# Visit http://localhost:3000
```

#### Path 2: VPS Deployment
```bash
# Follow VPS_DEPLOYMENT.md
# 1-2 hours to full production setup
```

#### Path 3: Vercel Deployment
```bash
# Follow VERCEL_QUICK_DEPLOY.md
# 30 minutes to live on the internet
```

#### Path 4: Docker Deployment
```bash
docker build -t marketplace .
docker run -p 3000:3000 marketplace
```

## 📚 Documentation Reading Order

1. **First**: `README_COMPLETE.md` - Overview
2. **Then**: `QUICK_START.md` - Basic setup
3. **Choose Path**:
   - Local: `DEPLOYMENT_GUIDE.md`
   - VPS: `VPS_DEPLOYMENT.md`
   - Vercel: `VERCEL_QUICK_DEPLOY.md`
   - Database: `DATABASE_SETUP.md`

## 🔧 Troubleshooting

### Archive Won't Extract

```bash
# Check if file is corrupted
tar -tzf premium-marketplace-complete-package.tar.gz > /dev/null

# Try extracting with verbose output
tar -xzvf premium-marketplace-complete-package.tar.gz

# If still fails, re-download the file
```

### Permission Denied

```bash
# Fix permissions
sudo chown -R ubuntu:ubuntu /home/ubuntu/premium-marketplace
chmod -R 755 /home/ubuntu/premium-marketplace
```

### pnpm Not Found

```bash
# Install pnpm
npm install -g pnpm

# Or use npm instead
npm install
npm run dev
```

### Node Modules Too Large

```bash
# Don't include node_modules in archive
# They will be installed with: pnpm install

# If included by mistake, remove them
rm -rf node_modules
pnpm install
```

## 💾 Backup & Version Control

### Create Git Repository

```bash
# Initialize git
git init

# Add all files
git add .

# Create initial commit
git commit -m "Initial commit: Premium Marketplace"

# Add remote (if using GitHub)
git remote add origin https://github.com/yourusername/premium-marketplace.git
git push -u origin main
```

### Backup Important Files

```bash
# Backup environment file
cp .env.local .env.local.backup

# Backup database
mysqldump -u user -p database > database_backup.sql

# Create archive
tar -czf marketplace_backup.tar.gz /home/ubuntu/premium-marketplace/
```

## 📱 System Requirements

### Minimum
- CPU: 1 core
- RAM: 512 MB
- Storage: 5 GB
- Bandwidth: 100 GB/month

### Recommended
- CPU: 2-4 cores
- RAM: 2-4 GB
- Storage: 20-50 GB
- Bandwidth: Unlimited

### Production
- CPU: 4+ cores
- RAM: 8+ GB
- Storage: 100+ GB
- Bandwidth: Unlimited

## 🌐 Network Configuration

### Firewall Rules

```bash
# Allow SSH
sudo ufw allow 22

# Allow HTTP
sudo ufw allow 80

# Allow HTTPS
sudo ufw allow 443

# Enable firewall
sudo ufw enable
```

### Port Forwarding (If Behind NAT)

```bash
# Forward port 80 to 3000
sudo iptables -t nat -A PREROUTING -p tcp --dport 80 -j REDIRECT --to-port 3000

# Make persistent
sudo apt install iptables-persistent
sudo netfilter-persistent save
```

## ✅ Verification Checklist

After setup, verify:

- [ ] Files extracted successfully
- [ ] Node.js and pnpm installed
- [ ] Dependencies installed (`pnpm install`)
- [ ] Environment file created (`.env.local`)
- [ ] Database connected
- [ ] Migrations ran successfully
- [ ] Application starts (`pnpm dev`)
- [ ] Can access http://localhost:3000
- [ ] Admin panel works (`/admin`)
- [ ] Can create test listing

## 🎯 Common Commands

```bash
# Navigate to project
cd /home/ubuntu/premium-marketplace

# Install dependencies
pnpm install

# Start development
pnpm dev

# Build for production
pnpm build

# Start production
pnpm start

# Run migrations
pnpm drizzle-kit migrate

# View database
pnpm drizzle-kit studio

# Type check
pnpm check

# Format code
pnpm format

# Run tests
pnpm test
```

## 📞 Support

If you encounter issues:

1. Check the relevant documentation file
2. Review error messages carefully
3. Check logs: `tail -f /var/log/marketplace.log`
4. Verify environment variables: `cat .env.local`
5. Test database: `mysql -u user -p -e "SELECT 1;"`

## 🎓 Learning Resources

- [Node.js Documentation](https://nodejs.org/docs/)
- [React Documentation](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Express.js Guide](https://expressjs.com/en/starter/basic-routing.html)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)

## 🚀 You're Ready!

Your Premium Marketplace is ready to deploy. Follow the documentation for your chosen deployment path and get your marketplace live!

**Questions?** Check the documentation files included in the package.

**Happy deploying!** 🎉

---

**Last Updated**: March 2026
**Version**: 1.0.0
