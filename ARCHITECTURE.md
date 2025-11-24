# 🏗️ Architecture - AI Food Ordering App

## System Overview

```mermaid
graph TB
    subgraph "AI Food Ordering System"
        A[Custom GPT<br/>Text-based]
        B[Interactive App<br/>Visual UI]
        
        A -->|API Actions| C[Vercel API<br/>FastAPI Backend]
        B -->|HTTPS| C
        
        C -->|Mock Data| D[Data Layer<br/>16 Restaurants<br/>5 Cities<br/>8 Cuisines]
        C -.->|Future| E[Nomnom API<br/>Real Restaurant Data]
    end
    
    style A fill:#4CAF50
    style B fill:#2196F3
    style C fill:#FF9800
    style D fill:#9C27B0
    style E fill:#607D8B
```

---

## Component Architecture

### Interactive App Structure

```mermaid
graph TB
    subgraph "App.tsx - Main Application"
        SM[State Management]
        CM[Cart Management]
        API[API Integration]
        
        subgraph "Component Flow"
            CS[1. CitySelector]
            CU[2. CuisineSelector]
            RL[3. RestaurantList]
            MV[4. MenuView + Cart]
            CO[5. Checkout]
            OC[6. OrderConfirmation]
            
            CS --> CU
            CU --> RL
            RL --> MV
            MV --> CO
            CO --> OC
        end
        
        SM -.-> CS
        CM -.-> MV
        API -.-> RL
    end
    
    style SM fill:#4CAF50
    style CM fill:#FF9800
    style API fill:#2196F3
```

---

## User Flow

### Complete Ordering Journey

```mermaid
graph TD
    START([User Starts]) --> CS[City Selector<br/>📍 Bangalore, NYC, LA]
    CS -->|Selects City| CU[Cuisine Selector<br/>🍛 Indian, 🥡 Chinese, 🍝 Italian]
    CU -->|Selects Cuisine| RL[Restaurant List<br/>Restaurant Cards<br/>⭐ Ratings]
    RL -->|Clicks View Menu| MV[Menu View<br/>Items with Prices<br/>Add to Cart Buttons]
    MV -->|Adds Items| CART[🛒 Cart<br/>Review Items]
    CART -->|Clicks Checkout| CO[Checkout<br/>Enter Delivery Address<br/>City, State, ZIP]
    CO -->|Places Order| OC[✅ Order Confirmation<br/>Order #123<br/>🕒 ETA: 12 mins]
    OC --> END([Order Complete])
    
    style START fill:#4CAF50
    style CS fill:#2196F3
    style CU fill:#FF9800
    style RL fill:#9C27B0
    style MV fill:#00BCD4
    style CART fill:#FFC107
    style CO fill:#FF5722
    style OC fill:#4CAF50
    style END fill:#4CAF50
```

---

## Data Flow

### API Integration

```mermaid
graph TB
    subgraph "Frontend - React"
        API[services/api.ts]
        API --> F1[getCities]
        API --> F2[getCuisines]
        API --> F3[searchRestaurants]
        API --> F4[getMenu]
        API --> F5[createOrder]
        API --> F6[processPayment]
        API --> F7[getFavorites]
        API --> F8[addFavorite]
    end
    
    API -->|HTTPS| BACKEND[Vercel API<br/>FastAPI Backend<br/>ai-food-ordering-poc.vercel.app]
    
    subgraph "API Endpoints"
        E1[GET /api/v1/cities]
        E2[GET /api/v1/cuisines]
        E3[GET /api/v1/restaurants/search]
        E4[GET /api/v1/restaurants/:id/menu]
        E5[POST /api/v1/orders/create]
        E6[POST /api/v1/orders/:id/payment]
        E7[GET /api/v1/orders/:id/track]
        E8[GET /api/v1/favorites/restaurants]
    end
    
    BACKEND --> E1
    BACKEND --> E2
    BACKEND --> E3
    BACKEND --> E4
    BACKEND --> E5
    BACKEND --> E6
    BACKEND --> E7
    BACKEND --> E8
    
    E1 --> DATA[Mock Data<br/>16 Restaurants<br/>5 Cities<br/>8 Cuisines<br/>In-memory Storage]
    E2 --> DATA
    E3 --> DATA
    E4 --> DATA
    E5 --> DATA
    E6 --> DATA
    E7 --> DATA
    E8 --> DATA
    
    style API fill:#2196F3
    style BACKEND fill:#FF9800
    style DATA fill:#4CAF50
```

---

## State Management

### React State Flow

```mermaid
graph TB
    subgraph "App State Management"
        STATE[AppState]
        CART[Cart State]
        ACTIONS[Actions]
        
        STATE --> S1[screen: city/cuisine/restaurant/menu]
        STATE --> S2[city: string]
        STATE --> S3[cuisine: string]
        STATE --> S4[restaurant: Restaurant]
        STATE --> S5[order: Order]
        
        CART --> C1[OrderItem Array]
        C1 --> C2[item_id, name, price, quantity]
        
        ACTIONS --> A1[handleAddToCart]
        ACTIONS --> A2[handleUpdateQuantity]
        ACTIONS --> A3[handleRemoveItem]
        ACTIONS --> A4[handleStartNew]
        
        A1 -.->|Updates| CART
        A2 -.->|Updates| CART
        A3 -.->|Updates| CART
        A4 -.->|Resets| STATE
    end
    
    style STATE fill:#2196F3
    style CART fill:#FF9800
    style ACTIONS fill:#4CAF50
```

---

## Deployment Architecture

### Vercel Deployment

```mermaid
graph LR
    GH[GitHub Repository<br/>premkalyan/ai-food-ordering-app<br/>Branch: main]
    
    GH -->|Push to main<br/>Webhook| VERCEL[Vercel CI/CD]
    
    subgraph "Vercel Build Process"
        V1[1. Detect Push]
        V2[2. Clone Repo]
        V3[3. npm install]
        V4[4. npm run build]
        V5[5. Deploy to CDN]
        
        V1 --> V2 --> V3 --> V4 --> V5
    end
    
    VERCEL --> V1
    V5 --> CDN[Global CDN<br/>ai-food-ordering-app.vercel.app]
    
    subgraph "Static Assets"
        A1[index.html]
        A2[JavaScript 166KB]
        A3[CSS 15KB]
    end
    
    CDN --> A1
    CDN --> A2
    CDN --> A3
    
    CDN -.-> F1[✓ Automatic SSL]
    CDN -.-> F2[✓ Global CDN]
    CDN -.-> F3[✓ Cache Invalidation]
    CDN -.-> F4[✓ Preview Deployments]
    
    style GH fill:#4CAF50
    style VERCEL fill:#000000,color:#fff
    style CDN fill:#2196F3
```

---

## Technology Stack

### Frontend

```mermaid
graph TB
    subgraph "Frontend Technology Stack"
        REACT[React 18.3.1<br/>✓ Component-based<br/>✓ Hooks<br/>✓ Fast rendering]
        TS[TypeScript 5.6.3<br/>✓ Type safety<br/>✓ IDE support<br/>✓ Fewer errors]
        VITE[Vite 6.4.1<br/>✓ Fast builds<br/>✓ HMR<br/>✓ Optimized]
        TAIL[Tailwind CSS 3.4<br/>✓ Utility-first<br/>✓ Responsive<br/>✓ Small bundle]
        
        REACT --> APP[Application]
        TS --> APP
        VITE --> APP
        TAIL --> APP
    end
    
    style REACT fill:#61DAFB,color:#000
    style TS fill:#3178C6
    style VITE fill:#646CFF
    style TAIL fill:#06B6D4
    style APP fill:#4CAF50
```

### Backend

```mermaid
graph TB
    subgraph "Backend Technology Stack"
        FAST[FastAPI Python<br/>✓ RESTful API<br/>✓ OpenAPI docs<br/>✓ Fast performance]
        MOCK[Mock Data<br/>✓ 16 restaurants<br/>✓ 5 cities<br/>✓ 8 cuisines<br/>✓ In-memory]
        VERCEL[Vercel Serverless<br/>✓ Auto-scaling<br/>✓ Zero config<br/>✓ Global]
        
        FAST --> API[Backend API]
        MOCK --> API
        VERCEL --> API
    end
    
    style FAST fill:#009688
    style MOCK fill:#FF9800
    style VERCEL fill:#000000,color:#fff
    style API fill:#4CAF50
```

---

## Performance Optimization

### Build Optimization

```mermaid
graph TD
    SRC[Source Code] --> TSC[TypeScript Compilation]
    TSC --> VITE[Vite Bundling]
    VITE --> TREE[Tree Shaking<br/>Remove unused code]
    TREE --> MIN[Minification<br/>Compress code]
    MIN --> SPLIT[Code Splitting<br/>Separate chunks]
    SPLIT --> GZIP[Gzip Compression]
    GZIP --> PROD[Production Build]
    
    PROD --> JS[JavaScript: 166KB<br/>51KB gzipped]
    PROD --> CSS[CSS: 15KB<br/>3.4KB gzipped]
    PROD --> PERF[Load Time: < 1s]
    
    style SRC fill:#2196F3
    style PROD fill:#4CAF50
    style JS fill:#FFC107
    style CSS fill:#FF9800
    style PERF fill:#4CAF50
```

---

## Security

### Security Measures

```mermaid
graph TB
    subgraph "Security Layers"
        HTTPS[🔒 HTTPS<br/>✓ Auto SSL via Vercel<br/>✓ Encrypted transmission]
        CORS[🌐 CORS<br/>✓ FastAPI configured<br/>✓ Frontend allowed]
        VALID[✅ Input Validation<br/>✓ TypeScript types<br/>✓ API validation]
        DEMO[🧪 Demo Mode<br/>✓ No real payments<br/>✓ Mock data<br/>✓ Safe testing]
    end
    
    APP[Application] --> HTTPS
    APP --> CORS
    APP --> VALID
    APP --> DEMO
    
    style HTTPS fill:#4CAF50
    style CORS fill:#2196F3
    style VALID fill:#FF9800
    style DEMO fill:#9C27B0
    style APP fill:#607D8B
```

---

## Future Architecture

### Production Integration

```mermaid
graph TB
    FRONT[Frontend React] --> GATEWAY[API Gateway]
    
    GATEWAY --> AUTH[🔐 Authentication<br/>JWT Tokens]
    GATEWAY --> NOMNOM[🍽️ Nomnom API<br/>Real Restaurant Data]
    GATEWAY --> PAY[💳 Payment Gateway<br/>Stripe/PayPal]
    
    AUTH --> DB[(Database)]
    NOMNOM --> DB
    PAY --> DB
    
    DB --> D1[User Profiles]
    DB --> D2[Order History]
    DB --> D3[Favorites]
    DB --> D4[Analytics]
    
    style FRONT fill:#2196F3
    style GATEWAY fill:#FF9800
    style AUTH fill:#4CAF50
    style NOMNOM fill:#9C27B0
    style PAY fill:#FFC107
    style DB fill:#607D8B
```

---

## Monitoring & Analytics

### Production Monitoring

```mermaid
graph TB
    subgraph "Monitoring & Analytics"
        VERCEL[📊 Vercel Analytics]
        PERF[⚡ Performance Metrics]
        BIZ[💼 Business Metrics]
        
        VERCEL --> V1[Page views]
        VERCEL --> V2[Load times]
        VERCEL --> V3[Error rates]
        VERCEL --> V4[User locations]
        
        PERF --> P1[TTFB]
        PERF --> P2[FCP]
        PERF --> P3[LCP]
        PERF --> P4[CLS]
        
        BIZ --> B1[Conversion rate]
        BIZ --> B2[Cart abandonment]
        BIZ --> B3[Average order value]
        BIZ --> B4[Time to order]
    end
    
    style VERCEL fill:#000000,color:#fff
    style PERF fill:#4CAF50
    style BIZ fill:#FF9800
```

---

## Scalability

### Horizontal Scaling

```mermaid
graph LR
    subgraph "Current Demo"
        D1[Vercel Free Tier]
        D2[Mock Data]
        D3[In-memory Storage]
        D4[Good for: Demos & Testing]
    end
    
    subgraph "Future Production"
        P1[Vercel Pro]
        P2[Real Database]
        P3[Redis Caching]
        P4[CDN Assets]
        P5[Load Balancing]
        P6[Auto-scaling]
        P7[Good for: Millions of Users]
    end
    
    D1 -.->|Upgrade| P1
    D2 -.->|Migrate| P2
    D3 -.->|Replace| P3
    
    style D1 fill:#9C27B0
    style D2 fill:#9C27B0
    style D3 fill:#9C27B0
    style D4 fill:#9C27B0
    style P1 fill:#4CAF50
    style P2 fill:#4CAF50
    style P3 fill:#4CAF50
    style P4 fill:#4CAF50
    style P5 fill:#4CAF50
    style P6 fill:#4CAF50
    style P7 fill:#4CAF50
```

---

## Summary

### Architecture Highlights

✅ **Modern Stack**: React + TypeScript + Vite + Tailwind
✅ **Fast Performance**: < 1s load, optimized bundles
✅ **Scalable**: Serverless architecture, auto-scaling
✅ **Secure**: HTTPS, CORS, input validation
✅ **Maintainable**: Clean code, TypeScript, documentation
✅ **Production-Ready**: Build successful, tested, documented

**Ready to deploy and scale!** 🚀

