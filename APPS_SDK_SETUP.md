# 🚀 ChatGPT Apps SDK Setup Guide

## What is Apps SDK?

The **Apps SDK** lets you build **interactive UI components** that render **inside ChatGPT** using the **Model Context Protocol (MCP)**.

**Key Components**:
1. **MCP Server** (Backend) - Exposes tools and UI to ChatGPT
2. **Web UI** (Frontend) - React app that runs in ChatGPT iframe
3. **ChatGPT Integration** - Connect your MCP server to ChatGPT

---

## ✅ What We've Built

### 1. MCP Server (`server/mcp-server.js`)
- Exposes 5 tools to ChatGPT:
  - `get_cities` - Get available cities
  - `get_cuisines` - Get available cuisines
  - `search_restaurants` - Search restaurants
  - `get_menu` - Get restaurant menu
  - `create_order` - Create food order
- Serves the React UI to ChatGPT
- Connects to existing API backend

### 2. React UI (Already Built!)
- Your existing React app in `src/`
- Will be built into `dist/index.html`
- Rendered in ChatGPT iframe

### 3. Integration
- MCP server connects both
- ChatGPT calls tools → Updates UI
- UI calls tools → Updates ChatGPT

---

## 🛠️ Setup Instructions

### Step 1: Build the UI

```bash
cd /Users/premkalyan/code/CORP/ai-food-ordering-app
npm run build
```

This creates `dist/index.html` with your React app.

### Step 2: Start MCP Server Locally

```bash
npm run mcp
```

You should see:
```
🍽️  Food Ordering MCP server listening on http://localhost:8787/mcp
📱 UI will be served from dist/index.html
🔗 API backend: https://ai-food-ordering-poc.vercel.app/api/v1
```

### Step 3: Test with MCP Inspector

```bash
npx @modelcontextprotocol/inspector@latest http://localhost:8787/mcp
```

This opens a browser to test your MCP server.

### Step 4: Expose to Internet (for ChatGPT)

Install ngrok:
```bash
brew install ngrok
# or download from https://ngrok.com
```

Expose your server:
```bash
ngrok http 8787
```

You'll get a URL like: `https://abc123.ngrok.app`

### Step 5: Connect to ChatGPT

1. **Enable Developer Mode**:
   - Go to ChatGPT Settings
   - Navigate to: **Apps & Connectors → Advanced settings**
   - Enable **Developer mode**

2. **Add Connector**:
   - Go to: **Settings → Connectors**
   - Click **Create**
   - Enter URL: `https://abc123.ngrok.app/mcp`
   - Name: "Food Ordering"
   - Description: "Order food from restaurants"
   - Click **Create**

3. **Test in Chat**:
   - Open new chat
   - Click **+** button → **More** menu
   - Select "Food Ordering"
   - Try: "Show me restaurants in Bangalore"

---

## 📁 Project Structure

```
ai-food-ordering-app/
├── server/
│   └── mcp-server.js          # MCP server (NEW!)
├── src/
│   ├── components/             # React components
│   ├── services/api.ts         # API integration
│   └── App.tsx                 # Main app
├── dist/                       # Built UI (after npm run build)
│   └── index.html              # Single HTML file for ChatGPT
├── package.json                # Updated with MCP scripts
└── APPS_SDK_SETUP.md          # This file
```

---

## 🔄 Development Workflow

### Make Changes to UI

1. Edit React components in `src/`
2. Rebuild: `npm run build`
3. Restart MCP server: `npm run mcp`
4. Refresh connector in ChatGPT

### Make Changes to Tools

1. Edit `server/mcp-server.js`
2. Restart MCP server: `npm run mcp`
3. Refresh connector in ChatGPT

### Quick Iteration

```bash
# Terminal 1: Watch and rebuild UI
npm run dev

# Terminal 2: Run MCP server
npm run mcp

# Terminal 3: Expose to internet
ngrok http 8787
```

---

## 🎯 How It Works

### User Flow in ChatGPT

```
User: "Show me Indian restaurants in Bangalore"
   ↓
ChatGPT calls: search_restaurants(city="Bangalore", cuisine="Indian")
   ↓
MCP Server: Calls your API, returns structured data
   ↓
ChatGPT: Renders your React UI with restaurant list
   ↓
User: Clicks restaurant in UI
   ↓
UI calls: window.openai.callTool("get_menu", {restaurant_id: "rest_009"})
   ↓
MCP Server: Fetches menu, returns data
   ↓
UI: Updates to show menu
```

### Data Flow

```
┌─────────────┐
│  ChatGPT    │
│  Interface  │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│  Your UI    │ (React app in iframe)
│  (iframe)   │ window.openai.callTool()
└──────┬──────┘
       │
       ▼
┌─────────────┐
│ MCP Server  │ (server/mcp-server.js)
│  (Node.js)  │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│  Your API   │ (ai-food-ordering-poc)
│  (FastAPI)  │
└─────────────┘
```

---

## 🚀 Deployment

### Option 1: Deploy MCP Server to Vercel

Create `api/mcp.js`:
```javascript
import { createFoodOrderingServer } from '../server/mcp-server.js';
// ... Vercel serverless function wrapper
```

### Option 2: Deploy to Railway/Render

```bash
# Push to GitHub
git push origin main

# Deploy on Railway/Render
# Point to: server/mcp-server.js
# Port: 8787
```

### Option 3: Keep Local (Development)

Use ngrok for testing, deploy later.

---

## 📊 Comparison

| Aspect | Custom GPT (Old) | Apps SDK (New) |
|--------|------------------|----------------|
| **UI Location** | External website | Inside ChatGPT |
| **Buttons** | Links to website | Real buttons in chat |
| **User Flow** | Chat → Click link → External site | All in ChatGPT |
| **Setup** | 5 minutes | 30 minutes |
| **Wow Factor** | 7/10 | 10/10 |
| **Complexity** | Simple | Moderate |

---

## ✅ Testing Checklist

- [ ] MCP server starts without errors
- [ ] MCP Inspector shows all 5 tools
- [ ] ngrok tunnel is active
- [ ] Connector added to ChatGPT
- [ ] Can invoke tools from chat
- [ ] UI renders in ChatGPT
- [ ] Can click through: Cities → Cuisines → Restaurants → Menu
- [ ] Can add items to cart
- [ ] Can complete order

---

## 🐛 Troubleshooting

### MCP Server Won't Start

**Error**: `Cannot find module`
**Fix**: Run `npm install` first

**Error**: `dist/index.html not found`
**Fix**: Run `npm run build` first

### ChatGPT Can't Connect

**Error**: `Failed to connect to connector`
**Fix**: Make sure ngrok is running and URL includes `/mcp`

**Error**: `502 Bad Gateway`
**Fix**: Check MCP server is running on correct port

### UI Not Rendering

**Error**: Blank screen in ChatGPT
**Fix**: Check browser console in MCP Inspector

**Error**: `window.openai is undefined`
**Fix**: UI must be served through MCP server, not standalone

---

## 📝 Next Steps

1. ✅ Build UI: `npm run build`
2. ✅ Start MCP server: `npm run mcp`
3. ✅ Test with Inspector
4. ✅ Expose with ngrok
5. ✅ Connect to ChatGPT
6. ✅ Test end-to-end
7. ⏳ Deploy to production
8. ⏳ Demo to stakeholders!

---

## 🎉 Success Criteria

When working correctly, you should be able to:

1. Open ChatGPT
2. Add "Food Ordering" connector
3. Say "I want to order food"
4. See your React UI **inside ChatGPT**
5. Click cities, cuisines, restaurants
6. Add items to cart
7. Complete checkout
8. **All without leaving ChatGPT!**

---

## 📚 Resources

- **Apps SDK Docs**: https://developers.openai.com/apps-sdk
- **MCP SDK**: https://github.com/modelcontextprotocol/sdk
- **Quickstart**: https://developers.openai.com/apps-sdk/quickstart
- **Examples**: https://github.com/openai/openai-apps-sdk-examples

---

**Ready to build the future of food ordering in ChatGPT!** 🚀

