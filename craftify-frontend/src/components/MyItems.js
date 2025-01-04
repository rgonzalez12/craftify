import React, { useEffect, useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';

function MyItems() {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated, userId } = useContext(AuthContext);

  useEffect(() => {
    // If user is not authenticated, redirect to /login
    if (!isAuthenticated || !userId) {
      navigate('/login');
      return;
    }
    // Otherwise fetch items and filter by userId
    api.get('items/')
      .then(response => {
        const userItems = response.data.filter(item => item.seller === userId);
        setItems(userItems);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [isAuthenticated, userId, navigate]);

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