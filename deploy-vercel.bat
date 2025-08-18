@echo off
REM Vercel Deployment Script for Scrum Poker App (Windows)
REM This script deploys both frontend and backend to Vercel

echo 🚀 Starting Vercel Deployment for Scrum Poker App
echo =================================================

REM Check if we're in the right directory
if not exist "package.json" (
    echo ❌ Error: package.json not found. Please run this script from the project root.
    pause
    exit /b 1
)

REM Check if Vercel CLI is installed
where vercel >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo 📦 Installing Vercel CLI...
    npm install -g vercel
)

REM Run linting and build check
echo 🔍 Running pre-deployment checks...
call npm run lint
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Linting failed. Please fix issues before deploying.
    pause
    exit /b 1
)

REM Test build
echo 🏗️  Testing build...
call npm run build
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Build failed. Please fix issues before deploying.
    pause
    exit /b 1
)

echo ✅ Pre-deployment checks passed!

REM Deploy to Vercel
echo 🚀 Deploying to Vercel...
call vercel --prod

echo.
echo 🎉 Deployment complete!
echo.
echo 📋 Post-deployment checklist:
echo   - Test your app at the provided URL
echo   - Create a game session
echo   - Test voting functionality
echo   - Check /api/health endpoint
echo.
echo 📖 For detailed information, see VERCEL_DEPLOYMENT.md

pause
