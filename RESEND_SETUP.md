# Setting Up Resend for Authentication

## Quick Setup Guide

1. **Create a Resend account** (free)
   - Go to https://resend.com
   - Sign up for a free account (3,000 emails/month)

2. **Add your domain**
   - In Resend dashboard, go to "Domains"
   - Click "Add Domain"
   - Enter `mobcat.ca`
   - Follow the DNS verification steps (add TXT/CNAME records)

3. **Get your API key**
   - Go to "API Keys" in Resend dashboard
   - Create a new API key
   - Copy the key (starts with `re_...`)

4. **Update your .env file**
   ```
   RESEND_API_KEY="re_your_actual_api_key_here"
   NEXTAUTH_SECRET="generate-a-random-secret-here"
   ```

   To generate a secure NEXTAUTH_SECRET, run:
   ```bash
   openssl rand -base64 32
   ```

5. **For production deployment**
   - Update `NEXTAUTH_URL` in .env to your production URL
   - Example: `NEXTAUTH_URL="https://planttracker.mobcat.ca"`

## Testing Authentication

1. Click "Sign In" on the homepage
2. Enter your email address
3. Check your email for the magic link
4. Click the link to sign in

## Troubleshooting

- **Email not sending**: Check that your Resend API key is correct
- **Domain not verified**: Make sure DNS records are properly configured
- **Link expired**: Magic links expire after 24 hours by default

## Current Status

✅ NextAuth configured with Resend provider
✅ Sign-in/out buttons added to homepage
✅ Database schema ready for users
✅ Middleware configured (currently allowing all access)

## Next Steps

1. Set up Resend account and add API key to .env
2. Test authentication flow
3. Update API routes to filter by authenticated user's workspace
4. Deploy to Vercel