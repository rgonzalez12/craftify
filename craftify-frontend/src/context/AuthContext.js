import React, { createContext, useState, useEffect } from 'react';
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

export function AuthProvider({ children }) {
  const navigate = useNavigate();
  const [userId, setUserId] = useState(null);

  // On initial load, check localStorage for an existing token
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const payload = parseJwt(token);
      setUserId(payload?.user_id || payload?.sub || null);
    }
  }, []);

  function login(token) {
    localStorage.setItem('token', token);
    const payload = parseJwt(token);
    setUserId(payload?.user_id || payload?.sub || null);
  }

  function logout() {
    localStorage.removeItem('token');
    setUserId(null);
    navigate('/login');
  }

  const isAuthenticated = !!userId;

  return (
    <AuthContext.Provider value={{ isAuthenticated, userId, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}