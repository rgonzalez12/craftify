import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

function Cart() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { cart, loading: cartLoading, error: cartError, removeFromCart, fetchCart } = useCart();
  // Initialize localCart with a safe default structure
  const [localCart, setLocalCart] = useState({ items: [] });
  const [isLoading, setIsLoading] = useState(true);
  const [isRemoving, setIsRemoving] = useState(false);

  // Load cart data when component mounts or auth state changes
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
      } else {
        setIsLoading(false);
      }
    };

    loadCart();
  }, [isAuthenticated, fetchCart]);

  // Update local cart state when cart data changes
  useEffect(() => {
    console.log('Cart data received:', cart);
    if (cart) {
      if (Array.isArray(cart)) {
        // Handle array response
        setLocalCart(cart[0] || { items: [] });
      } else if (cart.items) {
        // Handle object response
        setLocalCart(cart);
      } else {
        // Fallback to empty cart
        setLocalCart({ items: [] });
      }
    }
  }, [cart]);

  const handleRemoveItem = async (cartItem) => {
    if (!cartItem || !cartItem.item) {
      console.error('Invalid cart item:', cartItem);
      return;
    }

    setIsRemoving(true);
    try {
      console.log('Removing cart item:', cartItem);
      const itemToRemove = cartItem.item.id;
      
      if (!itemToRemove) {
        throw new Error('No item ID found for removal');
      }

      const success = await removeFromCart(itemToRemove);
      if (success) {
        console.log('Successfully removed item from cart');
      } else {
        console.error('Failed to remove item from cart');
      }
    } catch (err) {
      console.error('Error in handleRemoveItem:', err);
    } finally {
      setIsRemoving(false);
    }
  };

  // Show loading state
  if (isLoading || cartLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Shopping Cart</h1>
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
          </div>
        </div>
      </div>
    );
  }

  // Show error state
  if (cartError) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-md">
            <div className="flex">
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Error loading cart</h3>
                <div className="mt-2 text-sm text-red-700">{cartError}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show empty cart state
  if (!localCart?.items?.length) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Shopping Cart</h1>
          <div className="bg-white shadow-sm rounded-lg p-6 text-center">
            <h3 className="mt-4 text-lg font-medium text-gray-900">Your cart is empty</h3>
            <p className="mt-2 text-gray-500">Start shopping to add items to your cart</p>
            <button
              onClick={() => navigate('/')}
              className="mt-6 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Render cart with items
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Shopping Cart</h1>
        
        <div className="bg-white shadow-sm rounded-lg overflow-hidden">
          <div className="divide-y divide-gray-200">
            {localCart.items.map((cartItem) => (
              <div key={cartItem.item.id} className="p-6 flex items-center hover:bg-gray-50 transition-colors">
                <div className="ml-6 flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">{cartItem.item.name}</h3>
                      <p className="mt-1 text-sm text-gray-500">{cartItem.item.category || 'Uncategorized'}</p>
                      <p className="mt-1 text-sm text-gray-500">Seller: {cartItem.item.seller_username}</p>
                    </div>
                    <p className="text-lg font-medium text-gray-900">
                      ${Number(cartItem.total_price).toFixed(2)}
                    </p>
                  </div>

                  <div className="mt-4 flex items-center justify-between">
                    <div className="flex items-center">
                      <span className="text-gray-500 mr-2">Qty:</span>
                      <span className="text-gray-900 font-medium">{cartItem.quantity}</span>
                    </div>
                    <button
                      onClick={() => handleRemoveItem(cartItem)}
                      disabled={isRemoving}
                      className={`inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-red-600 hover:text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors ${isRemoving ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      {isRemoving ? 'Removing...' : 'Remove'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="p-6 bg-gray-50 border-t border-gray-200">
            <div className="flex justify-between items-center">
              <p className="text-lg font-medium text-gray-900">Total</p>
              <p className="text-xl font-semibold text-gray-900">
                ${Number(localCart.total_price).toFixed(2)}
              </p>
            </div>
            <button 
              onClick={() => navigate('/checkout')}
              className="mt-6 w-full flex justify-center items-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              Proceed to Checkout
            </button>
            <button 
              onClick={() => navigate('/')}
              className="mt-4 w-full flex justify-center items-center px-6 py-3 border border-gray-300 rounded-md shadow-sm text-base font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Cart;