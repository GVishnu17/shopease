import React, { createContext, useContext, useReducer, useEffect } from 'react';

const CartContext = createContext(null);
const STORAGE_KEY = 'shopease_cart';

function loadInitialCart() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
}

function cartReducer(state, action) {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existing = state.find((item) => item.id === action.product.id);
      if (existing) {
        return state.map((item) =>
          item.id === action.product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...state, { ...action.product, quantity: 1 }];
    }

    case 'REMOVE_ITEM':
      return state.filter((item) => item.id !== action.id);

    case 'UPDATE_QUANTITY': {
      if (action.quantity <= 0) {
        return state.filter((item) => item.id !== action.id);
      }
      return state.map((item) =>
        item.id === action.id ? { ...item, quantity: action.quantity } : item
      );
    }

    case 'CLEAR_CART':
      return [];

    default:
      return state;
  }
}

export function CartProvider({ children }) {
  const [cart, dispatch] = useReducer(cartReducer, [], loadInitialCart);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product) => dispatch({ type: 'ADD_ITEM', product });
  const removeFromCart = (id) => dispatch({ type: 'REMOVE_ITEM', id });
  const updateQuantity = (id, quantity) => dispatch({ type: 'UPDATE_QUANTITY', id, quantity });
  const clearCart = () => dispatch({ type: 'CLEAR_CART' });

  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const value = {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    itemCount,
    totalPrice,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}

// Exported for testing the pure reducer logic in isolation
export { cartReducer };
