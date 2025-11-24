# Intelligent Query Processing - Implementation Plan

## Overview

Enable the AI Food Ordering system to handle complex, natural language queries without requiring users to provide information in a specific order or format.

## Problem Statement

**Current Flow (Rigid):**
```
User: "I want to order food"
System: "Which city?"
User: "Bangalore"
System: "Which cuisine?"
User: "Indian"
System: "Here are restaurants..."
```

**Desired Flow (Intelligent):**
```
User: "I'm hungry, get me something spicy in 15 minutes"
System: Analyzes → Filters → Presents best options
```

---

## Use Cases

### Example 1: Specific Dish Query
**User:** "I would like to try Tandoori Chicken from an Indian restaurant"

**System Processing:**
1. Extract: dish="Tandoori Chicken", cuisine="Indian"
2. Detect user location (or ask)
3. Search restaurants: cuisine=Indian, has_dish=Tandoori Chicken
4. Present: Restaurants with Tandoori Chicken, sorted by rating
5. User selects → Order

### Example 2: Favorites-Based Query
**User:** "Pick my favorite Italian restaurant, order my favorite food"

**System Processing:**
1. Retrieve: user_favorites (restaurants + items)
2. Filter: cuisine=Italian
3. Get: favorite_restaurant, favorite_items
4. Auto-populate cart with favorite items
5. Confirm → Place order

### Example 3: Constraint-Based Query
**User:** "I'm hungry, get me something spicy in 15 minutes"

**System Processing:**
1. Extract: urgency=high, preference=spicy, time_constraint=15min
2. Detect location
3. Filter restaurants: delivery_time<=15min
4. Filter menu items: spicy=true
5. Sort by: fastest delivery + rating
6. Present: Top 3 options

### Example 4: Multi-Constraint Query
**User:** "I want to eat something in $5, should reach me in 10 minutes and should be Italian. If possible, order something, otherwise say no."

**System Processing:**
1. Extract: budget=$5, time=10min, cuisine=Italian
2. Search: cuisine=Italian, delivery_time<=10min
3. Filter menu: price<=$5
4. If results exist → Present options
5. If no results → "No Italian restaurants can deliver under $5 in 10 minutes. Would you like to adjust constraints?"

---

## Technical Architecture

### 1. Query Understanding Layer

**Component:** Natural Language Processing (NLP) Parser

**Responsibilities:**
- Extract entities (cuisine, dish, price, time, preferences)
- Identify intent (search, order, favorite, constraint-based)
- Handle ambiguity and missing information

**Implementation:**

```python
class QueryParser:
    def parse(self, user_query: str) -> ParsedQuery:
        """
        Parse natural language query into structured data
        """
        return ParsedQuery(
            intent="search",  # search, order, favorite, constraint
            cuisine=["Italian"],
            dish=None,
            price_max=5.0,
            time_max=10,
            preferences=["spicy"],
            location="Bangalore",
            use_favorites=False
        )
```

**Extraction Rules:**

| Entity | Keywords/Patterns | Example |
|--------|------------------|---------|
| **Cuisine** | Indian, Italian, Chinese, Thai, etc. | "Italian restaurant" |
| **Dish** | Specific food names | "Tandoori Chicken", "Margherita Pizza" |
| **Price** | $X, under $X, budget $X | "$5", "under $10" |
| **Time** | X minutes, fast, quick, ASAP | "15 minutes", "quick" |
| **Preferences** | spicy, vegetarian, vegan, healthy | "something spicy" |
| **Favorites** | my favorite, usual, regular | "my favorite restaurant" |
| **Urgency** | hungry, starving, ASAP | "I'm hungry" |

### 2. Smart Filtering Engine

**Component:** Multi-Constraint Filter

**Responsibilities:**
- Apply all constraints simultaneously
- Handle missing data gracefully
- Prioritize results by relevance

**Implementation:**

```python
class SmartFilter:
    def filter_restaurants(
        self,
        query: ParsedQuery,
        restaurants: List[Restaurant]
    ) -> List[Restaurant]:
        """
        Apply multi-constraint filtering
        """
        results = restaurants
        
        # Apply cuisine filter
        if query.cuisine:
            results = [r for r in results if r.cuisine in query.cuisine]
        
        # Apply time constraint
        if query.time_max:
            results = [r for r in results 
                      if r.delivery_time <= query.time_max]
        
        # Apply dish filter
        if query.dish:
            results = [r for r in results 
                      if self.has_dish(r, query.dish)]
        
        # Sort by relevance
        results = self.sort_by_relevance(results, query)
        
        return results
    
    def filter_menu_items(
        self,
        query: ParsedQuery,
        menu: List[MenuItem]
    ) -> List[MenuItem]:
        """
        Filter menu items by constraints
        """
        results = menu
        
        # Apply price filter
        if query.price_max:
            results = [item for item in results 
                      if item.price <= query.price_max]
        
        # Apply preference filter
        if "spicy" in query.preferences:
            results = [item for item in results 
                      if item.is_spicy]
        
        if "vegetarian" in query.preferences:
            results = [item for item in results 
                      if item.is_vegetarian]
        
        return results
```

### 3. Favorites Management

**Component:** User Favorites Service

**Responsibilities:**
- Store user preferences (restaurants, dishes)
- Retrieve favorites by cuisine/category
- Track order history for personalization

**Implementation:**

```python
class FavoritesService:
    def get_favorite_restaurant(
        self,
        user_id: str,
        cuisine: Optional[str] = None
    ) -> Optional[Restaurant]:
        """
        Get user's favorite restaurant, optionally filtered by cuisine
        """
        favorites = self.get_user_favorites(user_id)
        
        if cuisine:
            favorites = [f for f in favorites 
                        if f.cuisine == cuisine]
        
        # Return most frequently ordered
        return max(favorites, key=lambda f: f.order_count)
    
    def get_favorite_items(
        self,
        user_id: str,
        restaurant_id: str
    ) -> List[MenuItem]:
        """
        Get user's favorite items from a specific restaurant
        """
        history = self.get_order_history(user_id, restaurant_id)
        
        # Count item frequency
        item_counts = {}
        for order in history:
            for item in order.items:
                item_counts[item.id] = item_counts.get(item.id, 0) + 1
        
        # Return top 3 most ordered items
        top_items = sorted(item_counts.items(), 
                          key=lambda x: x[1], 
                          reverse=True)[:3]
        
        return [self.get_item(item_id) for item_id, _ in top_items]
```

### 4. Response Generation

**Component:** Smart Response Builder

**Responsibilities:**
- Format results for user
- Handle no-results gracefully
- Suggest alternatives when constraints too strict

**Implementation:**

```python
class ResponseBuilder:
    def build_response(
        self,
        query: ParsedQuery,
        results: List[Restaurant]
    ) -> str:
        """
        Build natural language response
        """
        if not results:
            return self.handle_no_results(query)
        
        if len(results) == 1:
            return self.build_single_result(results[0], query)
        
        return self.build_multiple_results(results, query)
    
    def handle_no_results(self, query: ParsedQuery) -> str:
        """
        Suggest alternatives when no results found
        """
        suggestions = []
        
        if query.price_max:
            suggestions.append(f"increase budget above ${query.price_max}")
        
        if query.time_max:
            suggestions.append(f"allow more than {query.time_max} minutes")
        
        if query.cuisine:
            suggestions.append(f"try a different cuisine")
        
        return f"No restaurants match your criteria. Try: {', '.join(suggestions)}"
```

---

## API Enhancements

### New Endpoints

#### 1. Intelligent Search

```python
@app.post("/api/v1/search/intelligent")
async def intelligent_search(request: IntelligentSearchRequest):
    """
    Handle complex natural language queries
    
    Request:
    {
        "query": "I'm hungry, get me something spicy in 15 minutes",
        "user_id": "user123",
        "location": "Bangalore"
    }
    
    Response:
    {
        "parsed_query": {
            "intent": "search",
            "cuisine": null,
            "preferences": ["spicy"],
            "time_max": 15,
            "urgency": "high"
        },
        "restaurants": [...],
        "suggested_items": [...],
        "message": "Found 3 restaurants with spicy food, fastest delivery in 12 minutes"
    }
    """
    # Parse query
    parsed = query_parser.parse(request.query)
    
    # Apply filters
    restaurants = smart_filter.filter_restaurants(parsed, all_restaurants)
    
    # Get relevant menu items
    items = []
    for restaurant in restaurants:
        menu = get_menu(restaurant.id)
        filtered_items = smart_filter.filter_menu_items(parsed, menu)
        items.extend(filtered_items)
    
    # Build response
    response = response_builder.build_response(parsed, restaurants)
    
    return {
        "parsed_query": parsed,
        "restaurants": restaurants,
        "suggested_items": items,
        "message": response
    }
```

#### 2. Favorites-Based Order

```python
@app.post("/api/v1/orders/from-favorites")
async def order_from_favorites(request: FavoriteOrderRequest):
    """
    Create order from user favorites
    
    Request:
    {
        "user_id": "user123",
        "query": "Order my favorite Italian food",
        "location": "Bangalore"
    }
    
    Response:
    {
        "restaurant": {...},
        "items": [...],
        "total": 25.50,
        "estimated_delivery": "30-40 mins",
        "confirmation_required": true
    }
    """
    # Parse query
    parsed = query_parser.parse(request.query)
    
    # Get favorite restaurant
    restaurant = favorites_service.get_favorite_restaurant(
        request.user_id,
        parsed.cuisine[0] if parsed.cuisine else None
    )
    
    # Get favorite items
    items = favorites_service.get_favorite_items(
        request.user_id,
        restaurant.id
    )
    
    # Build order preview
    return {
        "restaurant": restaurant,
        "items": items,
        "total": sum(item.price for item in items),
        "estimated_delivery": restaurant.delivery_time,
        "confirmation_required": True
    }
```

#### 3. Constraint Validation

```python
@app.post("/api/v1/search/validate-constraints")
async def validate_constraints(request: ConstraintRequest):
    """
    Check if constraints are achievable
    
    Request:
    {
        "cuisine": "Italian",
        "price_max": 5.0,
        "time_max": 10,
        "location": "Bangalore"
    }
    
    Response:
    {
        "achievable": false,
        "reason": "No Italian restaurants can deliver in 10 minutes with items under $5",
        "suggestions": [
            "Increase budget to $8 for Italian delivery in 10 minutes",
            "Allow 20 minutes for Italian food under $5",
            "Try Chinese cuisine for faster delivery under $5"
        ]
    }
    """
    # Check if any restaurants match
    restaurants = smart_filter.filter_restaurants(request, all_restaurants)
    
    if restaurants:
        # Check if menu items match price
        items = []
        for r in restaurants:
            menu = get_menu(r.id)
            filtered = smart_filter.filter_menu_items(request, menu)
            items.extend(filtered)
        
        if items:
            return {"achievable": True, "restaurants": restaurants, "items": items}
    
    # Generate suggestions
    suggestions = constraint_suggester.generate_suggestions(request)
    
    return {
        "achievable": False,
        "reason": constraint_suggester.explain_failure(request),
        "suggestions": suggestions
    }
```

---

## MCP Implementation

### Updated MCP Tools

#### 1. Intelligent Search Tool

```javascript
server.tool(
  "intelligent_search",
  "Search restaurants using natural language query with complex constraints",
  {
    query: z.string().describe("Natural language query (e.g., 'spicy food in 15 minutes under $10')"),
    user_id: z.string().optional().describe("User ID for personalization"),
    location: z.string().optional().describe("User location")
  },
  async ({ query, user_id, location }) => {
    const response = await fetch(`${API_BASE}/api/v1/search/intelligent`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query, user_id, location })
    });
    
    const data = await response.json();
    
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(data, null, 2)
        },
        {
          type: "resource",
          resource: {
            uri: "ui://restaurant-results",
            mimeType: "application/vnd.ui+json",
            text: JSON.stringify({
              type: "restaurant_list",
              restaurants: data.restaurants,
              message: data.message,
              parsed_query: data.parsed_query
            })
          }
        }
      ]
    };
  }
);
```

#### 2. Favorites Order Tool

```javascript
server.tool(
  "order_from_favorites",
  "Create order based on user's favorite restaurant and items",
  {
    user_id: z.string().describe("User ID"),
    cuisine: z.string().optional().describe("Cuisine preference (e.g., 'Italian')"),
    location: z.string().describe("Delivery location")
  },
  async ({ user_id, cuisine, location }) => {
    const response = await fetch(`${API_BASE}/api/v1/orders/from-favorites`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        user_id,
        query: cuisine ? `Order my favorite ${cuisine} food` : "Order my favorites",
        location
      })
    });
    
    const data = await response.json();
    
    return {
      content: [
        {
          type: "text",
          text: `Found your favorite: ${data.restaurant.name}\nItems: ${data.items.map(i => i.name).join(', ')}\nTotal: $${data.total}`
        },
        {
          type: "resource",
          resource: {
            uri: "ui://order-preview",
            mimeType: "application/vnd.ui+json",
            text: JSON.stringify({
              type: "order_preview",
              restaurant: data.restaurant,
              items: data.items,
              total: data.total,
              estimated_delivery: data.estimated_delivery
            })
          }
        }
      ]
    };
  }
);
```

---

## Custom GPT Instructions Update

### Enhanced Instructions

```markdown
You are an AI Food Ordering Assistant with intelligent query processing capabilities.

## Core Capabilities

1. **Natural Language Understanding**
   - Parse complex queries with multiple constraints
   - Extract: cuisine, dish, price, time, preferences, favorites
   - Handle ambiguous or incomplete information

2. **Smart Filtering**
   - Apply multiple constraints simultaneously
   - Prioritize results by relevance
   - Handle impossible constraints gracefully

3. **Personalization**
   - Remember user favorites (restaurants and dishes)
   - Suggest based on order history
   - Auto-populate orders from favorites

## Query Handling Examples

### Example 1: Specific Dish
User: "I would like to try Tandoori Chicken from an Indian restaurant"
Process:
1. Call intelligent_search with query
2. System extracts: dish="Tandoori Chicken", cuisine="Indian"
3. Present restaurants with this dish
4. User selects → Show menu → Order

### Example 2: Favorites
User: "Pick my favorite Italian restaurant, order my favorite food"
Process:
1. Call order_from_favorites with cuisine="Italian"
2. System retrieves favorite restaurant and items
3. Show order preview with pre-selected items
4. Confirm → Place order

### Example 3: Urgency + Preference
User: "I'm hungry, get me something spicy in 15 minutes"
Process:
1. Call intelligent_search with query
2. System filters: spicy=true, time<=15min
3. Present top 3 fastest options
4. User selects → Order

### Example 4: Multi-Constraint
User: "I want to eat something in $5, should reach me in 10 minutes and should be Italian"
Process:
1. Call intelligent_search with query
2. System checks: cuisine=Italian, price<=$5, time<=10min
3. If results exist → Present
4. If no results → Suggest alternatives:
   - "No Italian restaurants match. Try:"
   - "Increase budget to $8 for Italian in 10 mins"
   - "Allow 20 minutes for Italian under $5"
   - "Try Chinese for faster delivery under $5"

## Response Guidelines

- **Be conversational**: "I found 3 restaurants with spicy food, fastest delivery in 12 minutes!"
- **Handle failures gracefully**: Suggest alternatives when constraints too strict
- **Confirm before ordering**: Always show order summary before placing
- **Use favorites proactively**: "Would you like your usual from Pizza Palace?"
```

---

## Implementation Phases

### Phase 1: Query Parser (Week 1)
- [ ] Build NLP parser for entity extraction
- [ ] Test with 50+ example queries
- [ ] Handle edge cases and ambiguity
- [ ] Deploy to backend API

### Phase 2: Smart Filtering (Week 2)
- [ ] Implement multi-constraint filter
- [ ] Add relevance scoring algorithm
- [ ] Test with real restaurant data
- [ ] Optimize performance

### Phase 3: Favorites System (Week 3)
- [ ] Build favorites database schema
- [ ] Implement favorites API endpoints
- [ ] Add order history tracking
- [ ] Test personalization logic

### Phase 4: API Integration (Week 4)
- [ ] Create 3 new API endpoints
- [ ] Update existing endpoints
- [ ] Add comprehensive error handling
- [ ] Deploy to production

### Phase 5: MCP Tools (Week 5)
- [ ] Update MCP server with new tools
- [ ] Test intelligent_search tool
- [ ] Test order_from_favorites tool
- [ ] Deploy MCP updates

### Phase 6: Custom GPT Update (Week 6)
- [ ] Update GPT instructions
- [ ] Test all query examples
- [ ] Gather user feedback
- [ ] Iterate and improve

---

## Testing Strategy

### Test Cases

| Query | Expected Behavior |
|-------|------------------|
| "Tandoori Chicken from Indian restaurant" | Filter by dish + cuisine |
| "My favorite Italian restaurant" | Retrieve user favorites |
| "Spicy food in 15 minutes" | Filter by preference + time |
| "Italian under $5 in 10 minutes" | Multi-constraint filter |
| "I'm hungry" | Show fastest delivery options |
| "Order my usual" | Auto-populate from history |
| "Something healthy and quick" | Filter by preference + time |
| "Best pizza near me" | Location + dish + rating |

### Success Metrics

- **Query Understanding Accuracy:** >90%
- **Constraint Satisfaction Rate:** >85%
- **User Satisfaction:** 4.5+ rating
- **Order Completion Rate:** >70%
- **Response Time:** <2 seconds

---

## Benefits

### For Users
1. **Natural interaction** - No rigid conversation flow
2. **Faster ordering** - One query instead of 5 steps
3. **Personalized** - Remembers favorites and preferences
4. **Intelligent** - Handles complex constraints
5. **Helpful** - Suggests alternatives when needed

### For Business
1. **Higher conversion** - Easier ordering = more orders
2. **Better retention** - Personalization increases loyalty
3. **Competitive advantage** - Unique AI capability
4. **Scalable** - Works for any cuisine/location
5. **Data insights** - Learn user preferences

---

## Next Steps

1. **Review this plan** with stakeholders
2. **Prioritize features** based on impact
3. **Start Phase 1** (Query Parser)
4. **Update presentation** with new capabilities
5. **Demo to early users** for feedback

---

**This intelligent query processing capability is a key differentiator that makes our AI Food Ordering system truly conversational and user-friendly.**

