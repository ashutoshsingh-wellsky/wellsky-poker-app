#!/bin/bash

# Vercel Deployment Script for Scrum Poker App
# This script deploys both frontend and backend to Vercel

echo "🚀 Starting Vercel Deployment for Scrum Poker App"
echo "================================================="

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Please run this script from the project root."
    exit 1
fi

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "📦 Installing Vercel CLI..."
    npm install -g vercel
fi

# Run linting and build check
echo "🔍 Running pre-deployment checks..."
npm run lint
if [ $? -ne 0 ]; then
    echo "❌ Linting failed. Please fix issues before deploying."
    exit 1
fi

# Test build
echo "🏗️  Testing build..."
npm run build
if [ $? -ne 0 ]; then
    echo "❌ Build failed. Please fix issues before deploying."
    exit 1
fi

echo "✅ Pre-deployment checks passed!"

# Deploy to Vercel
echo "🚀 Deploying to Vercel..."
vercel --prod

echo ""
echo "🎉 Deployment complete!"
echo ""
echo "📋 Post-deployment checklist:"
echo "  - Test your app at the provided URL"
echo "  - Create a game session"
echo "  - Test voting functionality"
echo "  - Check /api/health endpoint"
echo ""
echo "📖 For detailed information, see VERCEL_DEPLOYMENT.md"
