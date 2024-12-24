import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';

function ItemDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, userId } = useContext(AuthContext);

  const [item, setItem] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [errors, setErrors] = useState([]);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    setErrors([]);
    setMessages([]);

    api.get(`items/${id}/`)
      .then((response) => {
        setItem(response.data);
      })
      .catch(() => {
        setErrors(['Error fetching item details.']);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);

  // Handle Add to Cart
  async function handleAddToCart(e) {
    e.preventDefault();
    setErrors([]);
    setMessages([]);

    // If not authenticated, let the user know they need to log in
    if (!isAuthenticated) {
      setErrors(['You must be logged in to add items to the cart.']);
      return;
    }

    // (Optional) Prevent user from adding their own item to the cart
    // if (item?.seller?.id === userId) {
    //   setErrors(["You can't buy your own item."]);
    //   return;
    // }

    const data = { quantity: parseInt(quantity, 10) };

    try {
      // Ensure we have the trailing slash if Django requires it
      await api.post(`cart/add/${id}/`, data);
      setMessages(['Item added to cart successfully.']);

      // Redirect to cart page after a short delay
      setTimeout(() => {
        navigate('/cart');
      }, 800);

    } catch (error) {
      if (error.response && error.response.data?.errors) {
        setErrors(error.response.data.errors.quantity || ['Error adding item to cart.']);
      } else {
        setErrors(['Error adding item to cart.']);
      }
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p className="text-gray-700">Loading item details...</p>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p className="text-red-500">Item not found or an error occurred.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      {/* Item Details */}
      <div className="bg-white shadow-md rounded p-6">
        <h2 className="text-2xl font-bold text-gray-800">{item.name}</h2>
        <p className="text-gray-700 mt-4">
          {item.description || 'No description provided.'}
        </p>
        <p className="mt-2 text-gray-800">
          <span className="font-semibold">Price:</span> ${item.price}
        </p>
        <p className="mt-2 text-gray-600">
          <span className="font-semibold">Seller:</span>{' '}
          {item.seller?.username || 'Unknown Seller'}
        </p>
      </div>

      {/* Error Messages */}
      {errors.length > 0 && (
        <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded">
          {errors.map((err, i) => (
            <p key={i} className="mb-1">
              {err}
            </p>
          ))}
        </div>
      )}
      {/* Success Messages */}
      {messages.length > 0 && (
        <div className="bg-green-50 border border-green-200 text-green-700 p-4 rounded">
          {messages.map((msg, i) => (
            <p key={i} className="mb-1">
              {msg}
            </p>
          ))}
        </div>
      )}

      {/* Add to Cart Form */}
      <div className="bg-white shadow-md rounded p-6">
        <form onSubmit={handleAddToCart} className="space-y-4">
          <div>
            <label className="block mb-1 font-semibold text-gray-700">
              Quantity:
            </label>
            <input
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              className="w-full border rounded px-3 py-2"
              required
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white font-semibold rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Add to Cart
          </button>
        </form>
      </div>
    </div>
  );
}

export default ItemDetail;