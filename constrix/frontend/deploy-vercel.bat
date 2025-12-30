@echo off
echo 🚀 Deploying Constrix Frontend to Vercel...

REM Check if Vercel CLI is installed
where vercel >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ Vercel CLI not found. Installing...
    npm install -g vercel
)

REM Deploy to Vercel
echo 📦 Deploying to Vercel...
vercel --prod

echo ✅ Deployment complete!
echo 🌐 Your app should be live at: https://constrix.vercel.app