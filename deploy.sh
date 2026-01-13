#!/bin/bash

# Easy deployment script for Apocalypse Survival
# This pushes changes to GitHub, which triggers automatic Vercel deployment

echo "🚀 Deploying Apocalypse Survival to Vercel..."
echo ""

cd "$(dirname "$0")"

# Check for uncommitted changes
if [[ -n $(git status -s) ]]; then
    echo "📝 Changes detected. Committing..."
    
    # Stage all changes
    git add .
    
    # Get commit message or use default
    if [ -z "$1" ]; then
        COMMIT_MSG="Update game code"
    else
        COMMIT_MSG="$1"
    fi
    
    git commit -m "$COMMIT_MSG"
    echo "✅ Changes committed: $COMMIT_MSG"
else
    echo "ℹ️  No changes to commit"
fi

# Push to GitHub (triggers Vercel deployment)
echo ""
echo "📤 Pushing to GitHub..."
git push origin main

echo ""
echo "✅ Pushed to GitHub!"
echo ""
echo "🌐 Vercel will automatically deploy your changes in ~30 seconds"
echo "📊 Check deployment status: https://vercel.com/dashboard"
echo ""
echo "Your changes will be live at your Vercel URL shortly!"
