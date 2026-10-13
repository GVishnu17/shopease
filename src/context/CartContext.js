import React, { createContext, useContext, useReducer, useEffect, useState, useRef, useCallback, useMemo } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from './AuthContext';

const CartContext = createContext(null);
const LEGACY_KEY = 'shopease_cart';

function getLegacyCart() {
  try {
    const saved = localStorage.getItem(LEGACY_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
}

function cartReducer(state, action) {
  switch (action.type) {
    case 'SET_CART':
      return Array.isArray(action.items) ? action.items : [];

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
  const { user } = useAuth();
  const uid = user ? user.uid : null;
  const [cart, dispatch] = useReducer(cartReducer, []);
  const [ready, setReady] = useState(false);
  const skipSave = useRef(false);

  useEffect(() => {
    let cancelled = false;
    setReady(false);
    dispatch({ type: 'SET_CART', items: [] });

    async function load() {
      const legacy = getLegacyCart();
      let serverItems = [];
      let exists = false;
      try {
        const snap = await getDoc(doc(db, 'users', uid, 'data', 'cart'));
        if (snap.exists()) {
          exists = true;
          serverItems = snap.data().items || [];
        }
      } catch {
        if (!cancelled) dispatch({ type: 'SET_CART', items: legacy });
        return;
      }
      if (cancelled) return;

      const extra = legacy.filter((l) => !serverItems.some((s) => s.id === l.id));
      const merged = extra.length > 0 ? [...serverItems, ...extra] : serverItems;

      try {
        localStorage.removeItem(LEGACY_KEY);
      } catch {
        // ignore
      }

      skipSave.current = merged.length === 0 || (exists && extra.length === 0);
      dispatch({ type: 'SET_CART', items: merged });
      setReady(true);
    }

    if (uid) {
      load();
    }
    return () => {
      cancelled = true;
    };
  }, [uid]);

  useEffect(() => {
    if (!uid || !ready) return;
    if (skipSave.current) {
      skipSave.current = false;
      return;
    }
    setDoc(doc(db, 'users', uid, 'data', 'cart'), { items: cart }).catch(() => {});
  }, [cart, uid, ready]);

  const addToCart = useCallback((product) => dispatch({ type: 'ADD_ITEM', product }), []);
  const removeFromCart = useCallback((id) => dispatch({ type: 'REMOVE_ITEM', id }), []);
  const updateQuantity = useCallback((id, quantity) => dispatch({ type: 'UPDATE_QUANTITY', id, quantity }), []);
  const clearCart = useCallback(() => dispatch({ type: 'CLEAR_CART' }), []);

  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const value = useMemo(
    () => ({
      cart,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      itemCount,
      totalPrice,
    }),
    [cart, addToCart, removeFromCart, updateQuantity, clearCart, itemCount, totalPrice]
  );

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
