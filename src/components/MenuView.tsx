import { useState, useEffect } from 'react';
import { api, Restaurant, MenuCategory, MenuItem, OrderItem } from '../services/api';

interface MenuViewProps {
  restaurant: Restaurant;
  onBack: () => void;
  onAddToCart: (item: MenuItem) => void;
  cart: OrderItem[];
}

export function MenuView({ restaurant, onBack, onAddToCart, cart }: MenuViewProps) {
  const [menu, setMenu] = useState<MenuCategory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getMenu(restaurant.id).then((data) => {
      setMenu(data.categories);
      setLoading(false);
    });
  }, [restaurant.id]);

  const getItemQuantity = (itemId: string) => {
    const cartItem = cart.find((item) => item.item_id === itemId);
    return cartItem?.quantity || 0;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <button
        onClick={onBack}
        className="mb-6 flex items-center text-gray-600 hover:text-gray-900"
      >
        <span className="mr-2">←</span>
        Back to restaurants
      </button>

      {/* Restaurant Header */}
      <div className="card mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">{restaurant.name}</h2>
        <div className="flex items-center space-x-4 text-sm">
          <span className="flex items-center">
            ⭐ <span className="ml-1 font-semibold">{restaurant.rating}</span>
          </span>
          <span className="text-gray-600">{restaurant.price_range}</span>
          <span className="flex items-center text-gray-600">
            🕒 {restaurant.delivery_time}
          </span>
          <span className="text-gray-600">Delivery: ${restaurant.delivery_fee}</span>
        </div>
      </div>

      {/* Menu Categories */}
      <div className="space-y-8">
        {menu.map((category) => (
          <div key={category.name}>
            <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
              <span className="mr-2">🍽️</span>
              {category.name}
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {category.items.map((item) => {
                const quantity = getItemQuantity(item.id);
                
                return (
                  <div key={item.id} className="card">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex-1">
                        <h4 className="text-lg font-semibold text-gray-900 flex items-center">
                          {item.name}
                          {item.popular && <span className="ml-2 text-yellow-500">⭐</span>}
                          {item.vegetarian && <span className="ml-2">🥬</span>}
                          {item.spicy && <span className="ml-2">🌶️</span>}
                        </h4>
                        <p className="text-sm text-gray-600 mt-1">{item.description}</p>
                      </div>
                      <span className="text-lg font-bold text-primary-600 ml-4">
                        ${item.price.toFixed(2)}
                      </span>
                    </div>

                    <div className="flex items-center justify-between mt-4">
                      {quantity > 0 ? (
                        <div className="flex items-center space-x-3">
                          <button
                            onClick={() => {
                              // Remove one
                              const cartItem = cart.find((i) => i.item_id === item.id);
                              if (cartItem && cartItem.quantity > 1) {
                                onAddToCart({ ...item, quantity: -1 } as any);
                              }
                            }}
                            className="w-8 h-8 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center font-bold"
                          >
                            −
                          </button>
                          <span className="font-semibold text-lg w-8 text-center">{quantity}</span>
                          <button
                            onClick={() => onAddToCart(item)}
                            className="w-8 h-8 rounded-full bg-primary-600 hover:bg-primary-700 text-white flex items-center justify-center font-bold"
                          >
                            +
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => onAddToCart(item)}
                          className="btn btn-primary"
                        >
                          Add to Cart
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

