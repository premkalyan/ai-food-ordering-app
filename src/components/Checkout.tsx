import { useState } from 'react';
import { api, OrderItem, Restaurant, Order } from '../services/api';

interface CheckoutProps {
  cart: OrderItem[];
  restaurant: Restaurant;
  onBack: () => void;
  onSuccess: (order: Order) => void;
}

export function Checkout({ cart, restaurant, onBack, onSuccess }: CheckoutProps) {
  const [address, setAddress] = useState('123 Main St');
  const [city, setCity] = useState(restaurant.location.city);
  const [state, setState] = useState(restaurant.location.state);
  const [zip, setZip] = useState('10001');
  const [processing, setProcessing] = useState(false);

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const deliveryFee = restaurant.delivery_fee;
  const tax = subtotal * 0.0875;
  const total = subtotal + deliveryFee + tax;

  const handlePlaceOrder = async () => {
    setProcessing(true);
    try {
      const order = await api.createOrder({
        restaurant_id: restaurant.id,
        items: cart,
        delivery_address: { address, city, state, zip },
      });

      await api.processPayment(order.id);
      onSuccess(order);
    } catch (error) {
      console.error('Order failed:', error);
      alert('Order failed. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 mb-24">
      <button
        onClick={onBack}
        className="mb-6 flex items-center text-gray-600 hover:text-gray-900"
      >
        <span className="mr-2">←</span>
        Back to menu
      </button>

      <h2 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Order Summary */}
        <div>
          <div className="card mb-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Order Summary</h3>
            <div className="space-y-3">
              {cart.map((item) => (
                <div key={item.item_id} className="flex justify-between text-sm">
                  <span className="text-gray-700">
                    {item.quantity}x {item.name}
                  </span>
                  <span className="font-semibold">
                    ${(item.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-4 pt-4 border-t border-gray-200 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Subtotal:</span>
                <span className="font-semibold">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Delivery Fee:</span>
                <span className="font-semibold">${deliveryFee.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Tax:</span>
                <span className="font-semibold">${tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-lg font-bold mt-2 pt-2 border-t border-gray-200">
                <span>Total:</span>
                <span className="text-primary-600">${total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <div className="card">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Restaurant</h3>
            <p className="font-semibold text-gray-900">{restaurant.name}</p>
            <p className="text-sm text-gray-600">{restaurant.location.address}</p>
            <p className="text-sm text-gray-600">
              {restaurant.location.city}, {restaurant.location.state} {restaurant.location.zip}
            </p>
            <p className="text-sm text-gray-600 mt-2">
              🕒 Estimated delivery: {restaurant.delivery_time}
            </p>
          </div>
        </div>

        {/* Delivery Details */}
        <div>
          <div className="card mb-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Delivery Address</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Street Address
                </label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="123 Main St"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    City
                  </label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    State
                  </label>
                  <input
                    type="text"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  ZIP Code
                </label>
                <input
                  type="text"
                  value={zip}
                  onChange={(e) => setZip(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="10001"
                />
              </div>
            </div>
          </div>

          <div className="card mb-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Payment Method</h3>
            <div className="bg-gray-50 rounded-lg p-4 flex items-center space-x-3">
              <span className="text-2xl">💳</span>
              <div>
                <p className="font-semibold text-gray-900">Credit Card •••• 4242</p>
                <p className="text-sm text-gray-600">Demo payment (no real charge)</p>
              </div>
            </div>
          </div>

          <button
            onClick={handlePlaceOrder}
            disabled={processing}
            className="w-full btn btn-primary text-lg py-4"
          >
            {processing ? (
              <span className="flex items-center justify-center">
                <span className="animate-spin mr-2">⏳</span>
                Processing...
              </span>
            ) : (
              `Place Order · $${total.toFixed(2)}`
            )}
          </button>

          <p className="text-xs text-gray-500 text-center mt-4">
            This is a demo. No real payment will be processed.
          </p>
        </div>
      </div>
    </div>
  );
}

