# Custom GPT Setup - Quick Guide

## ✅ Prerequisites

- Backend API deployed: `https://ai-food-ordering-poc.vercel.app`
- Intelligent search endpoint working: `GET /api/v1/search/intelligent`
- OpenAPI schema available: `https://ai-food-ordering-poc.vercel.app/openapi-production.json`

---

## Step-by-Step Setup

### Step 1: Go to Custom GPT Editor

1. Open ChatGPT
2. Click your profile → "My GPTs"
3. Find your food ordering GPT or create new one
4. Click "Configure"

---

### Step 2: Update Instructions

Copy the **entire content** from `CUSTOM_GPT_INSTRUCTIONS_FINAL.md` and paste into the "Instructions" field.

**Key points in the instructions:**
- ✅ Use `intelligentSearch` for complex queries
- ✅ Use standard flow for vague queries
- ✅ Always confirm before placing orders
- ✅ Show prices and delivery times

---

### Step 3: Import/Update API Actions

#### Option A: Import from URL (Recommended)

1. Go to "Actions" section
2. Click "Import from URL"
3. Enter: `https://ai-food-ordering-poc.vercel.app/openapi-production.json`
4. Click "Import"
5. ✅ This will automatically add all endpoints including `intelligentSearch`

#### Option B: Manual (if import doesn't work)

If the import fails, add this schema manually:

```yaml
openapi: 3.1.0
info:
  title: AI Food Ordering API
  version: 1.0.0
servers:
  - url: https://ai-food-ordering-poc.vercel.app
paths:
  /api/v1/search/intelligent:
    get:
      operationId: intelligentSearch
      summary: Search restaurants using natural language
      parameters:
        - name: query
          in: query
          required: true
          schema:
            type: string
          description: Natural language query
        - name: location
          in: query
          required: false
          schema:
            type: string
            default: "San Francisco"
          description: City name
      responses:
        '200':
          description: Search results
          content:
            application/json:
              schema:
                type: object
                properties:
                  message:
                    type: string
                  query:
                    type: string
                  location:
                    type: string
                  parsed:
                    type: object
                  restaurants:
                    type: array
                  suggested_items:
                    type: array
```

---

### Step 4: Verify Actions

After importing, you should see these actions:

✅ **intelligentSearch** - GET /api/v1/search/intelligent (NEW!)
✅ getCities - GET /api/v1/cities
✅ getCuisines - GET /api/v1/cuisines
✅ searchRestaurants - GET /api/v1/restaurants/search
✅ getMenu - GET /api/v1/restaurants/{id}/menu
✅ createOrder - POST /api/v1/orders/create
✅ trackOrder - GET /api/v1/orders/{id}/track

---

### Step 5: Test Your GPT

Try these test queries:

#### Test 1: Intelligent Search (Complex Query)
```
"I want tandoori chicken from an Indian restaurant in San Francisco"
```

**Expected:**
- GPT calls `intelligentSearch`
- Shows Taj Palace Indian Cuisine
- Offers to show menu or place order

#### Test 2: Standard Flow (Vague Query)
```
"I want to order food"
```

**Expected:**
- GPT calls `getCities`
- Asks which city
- Then asks for cuisine
- Shows restaurants

#### Test 3: Multi-Constraint Query
```
"Something spicy under $15 in 20 minutes in San Francisco"
```

**Expected:**
- GPT calls `intelligentSearch`
- Shows restaurants with spicy items under $15
- Shows delivery times

#### Test 4: Simple Cuisine Query
```
"Show me Italian restaurants in San Francisco"
```

**Expected:**
- GPT calls `searchRestaurants` with cuisine=Italian
- Shows Italian restaurants

---

### Step 6: Save and Publish

1. Click "Save" in top right
2. Test in the preview pane
3. If everything works, click "Publish"
4. Choose visibility (Only me / Anyone with link / Public)

---

## Troubleshooting

### Issue: GPT not using intelligentSearch

**Check:**
- Instructions mention intelligentSearch
- Action is imported correctly
- Test with explicit query: "tandoori chicken from Indian restaurant"

### Issue: API calls failing

**Check:**
- Backend is deployed: https://ai-food-ordering-poc.vercel.app/health
- OpenAPI schema is accessible: https://ai-food-ordering-poc.vercel.app/openapi-production.json
- No authentication required (it's public)

### Issue: GPT always uses standard flow

**Solution:**
- Make sure instructions clearly state when to use intelligentSearch
- Test with more specific queries
- Check that intelligentSearch action is available

---

## Quick Test Commands

Test the API directly:

```bash
# Test 1: Health check
curl https://ai-food-ordering-poc.vercel.app/health

# Test 2: Intelligent search
curl -G "https://ai-food-ordering-poc.vercel.app/api/v1/search/intelligent" \
  --data-urlencode "query=tandoori chicken from Indian restaurant" \
  --data-urlencode "location=San Francisco"

# Test 3: Cities
curl https://ai-food-ordering-poc.vercel.app/api/v1/cities

# Test 4: Cuisines
curl "https://ai-food-ordering-poc.vercel.app/api/v1/cuisines?city=San%20Francisco"
```

All should return JSON responses in <1 second.

---

## Summary

1. ✅ Copy instructions from `CUSTOM_GPT_INSTRUCTIONS_FINAL.md`
2. ✅ Import schema from `https://ai-food-ordering-poc.vercel.app/openapi-production.json`
3. ✅ Verify `intelligentSearch` action is available
4. ✅ Test with complex queries
5. ✅ Save and publish

**You're ready to demo! 🚀**

---

## URLs You Need

- **Backend API**: https://ai-food-ordering-poc.vercel.app
- **Health Check**: https://ai-food-ordering-poc.vercel.app/health
- **OpenAPI Schema**: https://ai-food-ordering-poc.vercel.app/openapi-production.json
- **API Docs**: https://ai-food-ordering-poc.vercel.app/docs
- **Intelligent Search**: https://ai-food-ordering-poc.vercel.app/api/v1/search/intelligent

All endpoints are live and tested! ✅

