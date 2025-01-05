import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

function Cart() {
  const navigate = useNavigate();
  const { isAuthenticated, authLoading } = useAuth();

  // from CartContext
  const {
    cart,
    loading,
    error,
    removeFromCart,
    fetchCart,
  } = useCart();

  // 1. Only fetch cart if user is authenticated
  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      fetchCart();
    }
    // If not authenticated, we can redirect, but let's wait until authLoading is false
    else if (!authLoading && !isAuthenticated) {
      navigate('/login');
    }
  }, [authLoading, isAuthenticated, fetchCart, navigate]);

  // 2. Handle removing item
  //    Pass the *cart item* ID if your backend expects that
  const handleRemoveItem = async (cartItemId) => {
    try {
      await removeFromCart(cartItemId);
      // Optionally no need to re-fetch here because removeFromCart calls fetchCart
    } catch (err) {
      console.error('Error removing item:', err);
    }
  };

  // 3. Render states
  if (authLoading || loading) return <div>Loading cart...</div>;
  if (error) return <div>Error: {error}</div>;

  // 4. If the cart is empty or null
  if (!cart || !cart.items || cart.items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Shopping Cart</h1>
        <p>Your cart is empty</p>
      </div>
    );
  }

  // 5. Display cart items
  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Shopping Cart</h1>

      {cart.items.map((cartItem) => (
        <div key={cartItem.id} className="flex items-center border-b py-4">
          <div className="ml-4 flex-grow">
            <h3 className="font-semibold">{cartItem.item?.name}</h3>
            <p className="text-gray-600">Quantity: {cartItem.quantity}</p>
            <p className="text-green-600 font-semibold">
              ${cartItem.item?.price * cartItem.quantity}
            </p>
          </div>

          <button
            // Instead of cartItem.item?.id, use cartItem.id
            // if that's how your backend identifies the cart item
            onClick={() => handleRemoveItem(cartItem.id)}
            className="text-red-600 hover:text-red-800"
          >
            Remove
          </button>
        </div>
      ))}

      <div className="mt-4 text-right">
        <p className="text-xl font-bold">
          {/* If your backend returns something like total_price, use that. Otherwise calculate here */}
          Total: ${cart.total_price || 0}
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