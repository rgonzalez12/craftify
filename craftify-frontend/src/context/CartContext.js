import React, { createContext, useState, useContext, useCallback } from 'react';
import api from '../services/api';

export const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState({ items: [] });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchCart = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.get('cart/');
      console.log('API Response:', response.data);
      setCart(response.data);
      return response.data;
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

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