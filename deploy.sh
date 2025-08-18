#!/bin/bash

# Scrum Poker Deployment Script

echo "🚀 Preparing Scrum Poker for deployment..."

# Build the application
echo "📦 Building application..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
    echo ""
    echo "🌐 Your app is ready for deployment!"
    echo ""
    echo "📋 Next Steps:"
    echo "1. Push your code to GitHub"
    echo "2. Connect to Vercel at https://vercel.com"
    echo "3. Deploy directly from GitHub"
    echo ""
    echo "📄 See DEPLOYMENT.md for detailed instructions"
else
    echo "❌ Build failed. Please check for errors and try again."
    exit 1
fi
