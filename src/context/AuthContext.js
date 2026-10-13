import React, { createContext, useContext, useState, useEffect, useRef, useCallback, useMemo } from 'react';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut,
  updateProfile,
  onAuthStateChanged,
} from 'firebase/auth';
import { auth } from '../firebase';

const AuthContext = createContext(null);

function toUser(fbUser) {
  if (!fbUser) return null;
  return {
    uid: fbUser.uid,
    email: fbUser.email,
    name: fbUser.displayName || (fbUser.email ? fbUser.email.split('@')[0] : ''),
  };
}

function friendlyError(error) {
  switch (error && error.code) {
    case 'auth/email-already-in-use':
      return 'An account with this email already exists. Please log in.';
    case 'auth/invalid-email':
    case 'auth/missing-email':
      return 'Please enter a valid email address.';
    case 'auth/weak-password':
      return 'Password must be at least 6 characters.';
    case 'auth/invalid-credential':
    case 'auth/user-not-found':
    case 'auth/wrong-password':
      return 'Incorrect email or password. If you are new, please register first.';
    case 'auth/too-many-requests':
      return 'Too many attempts. Please wait a few minutes and try again.';
    case 'auth/network-request-failed':
      return 'Network problem. Please check your internet and try again.';
    default:
      return 'Something went wrong. Please try again.';
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const registering = useRef(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (fbUser) => {
      if (registering.current) return;
      setUser(toUser(fbUser));
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const register = useCallback(async ({ name, email, password }) => {
    registering.current = true;
    try {
      const cred = await createUserWithEmailAndPassword(auth, email.trim(), password);
      await updateProfile(cred.user, { displayName: name.trim() });
      await signOut(auth);
      return { ok: true };
    } catch (error) {
      try {
        await signOut(auth);
      } catch {
        // ignore
      }
      return { ok: false, error: friendlyError(error) };
    } finally {
      registering.current = false;
    }
  }, []);

  const login = useCallback(async (email, password) => {
    try {
      await signInWithEmailAndPassword(auth, email.trim(), password);
      return { ok: true };
    } catch (error) {
      return { ok: false, error: friendlyError(error) };
    }
  }, []);

  const resetPassword = useCallback(async (email) => {
    try {
      await sendPasswordResetEmail(auth, email.trim());
      return { ok: true };
    } catch (error) {
      return { ok: false, error: friendlyError(error) };
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await signOut(auth);
    } catch {
      // ignore
    }
  }, []);

  const value = useMemo(
    () => ({ user, loading, register, login, resetPassword, logout }),
    [user, loading, register, login, resetPassword, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
