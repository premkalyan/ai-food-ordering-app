const API_BASE_URL = 'https://ai-food-ordering-poc.vercel.app/api/v1';

export interface Restaurant {
  id: string;
  name: string;
  cuisine: string;
  location: {
    address: string;
    city: string;
    state: string;
    zip: string;
  };
  rating: number;
  price_range: string;
  delivery_time: string;
  minimum_order: number;
  delivery_fee: number;
  is_open: boolean;
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  vegetarian?: boolean;
  spicy?: boolean;
  popular?: boolean;
}

export interface MenuCategory {
  name: string;
  items: MenuItem[];
}

export interface Order {
  id: string;
  restaurant_id: string;
  restaurant_name: string;
  items: OrderItem[];
  subtotal: number;
  delivery_fee: number;
  tax: number;
  total: number;
  status: string;
  estimated_delivery: string;
}

export interface OrderItem {
  item_id: string;
  name: string;
  price: number;
  quantity: number;
}

export const api = {
  // Get available cities
  async getCities(): Promise<{ cities: string[] }> {
    const response = await fetch(`${API_BASE_URL}/cities`);
    return response.json();
  },

  // Get available cuisines
  async getCuisines(): Promise<{ cuisines: string[] }> {
    const response = await fetch(`${API_BASE_URL}/cuisines`);
    return response.json();
  },

  // Search restaurants
  async searchRestaurants(params: { city?: string; cuisine?: string }): Promise<Restaurant[]> {
    const query = new URLSearchParams(params as Record<string, string>).toString();
    const response = await fetch(`${API_BASE_URL}/restaurants/search?${query}`);
    return response.json();
  },

  // Get restaurant menu
  async getMenu(restaurantId: string): Promise<{ categories: MenuCategory[] }> {
    const response = await fetch(`${API_BASE_URL}/restaurants/${restaurantId}/menu`);
    if (!response.ok) {
      throw new Error(`Failed to fetch menu: ${response.status}`);
    }
    const data = await response.json();
    console.log('API response for menu:', data);
    return data;
  },

  // Create order
  async createOrder(orderData: {
    restaurant_id: string;
    items: OrderItem[];
    delivery_address: {
      address: string;
      city: string;
      state: string;
      zip: string;
    };
  }): Promise<Order> {
    const response = await fetch(`${API_BASE_URL}/orders/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(orderData),
    });
    return response.json();
  },

  // Process payment
  async processPayment(orderId: string): Promise<{ success: boolean; transaction_id: string }> {
    const response = await fetch(`${API_BASE_URL}/orders/${orderId}/payment`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        payment_method: {
          type: 'credit_card',
          last_four: '4242',
        },
      }),
    });
    return response.json();
  },

  // Get favorites
  async getFavorites(): Promise<Restaurant[]> {
    const response = await fetch(`${API_BASE_URL}/favorites/restaurants`);
    return response.json();
  },

  // Add to favorites
  async addFavorite(restaurantId: string): Promise<{ success: boolean }> {
    const response = await fetch(`${API_BASE_URL}/favorites/restaurants/${restaurantId}`, {
      method: 'POST',
    });
    return response.json();
  },

  // Intelligent search
  async intelligentSearch(query: string, location?: string): Promise<{
    restaurants: Restaurant[];
    suggested_items: MenuItem[];
    query: string;
    parsed: any;
  }> {
    const params = new URLSearchParams({ query });
    if (location) params.append('location', location);
    const response = await fetch(`${API_BASE_URL}/search/intelligent?${params}`);
    return response.json();
  },

  // Track order
  async trackOrder(orderId: string): Promise<Order> {
    const response = await fetch(`${API_BASE_URL}/orders/${orderId}`);
    return response.json();
  },
};

