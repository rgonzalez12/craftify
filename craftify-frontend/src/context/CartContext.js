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
      console.error('Cart fetch error:', err);
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const addToCart = async (itemId, quantity) => {
    try {
      console.log(`Adding item ${itemId} to cart with quantity ${quantity}`);
      const response = await api.post(`cart/add/${itemId}/`, { quantity });
      console.log('Add to cart response:', response.data);
      setCart(response.data);
      return true;
    } catch (err) {
      console.error('Add to cart error:', err);
      setError(err.message);
      return false;
    }
  };

  const removeFromCart = async (itemId) => {
    if (!itemId) {
      console.error('Attempted to remove item with undefined ID');
      return false;
    }

    try {
      console.log(`Attempting to remove item ${itemId} from cart`);
      // Updated to match the Django ViewSet action URL pattern
      const response = await api.delete(`cart/remove_from_cart/${itemId}/`);
      console.log('Remove cart response:', response);

      // Refresh cart after successful removal
      await fetchCart();
      return true;
    } catch (err) {
      console.error('Remove from cart error:', {
        message: err.message,
        status: err.response?.status,
        data: err.response?.data,
        url: `cart/remove_from_cart/${itemId}/`
      });
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
      removeFromCart,
      clearError: () => setError(null)
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