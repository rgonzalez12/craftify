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
      setError(null);
      const response = await api.get('cart/');
      setCart(response.data);
    } catch (err) {
      setError(err.message || 'Error fetching cart');
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchCart();
    } else {
      setCart(null);
    }
  }, [isAuthenticated, fetchCart]);

  const addToCart = async (itemId, quantity) => {
    try {
      setError(null);
      const response = await api.post(`cart/add/${itemId}/`, { quantity });
      setCart(response.data);
      return true;
    } catch (err) {
      setError(err.message || 'Error adding item to cart');
      return false;
    }
  };

  const removeFromCart = async (cartItemId) => {
    try {
      setError(null);
      await api.delete(`cart/items/${cartItemId}/`);
      await fetchCart();
      return true;
    } catch (err) {
      setError(err.message || 'Error removing item from cart');
      return false;
    }
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        loading,
        error,
        fetchCart,
        addToCart,
        removeFromCart,
      }}
    >
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