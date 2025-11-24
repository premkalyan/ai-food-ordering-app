import { useState, useEffect } from 'react';
import { api, Restaurant } from '../services/api';

interface RestaurantListProps {
  city: string;
  cuisine: string;
  onSelectRestaurant: (restaurant: Restaurant) => void;
  onBack: () => void;
}

export function RestaurantList({ city, cuisine, onSelectRestaurant, onBack }: RestaurantListProps) {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.searchRestaurants({ city, cuisine }).then((data) => {
      setRestaurants(data);
      setLoading(false);
    });
  }, [city, cuisine]);

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
        Back to cuisines
      </button>

      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          {cuisine} Restaurants in {city}
        </h2>
        <p className="text-lg text-gray-600">
          Found {restaurants.length} restaurant{restaurants.length !== 1 ? 's' : ''}
        </p>
      </div>

      {restaurants.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-xl text-gray-600">No restaurants found in this area.</p>
          <button onClick={onBack} className="mt-4 btn btn-primary">
            Try another cuisine
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {restaurants.map((restaurant) => (
            <div key={restaurant.id} className="card group cursor-pointer">
              <div className="flex flex-col h-full">
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2 group-hover:text-primary-600">
                    {restaurant.name}
                  </h3>
                  
                  <div className="flex items-center space-x-4 mb-3 text-sm">
                    <span className="flex items-center">
                      ⭐ <span className="ml-1 font-semibold">{restaurant.rating}</span>
                    </span>
                    <span className="text-gray-600">{restaurant.price_range}</span>
                    <span className="flex items-center text-gray-600">
                      🕒 {restaurant.delivery_time}
                    </span>
                  </div>

                  <p className="text-gray-600 mb-3">
                    📍 {restaurant.location.address}
                  </p>

                  <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                    <span>Min order: ${restaurant.minimum_order}</span>
                    <span>Delivery: ${restaurant.delivery_fee}</span>
                  </div>
                </div>

                <div className="flex space-x-3">
                  <button
                    onClick={() => onSelectRestaurant(restaurant)}
                    className="flex-1 btn btn-primary"
                  >
                    View Menu
                  </button>
                  <button
                    onClick={async (e) => {
                      e.stopPropagation();
                      await api.addFavorite(restaurant.id);
                      alert('Added to favorites!');
                    }}
                    className="btn btn-secondary"
                  >
                    ⭐
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

