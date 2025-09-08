# Environment Variables for Vercel

Copy these to your Vercel project settings (Settings → Environment Variables):

## Required Variables

### 1. Database (Will be auto-created when you connect Vercel Postgres)
- `DATABASE_URL` - Will be automatically set when you add Vercel Postgres
- `POSTGRES_PRISMA_URL` - Will be automatically set when you add Vercel Postgres
- `POSTGRES_URL_NON_POOLING` - Will be automatically set when you add Vercel Postgres

### 2. NextAuth Configuration
```
NEXTAUTH_URL=https://plants.mobcat.ca
NEXTAUTH_SECRET=jrjIvMxCqzjjxiI0n4+FyEa1hFdA8hqBagluyTsNE/o=
```

### 3. Email Service (Resend)
```
RESEND_API_KEY=re_iZ3qdiWF_6E4acpS3Ebj9HEGuhdAWfRKt
EMAIL_FROM=Plant Tracker <noreply@mobcat.ca>
```

### 4. Optional - Plant Database API
```
TREFLE_API_TOKEN=z2RBlTEYk7usCONzDcvU8_lm5eLFxeqAN_OS53k-ayg
```

## Setup Steps in Vercel Dashboard

1. **Add Vercel Postgres Storage**:
   - Go to your project → Storage tab
   - Click "Create Database" → Choose "Postgres"
   - Select your region (recommend closest to you)
   - This will automatically add all database env vars

2. **Add Custom Domain**:
   - Go to Settings → Domains
   - Add `plants.mobcat.ca`
   - Add CNAME record in your DNS: `plants` → `cname.vercel-dns.com`

3. **Add Environment Variables**:
   - Go to Settings → Environment Variables
   - Add each variable above (except DATABASE_URL which is auto-added)
   - Make sure they're enabled for Production, Preview, and Development

4. **Deploy Command**:
   After setting up env vars, run:
   ```bash
   vercel --prod
   ```