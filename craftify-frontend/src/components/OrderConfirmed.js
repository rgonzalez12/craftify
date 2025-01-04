import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import api from '../services/api';

function OrderConfirmed() {
  const location = useLocation();
  const navigate = useNavigate();
  const { order } = location.state || {};

  if (!order) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Order Confirmation</h2>
        <p className="text-gray-600">No order details found.</p>
        <button
          onClick={() => navigate('/')}
          className="mt-4 px-4 py-2 bg-blue-600 text-white font-semibold rounded hover:bg-blue-700"
        >
          Return Home
        </button>
      </div>
    );
  }

  // For partial card display
  const last4 = order.payment?.last4
    ? order.payment.last4
    : order.payment?.cardNumber?.slice(-4);

  const shipping = order.shipping || {};
  const items = order.items || [];
  const total = items.reduce((acc, i) => acc + i.quantity * i.price, 0);

  async function handleReturnHome() {
    try {
      // Clear the cart so user can shop again with a fresh cart
      await api.delete('cart/');
    } catch (err) {
      console.error('Error clearing cart:', err);
      // We won't block navigation if cart clearing fails, but we could add UI feedback at some point
    }
    navigate('/');
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      <div className="bg-white p-6 rounded shadow-md">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">
          Thank You for Your Order!
        </h2>
        <p className="text-gray-700">Your order has been recorded.</p>
      </div>

      {/* Order Summary */}
      <div className="bg-white p-6 rounded shadow-md">
        <h3 className="text-xl font-semibold mb-2 text-gray-800">Order Summary</h3>
        <ul className="space-y-4">
          {items.map((item, index) => (
            <li
              key={index}
              className="flex justify-between border-b border-gray-200 pb-4"
            >
              <div>
                <p className="font-medium text-gray-800">
                  {item.quantity} x {item.name}
                </p>
                <p className="text-sm text-gray-500">${item.price} each</p>
              </div>
              <div className="text-gray-800 font-bold">
                ${item.quantity * item.price}
              </div>
            </li>
          ))}
        </ul>
        <div className="flex justify-between mt-4">
          <span className="font-semibold text-gray-700">Total:</span>
          <span className="text-lg font-bold text-gray-800">
            ${total.toFixed(2)}
          </span>
        </div>
      </div>

      {/* Shipping Info */}
      <div className="bg-white p-6 rounded shadow-md">
        <h3 className="text-xl font-semibold mb-2 text-gray-800">Shipping Address</h3>
        <p className="text-gray-700">
          {shipping.name} <br />
          {shipping.address} <br />
          {shipping.city}, {shipping.state} {shipping.zip} <br />
          {shipping.country}
        </p>
      </div>

      {/* Payment Info */}
      <div className="bg-white p-6 rounded shadow-md">
        <h3 className="text-xl font-semibold mb-2 text-gray-800">Payment</h3>
        <p className="text-gray-700">
          Card ending in <span className="font-bold">{last4 || '****'}</span>
        </p>
      </div>

      <button
        onClick={handleReturnHome}
        className="px-6 py-2 bg-blue-600 text-white font-semibold rounded hover:bg-blue-700"
      >
        Return Home
      </button>
    </div>
  );
}

export default OrderConfirmed;