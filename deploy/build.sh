#!/bin/bash
# ── Madhan Arts — Build for Hostinger Deployment ──
# Run this from the project root: bash deploy/build.sh

set -e

echo "═══════════════════════════════════════════"
echo "  Madhan Arts — Production Build"
echo "═══════════════════════════════════════════"

# 1. Build frontend
echo ""
echo "▸ Building frontend..."
cp deploy/.env.production frontend/.env.production
cd frontend
npm install --production=false
npm run build
cd ..
echo "  ✓ Frontend built → frontend/dist/"

# 2. Install backend dependencies
echo ""
echo "▸ Installing backend dependencies..."
cd backend
composer install --no-dev --optimize-autoloader
cd ..
echo "  ✓ Backend dependencies installed"

# 3. Assemble deployment package
echo ""
echo "▸ Assembling deployment package..."
rm -rf deploy/output
mkdir -p deploy/output/backend

# Copy frontend dist to root (SPA)
cp -r frontend/dist/* deploy/output/

# Copy backend
cp -r backend/src deploy/output/backend/
cp -r backend/config deploy/output/backend/
cp -r backend/public deploy/output/backend/
cp backend/composer.json deploy/output/backend/
cp backend/composer.lock deploy/output/backend/ 2>/dev/null || true
cp -r backend/vendor deploy/output/backend/
cp backend/.htaccess deploy/output/backend/

# Ensure upload directories exist
mkdir -p deploy/output/backend/public/uploads/gallery
mkdir -p deploy/output/backend/public/uploads/references

# Copy production configs
cp deploy/.htaccess deploy/output/.htaccess
cp deploy/backend/config/database.local.php deploy/output/backend/config/database.local.php
cp deploy/backend/config/app.production.php deploy/output/backend/config/app.production.php

# Copy database files
mkdir -p deploy/output/database
cp database/schema.sql deploy/output/database/
cp database/migrate_001_order_address.sql deploy/output/database/

echo "  ✓ Package assembled → deploy/output/"

echo ""
echo "═══════════════════════════════════════════"
echo "  BUILD COMPLETE!"
echo ""
echo "  deploy/output/ contains your ready-to-upload files."
echo ""
echo "  Before uploading:"
echo "  1. Edit deploy/output/backend/config/database.local.php"
echo "     → Set your Hostinger MySQL credentials"
echo "  2. Edit deploy/output/backend/config/app.production.php"
echo "     → Set a strong jwt_secret and your domain"
echo "     → Then rename it to app.php (replace existing)"
echo "  3. Upload everything in deploy/output/ to public_html/"
echo "═══════════════════════════════════════════"
