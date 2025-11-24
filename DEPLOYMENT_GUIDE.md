# 🚀 Deployment Guide - AI Food Ordering App

Complete guide to deploy the interactive UI app to Vercel.

## 📋 Prerequisites

- ✅ GitHub account
- ✅ Vercel account (free)
- ✅ Code pushed to GitHub

## 🎯 Step-by-Step Deployment

### Step 1: Prepare the Code

```bash
# Make sure everything is committed
cd /Users/premkalyan/code/CORP/ai-food-ordering-app
git add .
git commit -m "Ready for deployment: Interactive UI with buttons"
git push origin main
```

### Step 2: Deploy to Vercel

#### Option A: Vercel CLI (Fastest)

```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Deploy
vercel --prod
```

#### Option B: Vercel Dashboard (Recommended)

1. **Go to Vercel**:
   - Visit https://vercel.com
   - Click "New Project"

2. **Import Repository**:
   - Select "Import Git Repository"
   - Choose `premkalyan/ai-food-ordering-app`
   - Click "Import"

3. **Configure Project**:
   ```
   Framework Preset: Vite
   Build Command: npm run build
   Output Directory: dist
   Install Command: npm install
   ```

4. **Environment Variables**:
   - **None needed!** (API is public)

5. **Deploy**:
   - Click "Deploy"
   - Wait 2-3 minutes
   - Done! 🎉

### Step 3: Verify Deployment

1. **Check URL**: https://ai-food-ordering-app.vercel.app
2. **Test Flow**:
   - ✅ City selector loads
   - ✅ Cuisine selector works
   - ✅ Restaurants display
   - ✅ Menu loads
   - ✅ Cart works
   - ✅ Checkout completes

## 🔧 Troubleshooting

### Build Fails

**Error**: `npm run build` fails

**Fix**:
```bash
# Test build locally first
npm run build

# Check for TypeScript errors
npm run build 2>&1 | grep error
```

### 404 on Routes

**Error**: Refreshing page shows 404

**Fix**: Vercel should use `vercel.json` with rewrites. Verify:
```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

### API Not Working

**Error**: API calls fail

**Fix**: Check CORS and API URL in `src/services/api.ts`:
```typescript
const API_BASE_URL = 'https://ai-food-ordering-poc.vercel.app/api/v1';
```

### Slow Loading

**Error**: App loads slowly

**Fix**: Enable Vercel's optimizations:
1. Go to Project Settings
2. Enable "Speed Insights"
3. Enable "Image Optimization"

## 🎨 Custom Domain (Optional)

### Add Custom Domain

1. **Go to Project Settings** → Domains
2. **Add Domain**: `food.yourdomain.com`
3. **Configure DNS**:
   ```
   Type: CNAME
   Name: food
   Value: cname.vercel-dns.com
   ```
4. **Wait for SSL**: 5-10 minutes

## 📊 Monitoring

### Vercel Analytics

1. **Enable Analytics**:
   - Go to Project Settings
   - Enable "Analytics"
   - Free tier: 100k events/month

2. **View Metrics**:
   - Page views
   - Load times
   - Error rates
   - User locations

### Performance Monitoring

```bash
# Check Lighthouse scores
npx lighthouse https://ai-food-ordering-app.vercel.app

# Target scores:
# Performance: 90+
# Accessibility: 95+
# Best Practices: 95+
# SEO: 90+
```

## 🔄 Continuous Deployment

### Auto-Deploy on Push

Vercel automatically deploys when you push to `main`:

```bash
# Make changes
git add .
git commit -m "Update feature"
git push origin main

# Vercel deploys automatically!
```

### Preview Deployments

Every branch gets a preview URL:

```bash
# Create feature branch
git checkout -b feature/new-ui
git push origin feature/new-ui

# Get preview URL: https://ai-food-ordering-app-git-feature-new-ui.vercel.app
```

## 🎯 Production Checklist

Before going live:

- [ ] Test all user flows
- [ ] Check mobile responsiveness
- [ ] Verify API endpoints
- [ ] Test error handling
- [ ] Check loading states
- [ ] Verify cart functionality
- [ ] Test checkout flow
- [ ] Check order confirmation
- [ ] Test back navigation
- [ ] Verify favorites work

## 🚀 Post-Deployment

### Share the App

```
🎉 AI Food Ordering App is LIVE!

🔗 App: https://ai-food-ordering-app.vercel.app
📱 Mobile-friendly: Yes
⚡ Speed: < 1s load time
🎨 UI: Interactive buttons and cards
🛒 Features: Full ordering flow

Try it now! Order food in 2 minutes.
```

### Demo Script

1. **Open app** → "See the city selector with real buttons"
2. **Click Bangalore** → "Choose your cuisine"
3. **Click Indian** → "Browse restaurants with ratings"
4. **Click Spice Garden** → "Interactive menu with add-to-cart"
5. **Add items** → "Cart appears at bottom with live total"
6. **Checkout** → "Beautiful checkout flow"
7. **Confirm** → "Order success with tracking info"

**Total time**: 2-3 minutes!

## 📈 Next Steps

### Phase 1: Monitoring (Week 1)
- Monitor Vercel analytics
- Track error rates
- Check load times
- Gather user feedback

### Phase 2: Optimization (Week 2)
- Add restaurant images
- Improve loading states
- Add error boundaries
- Optimize bundle size

### Phase 3: Features (Week 3-4)
- Add user authentication
- Add order history
- Add real-time tracking
- Add push notifications

## 🎯 Success Metrics

Track these KPIs:

- **Load Time**: < 1 second
- **Conversion Rate**: City → Order
- **Cart Abandonment**: < 20%
- **Error Rate**: < 1%
- **Mobile Usage**: > 60%

## 🤝 Support

If deployment fails:

1. **Check Vercel Logs**:
   - Go to Deployments
   - Click failed deployment
   - View build logs

2. **Test Locally**:
   ```bash
   npm run build
   npm run preview
   ```

3. **Check GitHub**:
   - Verify code is pushed
   - Check branch is `main`

4. **Contact Vercel Support**:
   - Free tier has community support
   - Pro tier has email support

---

**Deployment should take 5-10 minutes total!**

Ready to go live? Let's deploy! 🚀

