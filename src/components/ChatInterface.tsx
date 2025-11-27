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
  buttons?: MessageButton[];
}

interface MessageButton {
  label: string;
  action: string;
  data?: any;
  variant?: 'primary' | 'secondary' | 'success' | 'danger';
}

interface ChatInterfaceProps {
  onSelectRestaurant?: (restaurant: Restaurant) => void;
}

interface ChatState {
  stage: 'search' | 'restaurant_selected' | 'viewing_menu' | 'adding_items' | 'checkout' | 'order_placed';
  selectedRestaurant?: Restaurant;
  cart: OrderItem[];
  lastSearchResults?: Restaurant[];
  lastOrderId?: string;
}

interface Favorites {
  restaurants: string[]; // Restaurant IDs
  dishes: string[]; // Menu item IDs
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
  const [favorites, setFavorites] = useState<Favorites>(() => {
    // Load from localStorage
    const saved = localStorage.getItem('favorites');
    return saved ? JSON.parse(saved) : { restaurants: [], dishes: [] };
  });
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Save favorites to localStorage
  useEffect(() => {
    localStorage.setItem('favorites', JSON.stringify(favorites));
  }, [favorites]);

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

  const handleButtonClick = async (action: string, data?: any) => {
    // Disable all previous buttons by removing them
    setMessages(prev => prev.map(msg => ({ ...msg, buttons: undefined })));
    
    // Add user message showing what they clicked
    let userMessage = '';
    
    switch (action) {
      case 'select_restaurant':
        userMessage = `Show me the menu for ${data.name}`;
        await handleRestaurantSelection(data, userMessage);
        break;
      case 'add_item':
        userMessage = `Add ${data.name} to cart`;
        addMessage('user', userMessage);
        handleAddToCart(data, 1);
        break;
      case 'show_cart':
        userMessage = 'Show my cart';
        addMessage('user', userMessage);
        if (chatState.cart.length === 0) {
          addMessage('assistant', "Your cart is empty. Add some items first!");
        } else {
          const total = chatState.cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
          let cartText = `**Your Cart:**\n\n`;
          chatState.cart.forEach(item => {
            cartText += `• ${item.quantity}x ${item.name} - $${(item.price * item.quantity).toFixed(2)}\n`;
          });
          cartText += `\n**Subtotal: $${total.toFixed(2)}**`;
          
          const buttons: MessageButton[] = [
            { label: '🛒 Checkout', action: 'checkout', variant: 'primary' },
            { label: '➕ Add More Items', action: 'continue_shopping', variant: 'secondary' },
          ];
          
          addMessage('assistant', cartText, { buttons });
        }
        break;
      case 'checkout':
        userMessage = 'Checkout';
        addMessage('user', userMessage);
        await handleCheckout();
        break;
      case 'confirm_order':
        userMessage = 'Confirm order';
        addMessage('user', userMessage);
        await handleConfirmOrder();
        break;
      case 'cancel_order':
        userMessage = 'Cancel';
        addMessage('user', userMessage);
        setChatState(prev => ({ ...prev, stage: 'adding_items' }));
        
        const buttons: MessageButton[] = [
          { label: '➕ Add More Items', action: 'continue_shopping', variant: 'secondary' },
          { label: '🛒 Checkout', action: 'checkout', variant: 'primary' },
        ];
        
        addMessage('assistant', "No problem! What would you like to do?", { buttons });
        break;
      case 'track_order':
        userMessage = 'Track my order';
        addMessage('user', userMessage);
        if (chatState.lastOrderId) {
          try {
            const orderStatus = await api.trackOrder(chatState.lastOrderId);
            
            let trackText = `📦 **Order Status Update**\n\n`;
            trackText += `Order ID: **${orderStatus.id}**\n`;
            trackText += `Restaurant: ${orderStatus.restaurant_name}\n`;
            trackText += `Status: **${orderStatus.status.toUpperCase()}**\n`;
            trackText += `Estimated Delivery: ${orderStatus.estimated_delivery}\n\n`;
            
            const statusEmoji: Record<string, string> = {
              'pending': '⏳',
              'confirmed': '✅',
              'preparing': '🍳',
              'ready': '📦',
              'out_for_delivery': '🚗',
              'delivered': '🎉',
            };
            
            trackText += `${statusEmoji[orderStatus.status] || '📋'} `;
            
            const statusMessages: Record<string, string> = {
              'pending': 'Order received, waiting for confirmation',
              'confirmed': 'Restaurant confirmed your order',
              'preparing': 'Your food is being prepared',
              'ready': 'Food is ready for pickup',
              'out_for_delivery': 'Driver is on the way!',
              'delivered': 'Order delivered! Enjoy your meal!',
            };
            
            trackText += statusMessages[orderStatus.status] || 'Processing your order';
            
            const trackButtons: MessageButton[] = [
              { label: '🔄 Refresh Status', action: 'track_order', variant: 'secondary' },
              { label: '🆕 Start New Order', action: 'start_over', variant: 'primary' },
            ];
            
            addMessage('assistant', trackText, { buttons: trackButtons });
          } catch (error) {
            addMessage('assistant', "Sorry, I couldn't track your order. Please try again.");
          }
        } else {
          addMessage('assistant', "You don't have any recent orders. Place an order first!");
        }
        break;
      case 'start_over':
        userMessage = 'Start new order';
        addMessage('user', userMessage);
        setChatState({
          stage: 'search',
          cart: [],
          selectedRestaurant: undefined,
          lastOrderId: undefined,
        });
        addMessage('assistant', "Let's start fresh! What are you craving today?");
        break;
      case 'toggle_favorite_restaurant':
        const restaurant = data;
        const isFavorited = favorites.restaurants.includes(restaurant.id);
        
        if (isFavorited) {
          setFavorites(prev => ({
            ...prev,
            restaurants: prev.restaurants.filter(id => id !== restaurant.id),
          }));
          // Just update favorites, don't add messages - keep the flow
        } else {
          setFavorites(prev => ({
            ...prev,
            restaurants: [...prev.restaurants, restaurant.id],
          }));
          // Just update favorites, don't add messages - keep the flow
        }
        // Don't break the flow - user can continue selecting
        break;
      
      case 'toggle_favorite_dish':
        const dish = data;
        const isDishFavorited = favorites.dishes.includes(dish.id);
        
        if (isDishFavorited) {
          setFavorites(prev => ({
            ...prev,
            dishes: prev.dishes.filter(id => id !== dish.id),
          }));
          // Just update favorites, don't add messages - keep the flow
        } else {
          setFavorites(prev => ({
            ...prev,
            dishes: [...prev.dishes, dish.id],
          }));
          // Just update favorites, don't add messages - keep the flow
        }
        // Don't break the flow - user can continue ordering
        break;
      
      case 'show_favorites':
        userMessage = 'Show my favorites';
        addMessage('user', userMessage);
        
        if (favorites.restaurants.length === 0 && favorites.dishes.length === 0) {
          addMessage('assistant', "You don't have any favorites yet! ⭐\n\nClick the ⭐ button next to restaurants or dishes to add them to your favorites.");
        } else {
          let favText = `⭐ **Your Favorites** (${favorites.restaurants.length + favorites.dishes.length} items)\n\n`;
          
          if (favorites.restaurants.length > 0) {
            favText += `**Favorite Restaurants:**\n`;
            favorites.restaurants.forEach((id, idx) => {
              favText += `${idx + 1}. Restaurant ID: ${id}\n`;
            });
            favText += '\n';
          }
          
          if (favorites.dishes.length > 0) {
            favText += `**Favorite Dishes:**\n`;
            favorites.dishes.forEach((id, idx) => {
              favText += `${idx + 1}. Dish ID: ${id}\n`;
            });
          }
          
          favText += '\nStart a new search to order from your favorites!';
          addMessage('assistant', favText);
        }
        break;
      
      case 'continue_shopping':
        // Just show the menu again
        if (chatState.selectedRestaurant) {
          const lastMenuMessage = messages.find(m => m.menuItems);
          if (lastMenuMessage?.menuItems) {
            let menuText = `Here's the menu again:\n\n`;
            lastMenuMessage.menuItems.forEach((item, idx) => {
              const tags = [];
              if (item.vegetarian) tags.push('🥬');
              if (item.spicy) tags.push('🌶️');
              if (item.popular) tags.push('⭐');
              menuText += `${idx + 1}. ${item.name} - $${item.price} ${tags.join(' ')}\n`;
            });
            
            const menuButtons: MessageButton[] = lastMenuMessage.menuItems.map((item, idx) => ({
              label: `${idx + 1}. ${item.name} ($${item.price})`,
              action: 'add_item',
              data: item,
              variant: 'secondary' as const,
            }));
            
            menuButtons.push(
              { label: '🛒 View Cart', action: 'show_cart', variant: 'primary' as const },
              { label: '✅ Checkout', action: 'checkout', variant: 'success' as const }
            );
            
            addMessage('assistant', menuText, { buttons: menuButtons });
          }
        }
        break;
    }
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

      menuText += `\nClick any item below to add to cart:`;

      // Flatten menu items for easy lookup
      const allItems = menuData.categories.flatMap(cat => cat.items);

      // Create buttons for each menu item
      const menuButtons: MessageButton[] = [];
      
      allItems.forEach((item, idx) => {
        const tags = [];
        if (item.vegetarian) tags.push('🥬');
        if (item.spicy) tags.push('🌶️');
        if (item.popular) tags.push('⭐');
        const isFav = favorites.dishes.includes(item.id);
        
        // Add to cart button
        menuButtons.push({
          label: `${idx + 1}. ${item.name} ($${item.price}) ${tags.join(' ')}`,
          action: 'add_item',
          data: item,
          variant: 'secondary' as const,
        });
        
        // Favorite toggle button (smaller, inline)
        menuButtons.push({
          label: isFav ? '⭐' : '☆',
          action: 'toggle_favorite_dish',
          data: item,
          variant: 'secondary' as const,
        });
      });

      // Add cart and checkout buttons at the end
      menuButtons.push(
        { label: '🛒 View Cart', action: 'show_cart', variant: 'primary' as const },
        { label: '✅ Checkout', action: 'checkout', variant: 'success' as const }
      );

      setChatState({
        stage: 'viewing_menu',
        selectedRestaurant: restaurant,
        cart: chatState.cart,
      });

      addMessage('assistant', menuText, { menuItems: allItems, buttons: menuButtons });
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
    response += `What would you like to do next?`;

    const cartButtons: MessageButton[] = [
      { label: '➕ Add More Items', action: 'continue_shopping', variant: 'secondary' },
      { label: '🛒 View Cart', action: 'show_cart', variant: 'primary' },
      { label: '✅ Checkout', action: 'checkout', variant: 'success' },
    ];

    addMessage('assistant', response, { 
      cartSummary: { items: newCart, total },
      buttons: cartButtons,
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
    checkoutText += `Ready to place your order?`;

    const checkoutButtons: MessageButton[] = [
      { label: '✅ Confirm Order', action: 'confirm_order', variant: 'success' },
      { label: '❌ Cancel', action: 'cancel_order', variant: 'danger' },
    ];

    setChatState(prev => ({ ...prev, stage: 'checkout' }));
    addMessage('assistant', checkoutText, { buttons: checkoutButtons });
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
      confirmText += `Your food is on its way! 🚗`;

      const orderButtons: MessageButton[] = [
        { label: '📦 Track Order', action: 'track_order', variant: 'primary' },
        { label: '🆕 Start New Order', action: 'start_over', variant: 'secondary' },
      ];

      setChatState({
        stage: 'order_placed',
        cart: [],
        selectedRestaurant: undefined,
        lastOrderId: order.id,
      });

      addMessage('assistant', confirmText, { buttons: orderButtons });
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

      // Handle track order command
      if (userInput.toLowerCase().includes('track order') || userInput.toLowerCase().includes('track my order')) {
        addMessage('user', userInput);
        
        if (chatState.lastOrderId) {
          try {
            const orderStatus = await api.trackOrder(chatState.lastOrderId);
            
            let trackText = `📦 **Order Status Update**\n\n`;
            trackText += `Order ID: **${orderStatus.id}**\n`;
            trackText += `Restaurant: ${orderStatus.restaurant_name}\n`;
            trackText += `Status: **${orderStatus.status.toUpperCase()}**\n`;
            trackText += `Estimated Delivery: ${orderStatus.estimated_delivery}\n\n`;
            
            // Status emoji
            const statusEmoji: Record<string, string> = {
              'pending': '⏳',
              'confirmed': '✅',
              'preparing': '🍳',
              'ready': '📦',
              'out_for_delivery': '🚗',
              'delivered': '🎉',
            };
            
            trackText += `${statusEmoji[orderStatus.status] || '📋'} `;
            
            const statusMessages: Record<string, string> = {
              'pending': 'Order received, waiting for confirmation',
              'confirmed': 'Restaurant confirmed your order',
              'preparing': 'Your food is being prepared',
              'ready': 'Food is ready for pickup',
              'out_for_delivery': 'Driver is on the way!',
              'delivered': 'Order delivered! Enjoy your meal!',
            };
            
            trackText += statusMessages[orderStatus.status] || 'Processing your order';
            trackText += `\n\nSay "track order" again for updates, or "start over" for a new order.`;
            
            addMessage('assistant', trackText);
          } catch (error) {
            addMessage('assistant', "Sorry, I couldn't track your order. Please try again.");
          }
        } else {
          addMessage('assistant', "You don't have any recent orders. Place an order first!");
        }
        setLoading(false);
        return;
      }

      // Handle start over command
      if (userInput.toLowerCase().includes('start over') || userInput.toLowerCase().includes('new order')) {
        addMessage('user', userInput);
        setChatState({
          stage: 'search',
          cart: [],
          selectedRestaurant: undefined,
          lastOrderId: undefined,
        });
        addMessage('assistant', "Let's start fresh! What are you craving today?");
        setLoading(false);
        return;
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

        responseContent += `\nClick a button below to view the menu:`;

        // Create buttons for each restaurant
        const restaurantButtons: MessageButton[] = [];
        
        result.restaurants.slice(0, 5).forEach((restaurant, index) => {
          const isFav = favorites.restaurants.includes(restaurant.id);
          
          // Main restaurant button
          restaurantButtons.push({
            label: `${index + 1}. ${restaurant.name}`,
            action: 'select_restaurant',
            data: restaurant,
            variant: 'primary' as const,
          });
          
          // Favorite toggle button (inline star)
          restaurantButtons.push({
            label: isFav ? '⭐ Favorited' : '☆ Favorite',
            action: 'toggle_favorite_restaurant',
            data: restaurant,
            variant: 'secondary' as const,
          });
        });

        setChatState({
          stage: 'search',
          cart: [],
          lastSearchResults: result.restaurants,
        });

        addMessage('assistant', responseContent, { 
          restaurants: result.restaurants,
          buttons: restaurantButtons,
        });
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
    <div className="flex flex-col h-full bg-white">
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
              {/* Message content with markdown-like formatting */}
              <div 
                className="whitespace-pre-wrap"
                dangerouslySetInnerHTML={{
                  __html: message.content
                    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
                    .replace(/\n/g, '<br/>')
                }}
              />

              {/* Buttons */}
              {message.buttons && message.buttons.length > 0 && (
                <div className="mt-3 space-y-2">
                  {message.buttons.map((button, btnIdx) => {
                    const variantStyles = {
                      primary: 'bg-blue-600 hover:bg-blue-700 text-white',
                      secondary: 'bg-gray-200 hover:bg-gray-300 text-gray-800',
                      success: 'bg-green-600 hover:bg-green-700 text-white',
                      danger: 'bg-red-600 hover:bg-red-700 text-white',
                    };
                    
                    return (
                      <button
                        key={btnIdx}
                        onClick={() => handleButtonClick(button.action, button.data)}
                        disabled={loading}
                        className={`w-full px-4 py-2 rounded-lg font-medium text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-left ${
                          variantStyles[button.variant || 'secondary']
                        }`}
                      >
                        {button.label}
                      </button>
                    );
                  })}
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
      {(messages.length === 1 || (messages.length > 1 && messages[messages.length - 1].content.includes("Let's start fresh"))) && (
        <div className="px-4 py-2 border-t border-gray-200">
          <p className="text-xs text-gray-600 mb-2">Try these:</p>
          <div className="flex flex-wrap gap-2">
            {quickPrompts.map((prompt, index) => (
              <button
                key={index}
                onClick={async () => {
                  if (loading) return;
                  
                  // Add user message
                  addMessage('user', prompt);
                  setLoading(true);

                  try {
                    // Call intelligent search API
                    const result = await api.intelligentSearch(prompt);

                    if (result.restaurants && result.restaurants.length > 0) {
                      let responseContent = `I found ${result.restaurants.length} restaurant${result.restaurants.length > 1 ? 's' : ''} matching your request:\n\n`;
                      
                      result.restaurants.slice(0, 5).forEach((restaurant, index) => {
                        responseContent += `**${index + 1}. ${restaurant.name}** (${restaurant.cuisine})\n`;
                        responseContent += `   ⭐ ${restaurant.rating} stars | 🕒 ${restaurant.delivery_time} | 💰 ${restaurant.price_range}\n`;
                        responseContent += `   📍 ${restaurant.location.city}\n\n`;
                      });

                      responseContent += `\nClick a button below to view the menu:`;

                      // Create buttons for each restaurant
                      const restaurantButtons: MessageButton[] = [];
                      
                      result.restaurants.slice(0, 5).forEach((restaurant, index) => {
                        const isFav = favorites.restaurants.includes(restaurant.id);
                        
                        // Main restaurant button
                        restaurantButtons.push({
                          label: `${index + 1}. ${restaurant.name}`,
                          action: 'select_restaurant',
                          data: restaurant,
                          variant: 'primary' as const,
                        });
                        
                        // Favorite toggle button
                        restaurantButtons.push({
                          label: isFav ? '⭐ Favorited' : '☆ Add to Favorites',
                          action: 'toggle_favorite_restaurant',
                          data: restaurant,
                          variant: 'secondary' as const,
                        });
                      });

                      setChatState({
                        stage: 'search',
                        cart: [],
                        lastSearchResults: result.restaurants,
                      });

                      addMessage('assistant', responseContent, { 
                        restaurants: result.restaurants,
                        buttons: restaurantButtons,
                      });
                    } else {
                      addMessage('assistant', `I couldn't find restaurants matching your criteria. Try:\n\n• Adjusting your budget\n• Different cuisine\n• Longer delivery time\n\nWhat else can I help you find?`);
                    }
                  } catch (error) {
                    console.error('Search failed:', error);
                    addMessage('assistant', "Sorry, I encountered an error. Please try again.");
                  } finally {
                    setLoading(false);
                  }
                }}
                disabled={loading}
                className="text-xs px-3 py-1 bg-blue-100 hover:bg-blue-200 text-blue-700 font-medium rounded-full transition-colors disabled:opacity-50"
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Quick Actions Bar */}
      <div className="px-4 py-3 border-t border-gray-200 bg-gray-50">
        <p className="text-xs text-gray-600 mb-2 font-medium">Quick Actions:</p>
        <div className="flex flex-wrap gap-2">
          {chatState.lastOrderId && (
            <button
              onClick={() => handleButtonClick('track_order')}
              disabled={loading}
              className="px-3 py-1.5 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 flex items-center space-x-1"
            >
              <span>📦</span>
              <span>Track Order</span>
            </button>
          )}
          {chatState.cart.length > 0 && (
            <button
              onClick={() => handleButtonClick('show_cart')}
              disabled={loading}
              className="px-3 py-1.5 bg-green-100 hover:bg-green-200 text-green-700 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 flex items-center space-x-1"
            >
              <span>🛒</span>
              <span>View Cart ({chatState.cart.length})</span>
            </button>
          )}
          {chatState.stage !== 'search' && (
            <button
              onClick={() => handleButtonClick('start_over')}
              disabled={loading}
              className="px-3 py-1.5 bg-purple-100 hover:bg-purple-200 text-purple-700 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 flex items-center space-x-1"
            >
              <span>🆕</span>
              <span>Start Over</span>
            </button>
          )}
          <button
            onClick={() => handleButtonClick('show_favorites')}
            disabled={loading}
            className="px-3 py-1.5 bg-yellow-100 hover:bg-yellow-200 text-yellow-700 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 flex items-center space-x-1"
          >
            <span>⭐</span>
            <span>My Favorites ({favorites.restaurants.length + favorites.dishes.length})</span>
          </button>
          {chatState.selectedRestaurant && chatState.stage === 'adding_items' && (
            <button
              onClick={() => handleButtonClick('checkout')}
              disabled={loading || chatState.cart.length === 0}
              className="px-3 py-1.5 bg-orange-100 hover:bg-orange-200 text-orange-700 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 flex items-center space-x-1"
            >
              <span>✅</span>
              <span>Checkout</span>
            </button>
          )}
        </div>
      </div>

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
