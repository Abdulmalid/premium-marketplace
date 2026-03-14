#!/bin/bash

# Premium Marketplace - VPS Setup Script
# This script sets up the marketplace on your VPS

set -e

echo "================================"
echo "Premium Marketplace VPS Setup"
echo "================================"
echo ""

# Check Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed"
    echo "Install Node.js 18+ from https://nodejs.org"
    exit 1
fi

echo "✅ Node.js $(node --version) found"

# Check pnpm
if ! command -v pnpm &> /dev/null; then
    echo "📦 Installing pnpm..."
    npm install -g pnpm
fi

echo "✅ pnpm $(pnpm --version) found"

# Install dependencies
echo ""
echo "📦 Installing dependencies..."
pnpm install

# Generate environment file
echo ""
echo "🔧 Creating .env.local template..."
if [ ! -f .env.local ]; then
    cat > .env.local << 'ENVFILE'
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
VITE_FRONTEND_FORGE_API_KEY=your-frontend-key
VITE_FRONTEND_FORGE_API_URL=https://api.manus.im

# App Configuration
VITE_APP_TITLE=Premium Marketplace
VITE_APP_LOGO=https://cdn.example.com/logo.png
ENVFILE
    echo "✅ Created .env.local - Please update with your values"
else
    echo "✅ .env.local already exists"
fi

# Build the project
echo ""
echo "🔨 Building project..."
pnpm build

echo ""
echo "================================"
echo "✅ Setup Complete!"
echo "================================"
echo ""
echo "Next steps:"
echo "1. Update .env.local with your database and API credentials"
echo "2. Run migrations: pnpm drizzle-kit migrate"
echo "3. Start development: pnpm dev"
echo "4. For production: pnpm start"
echo ""
echo "Documentation:"
echo "- QUICK_START.md - Quick setup guide"
echo "- DEPLOYMENT_GUIDE.md - Full deployment instructions"
echo "- VERCEL_QUICK_DEPLOY.md - Vercel deployment guide"
echo "- DATABASE_SETUP.md - Database management"
echo ""
