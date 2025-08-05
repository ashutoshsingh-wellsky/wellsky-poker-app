@echo off
REM WellSky Scrum Poker Deployment Script for Windows

echo 🚀 Preparing WellSky Scrum Poker for deployment...

REM Build the application
echo 📦 Building application...
call npm run build

if %errorlevel% equ 0 (
    echo ✅ Build successful!
    echo.
    echo 🌐 Your app is ready for deployment!
    echo.
    echo 📋 Next Steps:
    echo 1. Push your code to GitHub
    echo 2. Connect to Vercel at https://vercel.com
    echo 3. Deploy directly from GitHub
    echo.
    echo 📄 See DEPLOYMENT.md for detailed instructions
) else (
    echo ❌ Build failed. Please check for errors and try again.
    exit /b 1
)
