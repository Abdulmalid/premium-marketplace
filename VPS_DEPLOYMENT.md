# VPS Deployment Guide - Premium Marketplace

Complete guide to deploy the Premium Marketplace on your own VPS (Virtual Private Server).

## Table of Contents

1. [VPS Requirements](#vps-requirements)
2. [Download & Extract Project](#download--extract-project)
3. [Install Dependencies](#install-dependencies)
4. [Configure Database](#configure-database)
5. [Setup Environment Variables](#setup-environment-variables)
6. [Run Migrations](#run-migrations)
7. [Build & Deploy](#build--deploy)
8. [Configure Reverse Proxy](#configure-reverse-proxy)
9. [Setup SSL Certificate](#setup-ssl-certificate)
10. [Monitor & Maintain](#monitor--maintain)

---

## VPS Requirements

### Recommended Specifications

- **OS**: Ubuntu 20.04 LTS or newer
- **CPU**: 2 cores minimum (4+ recommended)
- **RAM**: 2GB minimum (4GB+ recommended)
- **Storage**: 20GB minimum (50GB+ recommended)
- **Bandwidth**: Unlimited or 1TB+ monthly

### Supported VPS Providers

- DigitalOcean
- Linode
- Vultr
- AWS EC2
- Google Cloud
- Azure
- Hetzner

### Cost Estimate

- Basic (2GB RAM, 2 cores): $5-10/month
- Standard (4GB RAM, 4 cores): $15-25/month
- Production (8GB RAM, 8 cores): $40-60/month

---

## Download & Extract Project

### Step 1: Download Archive

```bash
# On your local machine, download the archive
# From Manus dashboard or GitHub releases

# Or clone from GitHub
git clone https://github.com/yourusername/premium-marketplace.git
cd premium-marketplace
```

### Step 2: Upload to VPS

```bash
# Using SCP
scp -r premium-marketplace/ root@your-vps-ip:/home/ubuntu/

# Or using rsync (faster for large files)
rsync -avz --exclude=node_modules --exclude=.git premium-marketplace/ root@your-vps-ip:/home/ubuntu/premium-marketplace/
```

### Step 3: Connect to VPS

```bash
# SSH into your VPS
ssh root@your-vps-ip

# Or with specific user
ssh ubuntu@your-vps-ip

# Navigate to project
cd /home/ubuntu/premium-marketplace
```

---

## Install Dependencies

### Step 1: Update System

```bash
# Update package manager
sudo apt update && sudo apt upgrade -y

# Install required packages
sudo apt install -y curl wget git build-essential
```

### Step 2: Install Node.js

```bash
# Using NodeSource repository (recommended)
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Verify installation
node --version
npm --version
```

### Step 3: Install pnpm

```bash
# Install pnpm globally
npm install -g pnpm

# Verify
pnpm --version
```

### Step 4: Install Project Dependencies

```bash
# Navigate to project directory
cd /home/ubuntu/premium-marketplace

# Install all dependencies
pnpm install

# This will take 2-5 minutes
```

---

## Configure Database

### Option 1: MySQL on VPS (Local Database)

#### Install MySQL Server

```bash
# Install MySQL
sudo apt install -y mysql-server

# Secure installation
sudo mysql_secure_installation

# Start MySQL
sudo systemctl start mysql
sudo systemctl enable mysql
```

#### Create Database & User

```bash
# Login to MySQL
sudo mysql -u root -p

# Create database
CREATE DATABASE premium_marketplace;

# Create user
CREATE USER 'marketplace'@'localhost' IDENTIFIED BY 'your-secure-password';

# Grant privileges
GRANT ALL PRIVILEGES ON premium_marketplace.* TO 'marketplace'@'localhost';
FLUSH PRIVILEGES;

# Exit
EXIT;
```

#### Get Connection String

```
mysql://marketplace:your-secure-password@localhost:3306/premium_marketplace
```

### Option 2: Remote Database (PlanetScale/Neon)

#### PlanetScale

1. Go to https://planetscale.com
2. Create database: `premium-marketplace`
3. Get connection string from "Connect" button
4. Use in .env.local

#### Neon

1. Go to https://neon.tech
2. Create PostgreSQL project
3. Copy connection string
4. Update schema for PostgreSQL (see DATABASE_SETUP.md)

### Option 3: AWS RDS

1. Create RDS instance in AWS Console
2. Configure security groups to allow VPS IP
3. Get endpoint and credentials
4. Use in .env.local

---

## Setup Environment Variables

### Step 1: Create .env.local

```bash
# Navigate to project
cd /home/ubuntu/premium-marketplace

# Create environment file
nano .env.local
```

### Step 2: Add Configuration

```env
# Database
DATABASE_URL=mysql://marketplace:your-secure-password@localhost:3306/premium_marketplace

# Authentication
JWT_SECRET=generate-with-openssl-rand-base64-32
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
VITE_APP_LOGO=https://your-cdn-url.com/logo.png

# Server
NODE_ENV=production
PORT=3000
```

### Step 3: Generate JWT_SECRET

```bash
# Generate a secure random string
openssl rand -base64 32

# Copy the output and paste into .env.local
```

### Step 4: Save File

```bash
# In nano editor:
# Press Ctrl+X
# Press Y to confirm
# Press Enter to save
```

---

## Run Migrations

### Step 1: Generate Migrations

```bash
# Generate migration files
pnpm drizzle-kit generate
```

### Step 2: Run Migrations

```bash
# Apply migrations to database
pnpm drizzle-kit migrate
```

### Step 3: Verify Tables

```bash
# Connect to MySQL
mysql -u marketplace -p premium_marketplace

# List tables
SHOW TABLES;

# Check table structure
DESCRIBE listings;

# Exit
EXIT;
```

---

## Build & Deploy

### Step 1: Build Project

```bash
# Build for production
pnpm build

# This creates a 'dist' folder with optimized code
```

### Step 2: Start Application

#### Option A: Direct Start

```bash
# Start the application
pnpm start

# Application runs on http://localhost:3000
# Press Ctrl+C to stop
```

#### Option B: Using PM2 (Recommended for Production)

```bash
# Install PM2 globally
npm install -g pm2

# Start application with PM2
pm2 start "pnpm start" --name "marketplace"

# View logs
pm2 logs marketplace

# Restart on reboot
pm2 startup
pm2 save

# Monitor
pm2 monit
```

#### Option C: Using systemd Service

```bash
# Create service file
sudo nano /etc/systemd/system/marketplace.service
```

Add this content:

```ini
[Unit]
Description=Premium Marketplace
After=network.target

[Service]
Type=simple
User=ubuntu
WorkingDirectory=/home/ubuntu/premium-marketplace
ExecStart=/usr/bin/pnpm start
Restart=always
RestartSec=10
StandardOutput=journal
StandardError=journal

[Install]
WantedBy=multi-user.target
```

Then:

```bash
# Enable and start service
sudo systemctl daemon-reload
sudo systemctl enable marketplace
sudo systemctl start marketplace

# Check status
sudo systemctl status marketplace

# View logs
sudo journalctl -u marketplace -f
```

### Step 3: Test Application

```bash
# Check if running
curl http://localhost:3000

# Should return HTML content
```

---

## Configure Reverse Proxy

### Using Nginx (Recommended)

#### Step 1: Install Nginx

```bash
sudo apt install -y nginx
```

#### Step 2: Create Nginx Configuration

```bash
# Create config file
sudo nano /etc/nginx/sites-available/marketplace
```

Add this content:

```nginx
upstream marketplace {
    server localhost:3000;
}

server {
    listen 80;
    server_name your-domain.com www.your-domain.com;

    client_max_body_size 50M;

    location / {
        proxy_pass http://marketplace;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

#### Step 3: Enable Configuration

```bash
# Create symlink
sudo ln -s /etc/nginx/sites-available/marketplace /etc/nginx/sites-enabled/

# Test configuration
sudo nginx -t

# Restart Nginx
sudo systemctl restart nginx
```

### Using Apache

```bash
# Install Apache
sudo apt install -y apache2

# Enable required modules
sudo a2enmod proxy
sudo a2enmod proxy_http
sudo a2enmod rewrite

# Create virtual host
sudo nano /etc/apache2/sites-available/marketplace.conf
```

Add:

```apache
<VirtualHost *:80>
    ServerName your-domain.com
    ServerAlias www.your-domain.com

    ProxyPreserveHost On
    ProxyPass / http://localhost:3000/
    ProxyPassReverse / http://localhost:3000/

    ErrorLog ${APACHE_LOG_DIR}/marketplace-error.log
    CustomLog ${APACHE_LOG_DIR}/marketplace-access.log combined
</VirtualHost>
```

Then:

```bash
# Enable site
sudo a2ensite marketplace

# Test configuration
sudo apache2ctl configtest

# Restart Apache
sudo systemctl restart apache2
```

---

## Setup SSL Certificate

### Using Let's Encrypt (Free)

#### Step 1: Install Certbot

```bash
# For Nginx
sudo apt install -y certbot python3-certbot-nginx

# For Apache
sudo apt install -y certbot python3-certbot-apache
```

#### Step 2: Obtain Certificate

```bash
# For Nginx
sudo certbot --nginx -d your-domain.com -d www.your-domain.com

# For Apache
sudo certbot --apache -d your-domain.com -d www.your-domain.com
```

#### Step 3: Auto-Renewal

```bash
# Enable auto-renewal
sudo systemctl enable certbot.timer
sudo systemctl start certbot.timer

# Test renewal
sudo certbot renew --dry-run
```

### Manual SSL Setup

```bash
# If you have your own certificate
sudo cp your-cert.crt /etc/ssl/certs/
sudo cp your-key.key /etc/ssl/private/

# Update Nginx/Apache config to use certificate
```

---

## Monitor & Maintain

### Monitor Application

```bash
# Check if running
sudo systemctl status marketplace

# View logs
sudo journalctl -u marketplace -f

# Check memory usage
free -h

# Check disk usage
df -h

# Check CPU usage
top
```

### Setup Log Rotation

```bash
# Create logrotate config
sudo nano /etc/logrotate.d/marketplace
```

Add:

```
/var/log/marketplace/*.log {
    daily
    rotate 14
    compress
    delaycompress
    notifempty
    create 0640 ubuntu ubuntu
    sharedscripts
}
```

### Backup Database

```bash
# Daily backup script
sudo nano /usr/local/bin/backup-marketplace.sh
```

Add:

```bash
#!/bin/bash
BACKUP_DIR="/home/ubuntu/backups"
mkdir -p $BACKUP_DIR
DATE=$(date +%Y%m%d_%H%M%S)

mysqldump -u marketplace -p'your-password' premium_marketplace > \
  $BACKUP_DIR/marketplace_$DATE.sql

# Keep only last 30 days
find $BACKUP_DIR -name "marketplace_*.sql" -mtime +30 -delete
```

Make executable:

```bash
sudo chmod +x /usr/local/bin/backup-marketplace.sh

# Add to crontab for daily backups
sudo crontab -e

# Add this line:
0 2 * * * /usr/local/bin/backup-marketplace.sh
```

### Monitor Disk Space

```bash
# Check disk usage
df -h

# Find large directories
du -sh /home/ubuntu/premium-marketplace/*

# Clean up old logs
sudo journalctl --vacuum=30d
```

### Update Dependencies

```bash
# Check for updates
pnpm outdated

# Update dependencies
pnpm update

# Rebuild and restart
pnpm build
sudo systemctl restart marketplace
```

---

## Troubleshooting

### Application Won't Start

```bash
# Check logs
sudo journalctl -u marketplace -n 50

# Check if port 3000 is in use
sudo lsof -i :3000

# Check environment variables
cat /home/ubuntu/premium-marketplace/.env.local

# Verify database connection
mysql -u marketplace -p premium_marketplace -e "SELECT 1;"
```

### Database Connection Error

```bash
# Check MySQL is running
sudo systemctl status mysql

# Verify credentials
mysql -u marketplace -p premium_marketplace

# Check database exists
mysql -u root -p -e "SHOW DATABASES;"

# Check user permissions
mysql -u root -p -e "SHOW GRANTS FOR 'marketplace'@'localhost';"
```

### High Memory Usage

```bash
# Check memory
free -h

# Kill unused processes
ps aux | grep node

# Restart application
sudo systemctl restart marketplace
```

### SSL Certificate Issues

```bash
# Check certificate validity
sudo openssl x509 -in /etc/ssl/certs/your-cert.crt -text -noout

# Renew certificate
sudo certbot renew --force-renewal

# Check certificate expiry
sudo certbot certificates
```

---

## Performance Optimization

### Enable Gzip Compression

```bash
# In Nginx config
gzip on;
gzip_types text/plain text/css application/json application/javascript;
gzip_min_length 1000;
```

### Setup Caching

```bash
# In Nginx config
location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
}
```

### Database Optimization

```bash
# Add indexes
mysql -u marketplace -p premium_marketplace < /home/ubuntu/premium-marketplace/scripts/optimize.sql

# Analyze tables
ANALYZE TABLE listings;
ANALYZE TABLE inquiries;
```

---

## Backup & Recovery

### Backup Everything

```bash
# Backup database
mysqldump -u marketplace -p premium_marketplace > /home/ubuntu/backups/db_backup.sql

# Backup application files
tar -czf /home/ubuntu/backups/app_backup.tar.gz /home/ubuntu/premium-marketplace/

# Backup Nginx config
sudo tar -czf /home/ubuntu/backups/nginx_backup.tar.gz /etc/nginx/
```

### Restore from Backup

```bash
# Restore database
mysql -u marketplace -p premium_marketplace < /home/ubuntu/backups/db_backup.sql

# Restore application
tar -xzf /home/ubuntu/backups/app_backup.tar.gz -C /

# Restart application
sudo systemctl restart marketplace
```

---

## Quick Commands Reference

```bash
# Start application
sudo systemctl start marketplace

# Stop application
sudo systemctl stop marketplace

# Restart application
sudo systemctl restart marketplace

# View logs
sudo journalctl -u marketplace -f

# Check status
sudo systemctl status marketplace

# View Nginx logs
sudo tail -f /var/log/nginx/access.log

# Restart Nginx
sudo systemctl restart nginx

# Check disk space
df -h

# Check memory
free -h

# Backup database
mysqldump -u marketplace -p premium_marketplace > backup.sql

# Restore database
mysql -u marketplace -p premium_marketplace < backup.sql
```

---

## Security Best Practices

1. **Keep system updated**: `sudo apt update && sudo apt upgrade -y`
2. **Use strong passwords**: Generate with `openssl rand -base64 32`
3. **Enable firewall**: `sudo ufw enable`
4. **Allow SSH**: `sudo ufw allow 22`
5. **Allow HTTP/HTTPS**: `sudo ufw allow 80,443`
6. **Disable root login**: Edit `/etc/ssh/sshd_config`
7. **Setup fail2ban**: `sudo apt install fail2ban`
8. **Regular backups**: Automate with cron jobs
9. **Monitor logs**: Check `/var/log/` regularly
10. **Update dependencies**: Run `pnpm update` monthly

---

## Support & Resources

- **Ubuntu Documentation**: https://ubuntu.com/server/docs
- **Nginx Documentation**: https://nginx.org/en/docs/
- **MySQL Documentation**: https://dev.mysql.com/doc/
- **Let's Encrypt**: https://letsencrypt.org/
- **PM2 Documentation**: https://pm2.keymetrics.io/

---

**Last Updated**: March 2026
**Version**: 1.0.0
