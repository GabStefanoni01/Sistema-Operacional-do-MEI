import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import Cookies from 'js-cookie';
import { authService, decodeToken, isTokenValid } from '../services/authService';

const COOKIE_KEY = 'mei_auth_token';
const COOKIE_EXPIRES = 1; // 1 dia

const AuthContext = createContext(null);

/**
 * Extrai dados do usuário a partir do token JWT.
 */
function getUserFromToken(token) {
  if (!token) return null;
  const payload = decodeToken(token);
  if (!payload) return null;
  return {
    id: payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'],
    email: payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'],
  };
}

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => {
    const saved = Cookies.get(COOKIE_KEY);
    return saved && isTokenValid(saved) ? saved : null;
  });

  const [user, setUser] = useState(() => {
    const saved = Cookies.get(COOKIE_KEY);
    return saved && isTokenValid(saved) ? getUserFromToken(saved) : null;
  });

  const [loading, setLoading] = useState(false);

  // Salva token no cookie e atualiza state
  const saveSession = useCallback((newToken) => {
    Cookies.set(COOKIE_KEY, newToken, { expires: COOKIE_EXPIRES, sameSite: 'Lax' });
    setToken(newToken);
    setUser(getUserFromToken(newToken));
  }, []);

  const login = useCallback(async (credentials) => {
    setLoading(true);
    try {
      const newToken = await authService.login(credentials);
      saveSession(newToken);
      return { success: true };
    } catch (err) {
      return { success: false, message: err.message };
    } finally {
      setLoading(false);
    }
  }, [saveSession]);

  const register = useCallback(async (data) => {
    setLoading(true);
    try {
      const newToken = await authService.register(data);
      saveSession(newToken);
      return { success: true };
    } catch (err) {
      return { success: false, message: err.message };
    } finally {
      setLoading(false);
    }
  }, [saveSession]);

  const logout = useCallback(() => {
    Cookies.remove(COOKIE_KEY);
    setToken(null);
    setUser(null);
  }, []);

  const isAuthenticated = Boolean(token && isTokenValid(token));

  return (
    <AuthContext.Provider value={{ user, token, loading, isAuthenticated, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth deve ser usado dentro de <AuthProvider>');
  return ctx;
}
