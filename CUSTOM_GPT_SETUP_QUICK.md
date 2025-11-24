# 🤖 Custom GPT Setup - Quick Guide

## ✅ Prerequisites

- ✅ Frontend deployed: https://ai-food-ordering-app-ten.vercel.app
- ✅ Backend API deployed: https://ai-food-ordering-poc.vercel.app
- ✅ Menus working for all restaurants
- ✅ ChatGPT Plus subscription (required for Custom GPTs)

---

## 🚀 Quick Setup (5 minutes)

### Step 1: Create Custom GPT

1. Go to: https://chat.openai.com/gpts/editor
2. Click "Create a GPT"
3. Switch to "Configure" tab

### Step 2: Basic Information

**Name**:
```
AI Food Ordering Assistant
```

**Description**:
```
Order food from restaurants with an interactive visual interface. Browse cities, cuisines, restaurants, and menus. Add items to cart and complete checkout.
```

**Instructions**:
```
You are an AI Food Ordering Assistant that helps users order food through an interactive web interface.

IMPORTANT RULES:
1. Always guide users to the web app: https://ai-food-ordering-app-ten.vercel.app
2. Explain that the app has clickable buttons and visual cards
3. Walk them through: City → Cuisine → Restaurant → Menu → Cart → Checkout
4. Emphasize the visual experience (real buttons, not text)

RESPONSE FLOW:
When user wants to order food:
1. Provide the app link
2. Explain the simple 3-minute flow
3. Highlight the interactive UI features
4. Offer to answer questions about restaurants or menu items

AVAILABLE DATA (via API):
- 5 cities: Bangalore, San Francisco, New York City, Los Angeles, Chicago
- 8 cuisines: Indian, Chinese, Italian, Japanese, Mexican, Mediterranean, Thai, Korean
- 16 restaurants across all cities
- Full menus with prices in local currency

TONE:
- Friendly and helpful
- Excited about the visual interface
- Quick and efficient
- Focus on the user experience

EXAMPLE RESPONSE:
"Great! I can help you order food. 🍽️

Visit our interactive app: https://ai-food-ordering-app-ten.vercel.app

Here's how it works (takes just 2-3 minutes):
1. Click your city (we're in 5 cities!)
2. Choose your cuisine (8 options)
3. Browse restaurant cards with ratings
4. View the menu and add items
5. Checkout and confirm!

Everything has real clickable buttons and visual cards - no typing needed!

Which city are you in?"
```

### Step 3: Conversation Starters

Add these 4 starters:

```
1. "I want to order food"
2. "Show me restaurants in Bangalore"
3. "What cuisines are available?"
4. "I'm craving Indian food"
```

### Step 4: Knowledge (Optional)

You can upload these files for reference:
- `COMPARISON.md` - Feature comparison
- `BEST_GPT_INSTRUCTIONS.md` - Detailed instructions

### Step 5: Capabilities

Enable:
- ✅ Web Browsing (optional)
- ❌ DALL·E Image Generation (not needed)
- ❌ Code Interpreter (not needed)

### Step 6: Actions (Optional - Advanced)

If you want the GPT to call the API directly:

#### Option A: Import Schema (Easiest) ⭐ **RECOMMENDED**
1. Click "Create new action"
2. Click "Import from URL"
3. Enter: `https://ai-food-ordering-poc.vercel.app/openapi-production.json`
4. Click "Import"
5. Done! All endpoints will be imported automatically ✅

**Note**: Use `openapi-production.json` (not `openapi.json`) - it has only production URLs, no localhost references.

#### Option B: Manual Schema (Complete)
Or paste this complete OpenAPI schema:

```yaml
openapi: 3.1.0
info:
  title: AI Food Ordering API
  description: Restaurant ordering platform with menu browsing and order management
  version: 1.0.0
servers:
  - url: https://ai-food-ordering-poc.vercel.app
    description: Production server

paths:
  /api/v1/cities:
    get:
      summary: Get available cities
      description: Returns list of all cities where restaurants are available
      operationId: getCities
      responses:
        '200':
          description: List of cities with prompt
          content:
            application/json:
              schema:
                type: object
                properties:
                  cities:
                    type: array
                    items:
                      type: string
                  prompt:
                    type: string

  /api/v1/cuisines:
    get:
      summary: Get available cuisines
      description: Returns list of all available cuisine types
      operationId: getCuisines
      responses:
        '200':
          description: List of cuisines with prompt
          content:
            application/json:
              schema:
                type: object
                properties:
                  cuisines:
                    type: array
                    items:
                      type: string
                  prompt:
                    type: string

  /api/v1/restaurants/search:
    get:
      summary: Search restaurants
      description: Search for restaurants by city and/or cuisine
      operationId: searchRestaurants
      parameters:
        - name: city
          in: query
          required: false
          schema:
            type: string
          description: Filter by city (e.g., Bangalore, San Francisco)
        - name: cuisine
          in: query
          required: false
          schema:
            type: string
          description: Filter by cuisine (e.g., Indian, Chinese, Italian)
      responses:
        '200':
          description: List of restaurants
          content:
            application/json:
              schema:
                type: array
                items:
                  type: object
                  properties:
                    id:
                      type: string
                    name:
                      type: string
                    cuisine:
                      type: string
                    rating:
                      type: number
                    price_range:
                      type: string
                    delivery_time:
                      type: string
                    minimum_order:
                      type: number
                    delivery_fee:
                      type: number

  /api/v1/restaurants/{restaurant_id}/menu:
    get:
      summary: Get restaurant menu
      description: Returns complete menu with categories and items for a specific restaurant
      operationId: getRestaurantMenu
      parameters:
        - name: restaurant_id
          in: path
          required: true
          schema:
            type: string
          description: Restaurant ID (e.g., rest_009)
      responses:
        '200':
          description: Restaurant menu with categories
          content:
            application/json:
              schema:
                type: object
                properties:
                  categories:
                    type: array
                    items:
                      type: object
                      properties:
                        name:
                          type: string
                        items:
                          type: array
                          items:
                            type: object
                            properties:
                              id:
                                type: string
                              name:
                                type: string
                              description:
                                type: string
                              price:
                                type: number
                              vegetarian:
                                type: boolean
                              spicy:
                                type: boolean
                              popular:
                                type: boolean

  /api/v1/orders/create:
    post:
      summary: Create order
      description: Create a new food order
      operationId: createOrder
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              required:
                - restaurant_id
                - items
                - delivery_address
              properties:
                restaurant_id:
                  type: string
                items:
                  type: array
                  items:
                    type: object
                    properties:
                      item_id:
                        type: string
                      name:
                        type: string
                      price:
                        type: number
                      quantity:
                        type: integer
                delivery_address:
                  type: object
                  properties:
                    address:
                      type: string
                    city:
                      type: string
                    state:
                      type: string
                    zip:
                      type: string
      responses:
        '200':
          description: Order created successfully
          content:
            application/json:
              schema:
                type: object
                properties:
                  id:
                    type: string
                  status:
                    type: string
                  total:
                    type: number
                  estimated_delivery:
                    type: string

  /api/v1/orders/{order_id}/payment:
    post:
      summary: Process payment
      description: Process payment for an order
      operationId: processPayment
      parameters:
        - name: order_id
          in: path
          required: true
          schema:
            type: string
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              properties:
                payment_method:
                  type: object
                  properties:
                    type:
                      type: string
                    last_four:
                      type: string
      responses:
        '200':
          description: Payment processed
          content:
            application/json:
              schema:
                type: object
                properties:
                  success:
                    type: boolean
                  transaction_id:
                    type: string

  /api/v1/orders/{order_id}/track:
    get:
      summary: Track order
      description: Get current status and tracking info for an order
      operationId: trackOrder
      parameters:
        - name: order_id
          in: path
          required: true
          schema:
            type: string
      responses:
        '200':
          description: Order tracking information
          content:
            application/json:
              schema:
                type: object
                properties:
                  id:
                    type: string
                  status:
                    type: string
                  estimated_delivery:
                    type: string

  /api/v1/favorites/restaurants:
    get:
      summary: Get favorite restaurants
      description: Get user's favorite restaurants
      operationId: getFavoriteRestaurants
      responses:
        '200':
          description: List of favorite restaurants
          content:
            application/json:
              schema:
                type: array
                items:
                  type: object

  /api/v1/favorites/restaurants/{restaurant_id}:
    post:
      summary: Add restaurant to favorites
      description: Add a restaurant to user's favorites
      operationId: addFavoriteRestaurant
      parameters:
        - name: restaurant_id
          in: path
          required: true
          schema:
            type: string
      responses:
        '200':
          description: Restaurant added to favorites
          content:
            application/json:
              schema:
                type: object
                properties:
                  success:
                    type: boolean
                  message:
                    type: string
```

**Note**: For the visual app approach, you don't need Actions. Just guide users to the web interface at https://ai-food-ordering-app-ten.vercel.app

**Recommendation**: Use **Option A (Import from URL)** - it's easier and automatically stays updated!

---

## 🎯 Testing Your GPT

### Test 1: Basic Flow
```
User: "I want to order food"
GPT: [Provides app link and explains flow]
```

### Test 2: City Question
```
User: "What cities do you serve?"
GPT: [Lists 5 cities and provides app link]
```

### Test 3: Cuisine Question
```
User: "Show me Indian restaurants"
GPT: [Explains to select Bangalore/city, then Indian cuisine in app]
```

### Test 4: Direct Order
```
User: "Order me butter chicken"
GPT: [Guides to app, explains menu browsing]
```

---

## 📊 Expected User Experience

### Without Custom GPT (Current)
```
User opens: https://ai-food-ordering-app-ten.vercel.app
User clicks through: City → Cuisine → Restaurant → Menu → Cart → Checkout
Time: 2-3 minutes
```

### With Custom GPT (Enhanced)
```
User asks GPT: "I want Indian food in Bangalore"
GPT provides: App link + guidance
User clicks through: Same flow but with AI assistance
Time: 2-3 minutes + AI help
```

---

## 🎨 Customization Options

### Profile Picture
Upload a food-related icon or emoji (🍽️, 🍕, 🍜)

### Color Theme
Choose a warm, food-related color

### Privacy
- **Public**: Anyone can use (good for demo)
- **Only me**: Private testing
- **Only people with link**: Controlled sharing

---

## 🚀 Publishing

### For Demo/Testing
1. Keep as "Only me"
2. Test thoroughly
3. Share link with team

### For Partnership Pitch
1. Set to "Only people with link"
2. Get shareable link
3. Include in pitch deck

### For Public Launch
1. Set to "Public"
2. Add to GPT Store
3. Market to users

---

## 📝 Sample Conversations

### Conversation 1: First-time User
```
User: "How do I order food?"

GPT: "Welcome! 🍽️

Ordering is super easy with our visual app:

👉 https://ai-food-ordering-app-ten.vercel.app

Just 3 steps:
1. Pick your city (click the button)
2. Choose cuisine (visual cards)
3. Select restaurant & order!

Everything is clickable - no typing needed. Takes 2-3 minutes!

Ready to try it?"
```

### Conversation 2: Specific Request
```
User: "I want biryani in Bangalore"

GPT: "Great choice! 🍛

We have Bangalore Biryani House with amazing biryani!

Visit: https://ai-food-ordering-app-ten.vercel.app

Quick steps:
1. Click "Bangalore"
2. Click "Indian"
3. Select "Bangalore Biryani House"
4. Browse their menu (Hyderabadi Chicken Biryani is popular!)
5. Add to cart & checkout

The whole process has real buttons and visual cards. Super easy!

Want to see it now?"
```

### Conversation 3: Questions
```
User: "What restaurants do you have?"

GPT: "We have 16 amazing restaurants across 5 cities! 🌟

Cities:
• Bangalore (4 restaurants)
• San Francisco (4 restaurants)
• New York City (3 restaurants)
• Los Angeles (3 restaurants)
• Chicago (2 restaurants)

Cuisines:
🍛 Indian | 🥡 Chinese | 🍝 Italian | 🍱 Japanese
🌮 Mexican | 🥙 Mediterranean | 🍜 Thai | 🍲 Korean

Check them all out: https://ai-food-ordering-app-ten.vercel.app

Which city are you in?"
```

---

## ✅ Checklist

Before publishing:

- [ ] Name and description set
- [ ] Instructions configured
- [ ] Conversation starters added
- [ ] Tested with sample queries
- [ ] App link works
- [ ] Privacy settings configured
- [ ] Profile picture uploaded (optional)
- [ ] Shared with team for feedback

---

## 🎯 Success Metrics

Track these after launch:

- Number of conversations
- App link click-through rate
- User satisfaction
- Common questions
- Conversion to orders

---

## 🔄 Iteration

Based on user feedback:

1. **Week 1**: Monitor conversations, identify issues
2. **Week 2**: Update instructions based on patterns
3. **Week 3**: Add more conversation starters
4. **Week 4**: Optimize responses

---

## 🎉 You're Ready!

**Next Steps**:
1. Create the Custom GPT (5 minutes)
2. Test it thoroughly (10 minutes)
3. Share with team (demo)
4. Use in partnership pitch (OpenAI/Nomnom)

**Live URLs**:
- App: https://ai-food-ordering-app-ten.vercel.app
- API: https://ai-food-ordering-poc.vercel.app
- Docs: https://ai-food-ordering-poc.vercel.app/docs

**Let's create your Custom GPT!** 🚀

