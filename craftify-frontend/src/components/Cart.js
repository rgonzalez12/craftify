import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';

function Cart() {
  const navigate = useNavigate();
  const { isAuthenticated } = useContext(AuthContext);
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return; // skip fetching if not logged in
    }

    async function fetchCart() {
      try {
        setLoading(true);
        const response = await api.get('cart/');
        setCart(response.data);
      } catch (err) {
        console.error('Error fetching cart data:', err);
        setError('Unable to fetch cart at this time.');
      } finally {
        setLoading(false);
      }
    }

    fetchCart();
  }, [isAuthenticated, navigate]);

  // Remove item from cart
  async function handleRemoveItem(itemId) {
    try {
      await api.delete(`cart/items/${itemId}/`);
      setCart((prevCart) => {
        if (!prevCart) return prevCart;
        return {
          ...prevCart,
          items: prevCart.items.filter((ci) => ci.item.id !== itemId),
        };
      });
    } catch (err) {
      console.error('Error removing item:', err);
      setError('Failed to remove item. Please try again.');
    }
  }

  // Go to checkout
  function handleCheckout() {
    navigate('/checkout');
  }

  // Now do final returns (we do not call hooks conditionally)
  if (!isAuthenticated) {
    // We already navigated to /login in the useEffect, 
    // but this guard prevents a brief render of the cart for unauthenticated users.
    return null;
  }

  if (loading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <p className="text-gray-700">Loading your cart...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-8 px-4">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  // If cart is null or cart.items is undefined, treat as empty
  if (!cart || !cart.items) {
    return (
      <div className="container mx-auto py-8 px-4">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Your Cart</h2>
        <p className="text-gray-600">Your cart is empty.</p>
      </div>
    );
  }

  const totalPrice = cart.items.reduce(
    (acc, ci) => acc + ci.quantity * ci.item.price,
    0
  );

  return (
    <div className="container mx-auto py-8 px-4">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Your Cart</h2>

      {cart.items.length > 0 ? (
        <>
          <ul className="space-y-4 bg-white rounded-lg p-6 shadow-md">
            {cart.items.map((cartItem) => (
              <li
                key={cartItem.item.id}
                className="flex items-center justify-between border-b border-gray-200 pb-4"
              >
                <div className="flex flex-col">
                  <span className="text-lg font-semibold text-gray-800">
                    {cartItem.quantity} x {cartItem.item.name}
                  </span>
                  <p className="text-sm text-gray-500">
                    Price per item: ${cartItem.item.price}
                  </p>
                </div>
                <div className="flex items-center space-x-4">
                  <span className="text-lg font-bold text-gray-800">
                    ${cartItem.quantity * cartItem.item.price}
                  </span>
                  <button
                    onClick={() => handleRemoveItem(cartItem.item.id)}
                    className="text-red-500 hover:text-red-600 font-medium focus:outline-none"
                  >
                    Remove
                  </button>
                </div>
              </li>
            ))}
          </ul>

          <div className="flex items-center justify-between mt-6">
            <p className="text-xl font-bold text-gray-800">
              Total: ${totalPrice.toFixed(2)}
            </p>
            <button
              onClick={handleCheckout}
              className="inline-block bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Proceed to Checkout
            </button>
          </div>
        </>
      ) : (
        <p className="text-gray-600">Your cart is empty.</p>
      )}
    </div>
  );
}

export default Cart;