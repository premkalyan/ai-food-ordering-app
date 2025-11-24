# Intelligent Search - Testing Guide

## Quick Start

The intelligent search endpoint is now live and ready to test!

**Backend API:** `https://ai-food-ordering-poc.vercel.app`
**Endpoint:** `POST /api/v1/search/intelligent`

---

## Testing the API Directly

### Using curl

```bash
# Example 1: Specific Dish Query
curl -X POST https://ai-food-ordering-poc.vercel.app/api/v1/search/intelligent \
  -H "Content-Type: application/json" \
  -d '{
    "query": "I would like to try Tandoori Chicken from an Indian restaurant",
    "location": "San Francisco"
  }'

# Example 2: Urgency + Preference
curl -X POST https://ai-food-ordering-poc.vercel.app/api/v1/search/intelligent \
  -H "Content-Type: application/json" \
  -d '{
    "query": "I am hungry, get me something spicy in 15 minutes",
    "location": "San Francisco"
  }'

# Example 3: Multi-Constraint
curl -X POST https://ai-food-ordering-poc.vercel.app/api/v1/search/intelligent \
  -H "Content-Type: application/json" \
  -d '{
    "query": "Something Italian under $5 in 10 minutes",
    "location": "San Francisco"
  }'

# Example 4: Favorites
curl -X POST https://ai-food-ordering-poc.vercel.app/api/v1/search/intelligent \
  -H "Content-Type: application/json" \
  -d '{
    "query": "Order my favorite Italian food",
    "user_id": "user123",
    "location": "San Francisco"
  }'
```

### Using Python

```python
import requests

url = "https://ai-food-ordering-poc.vercel.app/api/v1/search/intelligent"

# Test query
data = {
    "query": "I want something spicy in 15 minutes",
    "location": "San Francisco"
}

response = requests.post(url, json=data)
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
  "query": "I'm hungry, get me something spicy in 15 minutes",
  "location": "San Francisco"
}
```

**Expected Output:**
- `parsed_query.urgency`: "high"
- `parsed_query.preferences`: ["spicy"]
- `parsed_query.time_max`: 15
- `restaurants`: Sorted by fastest delivery
- `suggested_items`: Spicy items only
- `message`: "Found X restaurants, fastest delivery in Y"

**Success Criteria:**
- ✓ Detects urgency
- ✓ Extracts spicy preference
- ✓ Filters by delivery time
- ✓ Sorts by speed
- ✓ Returns only spicy items

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
- `restaurants`: [] (empty)
- `message`: "No restaurants match your criteria."
- `alternatives`: [
    "Try increasing your budget above $5",
    "Allow more than 10 minutes for delivery",
    "Try a different cuisine"
  ]

**Success Criteria:**
- ✓ Extracts all constraints
- ✓ Returns empty results
- ✓ Provides helpful alternatives
- ✓ Suggests specific adjustments

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

## Testing in Custom GPT

### Step 1: Update Custom GPT

1. Go to your Custom GPT editor
2. Replace instructions with content from `CUSTOM_GPT_INSTRUCTIONS_V3_INTELLIGENT.md`
3. Add new API Action for `intelligentSearch`:

**Action Schema:**
```yaml
paths:
  /api/v1/search/intelligent:
    post:
      operationId: intelligentSearch
      summary: Search restaurants using natural language query
      requestBody:
        required: true
        content:
          application/json:
            schema:
              type: object
              properties:
                query:
                  type: string
                  description: Natural language query
                user_id:
                  type: string
                  description: User ID for personalization
                location:
                  type: string
                  description: User location/city
              required:
                - query
      responses:
        '200':
          description: Search results
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

