# Madhan Arts — Hostinger Deployment Guide

## Prerequisites

- Hostinger **Premium** or **Business** web hosting plan (PHP 8.1+ required)
- A domain pointed to Hostinger (e.g., `madhanarts.in`)
- Node.js installed on your local machine (for building frontend)
- Composer installed on your local machine (for PHP dependencies)

---

## Step 1: Create MySQL Database on Hostinger

1. Login to **Hostinger hPanel** → https://hpanel.hostinger.com
2. Go to **Databases** → **MySQL Databases**
3. Create a new database:
   - **Database name**: `madhanarts` (Hostinger will prefix it, e.g., `u123456789_madhanarts`)
   - **Username**: `dbuser` (becomes `u123456789_dbuser`)
   - **Password**: Choose a strong password
4. Click **Create**
5. **Note down** the full database name, username, and password

---

## Step 2: Import Database Schema

1. In hPanel, go to **Databases** → **phpMyAdmin**
2. Click **Enter phpMyAdmin** for your new database
3. Click the **Import** tab
4. Upload `database/schema.sql`
5. Click **Go** to execute
6. You should see tables created: `admins`, `users`, `categories`, `gallery_items`, `sizes`, `pricing_rules`, `orders`, `otp_tokens`

> **If upgrading from an older version**, also import `database/migrate_001_order_address.sql` to add the new delivery address columns.

---

## Step 3: Build the Project

### Option A: Using the build script (recommended)

```bash
cd MadhanArts
bash deploy/build.sh
```

This creates `deploy/output/` with everything ready to upload.

### Option B: Manual build

```bash
# Build frontend
cd frontend
echo "VITE_API_URL=/api" > .env.production
npm install
npm run build
cd ..

# Install backend dependencies
cd backend
composer install --no-dev --optimize-autoloader
cd ..
```

---

## Step 4: Configure Production Settings

### 4a. Database config
Edit `deploy/output/backend/config/database.local.php` (or create it if building manually):

```php
<?php
return [
    'driver'   => 'mysql',
    'host'     => 'localhost',
    'port'     => '3306',
    'database' => 'u123456789_madhanarts',  // ← Your full DB name from Step 1
    'username' => 'u123456789_dbuser',      // ← Your full DB username
    'password' => 'YourStrongPassword',     // ← Your DB password
];
```

### 4b. App config
Edit `deploy/output/backend/config/app.php` and update:

```php
<?php
return [
    'jwt_secret'       => 'paste-a-random-64-character-string-here',
    'jwt_expiry'       => 86400,
    'upload_path'      => __DIR__ . '/../public/uploads',
    'allowed_origins'  => [
        'https://madhanarts.in',
        'https://www.madhanarts.in',
    ],
    'max_upload_size'  => 10 * 1024 * 1024,
    'currency'         => 'INR',
];
```

> **Generate a JWT secret**: Open browser console and run:
> `Array.from(crypto.getRandomValues(new Uint8Array(32))).map(b=>b.toString(16).padStart(2,'0')).join('')`

---

## Step 5: Upload Files to Hostinger

### File structure on Hostinger:

```
public_html/
├── .htaccess              ← Root .htaccess (SPA + API routing)
├── index.html             ← Frontend (from frontend/dist/)
├── assets/                ← Frontend JS/CSS (from frontend/dist/assets/)
├── favicon.svg            ← Favicon
├── backend/
│   ├── .htaccess          ← Backend .htaccess
│   ├── composer.json
│   ├── vendor/            ← PHP dependencies
│   ├── config/
│   │   ├── app.php        ← Updated with your domain + JWT secret
│   │   ├── database.php
│   │   └── database.local.php  ← Your MySQL credentials
│   ├── src/               ← PHP source code
│   └── public/
│       ├── index.php      ← API entry point
│       ├── router.php
│       ├── serve-upload.php
│       └── uploads/
│           ├── gallery/   ← Gallery images (writable)
│           └── references/ ← Order reference photos (writable)
└── database/
    ├── schema.sql
    └── migrate_001_order_address.sql
```

### Upload methods:

**Method 1: File Manager (Simple)**
1. hPanel → **Files** → **File Manager**
2. Navigate to `public_html/`
3. Delete default files (index.html, .htaccess, etc.)
4. Upload all files from `deploy/output/`
5. Extract if uploaded as ZIP

**Method 2: FTP (Recommended for large uploads)**
1. hPanel → **Files** → **FTP Accounts**
2. Note the FTP credentials (or create a new account)
3. Use FileZilla or WinSCP:
   - Host: your FTP hostname
   - Port: 21
   - Username/Password: from hPanel
4. Navigate to `public_html/`
5. Upload all contents of `deploy/output/`

---

## Step 6: Set File Permissions

In File Manager or via FTP, set these permissions:

| Path | Permission |
|------|-----------|
| `backend/public/uploads/` | 755 |
| `backend/public/uploads/gallery/` | 755 |
| `backend/public/uploads/references/` | 755 |

In hPanel File Manager: Right-click folder → **Permissions** → Set to `755`

---

## Step 7: Set PHP Version

1. hPanel → **Advanced** → **PHP Configuration**
2. Set PHP version to **8.1** or **8.2**
3. Ensure these extensions are enabled:
   - `pdo_mysql`
   - `mbstring`
   - `json`
   - `fileinfo`
   - `gd` (optional, for image processing)

---

## Step 8: Enable SSL

1. hPanel → **Security** → **SSL**
2. Enable **Free SSL** (Let's Encrypt) for your domain
3. Wait for it to activate (usually a few minutes)
4. The `.htaccess` already forces HTTPS

---

## Step 9: Test Your Deployment

1. Visit `https://yourdomain.com` — should show the homepage
2. Visit `https://yourdomain.com/gallery` — should show gallery
3. Visit `https://yourdomain.com/api/categories` — should return JSON
4. Try admin login at `https://yourdomain.com/admin/login`:
   - Email: `admin@madhanarts.com`
   - Password: `admin123`
   - **Change this password immediately!**

---

## Troubleshooting

### "500 Internal Server Error"
- Check PHP version is 8.1+
- Check `.htaccess` file exists and `mod_rewrite` is enabled
- Check `backend/config/database.local.php` has correct credentials
- Check hPanel **Error Logs** for details

### "404 Not Found" on page refresh
- The root `.htaccess` SPA fallback is not working
- Make sure `.htaccess` is uploaded and `mod_rewrite` is enabled in PHP config

### API returns "Database connection failed"
- Verify MySQL credentials in `database.local.php`
- Make sure the database exists and schema is imported
- On Hostinger, the host is always `localhost`

### Images not uploading
- Check `backend/public/uploads/` directories exist
- Check permissions are `755`
- Check PHP `upload_max_filesize` is at least `10M`
  (hPanel → PHP Configuration → `upload_max_filesize`)

### CORS errors in browser console
- Update `allowed_origins` in `backend/config/app.php` to include your exact domain
- Include both `https://yourdomain.com` and `https://www.yourdomain.com`

---

## Updating the Site

When you make changes:

1. **Frontend only**: Run `npm run build` in frontend/, upload `dist/` contents to `public_html/` (excluding `backend/`)
2. **Backend only**: Upload changed PHP files to `public_html/backend/`
3. **Full update**: Run `bash deploy/build.sh` and re-upload `deploy/output/`

---

## Security Checklist

- [ ] Changed default admin password
- [ ] Set a strong JWT secret (64+ random characters)
- [ ] SSL enabled and forcing HTTPS
- [ ] `allowed_origins` set to your actual domain only
- [ ] Database password is strong
- [ ] Removed any `.env` or debug files from public_html
