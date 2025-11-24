# AI Food Ordering App - ChatGPT Apps SDK Version

**Interactive UI with Real Buttons** 🎉

## 🎯 Overview

This is the **premium version** of the AI Food Ordering POC, built with **ChatGPT Apps SDK** for true interactive UI with clickable buttons, cards, and visual components.

## 🆚 Difference from POC

| Feature | POC (Custom GPT) | App (Apps SDK) |
|---------|------------------|----------------|
| **UI** | Text-based | Interactive buttons & cards |
| **City Selection** | Type city name | Click city button |
| **Restaurant Display** | Text list | Visual cards with images |
| **Menu** | Text menu | Interactive menu with +/- |
| **Cart** | Text summary | Visual cart with edit |
| **Checkout** | Text confirmation | Interactive form |
| **Demo Impact** | 7/10 | 10/10 |

## 🏗️ Architecture

```
ChatGPT App (Apps SDK)
        ↓
React Components (Interactive UI)
        ↓
Same Vercel API (ai-food-ordering-poc.vercel.app)
        ↓
Mock Data / Future: Nomnom
```

**Note**: Uses the same backend API from the POC repo!

## 🚀 Features

### Interactive Components

1. **City Selector** - Clickable city buttons
2. **Cuisine Selector** - Visual cuisine cards
3. **Restaurant Cards** - With "View Menu" and "⭐ Save" buttons
4. **Menu Items** - Add to cart with quantity selector
5. **Shopping Cart** - Visual cart with +/- and remove
6. **Checkout Flow** - Interactive address form
7. **Order Confirmation** - Visual order summary

### User Flow

```
[San Francisco] [Bangalore] [NYC] [LA] [Chicago]
        ↓ Click city
[Indian] [Chinese] [Italian] [Japanese] [Mexican]
        ↓ Click cuisine
┌─────────────────────────────┐
│ 🏪 Taj Palace Indian        │
│ ⭐ 4.5 | $$ | 🕒 30-45 min  │
│ [View Menu] [⭐ Save]       │
└─────────────────────────────┘
        ↓ Click View Menu
┌─────────────────────────────┐
│ Paneer Butter Masala        │
│ Rich tomato cream sauce     │
│ $14.99    [➕ Add to Cart]  │
└─────────────────────────────┘
        ↓ Add items
🛒 Cart (2 items) - $22.97
[Proceed to Checkout]
```

## 📁 Project Structure

```
ai-food-ordering-app/
├── src/
│   ├── components/
│   │   ├── CitySelector.tsx
│   │   ├── CuisineSelector.tsx
│   │   ├── RestaurantCard.tsx
│   │   ├── MenuItem.tsx
│   │   ├── Cart.tsx
│   │   └── Checkout.tsx
│   ├── hooks/
│   │   ├── useAPI.ts
│   │   └── useCart.ts
│   ├── App.tsx
│   └── index.tsx
├── public/
│   └── manifest.json
├── package.json
├── tsconfig.json
└── README.md
```

## 🛠️ Tech Stack

- **Framework**: React + TypeScript
- **UI Library**: @openai/apps-sdk
- **API**: Existing Vercel API (no changes needed!)
- **State**: React hooks + Context
- **Styling**: Tailwind CSS
- **Build**: Vite

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Deploy to ChatGPT
npm run deploy
```

## 📝 Development Status

- [ ] Project setup
- [ ] Install Apps SDK
- [ ] Create base components
- [ ] Implement city selector
- [ ] Implement restaurant cards
- [ ] Implement menu view
- [ ] Implement cart
- [ ] Implement checkout
- [ ] Connect to Vercel API
- [ ] Test complete flow
- [ ] Deploy to ChatGPT

## 🎯 Timeline

- **Setup**: 30 minutes
- **Components**: 2-3 hours
- **Integration**: 1-2 hours
- **Testing**: 1 hour
- **Total**: 5-7 hours

## 🔗 Related Repos

- **POC (Custom GPT)**: `ai-food-ordering-poc` - Text-based version
- **Backend API**: Same Vercel API used by both versions

## 📚 Resources

- [ChatGPT Apps SDK Docs](https://developers.openai.com/apps-sdk)
- [Build Custom UX](https://developers.openai.com/apps-sdk/build/custom-ux)
- [Apps SDK Examples](https://github.com/openai/apps-sdk-examples)

## 🎉 Benefits

### For Demo
- ✅ Professional app-like UI
- ✅ Real buttons and interactions
- ✅ Visual shopping cart
- ✅ Better user experience

### For Partnership
- ✅ Shows technical sophistication
- ✅ Uses OpenAI's latest tech
- ✅ Production-ready feel
- ✅ Differentiates from competitors

## 🚀 Deployment

Once built, this will be deployed as a ChatGPT App (not Custom GPT):
- Users can install from ChatGPT App Store
- Interactive UI within ChatGPT
- Uses same backend API
- Better UX than Custom GPT

---

**Status**: 🚧 Ready to build when needed

**Backend API**: ✅ Already deployed at `ai-food-ordering-poc.vercel.app`

**Current POC**: ✅ Working at Custom GPT (for quick demos)

