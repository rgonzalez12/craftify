import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

// Helper to parse a JWT and extract payload data (like user_id)
function parseJwt(token) {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace('-', '+').replace('_', '/');
    return JSON.parse(window.atob(base64));
  } catch (error) {
    return null;
  }
}

function MyItems() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // Extract user ID from the token stored in localStorage.
  const token = localStorage.getItem('token');
  let userId = null;
  if (token) {
    const payload = parseJwt(token);
    userId = payload?.user_id || payload?.sub || null;
  }

  // Fetch items once, then filter to only show the user’s own items
  useEffect(() => {
    api.get('items/')
      .then(response => {
        if (userId) {
          // Filter by comparing item.seller (the seller_id) to userId
          const userItems = response.data.filter(item => item.seller === userId);
          setItems(userItems);
        } else {
          // If not logged in or no userId, we can show an empty list for "My Items"
          setItems([]);
        }
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, [userId]);

  function handleDelete(id) {
    if (!window.confirm('Are you sure you want to delete this item?')) return;
    api.delete(`items/${id}/`)
      .then(() => {
        setItems(prev => prev.filter(item => item.id !== id));
        alert('Item deleted successfully.');
      })
      .catch(() => alert('Error deleting item.'));
  }

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <h1>My Items</h1>
      <Link to="/items/create">Create New Item</Link>
      {items.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Price</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map(item => (
              <tr key={item.id}>
                <td>{item.name}</td>
                <td>${item.price}</td>
                <td>
                  <Link to={`/items/${item.id}/edit`}>Edit</Link>{' '}
                  <button onClick={() => handleDelete(item.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No items found.</p>
      )}
    </div>
  );
}

export default MyItems;