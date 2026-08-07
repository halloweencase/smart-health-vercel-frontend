import React, { createContext, useEffect, useMemo, useState } from 'react';
import { clearSession, getStoredToken, getStoredUser, saveSession } from '../services/api';
export const AuthContext = createContext(null);
export function AuthProvider({ children }) {
  const [token, setToken] = useState(getStoredToken()); const [user, setUser] = useState(getStoredUser());
  useEffect(() => { const sync = () => { setToken(getStoredToken()); setUser(getStoredUser()); }; window.addEventListener('smart-health-auth', sync); window.addEventListener('storage', sync); return () => { window.removeEventListener('smart-health-auth', sync); window.removeEventListener('storage', sync); }; }, []);
  const value = useMemo(() => ({ token, user, role: user?.role ?? null, login: saveSession, logout: clearSession }), [token, user]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
