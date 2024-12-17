import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';

function Cart() {
  const [cart, setCart] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    api.get('cart/')
      .then(response => {
        setCart(response.data);
      })
      .catch(() => {
        console.error('Error fetching cart data');
      });
  }, []);

  function handleRemoveItem(itemId) {
    api.delete(`cart/items/${itemId}/`) // Adjust the endpoint if needed
      .then(() => {
        setCart(prevCart => {
          return {
            ...prevCart,
            items: prevCart.items.filter(i => i.item.id !== itemId)
          };
        });
      })
      .catch(() => {
        console.error('Error removing item');
      });
  }
  function handleCheckout() {
    navigate('/checkout');
  }
  if (cart === null) {
    return <p>Loading your cart...</p>;
  }

  return (
    <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Your Cart</h2>
      {cart.items && cart.items.length > 0 ? (
        <>
          <ul className="cart-items space-y-4 bg-white rounded-lg p-6 shadow-md">
            {cart.items.map((cartItem) => (
              <li 
                key={cartItem.item.id} 
                className="cart-item flex items-center justify-between border-b border-gray-200 pb-4"
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
            <p className="cart-total text-xl font-bold text-gray-800">
              Total: ${cart.items.reduce((acc, ci) => acc + ci.quantity * ci.item.price, 0)}
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