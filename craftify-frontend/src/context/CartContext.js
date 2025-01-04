import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import api from '../services/api';
import { useAuth } from './AuthContext';

export const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { isAuthenticated } = useAuth();

  const fetchCart = useCallback(async () => {
    if (!isAuthenticated) return;
    try {
      setLoading(true);
      const response = await api.get('cart/');
      setCart(response.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchCart();
    }
  }, [isAuthenticated, fetchCart]);

  const addToCart = async (itemId, quantity) => {
    try {
      const response = await api.post(`cart/add/${itemId}/`, { quantity });
      setCart(response.data);
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    }
  };

  const removeFromCart = async (itemId) => {
    try {
      await api.delete(`cart/items/${itemId}/`);
      await fetchCart();
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    }
  };

  return (
    <CartContext.Provider value={{ 
      cart, 
      loading, 
      error, 
      fetchCart, 
      addToCart, 
      removeFromCart 
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};