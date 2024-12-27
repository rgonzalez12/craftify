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
  // Billing & Payment Info
  const [billingName, setBillingName] = useState('');
  const [billingAddress, setBillingAddress] = useState('');
  const [billingCity, setBillingCity] = useState('');
  const [billingState, setBillingState] = useState('');
  const [billingZip, setBillingZip] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCVC, setCardCVC] = useState('');
  // Success message or redirect
  const [successMessage, setSuccessMessage] = useState('');

  // 1. Check if still loading auth or not authenticated
  useEffect(() => {
    if (authLoading) return; // wait for auth to finish
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    // 2. Fetch cart
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

  // Simple total calculation
  const totalPrice = cart?.items?.reduce(
    (acc, ci) => acc + ci.quantity * ci.item.price,
    0
  ) || 0;

  // 3. Handle Checkout Submission
  async function handleCheckout(e) {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    // Basic local validation
    if (
      !billingName ||
      !billingAddress ||
      !billingCity ||
      !billingState ||
      !billingZip ||
      !cardNumber ||
      !cardExpiry ||
      !cardCVC
    ) {
      setError('Please fill in all required fields.');
      return;
    }

    try {
      // Example checkout call; adjust fields or endpoint to match actual backend logic
      const payload = {
        name: billingName,
        address: billingAddress,
        city: billingCity,
        state: billingState,
        zip: billingZip,
        cardNumber,
        cardExpiry,
        cardCVC,
      };

      // POST to /checkout/ or wherever your server processes an order
      await api.post('checkout/', payload);

      // If successful, show success & optionally navigate or show a message
      setSuccessMessage('Payment processed! Your order has been placed.');
      // Clear cart? This might happen automatically on the backend. 
      // You could re-fetch the cart or navigate. Let’s do a short delay then navigate:
      setTimeout(() => {
        navigate('/');
      }, 2000);
    } catch (err) {
      console.error('Checkout error:', err);
      setError('Error processing payment. Please try again.');
    }
  }

  if (authLoading || loading) {
    // While loading either auth or cart data
    return (
      <div className="container mx-auto py-8 px-4">
        <p className="text-gray-700">Loading checkout...</p>
      </div>
    );
  }

  // Show any top-level error if no cart loaded
  if (error && !cart) {
    return (
      <div className="container mx-auto py-8 px-4">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  // If the cart is empty or null
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

      {/* CART ITEMS REVIEW */}
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

      {/* BILLING & PAYMENT FORM */}
      <div className="bg-white p-6 rounded shadow-md">
        <h3 className="text-xl font-semibold mb-4 text-gray-800">Billing Address</h3>
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
        <form onSubmit={handleCheckout} className="space-y-4">
          {/* Billing Name */}
          <div>
            <label className="block font-medium mb-1 text-gray-700">Name</label>
            <input
              type="text"
              className="w-full border rounded px-3 py-2"
              value={billingName}
              onChange={(e) => setBillingName(e.target.value)}
              required
            />
          </div>
          {/* Address */}
          <div>
            <label className="block font-medium mb-1 text-gray-700">Address</label>
            <input
              type="text"
              className="w-full border rounded px-3 py-2"
              value={billingAddress}
              onChange={(e) => setBillingAddress(e.target.value)}
              required
            />
          </div>
          {/* City, State, Zip */}
          <div className="flex flex-col sm:flex-row sm:space-x-2 space-y-4 sm:space-y-0">
            <div className="sm:w-1/2">
              <label className="block font-medium mb-1 text-gray-700">City</label>
              <input
                type="text"
                className="w-full border rounded px-3 py-2"
                value={billingCity}
                onChange={(e) => setBillingCity(e.target.value)}
                required
              />
            </div>
            <div className="sm:w-1/4">
              <label className="block font-medium mb-1 text-gray-700">State</label>
              <input
                type="text"
                className="w-full border rounded px-3 py-2"
                value={billingState}
                onChange={(e) => setBillingState(e.target.value)}
                required
              />
            </div>
            <div className="sm:w-1/4">
              <label className="block font-medium mb-1 text-gray-700">Zip</label>
              <input
                type="text"
                className="w-full border rounded px-3 py-2"
                value={billingZip}
                onChange={(e) => setBillingZip(e.target.value)}
                required
              />
            </div>
          </div>

          <h3 className="text-xl font-semibold mt-6 mb-4 text-gray-800">Payment Info</h3>
          {/* Card Number */}
          <div>
            <label className="block font-medium mb-1 text-gray-700">Card Number</label>
            <input
              type="text"
              className="w-full border rounded px-3 py-2"
              value={cardNumber}
              onChange={(e) => setCardNumber(e.target.value)}
              placeholder="XXXX-XXXX-XXXX-XXXX"
              required
            />
          </div>
          {/* Expiry & CVC */}
          <div className="flex flex-col sm:flex-row sm:space-x-2 space-y-4 sm:space-y-0">
            <div className="sm:w-1/2">
              <label className="block font-medium mb-1 text-gray-700">Expiry (MM/YY)</label>
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
              <label className="block font-medium mb-1 text-gray-700">CVC</label>
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

          <button
            type="submit"
            className="mt-6 w-full py-2 bg-blue-600 text-white font-semibold rounded hover:bg-blue-700"
          >
            Place Order
          </button>
        </form>
      </div>
    </div>
  );
}

export default Checkout;