# Scrum Poker - Deployment Guide

## 🚀 Quick Deploy to Vercel (Recommended)

### Prerequisites
1. GitHub account
2. Vercel account (free)

### Step-by-Step Deployment

#### 1. Push to GitHub
```bash
# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit changes
git commit -m "Initial commit - Scrum Poker app"

# Add your GitHub repository
git remote add origin https://github.com/YOUR_USERNAME/scrum-poker-app.git

# Push to GitHub
git push -u origin main
```

#### 2. Deploy to Vercel
1. Go to [vercel.com](https://vercel.com)
2. Sign up/Login with GitHub
3. Click "New Project"
4. Import your repository
5. Configure:
   - **Framework Preset**: Vite
   - **Root Directory**: `./`
   - **Build Command**: `npm run vercel-build`
   - **Output Directory**: `dist`
6. Click "Deploy"

#### 3. Configure Environment
After deployment, in Vercel dashboard:
1. Go to your project settings
2. Add environment variables:
   - `NODE_ENV`: `production`

#### 4. Update Socket.IO URL
In your deployed app, update the socket connection URL in `src/utils/socketGameManager.ts`:
```typescript
// Replace localhost with your Vercel URL
this.socket = io('https://your-app-name.vercel.app');
```

---

## 🌐 Alternative Deployment Options

### Option 2: Netlify + Railway
**Frontend (Netlify):**
1. Drag & drop `dist` folder to [netlify.com](https://netlify.com)
2. For continuous deployment, connect GitHub

**Backend (Railway):**
1. Go to [railway.app](https://railway.app)
2. Deploy from GitHub (select `server` folder)
3. Set environment variables

### Option 3: Render
1. Go to [render.com](https://render.com)
2. Create "Web Service" from GitHub
3. Configure:
   - **Environment**: Node
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`

---

## 📋 Pre-Deployment Checklist

- [ ] App logo is in `public/` folder
- [ ] All environment variables configured
- [ ] CORS origins updated for production
- [ ] Socket.IO URL updated for production
- [ ] Build command works locally: `npm run build`

---

## 🔧 Configuration Files Added

- `vercel.json` - Vercel deployment configuration
- Updated `package.json` - Added deployment scripts
- Updated `server.js` - Production CORS configuration

---

## 🌟 Your App Features

✅ Real-time voting with Socket.IO  
✅ Multiple voting systems (Fibonacci, T-shirt, etc.)  
✅ Session link sharing with clipboard copy  
✅ Clean and professional styling  
✅ Mobile-responsive design  
✅ No database required (in-memory storage)  

---

## 📞 Need Help?

The app is ready for deployment! Follow the Vercel steps above for the easiest deployment experience.

**Estimated deployment time: 5-10 minutes**
