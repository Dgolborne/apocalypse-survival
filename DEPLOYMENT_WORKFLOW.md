# 🚀 Deployment Workflow

Your game is connected to GitHub + Vercel, which means **automatic deployments**!

## 📦 How It Works

```
Make changes → Git push → Vercel auto-deploys → Live in ~30 seconds ✨
```

---

## 🎯 Quick Deploy (3 Methods)

### **Method 1: Easy Deploy Script** (Recommended)

Just run this command from your project folder:

```bash
cd "/Users/davidgo/Documents/Claude Code/apocalypse-survival"
./deploy.sh "Your commit message"
```

Or without a message (uses default):
```bash
./deploy.sh
```

**What it does:**
1. ✅ Stages all changes
2. ✅ Commits with your message
3. ✅ Pushes to GitHub
4. ✅ Vercel auto-deploys (happens automatically!)

---

### **Method 2: Manual Git Commands**

```bash
cd "/Users/davidgo/Documents/Claude Code/apocalypse-survival"

# Stage changes
git add .

# Commit
git commit -m "Your commit message"

# Push (triggers Vercel deployment)
git push origin main
```

---

### **Method 3: Vercel CLI** (Direct Deploy, Skips GitHub)

Install Vercel CLI once:
```bash
npm install -g vercel
```

Then deploy directly:
```bash
cd "/Users/davidgo/Documents/Claude Code/apocalypse-survival"
vercel --prod
```

This deploys directly to Vercel without going through GitHub.

---

## 🔄 Typical Workflow

### **Make a Change:**

1. Edit files in your project
2. Test locally: `npm run dev`
3. When ready to deploy:

```bash
./deploy.sh "Added new feature"
```

4. Wait ~30 seconds
5. Changes are live! 🎉

---

## 📊 Monitor Deployments

### **Vercel Dashboard:**
- URL: https://vercel.com/dashboard
- See real-time deployment status
- View logs
- Rollback if needed

### **Deployment Status:**
- **Building**: Vercel is building your app
- **Ready**: Deployment successful!
- **Error**: Check logs for issues

---

## 🛠️ Advanced: Direct Vercel CLI Setup

If you want to deploy without GitHub commits:

### **1. Install Vercel CLI:**
```bash
npm install -g vercel
```

### **2. Link Project:**
```bash
cd "/Users/davidgo/Documents/Claude Code/apocalypse-survival"
vercel link
```

### **3. Deploy Commands:**

**Preview deployment (test):**
```bash
vercel
```

**Production deployment:**
```bash
vercel --prod
```

---

## 📝 Example Workflow

### **Scenario: Change the game password**

1. Edit `.env` in Vercel Dashboard, OR
2. Edit code files locally
3. Deploy:

```bash
cd "/Users/davidgo/Documents/Claude Code/apocalypse-survival"
./deploy.sh "Changed game password"
```

4. Done! Live in 30 seconds.

---

## 🔥 Quick Deploy Aliases

Add these to your `~/.zshrc` or `~/.bashrc`:

```bash
alias deploy-game='cd "/Users/davidgo/Documents/Claude Code/apocalypse-survival" && ./deploy.sh'
alias game-dev='cd "/Users/davidgo/Documents/Claude Code/apocalypse-survival" && npm run dev'
alias game-logs='cd "/Users/davidgo/Documents/Claude Code/apocalypse-survival" && vercel logs'
```

Then you can just run:
```bash
deploy-game "My changes"
```

From anywhere in your terminal!

---

## 📋 Deployment Checklist

Before deploying:
- [ ] Test locally (`npm run dev`)
- [ ] Check for console errors
- [ ] Build succeeds (`npm run build`)
- [ ] Commit message is descriptive
- [ ] Ready to deploy!

After deploying:
- [ ] Check Vercel dashboard for status
- [ ] Test the live site
- [ ] Verify changes are visible
- [ ] Check runtime logs if issues

---

## 🆘 Troubleshooting

### **Deployment Failed:**
1. Check Vercel dashboard logs
2. Look for build errors
3. Verify environment variables are set
4. Try: `npm run build` locally to test

### **Changes Not Showing:**
1. Hard refresh: `Cmd+Shift+R` (Mac) or `Ctrl+Shift+R` (Windows)
2. Check deployment completed in Vercel
3. Verify correct branch deployed (should be `main`)

### **Build Errors:**
1. Test locally: `npm run build`
2. Fix errors
3. Deploy again

---

## 🎮 Ready to Deploy!

Now whenever you make changes to your game:

1. **Edit files** (add features, fix bugs, etc.)
2. **Run:** `./deploy.sh "Description of changes"`
3. **Wait 30 seconds**
4. **Live!** 🎉

Your Vercel + GitHub setup is perfect for continuous deployment!

---

**Pro Tip:** Vercel keeps your last 100 deployments, so you can always rollback if needed!
