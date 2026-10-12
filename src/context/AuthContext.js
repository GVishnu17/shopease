import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';

const AuthContext = createContext(null);
const USERS_KEY = 'shopease_users';
const SESSION_KEY = 'shopease_session';

async function hashPassword(password) {
  const data = new TextEncoder().encode(password);
  const buffer = await window.crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

function readUsers() {
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
  } catch {
    return [];
  }
}

function getSession() {
  try {
    return JSON.parse(localStorage.getItem(SESSION_KEY));
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(getSession);

  const register = useCallback(async ({ name, email, password }) => {
    const users = readUsers();
    const normalizedEmail = email.trim().toLowerCase();

    if (users.some((u) => u.email === normalizedEmail)) {
      return { ok: false, error: 'An account with this email already exists. Please log in.' };
    }

    const passwordHash = await hashPassword(password);
    const newUser = { name: name.trim(), email: normalizedEmail, passwordHash };

    try {
      localStorage.setItem(USERS_KEY, JSON.stringify([...users, newUser]));
    } catch {
      return { ok: false, error: 'Could not save your account. Please try again.' };
    }
    return { ok: true };
  }, []);

  const login = useCallback(async (email, password) => {
    const users = readUsers();
    const normalizedEmail = email.trim().toLowerCase();
    const found = users.find((u) => u.email === normalizedEmail);

    if (!found) {
      return { ok: false, error: 'No account found with this email. Please register first.' };
    }

    const passwordHash = await hashPassword(password);
    if (found.passwordHash !== passwordHash) {
      return { ok: false, error: 'Incorrect password. Please try again.' };
    }

    const session = { name: found.name, email: found.email };
    try {
      localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    } catch {
      // ignore storage failures
    }
    setUser(session);
    return { ok: true };
  }, []);

  const logout = useCallback(() => {
    try {
      localStorage.removeItem(SESSION_KEY);
    } catch {
      // ignore storage failures
    }
    setUser(null);
  }, []);

  const value = useMemo(() => ({ user, register, login, logout }), [user, register, login, logout]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
