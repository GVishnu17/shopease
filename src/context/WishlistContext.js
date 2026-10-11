import React, { createContext, useContext, useMemo, useState, useEffect } from 'react';

const WishlistContext = createContext(null);
const STORAGE_KEY = 'shopease_wishlist';

function getInitialWishlist() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
}

export function WishlistProvider({ children }) {
  const [wishlist, setWishlist] = useState(getInitialWishlist);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(wishlist));
  }, [wishlist]);

  const toggleWishlist = (product) => {
    setWishlist((current) => {
      const exists = current.some((item) => item.id === product.id);
      if (exists) {
        return current.filter((item) => item.id !== product.id);
      }
      return [...current, product];
    });
  };

  const removeFromWishlist = (productId) => {
    setWishlist((current) => current.filter((item) => item.id !== productId));
  };

  const isInWishlist = (productId) => wishlist.some((item) => item.id === productId);

  const value = useMemo(() => ({
    wishlist,
    wishlistCount: wishlist.length,
    toggleWishlist,
    removeFromWishlist,
    isInWishlist,
  }), [wishlist]);

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
}
