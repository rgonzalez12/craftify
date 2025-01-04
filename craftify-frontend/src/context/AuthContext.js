import React, { createContext, useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';

export const AuthContext = createContext();

function parseJwt(token) {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace('-', '+').replace('_', '/');
    return JSON.parse(window.atob(base64));
  } catch (error) {
    return null;
  }
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function AuthProvider({ children }) {
  const navigate = useNavigate();
  const [userId, setUserId] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const payload = parseJwt(token);
      setUserId(payload?.user_id || payload?.sub || null);
      setIsAuthenticated(true);
    }
    setAuthLoading(false);
  }, []);

  function login(token) {
    localStorage.setItem('token', token);
    const payload = parseJwt(token);
    setUserId(payload?.user_id || payload?.sub || null);
    setIsAuthenticated(true);
  }

  function logout() {
    localStorage.removeItem('token');
    setUserId(null);
    setIsAuthenticated(false);
    navigate('/login');
  }

  return (
    <AuthContext.Provider value={{ 
      userId, 
      isAuthenticated, 
      authLoading, 
      login, 
      logout 
    }}>
      {children}
    </AuthContext.Provider>
  );
}