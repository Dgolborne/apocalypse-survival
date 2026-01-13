# 🔐 Vercel Environment Variables

Copy these EXACT values into your Vercel project environment variables.

## How to Add These to Vercel

1. Go to: https://vercel.com/dashboard
2. Click on your **apocalypse-survival** project
3. Go to **Settings** → **Environment Variables**
4. For each variable below, click **"Add Another"**
5. Paste the **Name** and **Value**
6. Select **"Production, Preview, and Development"** (all environments)
7. Click **"Save"**

---

## 🎮 Game Configuration Variables

### SESSION_SECRET
```
SESSION_SECRET
```
**Value:**
```
66520c7cb2b390d377a7e1c3590f80f8ff83d52994ab167cf962f365ec5145a7
```

### GAME_PASSWORD
```
GAME_PASSWORD
```
**Value:**
```
survive
```

### NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
```
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
```
**Value:**
```
AIzaSyCuRltGF196MlVMxk3Ginh9aEbIgJtMhpk
```

---

## 💾 Database Variables (Auto-Added by Vercel Postgres)

These should already be there if you created a Vercel Postgres database:

- `POSTGRES_URL`
- `POSTGRES_PRISMA_URL`
- `POSTGRES_URL_NON_POOLING`
- `POSTGRES_USER`
- `POSTGRES_HOST`
- `POSTGRES_PASSWORD`
- `POSTGRES_DATABASE`

**If these are missing:**
1. Go to **Storage** tab
2. Create a **Postgres** database
3. These variables will be automatically added

---

## ✅ After Adding Variables

1. Go to **Deployments** tab
2. Click **"..."** on the latest deployment
3. Click **"Redeploy"**
4. Wait for deployment to complete
5. Visit: `https://your-app.vercel.app/api/init-db`
6. Start playing!

---

## 🎮 Login to Your Game

**Password:** `survive`

---

## ⚠️ Important Notes

- Never commit these values to Git (they're already in .gitignore)
- The Google Maps API key is visible to browsers (that's normal for Maps API)
- Consider restricting your API key to your domain in Google Cloud Console
