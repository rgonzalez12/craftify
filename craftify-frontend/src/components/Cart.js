import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

function Cart() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { cart, loading, error, removeFromCart, fetchCart } = useCart();
  const [localCart, setLocalCart] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initial cart load
  useEffect(() => {
    const loadCart = async () => {
      if (isAuthenticated) {
        setIsLoading(true);
        try {
          await fetchCart();
        } catch (error) {
          console.error('Failed to fetch cart:', error);
        } finally {
          setIsLoading(false);
        }
      }
    };
    loadCart();
  }, [isAuthenticated, fetchCart]);

  // Update local cart when global cart changes
  useEffect(() => {
    if (cart && cart.items) {
      console.log('Updating local cart:', cart);
      setLocalCart(cart);
    }
  }, [cart]);

  const handleRemoveItem = async (cartItemId) => {
    try {
      await removeFromCart(cartItemId);
      await fetchCart(); // Force refresh after removal
    } catch (err) {
      console.error('Error removing item:', err);
    }
  };

  if (isLoading || loading) return <div>Loading cart...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!localCart?.items?.length) {
    return (
      <div className="max-w-2xl mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Shopping Cart</h1>
        <p>Your cart is empty</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Shopping Cart</h1>
      
      {localCart.items.map((cartItem) => (
        <div key={cartItem.id} className="flex items-center border-b py-4">
          <div className="ml-4 flex-grow">
            <h3 className="font-semibold">{cartItem.item?.name}</h3>
            <p className="text-gray-600">Quantity: {cartItem.quantity}</p>
            <p className="text-green-600 font-semibold">
              ${(cartItem.item?.price * cartItem.quantity).toFixed(2)}
            </p>
          </div>
          <button
            onClick={() => handleRemoveItem(cartItem.id)}
            className="text-red-600 hover:text-red-800"
          >
            Remove
          </button>
        </div>
      ))}

      <div className="mt-4 text-right">
        <p className="text-xl font-bold">
          Total: ${localCart.items.reduce((total, item) => 
            total + (item.item?.price * item.quantity), 0).toFixed(2)}
        </p>
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