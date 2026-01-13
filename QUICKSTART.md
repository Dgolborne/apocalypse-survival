# 🚀 Quick Start Guide

Get your Apocalypse Survival game running in 5 minutes!

## Prerequisites

- Node.js 18+ installed
- A Vercel account (free tier works!)
- A Google Cloud account (for Maps API)

## Step-by-Step Setup

### 1. Install Dependencies

```bash
cd apocalypse-survival
npm install
```

### 2. Set Up Environment Variables

Create a `.env.local` file in the project root:

```bash
# Copy the example file
cp .env.example .env.local
```

Edit `.env.local` and add:

```env
# For local development, you can use placeholder values initially
SESSION_SECRET=your-secret-key-at-least-32-characters-long-please
GAME_PASSWORD=apocalypse2024
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your-google-maps-api-key

# Database (add these after setting up Vercel Postgres)
POSTGRES_URL=
POSTGRES_PRISMA_URL=
POSTGRES_URL_NON_POOLING=
POSTGRES_USER=
POSTGRES_HOST=
POSTGRES_PASSWORD=
POSTGRES_DATABASE=
```

### 3. Get Google Maps API Key

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable these APIs:
   - **Maps JavaScript API**
   - **Places API**
4. Go to "Credentials" → "Create Credentials" → "API Key"
5. Copy the API key to your `.env.local` file

**Important**: For production, restrict your API key:
- Application restrictions: HTTP referrers
- Add your domain: `https://your-app.vercel.app/*`

### 4. Deploy to Vercel & Set Up Database

#### Option A: Using Vercel CLI (Recommended)

```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy
vercel

# Follow the prompts to create a new project
```

#### Option B: Using Vercel Dashboard

1. Go to [vercel.com](https://vercel.com)
2. Click "Add New" → "Project"
3. Import your repository (or upload folder)
4. Click "Deploy"

### 5. Add Vercel Postgres Database

1. In Vercel Dashboard, go to your project
2. Click "Storage" tab
3. Click "Create Database" → "Postgres"
4. Name it: `apocalypse-survival-db`
5. Click "Create"

**Copy the environment variables:**
- Vercel will show you the database connection strings
- Copy all `POSTGRES_*` variables
- Add them to your project's environment variables in Vercel
- Also add them to your local `.env.local` file

### 6. Set Environment Variables in Vercel

In Vercel Dashboard → Your Project → Settings → Environment Variables, add:

```
SESSION_SECRET=your-generated-secret-min-32-chars
GAME_PASSWORD=your-chosen-password
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your-google-maps-api-key
```

To generate a secure SESSION_SECRET:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 7. Initialize the Database

After deployment, visit:
```
https://your-app-name.vercel.app/api/init-db
```

You should see:
```json
{"success":true,"message":"Database initialized successfully"}
```

### 8. Start Playing!

Visit your app:
```
https://your-app-name.vercel.app
```

Or run locally:
```bash
npm run dev
# Visit http://localhost:3000
```

**Default password**: Check your `GAME_PASSWORD` in `.env.local`

## Local Development

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## Testing the Game

1. **Login**: Enter your game password
2. **Select Scenario**: Choose "Zombie Apocalypse"
3. **Create Character**: 
   - Enter a name
   - Roll or customize stats
   - Click "Begin Survival"
4. **Play**:
   - Click on the map to select a location
   - Choose "Move" or "Loot"
   - Survive 30 days!

## Troubleshooting

### Database Connection Failed
- Ensure all `POSTGRES_*` variables are set in `.env.local`
- Run `/api/init-db` to initialize tables
- Check Vercel logs for errors

### Google Maps Not Loading
- Verify API key is correct
- Check that Maps JavaScript API and Places API are enabled
- Ensure billing is enabled in Google Cloud Console
- Check browser console for errors

### Build Errors
```bash
# Clear cache and rebuild
rm -rf .next
npm run build
```

### Session/Login Issues
- Ensure `SESSION_SECRET` is at least 32 characters
- Clear browser cookies
- Check that `GAME_PASSWORD` matches what you're entering

## Quick Commands

```bash
# Development
npm run dev          # Start dev server
npm run build        # Build for production
npm run start        # Start production server

# Deployment
vercel               # Deploy to Vercel
vercel --prod        # Deploy to production

# Database
# Visit /api/init-db in browser to initialize
```

## What's Next?

- Customize the game password
- Invite friends to play
- Check the game recap after dying to see all player paths
- Try to survive all 30 days!

## Need Help?

- Check `README.md` for detailed documentation
- Check `DEPLOYMENT.md` for deployment details
- Review Vercel logs for errors
- Check browser console for client-side errors

---

**Ready to survive the apocalypse? Let's go! 🧟‍♂️💀🎮**
