# Setup Guide - ChatGPT Apps SDK Version

## 🎯 When to Build This

**Build this version when**:
- ✅ OpenAI partnership discussions are serious
- ✅ Need to impress with interactive UI
- ✅ Have 5-7 hours available
- ✅ Want production-ready demo

**Use POC version when**:
- ✅ Quick demo to Sudarshan
- ✅ Initial concept validation
- ✅ Time-constrained

## 📋 Prerequisites

1. **Node.js** 18+ installed
2. **npm** or **yarn**
3. **OpenAI Platform account** (for Apps SDK)
4. **Backend API** already deployed (✅ Done: `ai-food-ordering-poc.vercel.app`)

## 🚀 Step-by-Step Setup

### Step 1: Initialize Project (10 min)

```bash
cd /Users/premkalyan/code/CORP/ai-food-ordering-app

# Initialize npm project
npm init -y

# Install dependencies
npm install react react-dom @openai/apps-sdk
npm install -D @types/react @types/react-dom typescript vite @vitejs/plugin-react tailwindcss
```

### Step 2: Configure TypeScript (5 min)

Create `tsconfig.json`:
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

### Step 3: Configure Vite (5 min)

Create `vite.config.ts`:
```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    sourcemap: true
  }
})
```

### Step 4: Create App Manifest (5 min)

Create `public/manifest.json`:
```json
{
  "name": "Food Ordering Assistant",
  "short_name": "FoodOrder",
  "description": "AI-powered food ordering with interactive UI",
  "version": "1.0.0",
  "api": {
    "url": "https://ai-food-ordering-poc.vercel.app"
  },
  "capabilities": {
    "interactive_ui": true,
    "custom_components": true
  },
  "permissions": [
    "api_access"
  ]
}
```

### Step 5: Build Components (2-3 hours)

See `COMPONENTS_GUIDE.md` for detailed component implementations.

### Step 6: Test Locally (30 min)

```bash
npm run dev
```

Visit: http://localhost:5173

### Step 7: Deploy to ChatGPT (30 min)

1. Build:
```bash
npm run build
```

2. Go to: https://platform.openai.com/apps

3. Create new app

4. Upload `dist/` folder

5. Configure API endpoint

6. Test in ChatGPT

## 📦 Package.json Scripts

Add to `package.json`:
```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "deploy": "npm run build && openai-apps deploy"
  }
}
```

## 🎯 Development Workflow

1. **Start dev server**: `npm run dev`
2. **Make changes**: Edit components in `src/`
3. **Test**: Check in browser
4. **Build**: `npm run build`
5. **Deploy**: `npm run deploy`

## 🔗 Connect to Existing API

All components will use:
```typescript
const API_URL = 'https://ai-food-ordering-poc.vercel.app';

// Example API call
const response = await fetch(`${API_URL}/api/v1/restaurants/search?cuisine=Indian`);
const data = await response.json();
```

**No changes needed to backend API!** ✅

## 📝 Next Steps

Once setup is complete:
1. Build components (see COMPONENTS_GUIDE.md)
2. Test locally
3. Deploy to ChatGPT
4. Share with team
5. Demo to OpenAI

## 🆘 Troubleshooting

### Issue: Apps SDK not found
```bash
npm install @openai/apps-sdk --save
```

### Issue: TypeScript errors
```bash
npm install -D @types/react @types/react-dom
```

### Issue: Build fails
```bash
rm -rf node_modules package-lock.json
npm install
npm run build
```

## 📚 Resources

- [Apps SDK Docs](https://developers.openai.com/apps-sdk)
- [React Docs](https://react.dev)
- [Vite Docs](https://vitejs.dev)
- [TypeScript Docs](https://www.typescriptlang.org)

---

**Ready to build when you are!** 🚀

**Estimated time**: 5-7 hours total
**Result**: Professional interactive UI for ChatGPT

