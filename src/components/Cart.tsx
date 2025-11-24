import { OrderItem, Restaurant } from '../services/api';

interface CartProps {
  cart: OrderItem[];
  restaurant: Restaurant | null;
  onCheckout: () => void;
  onUpdateQuantity: (itemId: string, change: number) => void;
  onRemoveItem: (itemId: string) => void;
}

export function Cart({ cart, restaurant, onCheckout, onUpdateQuantity, onRemoveItem }: CartProps) {
  if (cart.length === 0) {
    return null;
  }

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const deliveryFee = restaurant?.delivery_fee || 0;
  const tax = subtotal * 0.0875; // 8.75% tax
  const total = subtotal + deliveryFee + tax;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t-2 border-gray-200 shadow-2xl z-50">
      <div className="max-w-6xl mx-auto p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-2xl font-bold text-gray-900 flex items-center">
            <span className="mr-2">🛒</span>
            Your Cart ({cart.length} {cart.length === 1 ? 'item' : 'items'})
          </h3>
          <button
            onClick={onCheckout}
            className="btn btn-primary text-lg px-8"
            disabled={subtotal < (restaurant?.minimum_order || 0)}
          >
            Checkout · ${total.toFixed(2)}
          </button>
        </div>

        {restaurant && subtotal < restaurant.minimum_order && (
          <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-sm text-yellow-800">
            ⚠️ Minimum order: ${restaurant.minimum_order.toFixed(2)} 
            (Add ${(restaurant.minimum_order - subtotal).toFixed(2)} more)
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-64 overflow-y-auto">
          {cart.map((item) => (
            <div key={item.item_id} className="flex items-center justify-between bg-gray-50 rounded-lg p-4">
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900">{item.name}</h4>
                <p className="text-sm text-gray-600">${item.price.toFixed(2)} each</p>
              </div>

              <div className="flex items-center space-x-2 ml-4">
                <button
                  onClick={() => onUpdateQuantity(item.item_id, -1)}
                  className="w-7 h-7 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center text-sm font-bold"
                >
                  −
                </button>
                <span className="font-semibold w-6 text-center">{item.quantity}</span>
                <button
                  onClick={() => onUpdateQuantity(item.item_id, 1)}
                  className="w-7 h-7 rounded-full bg-primary-600 hover:bg-primary-700 text-white flex items-center justify-center text-sm font-bold"
                >
                  +
                </button>
                <button
                  onClick={() => onRemoveItem(item.item_id)}
                  className="ml-2 text-red-500 hover:text-red-700 font-bold"
                >
                  ×
                </button>
              </div>

              <div className="ml-4 font-bold text-gray-900">
                ${(item.price * item.quantity).toFixed(2)}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-gray-600">Subtotal:</span>
            <span className="font-semibold">${subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm mb-2">
            <span className="text-gray-600">Delivery Fee:</span>
            <span className="font-semibold">${deliveryFee.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm mb-2">
            <span className="text-gray-600">Tax (8.75%):</span>
            <span className="font-semibold">${tax.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-lg font-bold mt-2 pt-2 border-t border-gray-200">
            <span>Total:</span>
            <span className="text-primary-600">${total.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

