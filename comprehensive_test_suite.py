#!/usr/bin/env python3
"""
Comprehensive API Test Suite for AI Food Ordering System
Tests all endpoints with all combinations and measures response times
Can also serve as E2E demo scripts
"""

import requests
import json
import time
from datetime import datetime
from typing import Dict, List, Tuple
import sys

# Configuration
API_BASE = "https://ai-food-ordering-poc.vercel.app"
RESULTS_FILE = f"test_results_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json"
SUMMARY_FILE = f"test_summary_{datetime.now().strftime('%Y%m%d_%H%M%S')}.txt"

# Test data
CITIES = ["San Francisco", "New York", "Los Angeles", "Chicago", "Bangalore"]
CUISINES = ["Chinese", "Indian", "Italian", "Japanese", "Korean", "Mediterranean", "Mexican", "Thai"]

# Colors for terminal output
class Colors:
    GREEN = '\033[0;32m'
    RED = '\033[0;31m'
    YELLOW = '\033[1;33m'
    BLUE = '\033[0;34m'
    CYAN = '\033[0;36m'
    MAGENTA = '\033[0;35m'
    NC = '\033[0m'  # No Color
    BOLD = '\033[1m'

class TestResults:
    def __init__(self):
        self.tests = []
        self.total = 0
        self.passed = 0
        self.failed = 0
        self.response_times = []
        
    def add_test(self, test_data: Dict):
        self.tests.append(test_data)
        self.total += 1
        if test_data['status'] == 'PASS':
            self.passed += 1
        else:
            self.failed += 1
        self.response_times.append(test_data['response_time'])
    
    def get_summary(self) -> Dict:
        return {
            'total_tests': self.total,
            'passed': self.passed,
            'failed': self.failed,
            'pass_rate': f"{(self.passed/self.total*100):.2f}%" if self.total > 0 else "0%",
            'avg_response_time': f"{sum(self.response_times)/len(self.response_times):.3f}s" if self.response_times else "N/A",
            'min_response_time': f"{min(self.response_times):.3f}s" if self.response_times else "N/A",
            'max_response_time': f"{max(self.response_times):.3f}s" if self.response_times else "N/A"
        }

results = TestResults()

def print_header(text: str, color=Colors.YELLOW):
    """Print a formatted header"""
    print(f"\n{color}{'='*70}{Colors.NC}")
    print(f"{color}{text.center(70)}{Colors.NC}")
    print(f"{color}{'='*70}{Colors.NC}\n")

def print_test(test_num: int, test_name: str):
    """Print test information"""
    print(f"{Colors.BLUE}Test #{test_num}: {test_name}{Colors.NC}")

def make_request(method: str, endpoint: str, data: Dict = None) -> Tuple[Dict, float, int]:
    """Make HTTP request and return response, time, and status code"""
    url = f"{API_BASE}{endpoint}"
    
    start_time = time.time()
    try:
        if method == "GET":
            response = requests.get(url, timeout=120)
        elif method == "POST":
            response = requests.post(url, json=data, timeout=120)
        else:
            raise ValueError(f"Unsupported method: {method}")
        
        response_time = time.time() - start_time
        
        try:
            response_data = response.json()
        except:
            response_data = {"error": "Invalid JSON", "text": response.text[:200]}
        
        return response_data, response_time, response.status_code
    
    except requests.exceptions.Timeout:
        response_time = time.time() - start_time
        return {"error": "Request timeout"}, response_time, 504
    except Exception as e:
        response_time = time.time() - start_time
        return {"error": str(e)}, response_time, 500

def run_test(test_name: str, method: str, endpoint: str, data: Dict = None, 
             expected_status: int = 200, validate_func = None) -> Dict:
    """Run a single test and return results"""
    test_num = results.total + 1
    print_test(test_num, test_name)
    print(f"  Endpoint: {method} {endpoint}")
    
    response_data, response_time, status_code = make_request(method, endpoint, data)
    
    # Determine if test passed
    status = "PASS" if status_code == expected_status else "FAIL"
    
    # Additional validation
    validation_msg = ""
    if status == "PASS" and validate_func:
        is_valid, msg = validate_func(response_data)
        if not is_valid:
            status = "FAIL"
            validation_msg = f" - {msg}"
    
    # Print results
    status_color = Colors.GREEN if status == "PASS" else Colors.RED
    print(f"  Status: {status_color}{status}{Colors.NC} (HTTP {status_code})")
    print(f"  Response Time: {Colors.CYAN}{response_time:.3f}s{Colors.NC}")
    
    # Show result count or error
    if status == "PASS":
        if isinstance(response_data, list):
            print(f"  Results: {len(response_data)} items")
        elif isinstance(response_data, dict):
            if 'restaurants' in response_data:
                print(f"  Results: {len(response_data['restaurants'])} restaurants")
            elif 'order_id' in response_data:
                print(f"  Order ID: {response_data['order_id']}")
            elif 'message' in response_data:
                print(f"  Message: {response_data.get('message', 'N/A')}")
    else:
        error_msg = response_data.get('error', response_data.get('detail', 'Unknown error'))
        print(f"  {Colors.RED}Error: {error_msg}{validation_msg}{Colors.NC}")
    
    # Store results
    test_data = {
        'test_num': test_num,
        'test_name': test_name,
        'method': method,
        'endpoint': endpoint,
        'status': status,
        'http_status': status_code,
        'response_time': response_time,
        'response_data': response_data
    }
    results.add_test(test_data)
    
    return test_data

# =============================================================================
# VALIDATION FUNCTIONS
# =============================================================================

def validate_list_not_empty(data):
    """Validate that response is a non-empty list"""
    if not isinstance(data, list):
        return False, "Response is not a list"
    if len(data) == 0:
        return False, "Response list is empty"
    return True, "Valid"

def validate_has_restaurants(data):
    """Validate that response has restaurants array"""
    if not isinstance(data, dict):
        return False, "Response is not a dict"
    if 'restaurants' not in data:
        return False, "No 'restaurants' key in response"
    return True, "Valid"

def validate_has_categories(data):
    """Validate that menu has categories"""
    if not isinstance(data, dict):
        return False, "Response is not a dict"
    if 'categories' not in data:
        return False, "No 'categories' key in response"
    if len(data['categories']) == 0:
        return False, "Categories list is empty"
    return True, "Valid"

def validate_order_created(data):
    """Validate that order was created"""
    if not isinstance(data, dict):
        return False, "Response is not a dict"
    if 'order_id' not in data:
        return False, "No 'order_id' in response"
    return True, "Valid"

# =============================================================================
# TEST CATEGORIES
# =============================================================================

def test_basic_endpoints():
    """Test basic endpoints"""
    print_header("CATEGORY 1: BASIC ENDPOINTS")
    
    # Test get cities
    run_test("Get All Cities", "GET", "/api/v1/cities", 
             validate_func=validate_list_not_empty)
    
    # Test get cuisines for each city
    for city in CITIES:
        run_test(f"Get Cuisines for {city}", "GET", 
                f"/api/v1/cuisines?city={city.replace(' ', '%20')}",
                validate_func=validate_list_not_empty)

def test_restaurant_search_by_city():
    """Test restaurant search by city"""
    print_header("CATEGORY 2: RESTAURANT SEARCH - BY CITY")
    
    for city in CITIES:
        run_test(f"Search Restaurants in {city}", "GET",
                f"/api/v1/restaurants/search?city={city.replace(' ', '%20')}",
                validate_func=validate_list_not_empty)

def test_restaurant_search_by_city_and_cuisine():
    """Test restaurant search by city and cuisine combinations"""
    print_header("CATEGORY 3: RESTAURANT SEARCH - ALL CITY & CUISINE COMBINATIONS")
    
    print(f"{Colors.CYAN}Testing {len(CITIES)} cities × {len(CUISINES)} cuisines = {len(CITIES) * len(CUISINES)} combinations{Colors.NC}\n")
    
    for city in CITIES:
        for cuisine in CUISINES:
            run_test(f"{city} - {cuisine}", "GET",
                    f"/api/v1/restaurants/search?city={city.replace(' ', '%20')}&cuisine={cuisine}",
                    validate_func=validate_list_not_empty)

def test_menu_retrieval():
    """Test menu retrieval for key restaurants"""
    print_header("CATEGORY 4: MENU RETRIEVAL")
    
    # Key restaurants to test (one from each city)
    test_restaurants = [
        ("rest_001", "Taj Palace (San Francisco)"),
        ("rest_012", "Manhattan Tandoor (New York)"),
        ("rest_016", "Chicago Deep Dish Co (Chicago)"),
        ("rest_014", "LA Sushi Bar (Los Angeles)"),
        ("rest_009", "Spice Garden (Bangalore)"),
        ("rest_020", "Bangalore Wok (Bangalore)"),
        ("rest_032", "Bollywood Bites LA (Los Angeles)"),
    ]
    
    for rest_id, rest_name in test_restaurants:
        run_test(f"Get Menu - {rest_name}", "GET",
                f"/api/v1/restaurants/{rest_id}/menu",
                validate_func=validate_has_categories)

def test_intelligent_search_dishes():
    """Test intelligent search with dish queries"""
    print_header("CATEGORY 5: INTELLIGENT SEARCH - DISH QUERIES")
    
    dish_queries = [
        "Chicken Tikka Masala",
        "Pad Thai",
        "Sushi",
        "Pizza",
        "Tacos",
        "Biryani",
        "Dumplings",
        "Noodles",
        "Curry",
        "Burger"
    ]
    
    for query in dish_queries:
        run_test(f"Intelligent: {query}", "GET",
                f"/api/v1/search/intelligent?query={query.replace(' ', '%20')}",
                validate_func=validate_has_restaurants)

def test_intelligent_search_with_location():
    """Test intelligent search with location"""
    print_header("CATEGORY 6: INTELLIGENT SEARCH - DISH + LOCATION")
    
    test_cases = [
        ("Chicken Tikka Masala in New York", "New York"),
        ("Chicken Tikka Masala in Los Angeles", "Los Angeles"),
        ("Sushi in Bangalore", "Bangalore"),
        ("Pizza in Chicago", "Chicago"),
        ("Tacos in San Francisco", "San Francisco"),
    ]
    
    for query, location in test_cases:
        run_test(f"Intelligent: {query}", "GET",
                f"/api/v1/search/intelligent?query={query.replace(' ', '%20')}&location={location.replace(' ', '%20')}",
                validate_func=validate_has_restaurants)

def test_intelligent_search_price_constraints():
    """Test intelligent search with price constraints"""
    print_header("CATEGORY 7: INTELLIGENT SEARCH - PRICE CONSTRAINTS")
    
    price_queries = [
        "food under $10",
        "food under $15",
        "food under $20",
        "Italian under $20",
        "Sushi under $15",
        "Indian under $25",
        "Mexican under $12",
    ]
    
    for query in price_queries:
        run_test(f"Intelligent: {query}", "GET",
                f"/api/v1/search/intelligent?query={query.replace(' ', '%20').replace('$', '%24')}",
                validate_func=validate_has_restaurants)

def test_intelligent_search_time_constraints():
    """Test intelligent search with time constraints"""
    print_header("CATEGORY 8: INTELLIGENT SEARCH - TIME CONSTRAINTS")
    
    time_queries = [
        "food in 20 minutes",
        "food in 30 minutes",
        "fast delivery",
        "quick food",
        "I'm hungry, need food fast",
        "delivery in 25 minutes",
    ]
    
    for query in time_queries:
        encoded_query = query.replace(' ', '%20').replace(',', '%2C').replace("'", '%27')
        run_test(f"Intelligent: {query}", "GET",
                f"/api/v1/search/intelligent?query={encoded_query}",
                validate_func=validate_has_restaurants)

def test_intelligent_search_preferences():
    """Test intelligent search with preferences"""
    print_header("CATEGORY 9: INTELLIGENT SEARCH - PREFERENCES")
    
    preference_queries = [
        "spicy food",
        "vegetarian food",
        "spicy vegetarian",
        "healthy food",
        "vegan options",
    ]
    
    for query in preference_queries:
        run_test(f"Intelligent: {query}", "GET",
                f"/api/v1/search/intelligent?query={query.replace(' ', '%20')}",
                validate_func=validate_has_restaurants)

def test_intelligent_search_complex():
    """Test intelligent search with complex queries"""
    print_header("CATEGORY 10: INTELLIGENT SEARCH - COMPLEX QUERIES")
    
    complex_queries = [
        "spicy Indian food under $20",
        "Italian food in 30 minutes under $25",
        "vegetarian Thai food fast delivery",
        "sushi in Bangalore under $20",
        "Korean BBQ in Chicago",
        "spicy Mexican under $15 in 25 minutes",
    ]
    
    for query in complex_queries:
        location = None
        if "in Bangalore" in query:
            location = "Bangalore"
        elif "in Chicago" in query:
            location = "Chicago"
        
        endpoint = f"/api/v1/search/intelligent?query={query.replace(' ', '%20').replace('$', '%24')}"
        if location:
            endpoint += f"&location={location.replace(' ', '%20')}"
        
        run_test(f"Intelligent: {query}", "GET", endpoint,
                validate_func=validate_has_restaurants)

def test_intelligent_search_edge_cases():
    """Test intelligent search edge cases"""
    print_header("CATEGORY 11: INTELLIGENT SEARCH - EDGE CASES")
    
    edge_cases = [
        ("Ethiopian food (not available)", "Ethiopian%20food"),
        ("French cuisine (not available)", "French%20cuisine"),
        ("food under $1 (too cheap)", "food%20under%20%241"),
        ("delivery in 5 minutes (unrealistic)", "delivery%20in%205%20minutes"),
    ]
    
    for test_name, query in edge_cases:
        # These might return empty results, which is OK
        test_data = run_test(f"Intelligent: {test_name}", "GET",
                            f"/api/v1/search/intelligent?query={query}")
        # Check if it returned empty results gracefully
        if test_data['status'] == 'PASS':
            response = test_data['response_data']
            if isinstance(response, dict) and 'restaurants' in response:
                if len(response['restaurants']) == 0:
                    print(f"  {Colors.CYAN}✓ Correctly returned 0 results{Colors.NC}")

def test_order_creation():
    """Test order creation"""
    print_header("CATEGORY 12: ORDER CREATION (POST)")
    
    # Test 1: Simple order
    order1 = {
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
    }
    
    test1 = run_test("Create Order - Chicken Tikka Masala (NYC)", "POST",
                     "/api/v1/orders/create", data=order1,
                     validate_func=validate_order_created)
    
    # Test 2: Multiple items
    order2 = {
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
    }
    
    test2 = run_test("Create Order - Multiple Items (SF)", "POST",
                     "/api/v1/orders/create", data=order2,
                     validate_func=validate_order_created)
    
    # Test 3: Chicago Deep Dish
    order3 = {
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
    }
    
    test3 = run_test("Create Order - Chicago Deep Dish", "POST",
                     "/api/v1/orders/create", data=order3,
                     validate_func=validate_order_created)
    
    # Return order IDs for tracking tests
    order_ids = []
    for test in [test1, test2, test3]:
        if test['status'] == 'PASS' and 'order_id' in test['response_data']:
            order_ids.append(test['response_data']['order_id'])
    
    return order_ids

def test_order_tracking(order_ids: List[str]):
    """Test order tracking"""
    print_header("CATEGORY 13: ORDER TRACKING")
    
    if not order_ids:
        print(f"{Colors.YELLOW}⚠️  No orders to track (order creation failed){Colors.NC}")
        return
    
    for order_id in order_ids:
        run_test(f"Track Order - {order_id}", "GET",
                f"/api/v1/orders/{order_id}")
        
        # Wait a bit and check again
        print(f"{Colors.CYAN}  Waiting 3 seconds...{Colors.NC}")
        time.sleep(3)
        
        run_test(f"Track Order - {order_id} (after 3s)", "GET",
                f"/api/v1/orders/{order_id}")

# =============================================================================
# MAIN TEST EXECUTION
# =============================================================================

def main():
    """Run all tests"""
    print(f"{Colors.BOLD}{Colors.MAGENTA}")
    print("=" * 70)
    print("AI FOOD ORDERING API - COMPREHENSIVE TEST SUITE".center(70))
    print("=" * 70)
    print(f"{Colors.NC}")
    print(f"Started: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print(f"API Base: {API_BASE}")
    print(f"Results will be saved to: {RESULTS_FILE}")
    
    try:
        # Run all test categories
        test_basic_endpoints()
        test_restaurant_search_by_city()
        test_restaurant_search_by_city_and_cuisine()
        test_menu_retrieval()
        test_intelligent_search_dishes()
        test_intelligent_search_with_location()
        test_intelligent_search_price_constraints()
        test_intelligent_search_time_constraints()
        test_intelligent_search_preferences()
        test_intelligent_search_complex()
        test_intelligent_search_edge_cases()
        order_ids = test_order_creation()
        test_order_tracking(order_ids)
        
        # Print summary
        print_header("TEST SUMMARY", Colors.MAGENTA)
        summary = results.get_summary()
        
        print(f"Total Tests: {Colors.BOLD}{summary['total_tests']}{Colors.NC}")
        print(f"Passed: {Colors.GREEN}{summary['passed']}{Colors.NC}")
        print(f"Failed: {Colors.RED}{summary['failed']}{Colors.NC}")
        print(f"Pass Rate: {Colors.CYAN}{summary['pass_rate']}{Colors.NC}")
        print(f"\nResponse Times:")
        print(f"  Average: {Colors.CYAN}{summary['avg_response_time']}{Colors.NC}")
        print(f"  Min: {Colors.GREEN}{summary['min_response_time']}{Colors.NC}")
        print(f"  Max: {Colors.YELLOW}{summary['max_response_time']}{Colors.NC}")
        
        # Save results
        with open(RESULTS_FILE, 'w') as f:
            json.dump({
                'summary': summary,
                'tests': results.tests
            }, f, indent=2)
        
        print(f"\n{Colors.GREEN}✅ Results saved to: {RESULTS_FILE}{Colors.NC}")
        
        # Save summary to text file
        with open(SUMMARY_FILE, 'w') as f:
            f.write("AI FOOD ORDERING API - TEST SUMMARY\n")
            f.write("=" * 70 + "\n\n")
            f.write(f"Completed: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n\n")
            f.write(f"Total Tests: {summary['total_tests']}\n")
            f.write(f"Passed: {summary['passed']}\n")
            f.write(f"Failed: {summary['failed']}\n")
            f.write(f"Pass Rate: {summary['pass_rate']}\n\n")
            f.write(f"Response Times:\n")
            f.write(f"  Average: {summary['avg_response_time']}\n")
            f.write(f"  Min: {summary['min_response_time']}\n")
            f.write(f"  Max: {summary['max_response_time']}\n\n")
            
            # List failed tests
            failed_tests = [t for t in results.tests if t['status'] == 'FAIL']
            if failed_tests:
                f.write(f"\nFailed Tests ({len(failed_tests)}):\n")
                f.write("-" * 70 + "\n")
                for test in failed_tests:
                    f.write(f"  {test['test_num']}. {test['test_name']}\n")
                    f.write(f"     {test['method']} {test['endpoint']}\n")
                    f.write(f"     HTTP {test['http_status']} - {test['response_time']:.3f}s\n\n")
        
        print(f"{Colors.GREEN}✅ Summary saved to: {SUMMARY_FILE}{Colors.NC}")
        
        # Final status
        if results.failed == 0:
            print(f"\n{Colors.GREEN}{Colors.BOLD}🎉 ALL TESTS PASSED!{Colors.NC}\n")
            return 0
        else:
            print(f"\n{Colors.YELLOW}⚠️  SOME TESTS FAILED{Colors.NC}\n")
            return 1
    
    except KeyboardInterrupt:
        print(f"\n{Colors.YELLOW}⚠️  Tests interrupted by user{Colors.NC}")
        return 2
    except Exception as e:
        print(f"\n{Colors.RED}❌ Error running tests: {e}{Colors.NC}")
        import traceback
        traceback.print_exc()
        return 3

if __name__ == "__main__":
    sys.exit(main())

