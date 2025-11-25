#!/usr/bin/env python3
"""
End-to-End Demo Scripts for AI Food Ordering System
These scripts demonstrate complete user journeys and can be used for demos
"""

import requests
import json
import time
from datetime import datetime
from typing import Dict, List

API_BASE = "https://ai-food-ordering-poc.vercel.app"

class Colors:
    GREEN = '\033[0;32m'
    RED = '\033[0;31m'
    YELLOW = '\033[1;33m'
    BLUE = '\033[0;34m'
    CYAN = '\033[0;36m'
    MAGENTA = '\033[0;35m'
    NC = '\033[0m'
    BOLD = '\033[1m'

def print_step(step_num: int, description: str):
    """Print a demo step"""
    print(f"\n{Colors.BOLD}{Colors.BLUE}Step {step_num}: {description}{Colors.NC}")
    print(f"{Colors.CYAN}{'─' * 70}{Colors.NC}")

def print_user_action(action: str):
    """Print user action"""
    print(f"{Colors.YELLOW}👤 User: {action}{Colors.NC}")

def print_system_response(response: str):
    """Print system response"""
    print(f"{Colors.GREEN}🤖 System: {response}{Colors.NC}")

def print_api_call(method: str, endpoint: str):
    """Print API call"""
    print(f"{Colors.CYAN}📡 API Call: {method} {endpoint}{Colors.NC}")

def print_result(data: Dict):
    """Print formatted result"""
    print(f"{Colors.MAGENTA}📊 Result:{Colors.NC}")
    print(json.dumps(data, indent=2))

def wait_with_message(seconds: int, message: str):
    """Wait with a message"""
    print(f"{Colors.YELLOW}⏳ {message} ({seconds}s)...{Colors.NC}")
    time.sleep(seconds)

# =============================================================================
# DEMO 1: Simple Order Flow (Standard API)
# =============================================================================

def demo_1_simple_order_flow():
    """
    Demo 1: Simple Order Flow using Standard APIs
    User Journey: Browse cities → Select cuisine → Choose restaurant → View menu → Place order → Track order
    """
    print(f"\n{Colors.BOLD}{Colors.MAGENTA}{'='*70}{Colors.NC}")
    print(f"{Colors.BOLD}{Colors.MAGENTA}DEMO 1: SIMPLE ORDER FLOW (Standard API){Colors.NC}")
    print(f"{Colors.BOLD}{Colors.MAGENTA}{'='*70}{Colors.NC}")
    
    # Step 1: Get available cities
    print_step(1, "User wants to order food")
    print_user_action("I want to order food")
    print_system_response("Let me show you available cities...")
    print_api_call("GET", "/api/v1/cities")
    
    response = requests.get(f"{API_BASE}/api/v1/cities")
    cities = response.json()
    print_result({"cities": cities})
    
    # Step 2: Select city and get cuisines
    selected_city = "New York"
    print_step(2, "User selects city")
    print_user_action(f"I'm in {selected_city}")
    print_system_response(f"Great! Let me show you available cuisines in {selected_city}...")
    print_api_call("GET", f"/api/v1/cuisines?city={selected_city}")
    
    response = requests.get(f"{API_BASE}/api/v1/cuisines?city={selected_city}")
    cuisines = response.json()
    print_result({"cuisines": cuisines})
    
    # Step 3: Select cuisine and get restaurants
    selected_cuisine = "Indian"
    print_step(3, "User selects cuisine")
    print_user_action(f"I want {selected_cuisine} food")
    print_system_response(f"Here are the {selected_cuisine} restaurants in {selected_city}...")
    print_api_call("GET", f"/api/v1/restaurants/search?city={selected_city}&cuisine={selected_cuisine}")
    
    response = requests.get(f"{API_BASE}/api/v1/restaurants/search?city={selected_city}&cuisine={selected_cuisine}")
    restaurants = response.json()
    print_result({"restaurants": [{"id": r["id"], "name": r["name"], "rating": r["rating"]} for r in restaurants]})
    
    # Step 4: Select restaurant and get menu
    selected_restaurant = restaurants[0]
    print_step(4, "User selects restaurant")
    print_user_action(f"Show me the menu for {selected_restaurant['name']}")
    print_system_response(f"Here's the menu for {selected_restaurant['name']}...")
    print_api_call("GET", f"/api/v1/restaurants/{selected_restaurant['id']}/menu")
    
    response = requests.get(f"{API_BASE}/api/v1/restaurants/{selected_restaurant['id']}/menu")
    menu = response.json()
    
    # Show simplified menu
    menu_summary = []
    for category in menu['categories']:
        for item in category['items']:
            menu_summary.append({
                "id": item['id'],
                "name": item['name'],
                "price": item['price']
            })
    print_result({"menu_items": menu_summary[:5]})  # Show first 5 items
    
    # Step 5: Place order
    print_step(5, "User places order")
    selected_item = menu['categories'][0]['items'][0]
    print_user_action(f"I'll order {selected_item['name']}")
    print_system_response("Creating your order...")
    print_api_call("POST", "/api/v1/orders/create")
    
    order_data = {
        "restaurant_id": selected_restaurant['id'],
        "items": [
            {
                "item_id": selected_item['id'],
                "name": selected_item['name'],
                "price": selected_item['price'],
                "quantity": 1
            }
        ],
        "delivery_address": {
            "address": "123 Broadway",
            "city": selected_city,
            "state": "NY",
            "zip": "10001"
        },
        "special_instructions": "Please ring doorbell"
    }
    
    response = requests.post(f"{API_BASE}/api/v1/orders/create", json=order_data)
    order_result = response.json()
    print_result(order_result)
    
    # Step 6: Track order
    if 'order_id' in order_result:
        order_id = order_result['order_id']
        print_step(6, "Track order status")
        
        for i in range(3):
            print_user_action(f"What's the status of my order? (Check #{i+1})")
            print_api_call("GET", f"/api/v1/orders/{order_id}")
            
            response = requests.get(f"{API_BASE}/api/v1/orders/{order_id}")
            order_status = response.json()
            print_result({
                "order_id": order_status['order_id'],
                "status": order_status['status'],
                "estimated_delivery": order_status.get('estimated_delivery_time', 'N/A')
            })
            
            if i < 2:
                wait_with_message(3, "Waiting for status update")
    
    print(f"\n{Colors.GREEN}✅ Demo 1 Complete!{Colors.NC}\n")

# =============================================================================
# DEMO 2: Intelligent Search Flow
# =============================================================================

def demo_2_intelligent_search():
    """
    Demo 2: Intelligent Search Flow
    User Journey: Natural language query → Get recommendations → Place order
    """
    print(f"\n{Colors.BOLD}{Colors.MAGENTA}{'='*70}{Colors.NC}")
    print(f"{Colors.BOLD}{Colors.MAGENTA}DEMO 2: INTELLIGENT SEARCH FLOW{Colors.NC}")
    print(f"{Colors.BOLD}{Colors.MAGENTA}{'='*70}{Colors.NC}")
    
    # Scenario 1: Dish-based search
    print_step(1, "User wants specific dish")
    query1 = "I want Chicken Tikka Masala in New York"
    print_user_action(query1)
    print_system_response("Let me find that for you...")
    print_api_call("GET", f"/api/v1/search/intelligent?query={query1}&location=New York")
    
    response = requests.get(f"{API_BASE}/api/v1/search/intelligent", 
                           params={"query": query1, "location": "New York"})
    result1 = response.json()
    
    if result1.get('restaurants'):
        print_result({
            "found": len(result1['restaurants']),
            "restaurants": [{"name": r["name"], "rating": r["rating"]} for r in result1['restaurants'][:3]],
            "suggested_items": result1.get('suggested_items', [])[:3]
        })
    
    # Scenario 2: Price constraint
    print_step(2, "User wants food under budget")
    query2 = "Italian food under $20"
    print_user_action(query2)
    print_system_response("Searching for Italian restaurants with items under $20...")
    print_api_call("GET", f"/api/v1/search/intelligent?query={query2}")
    
    response = requests.get(f"{API_BASE}/api/v1/search/intelligent", 
                           params={"query": query2})
    result2 = response.json()
    
    if result2.get('restaurants'):
        print_result({
            "found": len(result2['restaurants']),
            "restaurants": [{"name": r["name"], "cuisine": r["cuisine"]} for r in result2['restaurants'][:3]],
            "matching_items": len(result2.get('suggested_items', []))
        })
    
    # Scenario 3: Time constraint
    print_step(3, "User needs fast delivery")
    query3 = "I'm hungry, get me something spicy in 25 minutes"
    print_user_action(query3)
    print_system_response("Finding spicy food with fast delivery...")
    print_api_call("GET", f"/api/v1/search/intelligent?query={query3}")
    
    response = requests.get(f"{API_BASE}/api/v1/search/intelligent", 
                           params={"query": query3})
    result3 = response.json()
    
    if result3.get('restaurants'):
        print_result({
            "found": len(result3['restaurants']),
            "restaurants": [
                {
                    "name": r["name"], 
                    "delivery_time": r["delivery_time"],
                    "cuisine": r["cuisine"]
                } for r in result3['restaurants'][:3]
            ]
        })
    
    # Scenario 4: Complex query
    print_step(4, "User has multiple requirements")
    query4 = "vegetarian Thai food under $18 in 30 minutes"
    print_user_action(query4)
    print_system_response("Finding vegetarian Thai options that match your criteria...")
    print_api_call("GET", f"/api/v1/search/intelligent?query={query4}")
    
    response = requests.get(f"{API_BASE}/api/v1/search/intelligent", 
                           params={"query": query4})
    result4 = response.json()
    
    if result4.get('restaurants'):
        print_result({
            "found": len(result4['restaurants']),
            "restaurants": [{"name": r["name"]} for r in result4['restaurants'][:3]],
            "vegetarian_items": len([item for item in result4.get('suggested_items', []) if item.get('vegetarian')])
        })
    
    print(f"\n{Colors.GREEN}✅ Demo 2 Complete!{Colors.NC}\n")

# =============================================================================
# DEMO 3: Complete User Journey (Intelligent + Order + Track)
# =============================================================================

def demo_3_complete_journey():
    """
    Demo 3: Complete User Journey
    Combines intelligent search with order placement and tracking
    """
    print(f"\n{Colors.BOLD}{Colors.MAGENTA}{'='*70}{Colors.NC}")
    print(f"{Colors.BOLD}{Colors.MAGENTA}DEMO 3: COMPLETE USER JOURNEY{Colors.NC}")
    print(f"{Colors.BOLD}{Colors.MAGENTA}{'='*70}{Colors.NC}")
    
    # Step 1: Intelligent search
    print_step(1, "User makes natural language request")
    query = "I want sushi in Los Angeles under $20"
    print_user_action(query)
    print_system_response("Searching for sushi restaurants in LA with items under $20...")
    print_api_call("GET", f"/api/v1/search/intelligent?query={query}&location=Los Angeles")
    
    response = requests.get(f"{API_BASE}/api/v1/search/intelligent", 
                           params={"query": query, "location": "Los Angeles"})
    search_result = response.json()
    
    if not search_result.get('restaurants'):
        print(f"{Colors.RED}❌ No restaurants found{Colors.NC}")
        return
    
    restaurant = search_result['restaurants'][0]
    print_result({
        "selected_restaurant": {
            "name": restaurant["name"],
            "rating": restaurant["rating"],
            "delivery_time": restaurant["delivery_time"]
        },
        "suggested_items": search_result.get('suggested_items', [])[:3]
    })
    
    # Step 2: Get full menu
    print_step(2, "User wants to see full menu")
    print_user_action(f"Show me the full menu for {restaurant['name']}")
    print_api_call("GET", f"/api/v1/restaurants/{restaurant['id']}/menu")
    
    response = requests.get(f"{API_BASE}/api/v1/restaurants/{restaurant['id']}/menu")
    menu = response.json()
    
    # Find items under $20
    affordable_items = []
    for category in menu['categories']:
        for item in category['items']:
            if item['price'] <= 20:
                affordable_items.append(item)
    
    print_result({
        "items_under_20": len(affordable_items),
        "sample_items": [
            {"name": item['name'], "price": item['price']} 
            for item in affordable_items[:3]
        ]
    })
    
    # Step 3: Place order
    if affordable_items:
        print_step(3, "User places order")
        selected_items = affordable_items[:2]  # Order first 2 items
        print_user_action(f"I'll order {', '.join([item['name'] for item in selected_items])}")
        print_api_call("POST", "/api/v1/orders/create")
        
        order_data = {
            "restaurant_id": restaurant['id'],
            "items": [
                {
                    "item_id": item['id'],
                    "name": item['name'],
                    "price": item['price'],
                    "quantity": 1
                }
                for item in selected_items
            ],
            "delivery_address": {
                "address": "456 Sunset Blvd",
                "city": "Los Angeles",
                "state": "CA",
                "zip": "90028"
            },
            "special_instructions": "Extra wasabi please"
        }
        
        response = requests.post(f"{API_BASE}/api/v1/orders/create", json=order_data)
        order_result = response.json()
        print_result(order_result)
        
        # Step 4: Track order over time
        if 'order_id' in order_result:
            order_id = order_result['order_id']
            print_step(4, "Track order progression")
            
            tracking_times = [0, 3, 6]  # Check at 0s, 3s, 6s
            for i, wait_time in enumerate(tracking_times):
                if i > 0:
                    wait_with_message(wait_time - tracking_times[i-1], "Waiting for order progress")
                
                print_user_action(f"Check order status (Update #{i+1})")
                print_api_call("GET", f"/api/v1/orders/{order_id}")
                
                response = requests.get(f"{API_BASE}/api/v1/orders/{order_id}")
                order_status = response.json()
                
                print_system_response(f"Order Status: {order_status['status']}")
                print_result({
                    "order_id": order_status['order_id'],
                    "status": order_status['status'],
                    "restaurant": order_status['restaurant_name'],
                    "total": f"${order_status['total_amount']:.2f}",
                    "estimated_delivery": order_status.get('estimated_delivery_time', 'N/A')
                })
    
    print(f"\n{Colors.GREEN}✅ Demo 3 Complete!{Colors.NC}\n")

# =============================================================================
# DEMO 4: Multi-City Cuisine Coverage
# =============================================================================

def demo_4_multi_city_coverage():
    """
    Demo 4: Show complete coverage across all cities
    Demonstrates that all cuisines are available in all cities
    """
    print(f"\n{Colors.BOLD}{Colors.MAGENTA}{'='*70}{Colors.NC}")
    print(f"{Colors.BOLD}{Colors.MAGENTA}DEMO 4: MULTI-CITY CUISINE COVERAGE{Colors.NC}")
    print(f"{Colors.BOLD}{Colors.MAGENTA}{'='*70}{Colors.NC}")
    
    cities = ["San Francisco", "New York", "Los Angeles", "Chicago", "Bangalore"]
    test_cuisine = "Indian"
    
    print_step(1, f"Show {test_cuisine} availability across all cities")
    print_user_action(f"Where can I get {test_cuisine} food?")
    print_system_response(f"{test_cuisine} food is available in ALL cities! Let me show you...")
    
    coverage = {}
    for city in cities:
        print_api_call("GET", f"/api/v1/restaurants/search?city={city}&cuisine={test_cuisine}")
        response = requests.get(f"{API_BASE}/api/v1/restaurants/search", 
                               params={"city": city, "cuisine": test_cuisine})
        restaurants = response.json()
        coverage[city] = {
            "count": len(restaurants),
            "restaurants": [r["name"] for r in restaurants]
        }
    
    print_result(coverage)
    
    print_step(2, "Test Chicken Tikka Masala in different cities")
    print_user_action("I want Chicken Tikka Masala, which cities have it?")
    
    tikka_availability = {}
    for city in cities:
        print_api_call("GET", f"/api/v1/search/intelligent?query=Chicken Tikka Masala&location={city}")
        response = requests.get(f"{API_BASE}/api/v1/search/intelligent",
                               params={"query": "Chicken Tikka Masala", "location": city})
        result = response.json()
        
        if result.get('restaurants'):
            tikka_availability[city] = {
                "available": True,
                "restaurants": [r["name"] for r in result['restaurants'][:2]]
            }
        else:
            tikka_availability[city] = {"available": False}
    
    print_result(tikka_availability)
    
    print(f"\n{Colors.GREEN}✅ Demo 4 Complete!{Colors.NC}\n")

# =============================================================================
# MAIN DEMO RUNNER
# =============================================================================

def main():
    """Run all demo scripts"""
    print(f"\n{Colors.BOLD}{Colors.MAGENTA}")
    print("=" * 70)
    print("AI FOOD ORDERING - E2E DEMO SCRIPTS".center(70))
    print("=" * 70)
    print(f"{Colors.NC}")
    print(f"Started: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    print(f"API Base: {API_BASE}\n")
    
    print(f"{Colors.CYAN}Available Demos:{Colors.NC}")
    print(f"  1. Simple Order Flow (Standard API)")
    print(f"  2. Intelligent Search Flow")
    print(f"  3. Complete User Journey")
    print(f"  4. Multi-City Cuisine Coverage")
    print(f"  5. Run All Demos")
    
    choice = input(f"\n{Colors.YELLOW}Select demo (1-5): {Colors.NC}").strip()
    
    try:
        if choice == "1":
            demo_1_simple_order_flow()
        elif choice == "2":
            demo_2_intelligent_search()
        elif choice == "3":
            demo_3_complete_journey()
        elif choice == "4":
            demo_4_multi_city_coverage()
        elif choice == "5":
            demo_1_simple_order_flow()
            demo_2_intelligent_search()
            demo_3_complete_journey()
            demo_4_multi_city_coverage()
        else:
            print(f"{Colors.RED}Invalid choice{Colors.NC}")
            return 1
        
        print(f"\n{Colors.GREEN}{Colors.BOLD}🎉 ALL DEMOS COMPLETE!{Colors.NC}\n")
        return 0
    
    except KeyboardInterrupt:
        print(f"\n{Colors.YELLOW}⚠️  Demo interrupted by user{Colors.NC}")
        return 2
    except Exception as e:
        print(f"\n{Colors.RED}❌ Error running demo: {e}{Colors.NC}")
        import traceback
        traceback.print_exc()
        return 3

if __name__ == "__main__":
    import sys
    sys.exit(main())

