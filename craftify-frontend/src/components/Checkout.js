import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';

function Checkout() {
  const navigate = useNavigate();
  const { isAuthenticated, authLoading } = useContext(AuthContext);

  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Billing Info
  const [billingName, setBillingName] = useState('');
  const [billingAddress, setBillingAddress] = useState('');
  const [billingCity, setBillingCity] = useState('');
  const [billingState, setBillingState] = useState('');
  const [billingZip, setBillingZip] = useState('');
  const [billingCountry, setBillingCountry] = useState('');

  // Shipping Info
  const [shippingName, setShippingName] = useState('');
  const [shippingAddress, setShippingAddress] = useState('');
  const [shippingCity, setShippingCity] = useState('');
  const [shippingState, setShippingState] = useState('');
  const [shippingZip, setShippingZip] = useState('');
  const [shippingCountry, setShippingCountry] = useState('');

  // Payment Info
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCVC, setCardCVC] = useState('');

  // Success
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    if (authLoading) return; 
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    async function fetchCart() {
      try {
        setLoading(true);
        const response = await api.get('cart/');
        setCart(response.data);
      } catch (err) {
        console.error('Error fetching cart:', err);
        setError('Unable to load cart. Please try again.');
      } finally {
        setLoading(false);
      }
    }
    fetchCart();
  }, [authLoading, isAuthenticated, navigate]);

  const totalPrice = cart?.items?.reduce(
    (acc, ci) => acc + ci.quantity * ci.item.price,
    0
  ) || 0;

  async function handleCheckout(e) {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    // Basic field check
    if (
      !billingName || !billingAddress || !billingCity || !billingState ||
      !billingZip || !billingCountry || !shippingName || !shippingAddress ||
      !shippingCity || !shippingState || !shippingZip || !shippingCountry ||
      !cardNumber || !cardExpiry || !cardCVC
    ) {
      setError('Please fill in all required fields.');
      return;
    }

    try {
      const payload = {
        billing: {
          name: billingName,
          address: billingAddress,
          city: billingCity,
          state: billingState,
          zip: billingZip,
          country: billingCountry,
        },
        shipping: {
          name: shippingName,
          address: shippingAddress,
          city: shippingCity,
          state: shippingState,
          zip: shippingZip,
          country: shippingCountry,
        },
        payment: {
          cardNumber,
          cardExpiry,
          cardCVC,
        },
      };

      // 1) Send checkout data to backend: expects an order object in response
      const response = await api.post('checkout/', payload);
      // e.g., response.data = { orderId, items, shipping, payment, ... }

      // 2) Navigate to OrderConfirmed, pass the order data in location.state
      navigate('/order-confirmed', { state: { order: response.data } });

    } catch (err) {
      console.error('Checkout error:', err);
      setError('Error processing payment. Please try again.');
    }
  }

  if (authLoading || loading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <p className="text-gray-700">Loading checkout...</p>
      </div>
    );
  }

  if (error && !cart) {
    return (
      <div className="container mx-auto py-8 px-4">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  if (!cart || !cart.items || cart.items.length === 0) {
    return (
      <div className="container mx-auto py-8 px-4">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Checkout</h2>
        <p className="text-gray-600">Your cart is empty.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Checkout</h2>

      {/* CART ITEMS */}
      <div className="bg-white p-6 rounded shadow-md">
        <h3 className="text-xl font-semibold mb-4 text-gray-800">
          Review Your Items
        </h3>
        <ul className="space-y-4">
          {cart.items.map((cartItem) => (
            <li key={cartItem.item.id} className="flex justify-between border-b border-gray-200 pb-4">
              <div>
                <p className="font-medium text-gray-800">
                  {cartItem.quantity} x {cartItem.item.name}
                </p>
                <p className="text-sm text-gray-500">
                  ${cartItem.item.price} each
                </p>
              </div>
              <div className="text-gray-800 font-bold">
                ${cartItem.quantity * cartItem.item.price}
              </div>
            </li>
          ))}
        </ul>
        <div className="flex justify-between mt-4">
          <span className="font-semibold text-gray-700">Total:</span>
          <span className="text-lg font-bold text-gray-800">
            ${totalPrice.toFixed(2)}
          </span>
        </div>
      </div>

      {/* CHECKOUT FORM */}
      <div className="bg-white p-6 rounded shadow-md">
        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
            {error}
          </div>
        )}
        {successMessage && (
          <div className="mb-4 p-3 bg-green-100 text-green-700 rounded">
            {successMessage}
          </div>
        )}
        <form onSubmit={handleCheckout} className="space-y-6">
          {/* Billing Info */}
          <div>
            <h3 className="text-xl font-semibold mb-2 text-gray-800">Billing Address</h3>
            <div className="bg-gray-50 p-4 rounded space-y-4">
              <div>
                <label className="block mb-1 font-medium text-gray-700">
                  Name
                </label>
                <input
                  type="text"
                  className="w-full border rounded px-3 py-2"
                  value={billingName}
                  onChange={(e) => setBillingName(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="block mb-1 font-medium text-gray-700">
                  Address
                </label>
                <input
                  type="text"
                  className="w-full border rounded px-3 py-2"
                  value={billingAddress}
                  onChange={(e) => setBillingAddress(e.target.value)}
                  required
                />
              </div>
              <div className="flex flex-col sm:flex-row sm:space-x-2 space-y-4 sm:space-y-0">
                <div className="sm:w-1/3">
                  <label className="block mb-1 font-medium text-gray-700">
                    City
                  </label>
                  <input
                    type="text"
                    className="w-full border rounded px-3 py-2"
                    value={billingCity}
                    onChange={(e) => setBillingCity(e.target.value)}
                    required
                  />
                </div>
                <div className="sm:w-1/3">
                  <label className="block mb-1 font-medium text-gray-700">
                    State
                  </label>
                  <input
                    type="text"
                    className="w-full border rounded px-3 py-2"
                    value={billingState}
                    onChange={(e) => setBillingState(e.target.value)}
                    required
                  />
                </div>
                <div className="sm:w-1/3">
                  <label className="block mb-1 font-medium text-gray-700">
                    Zip
                  </label>
                  <input
                    type="text"
                    className="w-full border rounded px-3 py-2"
                    value={billingZip}
                    onChange={(e) => setBillingZip(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block mb-1 font-medium text-gray-700">
                  Country
                </label>
                <input
                  type="text"
                  className="w-full border rounded px-3 py-2"
                  value={billingCountry}
                  onChange={(e) => setBillingCountry(e.target.value)}
                  required
                />
              </div>
            </div>
          </div>

          {/* Shipping Info */}
          <div>
            <h3 className="text-xl font-semibold mb-2 text-gray-800">Shipping Address</h3>
            <div className="bg-gray-50 p-4 rounded space-y-4">
              <div>
                <label className="block mb-1 font-medium text-gray-700">
                  Name
                </label>
                <input
                  type="text"
                  className="w-full border rounded px-3 py-2"
                  value={shippingName}
                  onChange={(e) => setShippingName(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="block mb-1 font-medium text-gray-700">
                  Address
                </label>
                <input
                  type="text"
                  className="w-full border rounded px-3 py-2"
                  value={shippingAddress}
                  onChange={(e) => setShippingAddress(e.target.value)}
                  required
                />
              </div>
              <div className="flex flex-col sm:flex-row sm:space-x-2 space-y-4 sm:space-y-0">
                <div className="sm:w-1/3">
                  <label className="block mb-1 font-medium text-gray-700">
                    City
                  </label>
                  <input
                    type="text"
                    className="w-full border rounded px-3 py-2"
                    value={shippingCity}
                    onChange={(e) => setShippingCity(e.target.value)}
                    required
                  />
                </div>
                <div className="sm:w-1/3">
                  <label className="block mb-1 font-medium text-gray-700">
                    State
                  </label>
                  <input
                    type="text"
                    className="w-full border rounded px-3 py-2"
                    value={shippingState}
                    onChange={(e) => setShippingState(e.target.value)}
                    required
                  />
                </div>
                <div className="sm:w-1/3">
                  <label className="block mb-1 font-medium text-gray-700">
                    Zip
                  </label>
                  <input
                    type="text"
                    className="w-full border rounded px-3 py-2"
                    value={shippingZip}
                    onChange={(e) => setShippingZip(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block mb-1 font-medium text-gray-700">
                  Country
                </label>
                <input
                  type="text"
                  className="w-full border rounded px-3 py-2"
                  value={shippingCountry}
                  onChange={(e) => setShippingCountry(e.target.value)}
                  required
                />
              </div>
            </div>
          </div>

          {/* Payment Info */}
          <div>
            <h3 className="text-xl font-semibold mb-2 text-gray-800">Payment Info</h3>
            <div className="bg-gray-50 p-4 rounded space-y-4">
              <div>
                <label className="block mb-1 font-medium text-gray-700">
                  Card Number
                </label>
                <input
                  type="text"
                  className="w-full border rounded px-3 py-2"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  placeholder="XXXX-XXXX-XXXX-XXXX"
                  required
                />
              </div>
              <div className="flex flex-col sm:flex-row sm:space-x-2 space-y-4 sm:space-y-0">
                <div className="sm:w-1/2">
                  <label className="block mb-1 font-medium text-gray-700">
                    Expiry (MM/YY)
                  </label>
                  <input
                    type="text"
                    className="w-full border rounded px-3 py-2"
                    value={cardExpiry}
                    onChange={(e) => setCardExpiry(e.target.value)}
                    placeholder="MM/YY"
                    required
                  />
                </div>
                <div className="sm:w-1/2">
                  <label className="block mb-1 font-medium text-gray-700">
                    CVC
                  </label>
                  <input
                    type="text"
                    className="w-full border rounded px-3 py-2"
                    value={cardCVC}
                    onChange={(e) => setCardCVC(e.target.value)}
                    placeholder="3 or 4 digits"
                    required
                  />
                </div>
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-2 bg-blue-600 text-white font-semibold rounded hover:bg-blue-700"
          >
            Place Order
          </button>
        </form>
      </div>
    </div>
  );
}

export default Checkout;