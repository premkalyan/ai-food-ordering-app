# AI Food Ordering - Testing & Demo Guide

## Overview

This guide covers comprehensive testing and demo scripts for the AI Food Ordering System. The scripts test all API endpoints, measure response times, and provide E2E demo scenarios.

## Test Scripts

### 1. Comprehensive Test Suite (`comprehensive_test_suite.py`)

**Purpose**: Automated testing of all API endpoints with response time measurement

**What it tests**:
- ✅ Basic endpoints (cities, cuisines)
- ✅ Restaurant search (all city × cuisine combinations = 40 tests)
- ✅ Menu retrieval
- ✅ Intelligent search (dishes, prices, time, preferences, complex queries)
- ✅ Order creation (POST)
- ✅ Order tracking

**Usage**:
```bash
# Run all tests
python3 comprehensive_test_suite.py

# Or make it executable and run
./comprehensive_test_suite.py
```

**Output**:
- Console output with colored results
- `test_results_YYYYMMDD_HHMMSS.json` - Detailed JSON results
- `test_summary_YYYYMMDD_HHMMSS.txt` - Text summary
- Individual response files: `test_N_response.json`

**Test Categories**:

| Category | Tests | Description |
|----------|-------|-------------|
| Basic Endpoints | 6 | Cities + Cuisines for all cities |
| Restaurant Search by City | 5 | All 5 cities |
| Restaurant Search by City & Cuisine | 40 | 5 cities × 8 cuisines |
| Menu Retrieval | 7 | Key restaurants from each city |
| Intelligent Search - Dishes | 10 | Common dish queries |
| Intelligent Search - Location | 5 | Dish + location combinations |
| Intelligent Search - Price | 7 | Price constraint queries |
| Intelligent Search - Time | 6 | Time/urgency queries |
| Intelligent Search - Preferences | 5 | Spicy, vegetarian, etc. |
| Intelligent Search - Complex | 6 | Multi-constraint queries |
| Intelligent Search - Edge Cases | 4 | Empty results, unavailable cuisines |
| Order Creation | 3 | POST requests with different orders |
| Order Tracking | 6 | Track orders over time |
| **TOTAL** | **~110 tests** | **Complete API coverage** |

**Response Time Metrics**:
- Average response time
- Min response time
- Max response time
- Per-test timing

### 2. E2E Demo Scripts (`e2e_demo_scripts.py`)

**Purpose**: Interactive demos showing complete user journeys

**Available Demos**:

#### Demo 1: Simple Order Flow (Standard API)
**User Journey**: Browse → Select → Order → Track
```
1. Get available cities
2. Select city and get cuisines
3. Select cuisine and get restaurants
4. View restaurant menu
5. Place order
6. Track order status (with updates)
```

#### Demo 2: Intelligent Search Flow
**User Journey**: Natural language queries
```
Scenario 1: "I want Chicken Tikka Masala in New York"
Scenario 2: "Italian food under $20"
Scenario 3: "I'm hungry, get me something spicy in 25 minutes"
Scenario 4: "vegetarian Thai food under $18 in 30 minutes"
```

#### Demo 3: Complete User Journey
**User Journey**: Intelligent search → Order → Track
```
1. Intelligent search: "I want sushi in Los Angeles under $20"
2. View full menu
3. Place order with multiple items
4. Track order progression over time
```

#### Demo 4: Multi-City Cuisine Coverage
**User Journey**: Show availability across all cities
```
1. Show Indian restaurants in all 5 cities
2. Test Chicken Tikka Masala availability everywhere
3. Demonstrate 100% coverage
```

**Usage**:
```bash
# Run interactively
python3 e2e_demo_scripts.py

# Select demo:
# 1 - Simple Order Flow
# 2 - Intelligent Search
# 3 - Complete Journey
# 4 - Multi-City Coverage
# 5 - Run All Demos
```

## Quick Start

### Prerequisites
```bash
# Install required packages
pip3 install requests
```

### Run Full Test Suite
```bash
cd /Users/premkalyan/code/CORP/ai-food-ordering-app

# Run comprehensive tests
python3 comprehensive_test_suite.py

# Check results
cat test_summary_*.txt
```

### Run Demo for Stakeholders
```bash
# Run interactive demo
python3 e2e_demo_scripts.py

# Select demo 5 (all demos) for complete showcase
```

## Test Coverage

### API Endpoints Tested

#### Basic Endpoints
- `GET /api/v1/cities`
- `GET /api/v1/cuisines?city={city}`

#### Restaurant Search
- `GET /api/v1/restaurants/search?city={city}`
- `GET /api/v1/restaurants/search?city={city}&cuisine={cuisine}`
- `GET /api/v1/restaurants/{restaurant_id}/menu`

#### Intelligent Search
- `GET /api/v1/search/intelligent?query={query}`
- `GET /api/v1/search/intelligent?query={query}&location={location}`

#### Order Management
- `POST /api/v1/orders/create`
- `GET /api/v1/orders/{order_id}`

### Test Data Coverage

**Cities**: 5
- San Francisco
- New York
- Los Angeles
- Chicago
- Bangalore

**Cuisines**: 8 (all available in all cities)
- Chinese
- Indian
- Italian
- Japanese
- Korean
- Mediterranean
- Mexican
- Thai

**Restaurants**: 42 total
- 8 per city (except Bangalore with 10)
- Complete menu coverage
- 170 total menu items

**Test Scenarios**:
- ✅ All city × cuisine combinations (40)
- ✅ Dish-specific searches (10+)
- ✅ Price constraints ($10, $15, $20, $25)
- ✅ Time constraints (20min, 25min, 30min, fast, quick)
- ✅ Preferences (spicy, vegetarian, healthy)
- ✅ Complex multi-constraint queries
- ✅ Edge cases (unavailable cuisines, unrealistic constraints)
- ✅ Order creation and tracking

## Expected Results

### Success Criteria

**All Tests Should Pass** (100% pass rate expected)

**Response Times** (with 2-minute timeout):
- Basic endpoints: < 1s
- Restaurant search: < 1s
- Intelligent search: < 5s (complex queries)
- Order creation: < 2s
- Order tracking: < 1s

**Data Validation**:
- All cities return 8 cuisines
- All city × cuisine combinations return ≥1 restaurant
- All restaurants have complete menus
- Intelligent search returns relevant results
- Orders are created successfully
- Order status updates over time

### Known Edge Cases

**These should return 0 results gracefully**:
- Ethiopian food (not available)
- French cuisine (not available)
- Food under $1 (too cheap)
- Delivery in 5 minutes (unrealistic)

## Troubleshooting

### Common Issues

**Issue**: Tests timing out
**Solution**: Check if backend is deployed and accessible
```bash
curl https://ai-food-ordering-poc.vercel.app/api/v1/cities
```

**Issue**: JSON decode errors
**Solution**: Backend might be returning HTML error page
```bash
# Check actual response
curl -v https://ai-food-ordering-poc.vercel.app/api/v1/cities
```

**Issue**: POST requests failing
**Solution**: Verify timeout configuration (should be 120s)
```bash
# Check vercel.json has maxDuration: 120
```

**Issue**: Empty results for valid queries
**Solution**: Check if mock data is deployed
```bash
# Verify restaurant count
curl https://ai-food-ordering-poc.vercel.app/api/v1/restaurants/search?city=Bangalore | python3 -m json.tool | grep -c "id"
```

## Performance Benchmarks

### Target Response Times

| Endpoint Type | Target | Acceptable | Needs Optimization |
|---------------|--------|------------|-------------------|
| Basic (cities, cuisines) | < 0.5s | < 1s | > 2s |
| Restaurant search | < 0.5s | < 1s | > 2s |
| Menu retrieval | < 0.5s | < 1s | > 2s |
| Intelligent search (simple) | < 2s | < 5s | > 10s |
| Intelligent search (complex) | < 3s | < 8s | > 15s |
| Order creation (POST) | < 1s | < 3s | > 5s |
| Order tracking | < 0.5s | < 1s | > 2s |

### Load Testing

**Current Configuration**:
- Vercel Enterprise tier
- 2-minute timeout
- Serverless functions

**Recommended Load Test**:
```bash
# Test concurrent requests
for i in {1..10}; do
  python3 comprehensive_test_suite.py &
done
wait
```

## CI/CD Integration

### GitHub Actions Example

```yaml
name: API Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Set up Python
        uses: actions/setup-python@v2
        with:
          python-version: '3.9'
      - name: Install dependencies
        run: pip install requests
      - name: Run API tests
        run: python3 comprehensive_test_suite.py
      - name: Upload test results
        uses: actions/upload-artifact@v2
        with:
          name: test-results
          path: test_*.json
```

## Demo Presentation Tips

### For Stakeholders

1. **Start with Demo 4** (Multi-City Coverage)
   - Shows complete data coverage
   - Impressive scale (42 restaurants, 8 cuisines everywhere)

2. **Run Demo 2** (Intelligent Search)
   - Shows AI capabilities
   - Natural language understanding
   - Complex query handling

3. **Run Demo 3** (Complete Journey)
   - End-to-end user experience
   - Order placement and tracking
   - Real-time status updates

4. **Show Test Results** (comprehensive_test_suite.py)
   - 110+ tests passing
   - Response time metrics
   - Production-ready quality

### For Technical Audience

1. **Run Full Test Suite**
   - Show comprehensive coverage
   - Response time analysis
   - Edge case handling

2. **Review Test Code**
   - Show validation functions
   - Demonstrate test patterns
   - Explain E2E scenarios

3. **Discuss Architecture**
   - API design
   - Intelligent search algorithm
   - Order tracking mechanism

## Next Steps

### Enhancements

1. **Add More Test Scenarios**
   - User favorites
   - Dietary restrictions
   - Allergen filtering

2. **Performance Testing**
   - Load testing
   - Stress testing
   - Concurrent user simulation

3. **Integration Testing**
   - Payment gateway integration
   - Real restaurant API integration
   - SMS/Email notifications

4. **Monitoring**
   - Response time tracking
   - Error rate monitoring
   - Usage analytics

## Summary

✅ **110+ automated tests** covering all endpoints  
✅ **4 interactive demos** for stakeholder presentations  
✅ **Complete API coverage** with response time measurement  
✅ **Production-ready** with comprehensive validation  
✅ **Easy to run** with simple Python scripts  
✅ **Well-documented** with clear usage instructions  

**Ready for demo and production deployment!** 🚀

