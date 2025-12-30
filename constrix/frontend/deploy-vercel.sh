#!/bin/bash

# Constrix Frontend - Vercel Deployment Script
echo "🚀 Deploying Constrix Frontend to Vercel..."

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI not found. Installing..."
    npm install -g vercel
fi

# Set production environment variables
echo "🔧 Setting up production environment..."

# Deploy to Vercel
echo "📦 Deploying to Vercel..."
vercel --prod

echo "✅ Deployment complete!"
echo "🌐 Your app should be live at: https://constrix.vercel.app"