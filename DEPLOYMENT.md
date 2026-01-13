# 🚀 Deployment Guide

## Quick Deployment to Vercel

### Step 1: Prepare Your Repository

```bash
cd apocalypse-survival
git init
git add .
git commit -m "Initial commit: Apocalypse Survival Game"
```

### Step 2: Create GitHub Repository (Optional)

```bash
# Create a new repository on GitHub, then:
git remote add origin https://github.com/YOUR_USERNAME/apocalypse-survival.git
git branch -M main
git push -u origin main
```

### Step 3: Deploy to Vercel

#### Option A: Using Vercel CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Deploy
vercel

# Follow the prompts:
# - Set up and deploy? Yes
# - Which scope? Your account
# - Link to existing project? No
# - Project name? apocalypse-survival
# - Directory? ./
# - Override settings? No
```

#### Option B: Using Vercel Dashboard

1. Go to [vercel.com](https://vercel.com)
2. Click "Add New" → "Project"
3. Import your GitHub repository
4. Vercel will auto-detect Next.js
5. Click "Deploy"

### Step 4: Set Up Vercel Postgres

1. Go to your project on Vercel Dashboard
2. Navigate to "Storage" tab
3. Click "Create Database" → "Postgres"
4. Name it `apocalypse-survival-db`
5. Select a region close to your users
6. Click "Create"

### Step 5: Configure Environment Variables

The Postgres variables will be automatically added, but you need to add:

1. Go to "Settings" → "Environment Variables"
2. Add the following:

```
SESSION_SECRET=generate-a-random-32-char-string-here
GAME_PASSWORD=your-chosen-game-password
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your-google-maps-api-key
```

To generate a secure SESSION_SECRET:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Step 6: Get Google Maps API Key

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable APIs:
   - Maps JavaScript API
   - Places API
4. Go to "Credentials"
5. Create API Key
6. Restrict the key (optional but recommended):
   - Application restrictions: HTTP referrers
   - Add your domain: `https://your-app.vercel.app/*`
   - API restrictions: Select Maps JavaScript API and Places API
7. Copy the API key to environment variables

### Step 7: Initialize Database

After deployment:

1. Visit: `https://your-app-name.vercel.app/api/init-db`
2. You should see: `{"success":true,"message":"Database initialized successfully"}`

### Step 8: Test Your Game

1. Visit: `https://your-app-name.vercel.app`
2. Enter your game password
3. Start playing!

## Troubleshooting

### Database Connection Issues
- Ensure all Postgres environment variables are set
- Check Vercel logs for connection errors
- Verify database region matches your deployment region

### Google Maps Not Loading
- Check API key is correct
- Ensure billing is enabled in Google Cloud
- Verify APIs are enabled (Maps JavaScript API, Places API)
- Check browser console for errors

### Session Issues
- Ensure SESSION_SECRET is at least 32 characters
- Check that cookies are enabled in browser
- Clear cookies and try again

### Build Failures
```bash
# Test build locally first:
npm run build

# If it works locally but fails on Vercel:
# - Check Node.js version (should be 18+)
# - Verify all dependencies are in package.json
# - Check Vercel build logs for specific errors
```

## Environment Variable Template

Copy this to your Vercel environment variables:

```env
# Database (auto-configured by Vercel Postgres)
POSTGRES_URL=
POSTGRES_PRISMA_URL=
POSTGRES_URL_NON_POOLING=
POSTGRES_USER=
POSTGRES_HOST=
POSTGRES_PASSWORD=
POSTGRES_DATABASE=

# Authentication (you set these)
SESSION_SECRET=your-generated-secret-min-32-chars
GAME_PASSWORD=your-chosen-password

# Google Maps (you set this)
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your-api-key
```

## Custom Domain (Optional)

1. Go to "Settings" → "Domains"
2. Add your custom domain
3. Follow DNS configuration instructions
4. Update Google Maps API key restrictions with new domain

## Monitoring

- **Logs**: Vercel Dashboard → Your Project → Deployments → Click deployment → Runtime Logs
- **Analytics**: Enable Vercel Analytics in project settings
- **Database**: Monitor queries in Vercel Postgres dashboard

## Scaling

Vercel automatically scales your application. For database:
- Free tier: 256 MB, 60 hours compute time
- Pro tier: 256 MB - 512 GB, unlimited compute
- Upgrade in Vercel Dashboard → Storage → Your Database → Settings

## Security Best Practices

1. **Never commit .env.local** - It's in .gitignore
2. **Use strong passwords** - For both SESSION_SECRET and GAME_PASSWORD
3. **Restrict API keys** - Limit Google Maps API to your domain
4. **Enable HTTPS** - Vercel does this automatically
5. **Regular updates** - Keep dependencies updated

## Cost Estimates

### Vercel
- Hobby (Free): Perfect for personal use
- Pro ($20/mo): For production apps with custom domains

### Google Maps
- $200 free credit per month
- Maps JavaScript API: $7 per 1000 loads
- Places API: $17 per 1000 requests
- Most games will stay within free tier

### Vercel Postgres
- Free: 256 MB, good for ~1000 games
- Paid: Scales as needed

## Support

For issues:
1. Check Vercel logs
2. Review browser console
3. Verify all environment variables are set
4. Test locally with `npm run dev`

---

**Ready to deploy? Let's go! 🚀**
