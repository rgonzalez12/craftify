import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';

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
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // Retrieve and parse the JWT token from localStorage
  const token = localStorage.getItem('token');
  let userId = null;
  if (token) {
    const payload = parseJwt(token);
    userId = payload?.user_id || payload?.sub || null; 
  }

  // If there's no userId, redirect to /login
  useEffect(() => {
    if (!userId) {
      navigate('/login');
      return; // Stop here to avoid calling items API for unauthenticated user
    }

    api.get('items/')
      .then(response => {
        const userItems = response.data.filter(item => item.seller === userId);
        setItems(userItems);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [userId, navigate]);

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