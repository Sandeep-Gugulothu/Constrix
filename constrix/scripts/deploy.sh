#!/bin/bash

echo "🚀 Deploying Constrix to Production..."

# Build backend
echo "📦 Building backend..."
cd backend
npm run build
cd ..

# Build frontend  
echo "📦 Building frontend..."
cd frontend
npm run build
cd ..

echo "✅ Build complete!"
echo ""
echo "🔗 Next steps:"
echo "1. Push to GitHub"
echo "2. Connect Railway to backend/"
echo "3. Connect Vercel to frontend/"
echo "4. Set environment variables"
echo ""
echo "📍 Production URLs:"
echo "Frontend: https://constrix.vercel.app"
echo "Backend: https://constrix-backend.railway.app"