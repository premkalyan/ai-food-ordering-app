# Custom GPT - Final Setup Guide

## ✅ Everything Ready!

**Backend API:** https://ai-food-ordering-poc.vercel.app  
**Status:** All tests passing (5/5) ✅  
**Response Time:** <1 second  

---

## Step 1: Import OpenAPI Schema

**URL:**
```
https://ai-food-ordering-poc.vercel.app/openapi-production.json
```

1. Go to your Custom GPT → Actions
2. Click "Import from URL"
3. Paste the URL above
4. Click "Import"

**You should see these actions:**
- ✅ `intelligent_search_api_v1_search_intelligent_get`
- ✅ `get_cities_api_v1_cities_get`
- ✅ `get_cuisines_api_v1_cuisines_get`
- ✅ `search_restaurants_api_v1_restaurants_search_get`
- ✅ `get_menu_api_v1_restaurants__restaurant_id__menu_get`
- ✅ `create_new_order_api_v1_orders_create_post`
- ✅ `track_order_api_v1_orders__order_id__track_get`

---

## Step 2: Copy Instructions

Open `CUSTOM_GPT_INSTRUCTIONS_FINAL.md` and copy the **entire content** into your Custom GPT's Instructions field.

### Key Features in Instructions:

✅ **Numbered Options Everywhere**
- Cities: 1️⃣ San Francisco, 2️⃣ New York, 3️⃣ Los Angeles, 4️⃣ Chicago, 5️⃣ Bangalore
- Cuisines: 1️⃣ Indian, 2️⃣ Italian, 3️⃣ Chinese, 4️⃣ Japanese, 5️⃣ Mexican, 6️⃣ Thai
- Restaurants: 1️⃣ Restaurant Name, 2️⃣ Restaurant Name...
- Actions: 1️⃣ Add items, 2️⃣ Checkout, 3️⃣ View cart

✅ **Smart Decision Logic**
- Use `intelligentSearch` for complex queries (dish, price, time, preferences)
- Use standard flow for vague queries ("I want food")

✅ **Consistent UX**
- Always show numbered options
- Always confirm before ordering
- Always show prices and delivery times

---

## Step 3: Test Your GPT

### Test 1: Intelligent Search (Complex Query)
```
I want Chicken Tikka Masala from an Indian restaurant in San Francisco
```

**Expected:**
- GPT calls `intelligentSearch`
- Shows: "I found 1 restaurants with Chicken Tikka Masala"
- Shows: 1️⃣ Taj Palace Indian Cuisine with Chicken Tikka Masala ($16.99)
- Asks: What would you like to do?

### Test 2: Standard Flow (Vague Query)
```
I want to order food
```

**Expected:**
- GPT calls `getCities`
- Shows: "Which city are you in? Choose one:"
- Shows: 1️⃣ San Francisco, 2️⃣ New York, 3️⃣ Los Angeles, 4️⃣ Chicago, 5️⃣ Bangalore

### Test 3: Multi-Constraint Query
```
Something spicy under $15 in San Francisco
```

**Expected:**
- GPT calls `intelligentSearch`
- Shows: "I found 4 restaurants"
- Shows: Restaurants with spicy items under $15
- Shows: Suggested items (Penne Arrabbiata $14.99, Spicy Tuna Roll $10.99)

### Test 4: Urgency Query
```
I am hungry, get me something in 20 minutes in San Francisco
```

**Expected:**
- GPT calls `intelligentSearch`
- Shows: "I found 3 restaurants"
- Shows: Fastest restaurants (20-30 min delivery)
- Sorted by delivery speed

---

## What Makes This Work

### 1. Numbered Options Format
```
1️⃣ Option 1
2️⃣ Option 2
3️⃣ Option 3
```

This creates a **clickable experience** where users can:
- Type the number (1, 2, 3)
- Type the full name ("San Francisco")
- Click on the option (ChatGPT recognizes numbered lists)

### 2. Decision Logic
```
Complex Query (dish/price/time/preferences)
  → Call intelligentSearch (1 API call, fast)

Vague Query ("I want food")
  → Use standard flow (getCities → getCuisines → searchRestaurants)
```

### 3. Consistent UX
- Every response has numbered options
- Every action is clear (1️⃣ Do this, 2️⃣ Do that)
- User always knows what to do next

---

## Demo Script

### Demo 1: Show Intelligence
```
You: "I want Chicken Tikka Masala from an Indian restaurant in San Francisco"

GPT: "I found 1 restaurants with Chicken Tikka Masala:

1️⃣ Taj Palace Indian Cuisine ⭐ 4.5
   Delivery: 30-45 min
   Suggested: Chicken Tikka Masala - $16.99 🌶️

What would you like to do?
1️⃣ See the full menu
2️⃣ Place an order
3️⃣ Refine your search"

You: "Amazing! It understood exactly what I wanted AND gave me numbered options!"
```

### Demo 2: Show Guided Flow
```
You: "I want to order food"

GPT: "Which city are you in? Choose one:

1️⃣ San Francisco
2️⃣ New York
3️⃣ Los Angeles
4️⃣ Chicago
5️⃣ Bangalore"

You: "1"

GPT: "Great! What type of cuisine would you like in San Francisco?

1️⃣ Indian
2️⃣ Italian
3️⃣ Chinese
4️⃣ Japanese
5️⃣ Mexican
6️⃣ Thai"

You: "See how it guides me step by step with numbered options?"
```

### Demo 3: Show Multi-Constraint
```
You: "Something spicy under $15 in San Francisco"

GPT: "I found 4 restaurants:

1️⃣ Mama Mia Italian Kitchen ⭐ 4.7
   Suggested: Penne Arrabbiata - $14.99 🌶️

2️⃣ Tokyo Sushi Bar ⭐ 4.6
   Suggested: Spicy Tuna Roll - $10.99 🌶️

3️⃣ Taj Palace Indian Cuisine ⭐ 4.5
   ...

What would you like to do?
1️⃣ See the full menu for a restaurant
2️⃣ Place an order
3️⃣ Refine your search"

You: "It handles multiple constraints AND shows numbered options!"
```

---

## Troubleshooting

### Issue: GPT not showing numbered options

**Solution:** Make sure you copied the **entire** content from `CUSTOM_GPT_INSTRUCTIONS_FINAL.md` including all the formatting examples.

### Issue: GPT not using intelligentSearch

**Solution:** Test with more specific queries:
- "I want [specific dish] from [cuisine] restaurant"
- "Something [preference] under $[price]"
- "I am hungry, get me something in [X] minutes"

### Issue: Options showing as bullets instead of numbers

**Solution:** The instructions use emoji numbers (1️⃣ 2️⃣ 3️⃣). Make sure these are copied correctly.

---

## Summary

✅ **Import Schema:** `https://ai-food-ordering-poc.vercel.app/openapi-production.json`  
✅ **Copy Instructions:** From `CUSTOM_GPT_INSTRUCTIONS_FINAL.md`  
✅ **Test:** Use the 4 demo queries above  
✅ **Result:** Numbered options everywhere, smart API selection, great UX  

**Your Custom GPT is ready for demo!** 🚀

