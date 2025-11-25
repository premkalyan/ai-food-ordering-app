import { useState } from 'react';
import { CitySelector } from './components/CitySelector';
import { CuisineSelector } from './components/CuisineSelector';
import { RestaurantList } from './components/RestaurantList';
import { MenuView } from './components/MenuView';
import { Cart } from './components/Cart';
import { Checkout } from './components/Checkout';
import { OrderConfirmation } from './components/OrderConfirmation';
import { OrderTracking } from './components/OrderTracking';
import { ChatInterface } from './components/ChatInterface';
import { Restaurant, MenuItem, OrderItem, Order } from './services/api';

type AppState = 
  | { screen: 'city' }
  | { screen: 'cuisine'; city: string }
  | { screen: 'restaurants'; city: string; cuisine: string }
  | { screen: 'menu'; city: string; cuisine: string; restaurant: Restaurant }
  | { screen: 'checkout'; city: string; cuisine: string; restaurant: Restaurant }
  | { screen: 'confirmation'; order: Order }
  | { screen: 'tracking'; order: Order }
  | { screen: 'chat' };

function App() {
  const [state, setState] = useState<AppState>({ screen: 'city' });
  const [cart, setCart] = useState<OrderItem[]>([]);
  const [showChat, setShowChat] = useState(false);

  const handleAddToCart = (item: MenuItem) => {
    const existingItem = cart.find((cartItem) => cartItem.item_id === item.id);
    
    if (existingItem) {
      setCart(
        cart.map((cartItem) =>
          cartItem.item_id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        )
      );
    } else {
      setCart([
        ...cart,
        {
          item_id: item.id,
          name: item.name,
          price: item.price,
          quantity: 1,
        },
      ]);
    }
  };

  const handleUpdateQuantity = (itemId: string, change: number) => {
    setCart(
      cart
        .map((item) =>
          item.item_id === itemId
            ? { ...item, quantity: item.quantity + change }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const handleRemoveItem = (itemId: string) => {
    setCart(cart.filter((item) => item.item_id !== itemId));
  };

  const handleStartNew = () => {
    setState({ screen: 'city' });
    setCart([]);
  };

  const handleChatSelectRestaurant = (restaurant: Restaurant) => {
    setShowChat(false);
    setState({
      screen: 'menu',
      city: restaurant.location.city,
      cuisine: restaurant.cuisine,
      restaurant,
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-32">
      {/* Floating Chat Button */}
      {!showChat && state.screen !== 'chat' && (
        <button
          onClick={() => setShowChat(true)}
          className="fixed bottom-6 right-6 z-50 w-16 h-16 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all flex items-center justify-center text-2xl hover:scale-110"
          title="Chat with AI Assistant"
        >
          💬
        </button>
      )}

      {/* Chat Modal */}
      {showChat && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
          <div className="relative w-full max-w-2xl">
            <button
              onClick={() => setShowChat(false)}
              className="absolute -top-12 right-0 text-white hover:text-gray-300 text-3xl"
            >
              ✕
            </button>
            <ChatInterface onSelectRestaurant={handleChatSelectRestaurant} />
          </div>
        </div>
      )}

      {state.screen === 'city' && (
        <CitySelector
          onSelectCity={(city) => setState({ screen: 'cuisine', city })}
        />
      )}

      {state.screen === 'cuisine' && (
        <CuisineSelector
          city={state.city}
          onSelectCuisine={(cuisine) =>
            setState({ screen: 'restaurants', city: state.city, cuisine })
          }
          onBack={() => setState({ screen: 'city' })}
        />
      )}

      {state.screen === 'restaurants' && (
        <RestaurantList
          city={state.city}
          cuisine={state.cuisine}
          onSelectRestaurant={(restaurant) => {
            setState({
              screen: 'menu',
              city: state.city,
              cuisine: state.cuisine,
              restaurant,
            });
          }}
          onBack={() => setState({ screen: 'cuisine', city: state.city })}
        />
      )}

      {state.screen === 'menu' && (
        <>
          <MenuView
            restaurant={state.restaurant}
            onBack={() =>
              setState({ screen: 'restaurants', city: state.city, cuisine: state.cuisine })
            }
            onAddToCart={handleAddToCart}
            cart={cart}
          />
          <Cart
            cart={cart}
            restaurant={state.restaurant}
            onCheckout={() =>
              setState({
                screen: 'checkout',
                city: state.city,
                cuisine: state.cuisine,
                restaurant: state.restaurant,
              })
            }
            onUpdateQuantity={handleUpdateQuantity}
            onRemoveItem={handleRemoveItem}
          />
        </>
      )}

      {state.screen === 'checkout' && (
        <Checkout
          cart={cart}
          restaurant={state.restaurant}
          onBack={() =>
            setState({
              screen: 'menu',
              city: state.city,
              cuisine: state.cuisine,
              restaurant: state.restaurant,
            })
          }
          onSuccess={(order) => setState({ screen: 'confirmation', order })}
        />
      )}

      {state.screen === 'confirmation' && (
        <OrderConfirmation 
          order={state.order} 
          onStartNew={handleStartNew}
          onTrackOrder={() => setState({ screen: 'tracking', order: state.order })}
        />
      )}

      {state.screen === 'tracking' && (
        <OrderTracking order={state.order} onStartNew={handleStartNew} />
      )}
    </div>
  );
}

export default App;

