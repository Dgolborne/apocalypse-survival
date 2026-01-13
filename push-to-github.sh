#!/bin/bash

echo "🚀 Pushing Apocalypse Survival to GitHub..."

cd "$(dirname "$0")"

# Add remote (replace with your actual repo URL if different)
git remote add origin https://github.com/davidgo777/apocalypse-survival.git

# Push to GitHub
git branch -M main
git push -u origin main

echo "✅ Successfully pushed to GitHub!"
echo ""
echo "Next steps:"
echo "1. Go to https://vercel.com/new"
echo "2. Import your GitHub repository: davidgo777/apocalypse-survival"
echo "3. Vercel will auto-detect Next.js"
echo "4. Add environment variables (see QUICKSTART.md)"
echo "5. Deploy!"
echo ""
echo "Repository URL: https://github.com/davidgo777/apocalypse-survival"
