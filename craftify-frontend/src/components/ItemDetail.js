import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import api from '../services/api';

function ItemDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { addToCart } = useCart();

  const [item, setItem] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState([]);
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    api.get(`items/${id}/`)
      .then(response => {
        setItem(response.data);
      })
      .catch(error => {
        setErrors(['Error fetching item details.']);
        console.error('Error:', error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);

  const handleAddToCart = async (e) => {
    e.preventDefault();
    setErrors([]);
    setMessages([]);

    if (!isAuthenticated) {
      setErrors(['You must be logged in to add items to cart.']);
      return;
    }

    try {
      const success = await addToCart(id, parseInt(quantity));
      if (success) {
        setMessages(['Item added to cart successfully']);
        setTimeout(() => navigate('/cart'), 800);
      }
    } catch (error) {
      setErrors(['Error adding item to cart. Please try again.']);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!item) return <div>Item not found</div>;

  return (
    <div className="max-w-2xl mx-auto p-4">
      {/* Error Messages */}
      {errors.length > 0 && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded mb-4">
          {errors.map((error, i) => (
            <p key={i} className="mb-1">{error}</p>
          ))}
        </div>
      )}

      {/* Success Messages */}
      {messages.length > 0 && (
        <div className="bg-green-50 border border-green-200 text-green-700 p-4 rounded mb-4">
          {messages.map((msg, i) => (
            <p key={i} className="mb-1">{msg}</p>
          ))}
        </div>
      )}

      {/* Item Details */}
      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        {item.image && (
          <img 
            src={item.image} 
            alt={item.name}
            className="w-full h-64 object-cover"
          />
        )}
        
        <div className="p-6">
          <h1 className="text-2xl font-bold mb-2">{item.name}</h1>
          <p className="text-gray-600 mb-4">{item.description}</p>
          <p className="text-xl font-bold text-green-600 mb-4">
            ${item.price}
          </p>

          {/* Add to Cart Form */}
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
              disabled={!isAuthenticated}
              className={`w-full px-4 py-2 rounded font-semibold ${
                isAuthenticated 
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              {isAuthenticated ? 'Add to Cart' : 'Please Login to Add to Cart'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ItemDetail;