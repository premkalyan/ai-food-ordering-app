import { useState, useRef, useEffect } from 'react';
import { api, Restaurant, MenuItem, OrderItem } from '../services/api';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  restaurants?: Restaurant[];
  menuItems?: MenuItem[];
  cartSummary?: { items: OrderItem[]; total: number };
}

interface ChatInterfaceProps {
  onSelectRestaurant?: (restaurant: Restaurant) => void;
}

interface ChatState {
  stage: 'search' | 'restaurant_selected' | 'viewing_menu' | 'adding_items' | 'checkout' | 'order_placed';
  selectedRestaurant?: Restaurant;
  cart: OrderItem[];
  lastSearchResults?: Restaurant[];
}

export function ChatInterface({}: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: "👋 Hi! I'm your AI food ordering assistant. You can ask me things like:\n\n• \"I want Chicken Tikka Masala in New York\"\n• \"Find Italian food under $20\"\n• \"I'm hungry, get me something spicy in 30 minutes\"\n\nWhat are you craving today?",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [chatState, setChatState] = useState<ChatState>({ 
    stage: 'search',
    cart: [] 
  });
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const addMessage = (role: 'user' | 'assistant', content: string, extra?: Partial<Message>) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      role,
      content,
      timestamp: new Date(),
      ...extra,
    };
    setMessages(prev => [...prev, newMessage]);
    return newMessage;
  };

  const handleRestaurantSelection = async (restaurant: Restaurant, userInput: string) => {
    // User selected a restaurant
    addMessage('user', userInput);
    setLoading(true);

    try {
      // Fetch menu
      const menuData = await api.getMenu(restaurant.id);
      
      // Build menu display
      let menuText = `Great choice! Here's the menu for **${restaurant.name}**:\n\n`;
      
      menuData.categories.forEach((category, idx) => {
        menuText += `**${category.name}**\n`;
        category.items.forEach((item, itemIdx) => {
          const num = idx * 10 + itemIdx + 1;
          const tags = [];
          if (item.vegetarian) tags.push('🥬');
          if (item.spicy) tags.push('🌶️');
          if (item.popular) tags.push('⭐');
          menuText += `${num}. ${item.name} - $${item.price} ${tags.join(' ')}\n`;
          menuText += `   ${item.description}\n`;
        });
        menuText += '\n';
      });

      menuText += `\nTo order, just tell me:\n• Item number and quantity (e.g., "I'll take 2 of item 1")\n• Or item name (e.g., "Add Chicken Tikka Masala to cart")\n• Say "show cart" to review\n• Say "checkout" when ready`;

      // Flatten menu items for easy lookup
      const allItems = menuData.categories.flatMap(cat => cat.items);

      setChatState({
        stage: 'viewing_menu',
        selectedRestaurant: restaurant,
        cart: chatState.cart,
      });

      addMessage('assistant', menuText, { menuItems: allItems });
    } catch (error) {
      addMessage('assistant', "Sorry, I couldn't load the menu. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = (item: MenuItem, quantity: number) => {
    const existingItem = chatState.cart.find(cartItem => cartItem.item_id === item.id);
    
    let newCart: OrderItem[];
    if (existingItem) {
      newCart = chatState.cart.map(cartItem =>
        cartItem.item_id === item.id
          ? { ...cartItem, quantity: cartItem.quantity + quantity }
          : cartItem
      );
    } else {
      newCart = [
        ...chatState.cart,
        {
          item_id: item.id,
          name: item.name,
          price: item.price,
          quantity,
        },
      ];
    }

    setChatState(prev => ({ ...prev, cart: newCart, stage: 'adding_items' }));

    const total = newCart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    let response = `✅ Added ${quantity}x ${item.name} to your cart!\n\n`;
    response += `**Current Cart:**\n`;
    newCart.forEach(cartItem => {
      response += `• ${cartItem.quantity}x ${cartItem.name} - $${(cartItem.price * cartItem.quantity).toFixed(2)}\n`;
    });
    response += `\n**Subtotal: $${total.toFixed(2)}**\n\n`;
    response += `What else would you like? Or say "checkout" to complete your order.`;

    addMessage('assistant', response, { 
      cartSummary: { items: newCart, total } 
    });
  };

  const handleCheckout = async () => {
    if (chatState.cart.length === 0) {
      addMessage('assistant', "Your cart is empty! Please add some items first.");
      return;
    }

    if (!chatState.selectedRestaurant) {
      addMessage('assistant', "Something went wrong. Please start over.");
      return;
    }

    const subtotal = chatState.cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const deliveryFee = chatState.selectedRestaurant.delivery_fee;
    const tax = subtotal * 0.0875;
    const total = subtotal + deliveryFee + tax;

    let checkoutText = `**Order Summary**\n\n`;
    checkoutText += `Restaurant: ${chatState.selectedRestaurant.name}\n\n`;
    checkoutText += `**Items:**\n`;
    chatState.cart.forEach(item => {
      checkoutText += `• ${item.quantity}x ${item.name} - $${(item.price * item.quantity).toFixed(2)}\n`;
    });
    checkoutText += `\n**Subtotal:** $${subtotal.toFixed(2)}\n`;
    checkoutText += `**Delivery Fee:** $${deliveryFee.toFixed(2)}\n`;
    checkoutText += `**Tax:** $${tax.toFixed(2)}\n`;
    checkoutText += `**Total:** $${total.toFixed(2)}\n\n`;
    checkoutText += `Delivery to: ${chatState.selectedRestaurant.location.city}\n`;
    checkoutText += `Estimated time: ${chatState.selectedRestaurant.delivery_time}\n\n`;
    checkoutText += `Type "confirm" to place your order, or "cancel" to go back.`;

    setChatState(prev => ({ ...prev, stage: 'checkout' }));
    addMessage('assistant', checkoutText);
  };

  const handleConfirmOrder = async () => {
    if (!chatState.selectedRestaurant) return;

    setLoading(true);
    try {
      const order = await api.createOrder({
        restaurant_id: chatState.selectedRestaurant.id,
        items: chatState.cart,
        delivery_address: {
          address: '123 Main St',
          city: chatState.selectedRestaurant.location.city,
          state: chatState.selectedRestaurant.location.state,
          zip: chatState.selectedRestaurant.location.zip,
        },
      });

      let confirmText = `🎉 **Order Confirmed!**\n\n`;
      confirmText += `Order ID: **${order.id}**\n`;
      confirmText += `Restaurant: ${order.restaurant_name}\n`;
      confirmText += `Status: ${order.status}\n`;
      confirmText += `Estimated Delivery: ${order.estimated_delivery}\n\n`;
      confirmText += `Total Paid: **$${order.total.toFixed(2)}**\n\n`;
      confirmText += `Your food is on its way! 🚗\n\n`;
      confirmText += `Say "track order" to see real-time updates, or "start over" for a new order.`;

      setChatState({
        stage: 'order_placed',
        cart: [],
        selectedRestaurant: undefined,
      });

      addMessage('assistant', confirmText);
    } catch (error) {
      addMessage('assistant', "Sorry, there was an error placing your order. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userInput = input.trim();
    setInput('');
    setLoading(true);

    try {
      // Handle different stages
      if (chatState.stage === 'checkout') {
        addMessage('user', userInput);
        if (userInput.toLowerCase().includes('confirm') || userInput.toLowerCase().includes('yes')) {
          await handleConfirmOrder();
        } else if (userInput.toLowerCase().includes('cancel') || userInput.toLowerCase().includes('no')) {
          setChatState(prev => ({ ...prev, stage: 'adding_items' }));
          addMessage('assistant', "No problem! What would you like to do?\n• Add more items\n• Remove items\n• Checkout when ready");
        }
        setLoading(false);
        return;
      }

      // Handle menu item selection
      if (chatState.stage === 'viewing_menu' || chatState.stage === 'adding_items') {
        addMessage('user', userInput);

        // Check for cart commands
        if (userInput.toLowerCase().includes('show cart') || userInput.toLowerCase().includes('view cart')) {
          if (chatState.cart.length === 0) {
            addMessage('assistant', "Your cart is empty. Add some items first!");
          } else {
            const total = chatState.cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
            let cartText = `**Your Cart:**\n\n`;
            chatState.cart.forEach(item => {
              cartText += `• ${item.quantity}x ${item.name} - $${(item.price * item.quantity).toFixed(2)}\n`;
            });
            cartText += `\n**Subtotal: $${total.toFixed(2)}**\n\n`;
            cartText += `Say "checkout" to complete your order, or add more items!`;
            addMessage('assistant', cartText);
          }
          setLoading(false);
          return;
        }

        if (userInput.toLowerCase().includes('checkout')) {
          await handleCheckout();
          setLoading(false);
          return;
        }

        // Try to parse item selection
        // Look for patterns like "2 of item 1", "add item 3", "I'll take Chicken Tikka Masala"
        const lastMessage = messages[messages.length - 1];
        if (lastMessage.menuItems) {
          // Try to find item by number or name
          const numberMatch = userInput.match(/(\d+)\s*(?:of\s*)?(?:item\s*)?(\d+)|(?:item\s*)?(\d+)/i);
          const quantity = numberMatch ? parseInt(numberMatch[1] || '1') : 1;
          const itemNumber = numberMatch ? parseInt(numberMatch[2] || numberMatch[3] || '0') : 0;

          let selectedItem: MenuItem | undefined;

          if (itemNumber > 0 && itemNumber <= lastMessage.menuItems.length) {
            selectedItem = lastMessage.menuItems[itemNumber - 1];
          } else {
            // Try to find by name
            selectedItem = lastMessage.menuItems.find(item =>
              userInput.toLowerCase().includes(item.name.toLowerCase())
            );
          }

          if (selectedItem) {
            handleAddToCart(selectedItem, quantity);
            setLoading(false);
            return;
          }
        }

        addMessage('assistant', "I didn't understand that. Please:\n• Use item numbers (e.g., 'I'll take item 1')\n• Or item names (e.g., 'Add Chicken Tikka Masala')\n• Say 'show cart' to review\n• Say 'checkout' when ready");
        setLoading(false);
        return;
      }

      // Handle restaurant selection from search results
      if (chatState.stage === 'search' && chatState.lastSearchResults) {
        addMessage('user', userInput);
        
        // Try to parse restaurant selection
        const numberMatch = userInput.match(/(\d+)/);
        if (numberMatch) {
          const restaurantNumber = parseInt(numberMatch[1]);
          if (restaurantNumber > 0 && restaurantNumber <= chatState.lastSearchResults.length) {
            const restaurant = chatState.lastSearchResults[restaurantNumber - 1];
            await handleRestaurantSelection(restaurant, `Show me the menu for ${restaurant.name}`);
            setLoading(false);
            return;
          }
        }

        // Try to find by name
        const restaurant = chatState.lastSearchResults.find(r =>
          userInput.toLowerCase().includes(r.name.toLowerCase())
        );
        if (restaurant) {
          await handleRestaurantSelection(restaurant, `Show me the menu for ${restaurant.name}`);
          setLoading(false);
          return;
        }
      }

      // Default: Intelligent search
      addMessage('user', userInput);

      const result = await api.intelligentSearch(userInput);

      if (result.restaurants && result.restaurants.length > 0) {
        let responseContent = `I found ${result.restaurants.length} restaurant${result.restaurants.length > 1 ? 's' : ''} matching your request:\n\n`;
        
        result.restaurants.slice(0, 5).forEach((restaurant, index) => {
          responseContent += `**${index + 1}. ${restaurant.name}** (${restaurant.cuisine})\n`;
          responseContent += `   ⭐ ${restaurant.rating} stars | 🕒 ${restaurant.delivery_time} | 💰 ${restaurant.price_range}\n`;
          responseContent += `   📍 ${restaurant.location.city}\n\n`;
        });

        responseContent += `\nWhich restaurant would you like? Just type the number (e.g., "1") or the name.`;

        setChatState({
          stage: 'search',
          cart: [],
          lastSearchResults: result.restaurants,
        });

        addMessage('assistant', responseContent, { restaurants: result.restaurants });
      } else {
        addMessage('assistant', `I couldn't find restaurants matching your criteria. Try:\n\n• Adjusting your budget\n• Different cuisine\n• Longer delivery time\n\nWhat else can I help you find?`);
      }
    } catch (error) {
      console.error('Chat error:', error);
      addMessage('assistant', "Sorry, I encountered an error. Please try again.");
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
            <p className="text-sm opacity-90">Complete ordering in chat!</p>
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
              className={`max-w-[85%] rounded-lg p-4 ${
                message.role === 'user'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-900'
              }`}
            >
              <div className="whitespace-pre-wrap">{message.content}</div>

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
            placeholder="Type your message..."
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
