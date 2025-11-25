import { useState, useEffect } from 'react';
import { api, Order } from '../services/api';

interface OrderTrackingProps {
  order: Order;
  onStartNew: () => void;
}

export function OrderTracking({ order: initialOrder, onStartNew }: OrderTrackingProps) {
  const [order, setOrder] = useState<Order>(initialOrder);
  const [loading, setLoading] = useState(false);

  // Poll for order updates every 3 seconds
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const updatedOrder = await api.trackOrder(order.id);
        setOrder(updatedOrder);
      } catch (error) {
        console.error('Failed to track order:', error);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [order.id]);

  const refreshStatus = async () => {
    setLoading(true);
    try {
      const updatedOrder = await api.trackOrder(order.id);
      setOrder(updatedOrder);
    } catch (error) {
      console.error('Failed to refresh order:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      'pending': 'bg-yellow-100 text-yellow-800',
      'confirmed': 'bg-blue-100 text-blue-800',
      'preparing': 'bg-purple-100 text-purple-800',
      'ready': 'bg-indigo-100 text-indigo-800',
      'out_for_delivery': 'bg-orange-100 text-orange-800',
      'delivered': 'bg-green-100 text-green-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getStatusIcon = (status: string) => {
    const icons: Record<string, string> = {
      'pending': '⏳',
      'confirmed': '✅',
      'preparing': '🍳',
      'ready': '📦',
      'out_for_delivery': '🚗',
      'delivered': '🎉',
    };
    return icons[status] || '📋';
  };

  const getStatusMessage = (status: string) => {
    const messages: Record<string, string> = {
      'pending': 'Order received, waiting for confirmation',
      'confirmed': 'Restaurant confirmed your order',
      'preparing': 'Your food is being prepared',
      'ready': 'Food is ready for pickup',
      'out_for_delivery': 'Driver is on the way',
      'delivered': 'Order delivered! Enjoy your meal!',
    };
    return messages[status] || 'Processing your order';
  };

  const statusSteps = [
    { key: 'pending', label: 'Received', icon: '📋' },
    { key: 'confirmed', label: 'Confirmed', icon: '✅' },
    { key: 'preparing', label: 'Preparing', icon: '🍳' },
    { key: 'ready', label: 'Ready', icon: '📦' },
    { key: 'out_for_delivery', label: 'On the way', icon: '🚗' },
    { key: 'delivered', label: 'Delivered', icon: '🎉' },
  ];

  const currentStepIndex = statusSteps.findIndex(step => step.key === order.status);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="text-center mb-8">
        <div className="inline-block p-4 bg-green-100 rounded-full mb-4">
          <span className="text-6xl">{getStatusIcon(order.status)}</span>
        </div>
        <h2 className="text-4xl font-bold text-gray-900 mb-2">Order #{order.id}</h2>
        <p className="text-xl text-gray-600">
          {getStatusMessage(order.status)}
        </p>
      </div>

      {/* Status Progress Bar */}
      <div className="card mb-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-2xl font-bold text-gray-900">Tracking</h3>
            <p className="text-gray-600">From {order.restaurant_name}</p>
          </div>
          <div className="text-right">
            <div className={`inline-block px-4 py-2 rounded-full font-semibold ${getStatusColor(order.status)}`}>
              {order.status.replace(/_/g, ' ').toUpperCase()}
            </div>
          </div>
        </div>

        {/* Progress Steps */}
        <div className="relative mb-8">
          <div className="flex justify-between items-center">
            {statusSteps.map((step, index) => {
              const isCompleted = index <= currentStepIndex;
              const isCurrent = index === currentStepIndex;
              
              return (
                <div key={step.key} className="flex flex-col items-center flex-1">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl mb-2 transition-all ${
                    isCompleted 
                      ? 'bg-green-500 scale-110' 
                      : 'bg-gray-200'
                  } ${isCurrent ? 'ring-4 ring-green-300 animate-pulse' : ''}`}>
                    {step.icon}
                  </div>
                  <p className={`text-xs text-center font-medium ${
                    isCompleted ? 'text-green-600' : 'text-gray-400'
                  }`}>
                    {step.label}
                  </p>
                  {index < statusSteps.length - 1 && (
                    <div className={`absolute h-1 top-6 transition-all ${
                      isCompleted ? 'bg-green-500' : 'bg-gray-200'
                    }`} style={{
                      left: `${(index + 0.5) * (100 / statusSteps.length)}%`,
                      width: `${100 / statusSteps.length}%`,
                    }} />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Estimated Delivery */}
        <div className="bg-blue-50 rounded-lg p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <span className="text-4xl">🕒</span>
              <div>
                <p className="text-sm text-gray-600">Estimated Delivery</p>
                <p className="text-2xl font-bold text-gray-900">{order.estimated_delivery}</p>
              </div>
            </div>
            <button
              onClick={refreshStatus}
              disabled={loading}
              className="btn btn-secondary"
            >
              {loading ? '⏳' : '🔄'} Refresh
            </button>
          </div>
        </div>

        {/* Order Items */}
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

        {/* Order Total */}
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

      {/* Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="card text-center hover:shadow-lg transition-shadow cursor-pointer">
          <span className="text-3xl mb-2">📱</span>
          <p className="text-sm font-medium text-gray-900">Contact Driver</p>
          <p className="text-xs text-gray-600">Call or message</p>
        </div>
        <div className="card text-center hover:shadow-lg transition-shadow cursor-pointer">
          <span className="text-3xl mb-2">📍</span>
          <p className="text-sm font-medium text-gray-900">Live Location</p>
          <p className="text-xs text-gray-600">Track on map</p>
        </div>
        <div className="card text-center hover:shadow-lg transition-shadow cursor-pointer">
          <span className="text-3xl mb-2">💬</span>
          <p className="text-sm font-medium text-gray-900">Support</p>
          <p className="text-xs text-gray-600">Get help</p>
        </div>
      </div>

      {/* Actions */}
      <div className="text-center space-y-3">
        {order.status === 'delivered' && (
          <button onClick={onStartNew} className="btn btn-primary text-lg px-8 w-full md:w-auto">
            Order Again
          </button>
        )}
        <p className="text-xs text-gray-500">
          Auto-refreshing every 3 seconds
        </p>
      </div>
    </div>
  );
}

