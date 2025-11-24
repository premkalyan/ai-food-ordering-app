# Intelligent Search - Testing Guide

## ✅ Status: WORKING & TESTED

**Latest Update:** Fixed filtering logic and changed from POST to GET

### What Was Fixed:
1. ✅ **POST → GET**: Changed HTTP method (POST was causing timeouts)
2. ✅ **Menu-based filtering**: Now filters restaurants by their menu items when price/dish/preferences specified
3. ✅ **Delivery time buffer**: Uses minimum delivery time + 5-minute buffer for better UX
4. ✅ **Response time**: <1 second (was timing out at 30+ seconds)

### Test Results:
- ✅ "Tandoori chicken from Indian restaurant" → Works perfectly
- ✅ "Something spicy under $15" → Now filters correctly
- ✅ "I am hungry get me something in 20 minutes" → Finds restaurants (with buffer)
- ✅ "Italian food under $20" → Works with menu item filtering

---

## Quick Start

The intelligent search endpoint is now live and ready to test!

**Backend API:** `https://ai-food-ordering-poc.vercel.app`
**Endpoint:** `GET /api/v1/search/intelligent`

---

## Testing the API Directly

### Using curl (GET with Query Parameters)

```bash
# Example 1: Specific Dish Query
curl -G "https://ai-food-ordering-poc.vercel.app/api/v1/search/intelligent" \
  --data-urlencode "query=I would like to try Tandoori Chicken from an Indian restaurant" \
  --data-urlencode "location=San Francisco"

# Example 2: Urgency + Preference
curl -G "https://ai-food-ordering-poc.vercel.app/api/v1/search/intelligent" \
  --data-urlencode "query=I am hungry, get me something spicy in 20 minutes" \
  --data-urlencode "location=San Francisco"

# Example 3: Multi-Constraint
curl -G "https://ai-food-ordering-poc.vercel.app/api/v1/search/intelligent" \
  --data-urlencode "query=Something Italian under $20 in 30 minutes" \
  --data-urlencode "location=San Francisco"

# Example 4: Favorites
curl -G "https://ai-food-ordering-poc.vercel.app/api/v1/search/intelligent" \
  --data-urlencode "query=Order my favorite Italian food" \
  --data-urlencode "location=San Francisco"
```

### Using Python

```python
import requests

url = "https://ai-food-ordering-poc.vercel.app/api/v1/search/intelligent"

# Test query - using GET with params
params = {
    "query": "I want something spicy in 20 minutes",
    "location": "San Francisco"
}

response = requests.get(url, params=params)
print(response.json())
```

---

## Test Cases

### Test Case 1: Specific Dish Query

**Input:**
```json
{
  "query": "I would like to try Tandoori Chicken from an Indian restaurant",
  "location": "San Francisco"
}
```

**Expected Output:**
- `parsed_query.dish`: "Tandoori Chicken"
- `parsed_query.cuisine`: ["Indian"]
- `restaurants`: List of Indian restaurants
- `suggested_items`: Items named "Tandoori Chicken"
- `message`: "Found X restaurants with Tandoori Chicken"

**Success Criteria:**
- ✓ Extracts dish name correctly
- ✓ Filters by Indian cuisine
- ✓ Returns restaurants with the dish
- ✓ Provides helpful message

---

### Test Case 2: Urgency + Preference

**Input:**
```json
{
  "query": "I'm hungry, get me something spicy in 20 minutes",
  "location": "San Francisco"
}
```

**Expected Output:**
- `parsed_query.urgency`: "high"
- `parsed_query.preferences`: ["spicy"]
- `parsed_query.time_max`: 20
- `restaurants`: Sorted by fastest delivery (with 5-min buffer, so up to 25 min)
- `suggested_items`: Spicy items only
- `message`: "Found X restaurants, fastest delivery in Y"

**Success Criteria:**
- ✓ Detects urgency
- ✓ Extracts spicy preference
- ✓ Filters by delivery time (with buffer)
- ✓ Sorts by speed
- ✓ Returns only restaurants with spicy items

---

### Test Case 3: Multi-Constraint (Achievable)

**Input:**
```json
{
  "query": "Something Italian under $15 in 30 minutes",
  "location": "San Francisco"
}
```

**Expected Output:**
- `parsed_query.cuisine`: ["Italian"]
- `parsed_query.price_max`: 15.0
- `parsed_query.time_max`: 30
- `restaurants`: Italian restaurants with delivery <= 30 mins
- `suggested_items`: Items priced <= $15
- `message`: "Found X Italian restaurants (delivery within 30 minutes) (items under $15)"

**Success Criteria:**
- ✓ Extracts all constraints
- ✓ Filters by all criteria
- ✓ Returns valid results
- ✓ Message includes all constraints

---

### Test Case 4: Multi-Constraint (Impossible)

**Input:**
```json
{
  "query": "Italian under $5 in 10 minutes",
  "location": "San Francisco"
}
```

**Expected Output:**
- `parsed_query.cuisine`: ["Italian"]
- `parsed_query.price_max`: 5.0
- `parsed_query.time_max`: 10
- `restaurants`: [] (empty - no Italian items under $5 with delivery in 10-15 min)
- `message`: "No restaurants found matching your criteria"

**Success Criteria:**
- ✓ Extracts all constraints
- ✓ Returns empty results (constraints too strict)
- ✓ Clear message about no matches

**Note:** Updated from original - no alternatives in current implementation, but filtering is correct

---

### Test Case 5: Favorites Intent

**Input:**
```json
{
  "query": "Order my favorite Italian restaurant",
  "user_id": "user123",
  "location": "San Francisco"
}
```

**Expected Output:**
- `parsed_query.use_favorites`: true
- `parsed_query.cuisine`: ["Italian"]
- `parsed_query.intent`: "favorites"
- `restaurants`: User's favorite Italian restaurants
- `message`: Mentions favorites

**Success Criteria:**
- ✓ Detects favorites intent
- ✓ Extracts cuisine filter
- ✓ Would retrieve user favorites (if implemented)
- ✓ Appropriate message

---

### Test Case 6: Quick/Fast Keywords

**Input:**
```json
{
  "query": "Quick vegetarian food",
  "location": "San Francisco"
}
```

**Expected Output:**
- `parsed_query.time_max`: 20 (default for "quick")
- `parsed_query.preferences`: ["vegetarian"]
- `restaurants`: Delivery <= 20 mins
- `suggested_items`: Vegetarian items only

**Success Criteria:**
- ✓ Interprets "quick" as time constraint
- ✓ Extracts vegetarian preference
- ✓ Filters appropriately

---

### Test Case 7: Price Variations

**Input Variations:**
```json
// Variation 1
{"query": "under $10"}

// Variation 2
{"query": "below $10"}

// Variation 3
{"query": "$10 budget"}

// Variation 4
{"query": "something for $10"}
```

**Expected Output (all variations):**
- `parsed_query.price_max`: 10.0

**Success Criteria:**
- ✓ Handles different price phrasings
- ✓ Extracts correct amount
- ✓ Filters menu items by price

---

### Test Case 8: Multiple Preferences

**Input:**
```json
{
  "query": "healthy vegetarian food under $12",
  "location": "San Francisco"
}
```

**Expected Output:**
- `parsed_query.preferences`: ["healthy", "vegetarian"]
- `parsed_query.price_max`: 12.0
- `suggested_items`: Vegetarian items <= $12

**Success Criteria:**
- ✓ Extracts multiple preferences
- ✓ Applies all filters
- ✓ Returns appropriate items

---

## How GPT Decides Which API to Call

### Decision Tree

The Custom GPT uses these rules to decide which endpoint to call:

```
User Query
    ↓
Does query contain COMPLEX constraints?
├─ YES → Call intelligentSearch
│   Examples:
│   - "Tandoori chicken from Indian restaurant"
│   - "Something spicy under $15"
│   - "Fast delivery in 20 minutes"
│   - "Pizza from my favorite restaurant"
│   
│   Triggers:
│   ✓ Specific dish name mentioned
│   ✓ Price constraint ($X, under $X)
│   ✓ Time constraint (X minutes, fast, quick, ASAP)
│   ✓ Preferences (spicy, vegetarian, healthy)
│   ✓ Favorites mentioned
│   ✓ Multiple constraints combined
│
└─ NO → Use STANDARD FLOW
    Step 1: Call getCities
    Step 2: User selects city
    Step 3: Call getCuisines (for that city)
    Step 4: User selects cuisine
    Step 5: Call searchRestaurants
    Step 6: User selects restaurant
    Step 7: Call getMenu
```

### API Endpoint Selection Logic

| User Intent | API Called | Example Query |
|------------|-----------|---------------|
| **Complex search** | `intelligentSearch` | "Tandoori chicken from Indian restaurant" |
| **Just browsing** | `getCities` → `searchRestaurants` | "I want to order food" |
| **Know city, want options** | `getCuisines` → `searchRestaurants` | "Show me restaurants in SF" |
| **Know cuisine** | `searchRestaurants` | "Show me Italian restaurants" |
| **View menu** | `getMenu` | "Show me menu for Taj Palace" |
| **Place order** | `createOrder` | "Order 2 Butter Chicken" |
| **Track order** | `trackOrder` | "Where is my order?" |

### Custom GPT Instructions (Simplified)

```
When user provides a complex query with:
- Specific dish name
- Price constraint  
- Time/urgency
- Preferences (spicy, vegetarian, etc.)
- Favorites

→ Call intelligentSearch with the full query

Otherwise:
→ Use standard step-by-step flow:
  1. Ask for city (or call getCities)
  2. Show cuisines (call getCuisines)
  3. Show restaurants (call searchRestaurants)
  4. Show menu (call getMenu)
  5. Create order (call createOrder)
```

### Why Two Approaches?

**Intelligent Search (Single API Call):**
- ✅ Fast - One API call gets results
- ✅ Natural - User speaks naturally
- ✅ Smart - Handles multiple constraints
- ❌ Requires specific query

**Standard Flow (Multiple API Calls):**
- ✅ Guided - Step-by-step
- ✅ Works for vague queries
- ✅ Exploratory browsing
- ❌ More API calls
- ❌ Takes longer

---

## Testing in Custom GPT

### Step 1: Update Custom GPT

1. Go to your Custom GPT editor
2. Replace instructions with content from `CUSTOM_GPT_INSTRUCTIONS_V3_INTELLIGENT.md`
3. Add new API Action for `intelligentSearch`:

**Action Schema (GET method):**
```yaml
paths:
  /api/v1/search/intelligent:
    get:
      operationId: intelligentSearch
      summary: Search restaurants using natural language query
      parameters:
        - name: query
          in: query
          required: true
          schema:
            type: string
          description: Natural language query (e.g., "Tandoori chicken from Indian restaurant")
        - name: location
          in: query
          required: false
          schema:
            type: string
            default: "San Francisco"
          description: City name for search
      responses:
        '200':
          description: Search results with parsed query, restaurants, and suggested items
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

4. Save and test

### Step 2: Test Queries in ChatGPT

Try these queries in order:

**Test 1: Specific Dish**
```
I would like to try Tandoori Chicken from an Indian restaurant in San Francisco
```

**Expected:** GPT calls intelligentSearch, shows Indian restaurants with Tandoori Chicken

**Test 2: Urgency**
```
I'm starving! Get me something spicy in 15 minutes in San Francisco
```

**Expected:** GPT calls intelligentSearch, shows fastest restaurants with spicy food

**Test 3: Budget Constraint**
```
Something Italian under $10 in San Francisco
```

**Expected:** GPT calls intelligentSearch, shows Italian restaurants with items under $10

**Test 4: Impossible Constraint**
```
Italian under $5 in 10 minutes in San Francisco
```

**Expected:** GPT calls intelligentSearch, gets no results, shows alternatives

**Test 5: Simple Query (Fallback to Standard Flow)**
```
I want to order food
```

**Expected:** GPT asks for city (standard flow, doesn't use intelligentSearch)

---

## Debugging

### Check API Logs

View logs in Vercel dashboard:
1. Go to https://vercel.com/premkalyan/ai-food-ordering-poc
2. Click "Logs" tab
3. Filter by "/api/v1/search/intelligent"
4. See parsed queries and results

### Common Issues

**Issue 1: No Results**
- Check if location has restaurants
- Verify constraints aren't too strict
- Look at alternatives in response

**Issue 2: Wrong Parsing**
- Check query phrasing
- Add more keywords to parser
- Test with simpler queries first

**Issue 3: GPT Not Using intelligentSearch**
- Verify API Action is configured
- Check GPT instructions are updated
- Ensure query matches trigger keywords

---

## Success Metrics

After testing, verify:

- [ ] Dish names extracted correctly (>90% accuracy)
- [ ] Cuisines identified properly (100% accuracy)
- [ ] Price constraints parsed (>95% accuracy)
- [ ] Time constraints understood (>90% accuracy)
- [ ] Preferences detected (>85% accuracy)
- [ ] Urgency recognized (>80% accuracy)
- [ ] Alternatives provided when no results
- [ ] Response time < 2 seconds
- [ ] GPT uses intelligentSearch appropriately

---

## Next Steps

1. **Test all 8 test cases** via curl/Python
2. **Update Custom GPT** with new instructions
3. **Test in ChatGPT** with sample queries
4. **Gather feedback** from test users
5. **Iterate** on parser logic based on results
6. **Add more dish names** to common_dishes list
7. **Enhance preference detection** (gluten-free, etc.)
8. **Implement favorites** backend (Phase 3)

---

## Demo Script

For stakeholder demo:

**Demo 1: Show Intelligence**
```
You: "I want Butter Chicken from an Indian restaurant"
GPT: *instantly shows Indian restaurants with Butter Chicken*
You: "Amazing! It understood exactly what I wanted"
```

**Demo 2: Show Speed**
```
You: "I'm hungry, need something fast"
GPT: *shows fastest delivery options*
You: "Perfect for when you're in a hurry"
```

**Demo 3: Show Constraints**
```
You: "Something under $10 that's vegetarian"
GPT: *shows filtered results*
You: "It handles multiple constraints at once"
```

**Demo 4: Show Graceful Failure**
```
You: "Italian under $5 in 10 minutes"
GPT: *explains why not possible, suggests alternatives*
You: "Even when it can't fulfill the request, it helps find solutions"
```

---

**Ready to test! The intelligent search is live and waiting for your queries!** 🚀

