import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

function Cart() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { cart, loading, error, removeFromCart, fetchCart } = useCart();
  const [localError, setLocalError] = useState(null);

  useEffect(() => {
    const getCartData = async () => {
      try {
        if (isAuthenticated) {
          console.log('Fetching cart data...');
          await fetchCart();
          console.log('Cart data fetched:', cart);
        }
      } catch (err) {
        console.error('Error fetching cart:', err);
        setLocalError(err.message);
      }
    };

    getCartData();
  }, [isAuthenticated, fetchCart]);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  console.log('Current cart state:', cart);

  if (loading) return <div className="p-4">Loading cart...</div>;
  if (localError) return <div className="p-4 text-red-600">Error: {localError}</div>;
  if (!cart || !cart.items?.length) {
    return (
      <div className="max-w-2xl mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Shopping Cart</h1>
        <p>Your cart is empty</p>
      </div>
    );
  }

  const handleRemoveItem = async (itemId) => {
    try {
      console.log('Removing item:', itemId);
      await removeFromCart(itemId);
      await fetchCart();
    } catch (err) {
      console.error('Error removing item:', err);
      setLocalError(err.message);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Shopping Cart</h1>
      
      {cart.items.map((cartItem) => (
        <div key={cartItem.id} className="flex items-center border-b py-4">
          <div className="ml-4 flex-grow">
            <h3 className="font-semibold">{cartItem.item.name}</h3>
            <p className="text-gray-600">Quantity: {cartItem.quantity}</p>
            <p className="text-green-600 font-semibold">${cartItem.total_price}</p>
          </div>

          <button
            onClick={() => handleRemoveItem(cartItem.item.id)}
            className="text-red-600 hover:text-red-800"
          >
            Remove
          </button>
        </div>
      ))}

      <div className="mt-4 text-right">
        <p className="text-xl font-bold">Total: ${cart.total_price}</p>
        <button 
          onClick={() => navigate('/checkout')}
          className="mt-4 bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
        >
          Proceed to Checkout
        </button>
      </div>
    </div>
  );
}

export default Cart;