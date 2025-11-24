# 🚀 Vercel MCP Deployment Guide

## Quick Deploy to Vercel

Your MCP server is ready to deploy as a Vercel serverless function!

---

## ✅ What's Ready

1. **`api/mcp.js`** - Vercel serverless function for MCP
2. **`vercel.json`** - Configured for MCP endpoint
3. **`dist/`** - Built React UI
4. **Dependencies** - MCP SDK already in package.json

---

## 🚀 Deploy in 3 Steps

### Step 1: Commit & Push

```bash
cd /Users/premkalyan/code/CORP/ai-food-ordering-app

# Add all changes
git add .

# Commit
git commit -m "Add Vercel MCP serverless function"

# Push to GitHub
git push origin main
```

### Step 2: Deploy on Vercel

**Option A: Vercel Dashboard**
1. Go to https://vercel.com
2. Click "New Project"
3. Import `premkalyan/ai-food-ordering-app`
4. Vercel auto-detects Vite
5. Click "Deploy"
6. Wait 2-3 minutes

**Option B: Vercel CLI**
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel --prod
```

### Step 3: Get MCP URL

After deployment, your MCP endpoint will be:

```
https://ai-food-ordering-app-ten.vercel.app/api/mcp
```

---

## 🔗 Connect to ChatGPT

### Update Your Connector

1. **Go to ChatGPT Settings**
2. **Navigate to**: Settings → Connectors
3. **Edit** your existing connector (or create new)
4. **Update URL** to:
   ```
   https://ai-food-ordering-app-ten.vercel.app/api/mcp
   ```
5. **Save**
6. **Refresh** the connector

### Test It

1. Open new chat
2. Add "Food Ordering" connector
3. Try: "Show me restaurants in Bangalore"
4. Your UI appears inside ChatGPT! 🎉

---

## 📊 Comparison: Local vs Vercel

| Aspect | Local (ngrok) | Vercel |
|--------|---------------|--------|
| **Setup** | ngrok http 8787 | git push |
| **URL** | Changes each time | Permanent |
| **Uptime** | Only when running | 24/7 |
| **Speed** | Depends on connection | Fast (CDN) |
| **Cost** | Free (ngrok) | Free (Vercel) |
| **Best For** | Development | Production |

---

## 🔍 Verify Deployment

### Test MCP Endpoint

```bash
# Health check
curl https://ai-food-ordering-app-ten.vercel.app/api/mcp

# Should return:
# {
#   "name": "Food Ordering MCP Server",
#   "version": "1.0.0",
#   "status": "running"
# }
```

### Test with MCP Inspector

```bash
npx @modelcontextprotocol/inspector@latest https://ai-food-ordering-app-ten.vercel.app/api/mcp
```

---

## 📁 Project Structure

```
ai-food-ordering-app/
├── api/
│   └── mcp.js                 # Vercel serverless function ✅
├── server/
│   └── mcp-server.js          # Local development server
├── dist/
│   └── index.html             # Built React app
├── vercel.json                # Vercel config ✅
└── package.json               # Dependencies ✅
```

---

## 🔄 Development Workflow

### Local Development

```bash
# Terminal 1: Run local MCP server
npm run mcp

# Terminal 2: Expose with ngrok
ngrok http 8787

# Use ngrok URL in ChatGPT for testing
```

### Production Deployment

```bash
# Make changes
# ...

# Build
npm run build

# Commit & push
git add .
git commit -m "Update feature"
git push origin main

# Vercel auto-deploys!
# Use production URL in ChatGPT
```

---

## ⚙️ Vercel Configuration

### vercel.json

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "rewrites": [
    {
      "source": "/api/mcp",
      "destination": "/api/mcp"
    },
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ],
  "functions": {
    "api/mcp.js": {
      "memory": 1024,
      "maxDuration": 30
    }
  }
}
```

**What this does**:
- Routes `/api/mcp` to serverless function
- Routes all other paths to React app
- Allocates 1GB memory for MCP function
- Sets 30s timeout

---

## 🐛 Troubleshooting

### Build Fails

**Error**: `Cannot find module '@modelcontextprotocol/sdk'`

**Fix**: Dependencies should be in `dependencies`, not `devDependencies`

Check `package.json`:
```json
{
  "dependencies": {
    "@modelcontextprotocol/sdk": "^1.22.0",
    "zod": "^4.1.13",
    "react": "^18.3.1",
    "react-dom": "^18.3.1"
  }
}
```

### MCP Endpoint 404

**Error**: `/api/mcp` returns 404

**Fix**: Check `vercel.json` has correct rewrites

### Function Timeout

**Error**: Function execution timed out

**Fix**: Increase `maxDuration` in `vercel.json`:
```json
{
  "functions": {
    "api/mcp.js": {
      "maxDuration": 60
    }
  }
}
```

### CORS Errors

**Error**: CORS policy blocking requests

**Fix**: Already handled in `api/mcp.js` with:
```javascript
res.setHeader("Access-Control-Allow-Origin", "*");
```

---

## 📊 Monitoring

### Vercel Dashboard

1. Go to https://vercel.com/dashboard
2. Select your project
3. View:
   - Deployments
   - Function logs
   - Analytics
   - Performance

### Check Logs

```bash
# Install Vercel CLI
npm install -g vercel

# View logs
vercel logs
```

---

## 🎯 Production Checklist

- [ ] Code committed to GitHub
- [ ] Deployed to Vercel
- [ ] MCP endpoint accessible
- [ ] Health check returns 200
- [ ] MCP Inspector works
- [ ] ChatGPT connector updated
- [ ] Tested end-to-end in ChatGPT
- [ ] UI renders correctly
- [ ] All tools working
- [ ] Orders can be placed

---

## 🚀 Auto-Deployment

### How It Works

```
1. You push to GitHub
   ↓
2. Vercel detects push
   ↓
3. Vercel runs: npm run build
   ↓
4. Vercel deploys:
   - Static files → CDN
   - api/mcp.js → Serverless function
   ↓
5. New version live!
```

### Deployment Time

- **Build**: 1-2 minutes
- **Deploy**: 30 seconds
- **Total**: ~2-3 minutes

---

## 💡 Tips

### 1. Preview Deployments

Every branch gets a preview URL:
```bash
git checkout -b feature/new-ui
git push origin feature/new-ui

# Get preview URL:
# https://ai-food-ordering-app-git-feature-new-ui.vercel.app
```

### 2. Environment Variables

If you need secrets:
1. Go to Vercel Dashboard → Settings → Environment Variables
2. Add variables
3. Redeploy

### 3. Custom Domain

Want a custom domain?
1. Go to Vercel Dashboard → Settings → Domains
2. Add your domain
3. Update ChatGPT connector URL

---

## 🎉 Success!

When working correctly:

1. ✅ Push code → Auto-deploys
2. ✅ MCP endpoint always online
3. ✅ No ngrok needed
4. ✅ Fast and reliable
5. ✅ Production-ready

**Your MCP server is now running on Vercel!** 🚀

---

## 📚 Resources

- **Vercel Docs**: https://vercel.com/docs
- **Serverless Functions**: https://vercel.com/docs/functions
- **MCP SDK**: https://github.com/modelcontextprotocol/sdk
- **Apps SDK**: https://developers.openai.com/apps-sdk

---

**Next**: Update your ChatGPT connector to use the Vercel URL! 🎯

