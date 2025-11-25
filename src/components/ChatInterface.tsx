import { useState, useRef, useEffect } from 'react';
import { api, Restaurant } from '../services/api';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  restaurants?: Restaurant[];
  suggestedItems?: any[];
}

interface ChatInterfaceProps {
  onSelectRestaurant?: (restaurant: Restaurant) => void;
}

export function ChatInterface({ onSelectRestaurant }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: "👋 Hi! I'm your AI food ordering assistant. You can ask me things like:\n\n• \"I want Chicken Tikka Masala in New York\"\n• \"Find Italian food under $20\"\n• \"I'm hungry, get me something spicy in 30 minutes\"\n• \"Show me sushi restaurants in Los Angeles\"\n\nWhat are you craving today?",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      // Call intelligent search API
      const result = await api.intelligentSearch(input);

      let responseContent = '';
      if (result.restaurants && result.restaurants.length > 0) {
        responseContent = `I found ${result.restaurants.length} restaurant${result.restaurants.length > 1 ? 's' : ''} matching your request:\n\n`;
        
        result.restaurants.slice(0, 3).forEach((restaurant, index) => {
          responseContent += `${index + 1}. **${restaurant.name}** (${restaurant.cuisine})\n`;
          responseContent += `   ⭐ ${restaurant.rating} stars | 🕒 ${restaurant.delivery_time}\n`;
          responseContent += `   📍 ${restaurant.location.city}\n\n`;
        });

        if (result.suggested_items && result.suggested_items.length > 0) {
          responseContent += `\n**Suggested items:**\n`;
          result.suggested_items.slice(0, 3).forEach((item) => {
            responseContent += `• ${item.name} - $${item.price}\n`;
          });
        }

        responseContent += `\nClick on a restaurant to see the full menu!`;
      } else {
        responseContent = `I couldn't find restaurants matching your criteria. Try:\n\n• Adjusting your budget\n• Different cuisine\n• Longer delivery time\n• Browse all restaurants`;
      }

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: responseContent,
        timestamp: new Date(),
        restaurants: result.restaurants,
        suggestedItems: result.suggested_items,
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Search failed:', error);
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: "Sorry, I encountered an error. Please try again or browse restaurants manually.",
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const quickPrompts = [
    "Chicken Tikka Masala in New York",
    "Italian food under $20",
    "Sushi in Los Angeles",
    "Spicy food in 30 minutes",
  ];

  return (
    <div className="flex flex-col h-[600px] bg-white rounded-lg shadow-lg">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-4 rounded-t-lg">
        <div className="flex items-center space-x-3">
          <span className="text-3xl">🤖</span>
          <div>
            <h3 className="font-bold text-lg">AI Food Assistant</h3>
            <p className="text-sm opacity-90">Ask me anything about food!</p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] rounded-lg p-4 ${
                message.role === 'user'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-900'
              }`}
            >
              <div className="whitespace-pre-wrap">{message.content}</div>
              
              {/* Restaurant Cards */}
              {message.restaurants && message.restaurants.length > 0 && (
                <div className="mt-4 space-y-2">
                  {message.restaurants.slice(0, 3).map((restaurant) => (
                    <div
                      key={restaurant.id}
                      onClick={() => onSelectRestaurant?.(restaurant)}
                      className="bg-white text-gray-900 p-3 rounded-lg cursor-pointer hover:shadow-md transition-shadow border border-gray-200"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-bold">{restaurant.name}</p>
                          <p className="text-sm text-gray-600">{restaurant.cuisine}</p>
                          <div className="flex items-center space-x-3 mt-1 text-xs text-gray-500">
                            <span>⭐ {restaurant.rating}</span>
                            <span>🕒 {restaurant.delivery_time}</span>
                            <span>💰 {restaurant.price_range}</span>
                          </div>
                        </div>
                        <button className="text-blue-600 font-semibold text-sm">
                          View Menu →
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <p className="text-xs opacity-70 mt-2">
                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start">
            <div className="bg-gray-100 text-gray-900 rounded-lg p-4">
              <div className="flex items-center space-x-2">
                <span className="animate-bounce">🤔</span>
                <span>Thinking...</span>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Prompts */}
      {messages.length === 1 && (
        <div className="px-4 py-2 border-t border-gray-200">
          <p className="text-xs text-gray-600 mb-2">Try these:</p>
          <div className="flex flex-wrap gap-2">
            {quickPrompts.map((prompt, index) => (
              <button
                key={index}
                onClick={() => setInput(prompt)}
                className="text-xs px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-full text-gray-700 transition-colors"
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex space-x-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask me anything... (e.g., 'I want pizza in 30 minutes')"
            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={loading}
          />
          <button
            onClick={handleSend}
            disabled={loading || !input.trim()}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-semibold transition-colors"
          >
            {loading ? '⏳' : '📤'}
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-2">
          Press Enter to send • Shift+Enter for new line
        </p>
      </div>
    </div>
  );
}

