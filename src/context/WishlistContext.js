import React, { createContext, useContext, useMemo, useState, useEffect, useCallback, useRef } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from './AuthContext';

const WishlistContext = createContext(null);
const LEGACY_KEY = 'shopease_wishlist';

function getLegacyWishlist() {
  try {
    const saved = localStorage.getItem(LEGACY_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
}

export function WishlistProvider({ children }) {
  const { user } = useAuth();
  const uid = user ? user.uid : null;
  const [wishlist, setWishlist] = useState([]);
  const [ready, setReady] = useState(false);
  const skipSave = useRef(false);

  useEffect(() => {
    let cancelled = false;
    setReady(false);
    setWishlist([]);

    async function load() {
      const legacy = getLegacyWishlist();
      let items = [];
      let exists = false;
      try {
        const snap = await getDoc(doc(db, 'users', uid, 'data', 'wishlist'));
        if (snap.exists()) {
          exists = true;
          items = snap.data().items || [];
        } else if (legacy.length > 0) {
          items = legacy;
          try {
            localStorage.removeItem(LEGACY_KEY);
          } catch {
            // ignore
          }
        }
      } catch {
        if (!cancelled) setWishlist(legacy);
        return;
      }
      if (cancelled) return;
      skipSave.current = exists || items.length === 0;
      setWishlist(items);
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
    setDoc(doc(db, 'users', uid, 'data', 'wishlist'), { items: wishlist }).catch(() => {});
  }, [wishlist, uid, ready]);

  const toggleWishlist = useCallback((product) => {
    setWishlist((current) => {
      const exists = current.some((item) => item.id === product.id);
      if (exists) {
        return current.filter((item) => item.id !== product.id);
      }
      return [...current, product];
    });
  }, []);

  const removeFromWishlist = useCallback((productId) => {
    setWishlist((current) => current.filter((item) => item.id !== productId));
  }, []);

  const isInWishlist = useCallback(
    (productId) => wishlist.some((item) => item.id === productId),
    [wishlist]
  );

  const value = useMemo(() => ({
    wishlist,
    wishlistCount: wishlist.length,
    toggleWishlist,
    removeFromWishlist,
    isInWishlist,
  }), [wishlist, toggleWishlist, removeFromWishlist, isInWishlist]);

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
}
