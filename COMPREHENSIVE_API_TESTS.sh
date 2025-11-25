#!/bin/bash

# Comprehensive API Test Suite for AI Food Ordering
# Tests all endpoints with various user inputs and measures response times

API_BASE="https://ai-food-ordering-poc.vercel.app"
RESULTS_FILE="test_results_$(date +%Y%m%d_%H%M%S).txt"

echo "🧪 AI FOOD ORDERING API - COMPREHENSIVE TEST SUITE" | tee $RESULTS_FILE
echo "=================================================" | tee -a $RESULTS_FILE
echo "Started: $(date)" | tee -a $RESULTS_FILE
echo "API Base: $API_BASE" | tee -a $RESULTS_FILE
echo "" | tee -a $RESULTS_FILE

# Color codes
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Test counter
TOTAL_TESTS=0
PASSED_TESTS=0
FAILED_TESTS=0

# Function to run a test
run_test() {
    local test_name="$1"
    local endpoint="$2"
    local method="${3:-GET}"
    local data="$4"
    
    TOTAL_TESTS=$((TOTAL_TESTS + 1))
    
    echo -e "\n${BLUE}Test #${TOTAL_TESTS}: ${test_name}${NC}" | tee -a $RESULTS_FILE
    echo "Endpoint: ${method} ${endpoint}" | tee -a $RESULTS_FILE
    
    # Measure time and make request
    START_TIME=$(date +%s.%N)
    
    if [ "$method" == "POST" ]; then
        RESPONSE=$(curl -s -w "\n%{http_code}\n%{time_total}" -X POST "${API_BASE}${endpoint}" \
            -H "Content-Type: application/json" \
            -d "$data")
    else
        RESPONSE=$(curl -s -w "\n%{http_code}\n%{time_total}" "${API_BASE}${endpoint}")
    fi
    
    END_TIME=$(date +%s.%N)
    
    # Extract response body, status code, and time
    BODY=$(echo "$RESPONSE" | head -n -2)
    STATUS=$(echo "$RESPONSE" | tail -n 2 | head -n 1)
    CURL_TIME=$(echo "$RESPONSE" | tail -n 1)
    
    # Calculate response time
    RESPONSE_TIME=$(echo "$END_TIME - $START_TIME" | bc)
    
    echo "Status: $STATUS" | tee -a $RESULTS_FILE
    echo "Response Time: ${CURL_TIME}s (${RESPONSE_TIME}s total)" | tee -a $RESULTS_FILE
    
    # Check if successful
    if [ "$STATUS" == "200" ]; then
        # Check if response is valid JSON and not empty
        if echo "$BODY" | python3 -m json.tool > /dev/null 2>&1; then
            RESULT_COUNT=$(echo "$BODY" | python3 -c "import sys, json; data=json.load(sys.stdin); print(len(data) if isinstance(data, list) else (len(data.get('restaurants', [])) if 'restaurants' in data else 'N/A'))" 2>/dev/null)
            echo -e "${GREEN}✅ PASS${NC} - Valid JSON response (Results: $RESULT_COUNT)" | tee -a $RESULTS_FILE
            PASSED_TESTS=$((PASSED_TESTS + 1))
        else
            echo -e "${RED}❌ FAIL${NC} - Invalid JSON response" | tee -a $RESULTS_FILE
            FAILED_TESTS=$((FAILED_TESTS + 1))
        fi
    else
        echo -e "${RED}❌ FAIL${NC} - HTTP Status: $STATUS" | tee -a $RESULTS_FILE
        FAILED_TESTS=$((FAILED_TESTS + 1))
    fi
    
    # Show first 200 chars of response
    echo "Response Preview: $(echo "$BODY" | head -c 200)..." | tee -a $RESULTS_FILE
    
    # Save full response to separate file
    echo "$BODY" > "test_${TOTAL_TESTS}_response.json"
    echo "Full response saved to: test_${TOTAL_TESTS}_response.json" | tee -a $RESULTS_FILE
}

# =============================================================================
# TEST CATEGORY 1: Basic Endpoints
# =============================================================================
echo -e "\n${YELLOW}═══════════════════════════════════════════════════════${NC}" | tee -a $RESULTS_FILE
echo -e "${YELLOW}CATEGORY 1: BASIC ENDPOINTS${NC}" | tee -a $RESULTS_FILE
echo -e "${YELLOW}═══════════════════════════════════════════════════════${NC}" | tee -a $RESULTS_FILE

run_test "Get All Cities" "/api/v1/cities"
run_test "Get Cuisines for San Francisco" "/api/v1/cuisines?city=San%20Francisco"
run_test "Get Cuisines for New York" "/api/v1/cuisines?city=New%20York"
run_test "Get Cuisines for Chicago" "/api/v1/cuisines?city=Chicago"
run_test "Get Cuisines for Los Angeles" "/api/v1/cuisines?city=Los%20Angeles"
run_test "Get Cuisines for Bangalore" "/api/v1/cuisines?city=Bangalore"

# =============================================================================
# TEST CATEGORY 2: Restaurant Search - By City
# =============================================================================
echo -e "\n${YELLOW}═══════════════════════════════════════════════════════${NC}" | tee -a $RESULTS_FILE
echo -e "${YELLOW}CATEGORY 2: RESTAURANT SEARCH - BY CITY${NC}" | tee -a $RESULTS_FILE
echo -e "${YELLOW}═══════════════════════════════════════════════════════${NC}" | tee -a $RESULTS_FILE

run_test "Search Restaurants in San Francisco" "/api/v1/restaurants/search?city=San%20Francisco"
run_test "Search Restaurants in New York" "/api/v1/restaurants/search?city=New%20York"
run_test "Search Restaurants in Chicago" "/api/v1/restaurants/search?city=Chicago"
run_test "Search Restaurants in Los Angeles" "/api/v1/restaurants/search?city=Los%20Angeles"
run_test "Search Restaurants in Bangalore" "/api/v1/restaurants/search?city=Bangalore"

# =============================================================================
# TEST CATEGORY 3: Restaurant Search - By City & Cuisine
# =============================================================================
echo -e "\n${YELLOW}═══════════════════════════════════════════════════════${NC}" | tee -a $RESULTS_FILE
echo -e "${YELLOW}CATEGORY 3: RESTAURANT SEARCH - BY CITY & CUISINE${NC}" | tee -a $RESULTS_FILE
echo -e "${YELLOW}═══════════════════════════════════════════════════════${NC}" | tee -a $RESULTS_FILE

# Test all cuisines in San Francisco
run_test "SF - Indian Restaurants" "/api/v1/restaurants/search?city=San%20Francisco&cuisine=Indian"
run_test "SF - Chinese Restaurants" "/api/v1/restaurants/search?city=San%20Francisco&cuisine=Chinese"
run_test "SF - Italian Restaurants" "/api/v1/restaurants/search?city=San%20Francisco&cuisine=Italian"
run_test "SF - Japanese Restaurants" "/api/v1/restaurants/search?city=San%20Francisco&cuisine=Japanese"
run_test "SF - Mexican Restaurants" "/api/v1/restaurants/search?city=San%20Francisco&cuisine=Mexican"
run_test "SF - Thai Restaurants" "/api/v1/restaurants/search?city=San%20Francisco&cuisine=Thai"
run_test "SF - Korean Restaurants" "/api/v1/restaurants/search?city=San%20Francisco&cuisine=Korean"
run_test "SF - Mediterranean Restaurants" "/api/v1/restaurants/search?city=San%20Francisco&cuisine=Mediterranean"

# Test key cuisines in other cities
run_test "NYC - Indian Restaurants" "/api/v1/restaurants/search?city=New%20York&cuisine=Indian"
run_test "Chicago - Mexican Restaurants" "/api/v1/restaurants/search?city=Chicago&cuisine=Mexican"
run_test "LA - Japanese Restaurants" "/api/v1/restaurants/search?city=Los%20Angeles&cuisine=Japanese"
run_test "Bangalore - Chinese Restaurants" "/api/v1/restaurants/search?city=Bangalore&cuisine=Chinese"

# =============================================================================
# TEST CATEGORY 4: Menu Retrieval
# =============================================================================
echo -e "\n${YELLOW}═══════════════════════════════════════════════════════${NC}" | tee -a $RESULTS_FILE
echo -e "${YELLOW}CATEGORY 4: MENU RETRIEVAL${NC}" | tee -a $RESULTS_FILE
echo -e "${YELLOW}═══════════════════════════════════════════════════════${NC}" | tee -a $RESULTS_FILE

run_test "Get Menu - Taj Palace (rest_001)" "/api/v1/restaurants/rest_001/menu"
run_test "Get Menu - Manhattan Tandoor (rest_012)" "/api/v1/restaurants/rest_012/menu"
run_test "Get Menu - Chicago Tandoor (rest_019)" "/api/v1/restaurants/rest_019/menu"
run_test "Get Menu - Bollywood Bites LA (rest_032)" "/api/v1/restaurants/rest_032/menu"
run_test "Get Menu - Bangalore Wok (rest_020)" "/api/v1/restaurants/rest_020/menu"

# =============================================================================
# TEST CATEGORY 5: Intelligent Search - Dish Queries
# =============================================================================
echo -e "\n${YELLOW}═══════════════════════════════════════════════════════${NC}" | tee -a $RESULTS_FILE
echo -e "${YELLOW}CATEGORY 5: INTELLIGENT SEARCH - DISH QUERIES${NC}" | tee -a $RESULTS_FILE
echo -e "${YELLOW}═══════════════════════════════════════════════════════${NC}" | tee -a $RESULTS_FILE

run_test "Intelligent: Chicken Tikka Masala" "/api/v1/search/intelligent?query=Chicken%20Tikka%20Masala"
run_test "Intelligent: Chicken Tikka Masala in New York" "/api/v1/search/intelligent?query=Chicken%20Tikka%20Masala%20in%20New%20York&location=New%20York"
run_test "Intelligent: Chicken Tikka Masala in Los Angeles" "/api/v1/search/intelligent?query=Chicken%20Tikka%20Masala%20in%20Los%20Angeles&location=Los%20Angeles"
run_test "Intelligent: Pad Thai" "/api/v1/search/intelligent?query=Pad%20Thai"
run_test "Intelligent: Sushi" "/api/v1/search/intelligent?query=sushi"
run_test "Intelligent: Pizza" "/api/v1/search/intelligent?query=pizza"
run_test "Intelligent: Tacos" "/api/v1/search/intelligent?query=tacos"
run_test "Intelligent: Biryani" "/api/v1/search/intelligent?query=biryani"
run_test "Intelligent: Dumplings" "/api/v1/search/intelligent?query=dumplings"

# =============================================================================
# TEST CATEGORY 6: Intelligent Search - Price Constraints
# =============================================================================
echo -e "\n${YELLOW}═══════════════════════════════════════════════════════${NC}" | tee -a $RESULTS_FILE
echo -e "${YELLOW}CATEGORY 6: INTELLIGENT SEARCH - PRICE CONSTRAINTS${NC}" | tee -a $RESULTS_FILE
echo -e "${YELLOW}═══════════════════════════════════════════════════════${NC}" | tee -a $RESULTS_FILE

run_test "Intelligent: Food under \$10" "/api/v1/search/intelligent?query=food%20under%20%2410"
run_test "Intelligent: Food under \$15" "/api/v1/search/intelligent?query=food%20under%20%2415"
run_test "Intelligent: Food under \$20" "/api/v1/search/intelligent?query=food%20under%20%2420"
run_test "Intelligent: Italian under \$20" "/api/v1/search/intelligent?query=Italian%20food%20under%20%2420"
run_test "Intelligent: Sushi under \$15" "/api/v1/search/intelligent?query=sushi%20under%20%2415"

# =============================================================================
# TEST CATEGORY 7: Intelligent Search - Time Constraints
# =============================================================================
echo -e "\n${YELLOW}═══════════════════════════════════════════════════════${NC}" | tee -a $RESULTS_FILE
echo -e "${YELLOW}CATEGORY 7: INTELLIGENT SEARCH - TIME CONSTRAINTS${NC}" | tee -a $RESULTS_FILE
echo -e "${YELLOW}═══════════════════════════════════════════════════════${NC}" | tee -a $RESULTS_FILE

run_test "Intelligent: Food in 20 minutes" "/api/v1/search/intelligent?query=food%20in%2020%20minutes"
run_test "Intelligent: Food in 30 minutes" "/api/v1/search/intelligent?query=food%20in%2030%20minutes"
run_test "Intelligent: Fast delivery" "/api/v1/search/intelligent?query=fast%20delivery"
run_test "Intelligent: Quick food" "/api/v1/search/intelligent?query=quick%20food"
run_test "Intelligent: I'm hungry, need food fast" "/api/v1/search/intelligent?query=I%27m%20hungry%2C%20need%20food%20fast"

# =============================================================================
# TEST CATEGORY 8: Intelligent Search - Preferences
# =============================================================================
echo -e "\n${YELLOW}═══════════════════════════════════════════════════════${NC}" | tee -a $RESULTS_FILE
echo -e "${YELLOW}CATEGORY 8: INTELLIGENT SEARCH - PREFERENCES${NC}" | tee -a $RESULTS_FILE
echo -e "${YELLOW}═══════════════════════════════════════════════════════${NC}" | tee -a $RESULTS_FILE

run_test "Intelligent: Spicy food" "/api/v1/search/intelligent?query=spicy%20food"
run_test "Intelligent: Vegetarian food" "/api/v1/search/intelligent?query=vegetarian%20food"
run_test "Intelligent: Spicy vegetarian" "/api/v1/search/intelligent?query=spicy%20vegetarian%20food"
run_test "Intelligent: Healthy food" "/api/v1/search/intelligent?query=healthy%20food"

# =============================================================================
# TEST CATEGORY 9: Intelligent Search - Complex Queries
# =============================================================================
echo -e "\n${YELLOW}═══════════════════════════════════════════════════════${NC}" | tee -a $RESULTS_FILE
echo -e "${YELLOW}CATEGORY 9: INTELLIGENT SEARCH - COMPLEX QUERIES${NC}" | tee -a $RESULTS_FILE
echo -e "${YELLOW}═══════════════════════════════════════════════════════${NC}" | tee -a $RESULTS_FILE

run_test "Intelligent: Spicy Indian under \$20" "/api/v1/search/intelligent?query=spicy%20Indian%20food%20under%20%2420"
run_test "Intelligent: Italian in 30 mins under \$25" "/api/v1/search/intelligent?query=Italian%20food%20in%2030%20minutes%20under%20%2425"
run_test "Intelligent: Vegetarian Thai fast" "/api/v1/search/intelligent?query=vegetarian%20Thai%20food%20fast%20delivery"
run_test "Intelligent: Sushi in Bangalore under \$20" "/api/v1/search/intelligent?query=sushi%20in%20Bangalore%20under%20%2420&location=Bangalore"
run_test "Intelligent: Korean BBQ in Chicago" "/api/v1/search/intelligent?query=Korean%20BBQ%20in%20Chicago&location=Chicago"

# =============================================================================
# TEST CATEGORY 10: Intelligent Search - Edge Cases
# =============================================================================
echo -e "\n${YELLOW}═══════════════════════════════════════════════════════${NC}" | tee -a $RESULTS_FILE
echo -e "${YELLOW}CATEGORY 10: INTELLIGENT SEARCH - EDGE CASES${NC}" | tee -a $RESULTS_FILE
echo -e "${YELLOW}═══════════════════════════════════════════════════════${NC}" | tee -a $RESULTS_FILE

run_test "Intelligent: Empty query" "/api/v1/search/intelligent?query="
run_test "Intelligent: Ethiopian food (not available)" "/api/v1/search/intelligent?query=Ethiopian%20food"
run_test "Intelligent: Food under \$1 (too cheap)" "/api/v1/search/intelligent?query=food%20under%20%241"
run_test "Intelligent: Delivery in 5 minutes (unrealistic)" "/api/v1/search/intelligent?query=delivery%20in%205%20minutes"
run_test "Intelligent: French cuisine (not available)" "/api/v1/search/intelligent?query=French%20cuisine"

# =============================================================================
# TEST CATEGORY 11: Order Creation (POST)
# =============================================================================
echo -e "\n${YELLOW}═══════════════════════════════════════════════════════${NC}" | tee -a $RESULTS_FILE
echo -e "${YELLOW}CATEGORY 11: ORDER CREATION (POST)${NC}" | tee -a $RESULTS_FILE
echo -e "${YELLOW}═══════════════════════════════════════════════════════${NC}" | tee -a $RESULTS_FILE

run_test "Create Order - Chicken Tikka Masala" "/api/v1/orders/create" "POST" '{
  "restaurant_id": "rest_012",
  "items": [
    {
      "item_id": "item_1203",
      "name": "Chicken Tikka Masala",
      "price": 17.99,
      "quantity": 1
    }
  ],
  "delivery_address": {
    "address": "123 Broadway",
    "city": "New York",
    "state": "NY",
    "zip": "10001"
  },
  "special_instructions": "Extra spicy please"
}'

run_test "Create Order - Multiple Items" "/api/v1/orders/create" "POST" '{
  "restaurant_id": "rest_001",
  "items": [
    {
      "item_id": "item_003",
      "name": "Chicken Tikka Masala",
      "price": 16.99,
      "quantity": 2
    },
    {
      "item_id": "item_001",
      "name": "Samosa",
      "price": 5.99,
      "quantity": 1
    }
  ],
  "delivery_address": {
    "address": "456 Market St",
    "city": "San Francisco",
    "state": "CA",
    "zip": "94102"
  },
  "special_instructions": ""
}'

run_test "Create Order - Chicago Deep Dish" "/api/v1/orders/create" "POST" '{
  "restaurant_id": "rest_016",
  "items": [
    {
      "item_id": "item_501",
      "name": "Classic Chicago Deep Dish",
      "price": 24.99,
      "quantity": 1
    }
  ],
  "delivery_address": {
    "address": "789 Michigan Ave",
    "city": "Chicago",
    "state": "IL",
    "zip": "60611"
  },
  "special_instructions": "Call when arriving"
}'

# =============================================================================
# SUMMARY
# =============================================================================
echo -e "\n${YELLOW}═══════════════════════════════════════════════════════${NC}" | tee -a $RESULTS_FILE
echo -e "${YELLOW}TEST SUMMARY${NC}" | tee -a $RESULTS_FILE
echo -e "${YELLOW}═══════════════════════════════════════════════════════${NC}" | tee -a $RESULTS_FILE

echo "" | tee -a $RESULTS_FILE
echo "Total Tests: $TOTAL_TESTS" | tee -a $RESULTS_FILE
echo -e "${GREEN}Passed: $PASSED_TESTS${NC}" | tee -a $RESULTS_FILE
echo -e "${RED}Failed: $FAILED_TESTS${NC}" | tee -a $RESULTS_FILE

if [ $FAILED_TESTS -eq 0 ]; then
    echo -e "\n${GREEN}🎉 ALL TESTS PASSED!${NC}" | tee -a $RESULTS_FILE
else
    echo -e "\n${RED}⚠️  SOME TESTS FAILED${NC}" | tee -a $RESULTS_FILE
fi

echo "" | tee -a $RESULTS_FILE
echo "Completed: $(date)" | tee -a $RESULTS_FILE
echo "Results saved to: $RESULTS_FILE" | tee -a $RESULTS_FILE
echo "" | tee -a $RESULTS_FILE

# Generate response time analysis
echo -e "\n${YELLOW}═══════════════════════════════════════════════════════${NC}" | tee -a $RESULTS_FILE
echo -e "${YELLOW}RESPONSE TIME ANALYSIS${NC}" | tee -a $RESULTS_FILE
echo -e "${YELLOW}═══════════════════════════════════════════════════════${NC}" | tee -a $RESULTS_FILE

python3 << 'PYTHON_SCRIPT'
import json
import glob

response_times = []
for file in sorted(glob.glob("test_*_response.json")):
    try:
        with open(file, 'r') as f:
            # Response time is in the test results file
            pass
    except:
        pass

print("\nResponse time statistics will be calculated from test results...")
print("Check individual test results above for timing details.")
PYTHON_SCRIPT

echo "" | tee -a $RESULTS_FILE
echo "✅ Test suite complete!" | tee -a $RESULTS_FILE

