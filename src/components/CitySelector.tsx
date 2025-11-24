import { useState, useEffect } from 'react';
import { api } from '../services/api';

interface CitySelectorProps {
  onSelectCity: (city: string) => void;
}

export function CitySelector({ onSelectCity }: CitySelectorProps) {
  const [cities, setCities] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getCities().then((data) => {
      setCities(data.cities);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          🍽️ Welcome to AI Food Ordering
        </h2>
        <p className="text-lg text-gray-600">
          Which city are you in?
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {cities.map((city) => (
          <button
            key={city}
            onClick={() => onSelectCity(city)}
            className="card hover:scale-105 transition-transform duration-200 cursor-pointer group"
          >
            <div className="flex items-center justify-center space-x-3">
              <span className="text-2xl">📍</span>
              <span className="text-xl font-semibold text-gray-800 group-hover:text-primary-600">
                {city}
              </span>
            </div>
          </button>
        ))}
      </div>

      <div className="mt-8 text-center text-sm text-gray-500">
        <p>Click a city to see available restaurants</p>
      </div>
    </div>
  );
}

