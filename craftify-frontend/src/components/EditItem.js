import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useParams, useNavigate } from 'react-router-dom';

function EditItem() {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    api.get(`items/${id}/`)
      .then(response => setItem(response.data))
      .catch(() => alert('Error fetching item'));
  }, [id]);

  function handleSubmit(e) {
    e.preventDefault();
    const data = {
      name: item.name,
      price: parseFloat(item.price),
      quantity: item.quantity
    };
    api.put(`items/${id}/`, data)
      .then(() => {
        alert('Item updated successfully.');
        navigate('/');
      })
      .catch(() => alert('Error updating item.'));
  }

  if (!item) return <p>Loading...</p>;

  return (
    <form onSubmit={handleSubmit}>
      <h1>Edit Item</h1>
      <div>
        <label>Name:</label>
        <input
          value={item.name}
          onChange={e => setItem({ ...item, name: e.target.value })}
          required
        />
      </div>
      <div>
        <label>Price:</label>
        <input
          value={item.price}
          onChange={e => setItem({ ...item, price: e.target.value })}
          type="number"
          step="0.01"
          required
        />
      </div>
      <button type="submit">Save Changes</button>
    </form>
  );
}

export default EditItem;