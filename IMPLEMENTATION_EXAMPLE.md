# Implementation Example 🚀

## Quick Start: Config-Driven UI

### 1. Simple Config Toggle

```typescript
// .env.local
PLATFORM=web  # or 'gpt' or 'mobile'
DISPLAY_MODE=buttons  # or 'text' or 'hybrid'
```

### 2. Usage in Code

```typescript
// Before (Hard-coded buttons)
<div>
  <p>{message}</p>
  <button onClick={() => select(restaurant)}>
    {restaurant.name}
  </button>
</div>

// After (Config-driven)
<ResponseRenderer
  message={message}
  options={restaurants}
  config={UI_CONFIG}
/>

// Automatically renders as:
// - Buttons (web)
// - Numbered list (GPT)
// - Voice options (mobile)
```

### 3. Platform Detection

```typescript
// utils/platform.ts
export function detectPlatform(): 'gpt' | 'web' | 'mobile' {
  // Check environment
  if (process.env.PLATFORM) {
    return process.env.PLATFORM as any;
  }
  
  // Check user agent
  if (typeof window !== 'undefined') {
    const ua = navigator.userAgent;
    if (/mobile/i.test(ua)) return 'mobile';
    return 'web';
  }
  
  // Default to GPT for server-side
  return 'gpt';
}

// Auto-load config
export const CURRENT_CONFIG = UI_CONFIGS[detectPlatform()];
```

---

## Quick Start: Theming

### 1. Add Theme Selector to App

```typescript
// App.tsx
import { ThemeProvider } from './contexts/ThemeContext';
import { ThemeSelector } from './components/ThemeSelector';

export default function App() {
  const [showThemes, setShowThemes] = useState(false);
  
  return (
    <ThemeProvider>
      <div className="app">
        {/* Theme button in header */}
        <header>
          <button onClick={() => setShowThemes(true)}>
            🎨 Themes
          </button>
        </header>
        
        {/* Theme selector modal */}
        {showThemes && (
          <div className="modal">
            <ThemeSelector />
            <button onClick={() => setShowThemes(false)}>
              Close
            </button>
          </div>
        )}
        
        {/* Rest of app */}
        <ChatInterface />
      </div>
    </ThemeProvider>
  );
}
```

### 2. Use Theme in Components

```typescript
// Any component
import { useTheme } from '../contexts/ThemeContext';

export function MyComponent() {
  const { theme } = useTheme();
  
  return (
    <div style={{
      backgroundColor: theme.colors.surface,
      color: theme.colors.text,
      borderRadius: theme.borderRadius.md,
    }}>
      Themed content
    </div>
  );
}
```

### 3. CSS Variables (Recommended)

```css
/* globals.css */
:root {
  /* Auto-populated by ThemeProvider */
  --color-primary: #3B82F6;
  --color-secondary: #6B7280;
  --color-success: #10B981;
  --color-danger: #EF4444;
  --bg-image: none;
  --bg-opacity: 0;
}

/* Use in components */
.button {
  background-color: var(--color-primary);
  color: white;
}

.app {
  background-image: var(--bg-image);
  opacity: var(--bg-opacity);
}
```

---

## Quick Start: User Sessions

### 1. Add User Selection

```typescript
// App.tsx
import { SessionProvider } from './contexts/SessionContext';
import { UserSelector } from './components/UserSelector';

export default function App() {
  return (
    <SessionProvider>
      <UserSelector />
      <ChatInterface />
    </SessionProvider>
  );
}
```

### 2. Use User Context

```typescript
// ChatInterface.tsx
import { useSession } from '../contexts/SessionContext';

export function ChatInterface() {
  const { currentUser, session } = useSession();
  
  // Personalized greeting
  const greeting = currentUser
    ? `Hi ${currentUser.name}! ${currentUser.avatar}`
    : "Hi! What are you craving?";
  
  // Use preferences
  const defaultCity = currentUser?.preferences.favoriteCity || 'New York';
  
  // Show favorites
  if (currentUser?.favorites.restaurants.length > 0) {
    return <FavoritesView />;
  }
  
  return (
    <div>
      <h2>{greeting}</h2>
      {/* Rest of chat */}
    </div>
  );
}
```

### 3. Session Persistence

```typescript
// Automatically saved to sessionStorage
// Survives page refresh
// Cleared on browser close

// Manual operations
const { updateCart, clearSession } = useSession();

// Update cart
updateCart([...cart, newItem]);

// Clear session (logout)
clearSession();
```

---

## Complete Example: Restaurant Selection

### Platform-Agnostic Service

```typescript
// services/OrderingService.ts
export class OrderingService {
  async searchRestaurants(query: string): Promise<ChatResponse> {
    const results = await api.intelligentSearch(query);
    
    return {
      message: `I found ${results.length} restaurants:`,
      options: results.map(r => ({
        id: r.id,
        label: `${r.name} - ⭐ ${r.rating}`,
        value: r,
        type: 'restaurant',
        variant: 'primary',
      })),
    };
  }
}
```

### Web Renderer (Buttons)

```typescript
// renderers/WebRenderer.tsx
export function WebRenderer({ response }: { response: ChatResponse }) {
  return (
    <div>
      <p>{response.message}</p>
      <div className="button-grid">
        {response.options.map(option => (
          <button
            key={option.id}
            onClick={() => handleSelect(option)}
            className={`btn btn-${option.variant}`}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}
```

### GPT Renderer (Text)

```typescript
// renderers/GPTRenderer.ts
export function GPTRenderer(response: ChatResponse): string {
  let output = response.message + '\n\n';
  
  response.options.forEach((option, idx) => {
    output += `${idx + 1}. ${option.label}\n`;
  });
  
  output += '\nType the number to select.';
  return output;
}
```

### Usage

```typescript
// ChatInterface.tsx
import { CURRENT_CONFIG } from '../utils/platform';

export function ChatInterface() {
  const service = new OrderingService();
  
  const handleSearch = async (query: string) => {
    const response = await service.searchRestaurants(query);
    
    // Render based on platform
    if (CURRENT_CONFIG.displayMode === 'buttons') {
      return <WebRenderer response={response} />;
    } else {
      return <TextRenderer response={response} />;
    }
  };
  
  return (
    // ... chat UI
  );
}
```

---

## Testing Different Platforms

### Test as Web App

```bash
# .env.local
PLATFORM=web
DISPLAY_MODE=buttons

npm run dev
# Opens with button-based UI
```

### Test as GPT

```bash
# .env.local
PLATFORM=gpt
DISPLAY_MODE=text

npm run dev
# Opens with text-based UI (simulates GPT)
```

### Test as Mobile

```bash
# .env.local
PLATFORM=mobile
DISPLAY_MODE=hybrid

npm run dev
# Opens with mobile-optimized UI
```

---

## Quick Wins

### 1. Add Theme Selector (5 minutes)

```typescript
// Add to App.tsx header
<button onClick={() => setShowThemes(true)}>
  🎨 Change Theme
</button>
```

### 2. Add User Selector (10 minutes)

```typescript
// Wrap App with SessionProvider
<SessionProvider>
  <UserSelector />
  <App />
</SessionProvider>
```

### 3. Switch to Text Mode (1 minute)

```typescript
// Change .env.local
DISPLAY_MODE=text

// Restart server
npm run dev
```

---

## Benefits Summary

### For Development
✅ **Write once, deploy everywhere**
✅ **Easy testing** (switch config)
✅ **Maintainable** (single codebase)

### For Users
✅ **Personalized** (themes, preferences)
✅ **Fast** (no login required)
✅ **Consistent** (same experience across platforms)

### For Business
✅ **Scalable** (add platforms easily)
✅ **Cost-effective** (shared codebase)
✅ **Flexible** (easy to customize)

---

## Next Steps

1. **Review** `ARCHITECTURE_DESIGN_PRINCIPLES.md`
2. **Choose** which feature to implement first
3. **Test** with simple config changes
4. **Iterate** based on feedback

**Start with**: Config-driven UI (easiest, biggest impact)

---

**Ready to implement?** Let me know which feature you'd like to start with!

