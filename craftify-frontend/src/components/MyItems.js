import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { Link } from 'react-router-dom';

function MyItems() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('items/') // GET /api/items/
      .then(response => {
        setItems(response.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

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
      <Link to="/create">Create New Item</Link>
      {items.length > 0 ? (
        <table>
          <thead>
            <tr><th>Name</th><th>Price</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {items.map(item => (
              <tr key={item.id}>
                <td>{item.name}</td>
                <td>${item.price}</td>
                <td>
                  <Link to={`/edit/${item.id}`}>Edit</Link>
                  <button onClick={() => handleDelete(item.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : <p>No items found.</p>}
    </div>
  );
}

export default MyItems;