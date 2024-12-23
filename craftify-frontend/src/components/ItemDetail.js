import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';

function ItemDetail() {
  const { id } = useParams(); 
  const [item, setItem] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [errors, setErrors] = useState([]);
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    api.get(`items/${id}/`)
      .then(response => {
        setItem(response.data);
      })
      .catch(() => {
        setErrors(['Error fetching item details.']);
      });
  }, [id]);

  function handleAddToCart(e) {
    e.preventDefault();
    setErrors([]);
    setMessages([]);

    const data = { quantity: parseInt(quantity, 10) };
    api.post(`cart/add/${id}`, data)
      .then(() => {
        setMessages(['Item added to cart successfully.']);
      })
      .catch(error => {
        if (error.response && error.response.data && error.response.data.errors) {
          setErrors(error.response.data.errors.quantity || ['Error adding item to cart.']);
        } else {
          setErrors(['Error adding item to cart.']);
        }
      });
  }

  if (item === null) {
    return <p>Loading item details...</p>;
  }

  return (
    <div className="container">
      <h2>{item.name}</h2>
      <p>{item.description}</p>
      <p>Price: ${item.price}</p>
      <p>Seller: {item.seller.username}</p>
      {errors.length > 0 && (
        <div className="error">
          {errors.map((err, i) => <p key={i}>{err}</p>)}
        </div>
      )}
      {messages.length > 0 && (
        <ul className="messages">
          {messages.map((msg, i) => (
            <li key={i}>{msg}</li>
          ))}
        </ul>
      )}
      <form onSubmit={handleAddToCart} className="space-y-6 bg-white p-6 rounded-lg shadow-md">
        <div className="form-group mb-4">
          <label className="block font-semibold text-gray-700 mb-1">Quantity:</label>
          <input
            type="number"
            min="1"
            className="border rounded px-3 py-2 w-full"
            value={quantity}
            onChange={e => setQuantity(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="button px-4 py-2 bg-blue-600 text-white font-semibold rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
          Add to Cart
        </button>
      </form>
    </div>
  );
}

export default ItemDetail;