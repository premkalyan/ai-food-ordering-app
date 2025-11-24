import { useState, useEffect } from 'react';
import { api } from '../services/api';

interface CuisineSelectorProps {
  city: string;
  onSelectCuisine: (cuisine: string) => void;
  onBack: () => void;
}

const cuisineEmojis: Record<string, string> = {
  Indian: '🍛',
  Chinese: '🥡',
  Italian: '🍝',
  Japanese: '🍱',
  Mexican: '🌮',
  Mediterranean: '🥙',
  Thai: '🍜',
  Korean: '🍲',
};

export function CuisineSelector({ city, onSelectCuisine, onBack }: CuisineSelectorProps) {
  const [cuisines, setCuisines] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getCuisines().then((data) => {
      setCuisines(data.cuisines);
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
      <button
        onClick={onBack}
        className="mb-6 flex items-center text-gray-600 hover:text-gray-900"
      >
        <span className="mr-2">←</span>
        Back to cities
      </button>

      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          What are you craving?
        </h2>
        <p className="text-lg text-gray-600">
          Restaurants in <span className="font-semibold">{city}</span>
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {cuisines.map((cuisine) => (
          <button
            key={cuisine}
            onClick={() => onSelectCuisine(cuisine)}
            className="card hover:scale-105 transition-transform duration-200 cursor-pointer group p-8"
          >
            <div className="flex flex-col items-center space-y-3">
              <span className="text-4xl">{cuisineEmojis[cuisine] || '🍽️'}</span>
              <span className="text-lg font-semibold text-gray-800 group-hover:text-primary-600">
                {cuisine}
              </span>
            </div>
          </button>
        ))}
      </div>

      <div className="mt-8 text-center text-sm text-gray-500">
        <p>Click a cuisine to see restaurants</p>
      </div>
    </div>
  );
}

