import React, { useState } from 'react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';

function CreateItem() {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const navigate = useNavigate();

  function handleSubmit(e) {
    e.preventDefault();
    const data = {
      name,
      price: parseFloat(price),
      quantity: 1
    };
    api.post('items/', data)
      .then(() => {
        alert('Item created successfully!');
        navigate('/'); // navigate back to MyItems page
      })
      .catch(() => alert('Error creating item.'));
  }

  return (
    <form onSubmit={handleSubmit}>
      <h1>Create New Item</h1>
      <div>
        <label>Item Name:</label>
        <input value={name} onChange={e => setName(e.target.value)} required />
      </div>
      <div>
        <label>Price:</label>
        <input value={price} onChange={e => setPrice(e.target.value)} type="number" step="0.01" required />
      </div>
      <button type="submit">Create</button>
    </form>
  );
}

export default CreateItem;
