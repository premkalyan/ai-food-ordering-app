import { Order } from '../services/api';

interface OrderConfirmationProps {
  order: Order;
  onStartNew: () => void;
}

export function OrderConfirmation({ order, onStartNew }: OrderConfirmationProps) {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="text-center mb-8">
        <div className="inline-block p-4 bg-green-100 rounded-full mb-4">
          <span className="text-6xl">✅</span>
        </div>
        <h2 className="text-4xl font-bold text-gray-900 mb-2">Order Confirmed!</h2>
        <p className="text-xl text-gray-600">
          Your food is on its way
        </p>
      </div>

      <div className="card mb-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-2xl font-bold text-gray-900">Order #{order.id}</h3>
            <p className="text-gray-600">From {order.restaurant_name}</p>
          </div>
          <div className="text-right">
            <div className="inline-block px-4 py-2 bg-green-100 text-green-800 rounded-full font-semibold">
              {order.status}
            </div>
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-6 mb-6">
          <div className="flex items-center justify-center space-x-4 mb-4">
            <span className="text-4xl">🍳</span>
            <span className="text-2xl">→</span>
            <span className="text-4xl">📦</span>
            <span className="text-2xl">→</span>
            <span className="text-4xl">🚗</span>
            <span className="text-2xl">→</span>
            <span className="text-4xl">🏠</span>
          </div>
          <p className="text-center text-lg font-semibold text-gray-900">
            Estimated Delivery: {order.estimated_delivery}
          </p>
        </div>

        <div className="space-y-3 mb-6">
          <h4 className="font-bold text-gray-900">Order Items:</h4>
          {order.items.map((item, index) => (
            <div key={index} className="flex justify-between text-sm">
              <span className="text-gray-700">
                {item.quantity}x {item.name}
              </span>
              <span className="font-semibold">
                ${(item.price * item.quantity).toFixed(2)}
              </span>
            </div>
          ))}
        </div>

        <div className="pt-4 border-t border-gray-200 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Subtotal:</span>
            <span className="font-semibold">${order.subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Delivery Fee:</span>
            <span className="font-semibold">${order.delivery_fee.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Tax:</span>
            <span className="font-semibold">${order.tax.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-lg font-bold mt-2 pt-2 border-t border-gray-200">
            <span>Total Paid:</span>
            <span className="text-green-600">${order.total.toFixed(2)}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="card text-center">
          <span className="text-3xl mb-2">📱</span>
          <p className="text-sm text-gray-600">Track your order in real-time</p>
        </div>
        <div className="card text-center">
          <span className="text-3xl mb-2">💬</span>
          <p className="text-sm text-gray-600">Chat with your driver</p>
        </div>
        <div className="card text-center">
          <span className="text-3xl mb-2">⭐</span>
          <p className="text-sm text-gray-600">Rate your experience</p>
        </div>
      </div>

      <div className="text-center">
        <button onClick={onStartNew} className="btn btn-primary text-lg px-8">
          Order Again
        </button>
      </div>
    </div>
  );
}

