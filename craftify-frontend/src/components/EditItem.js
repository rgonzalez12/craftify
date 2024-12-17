import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api'; // your axios instance

function EditItem() {
  const { id } = useParams();          // Get the item id from URL params
  const navigate = useNavigate();
  
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [quantity, setQuantity] = useState('');
  const [category, setCategory] = useState('');
  // If you have image handling, you'd track it here as well
  // const [image, setImage] = useState(null);

  useEffect(() => {
    // Fetch the current item data
    api.get(`items/${id}/`)
      .then(response => {
        const item = response.data;
        setName(item.name);
        setDescription(item.description || '');
        setPrice(item.price || '');
        setQuantity(item.quantity || '');
        setCategory(item.category || '');
        // If image is provided by the API, handle it accordingly.
      })
      .catch(() => alert('Error fetching item data.'));
  }, [id]);

  function handleSubmit(e) {
    e.preventDefault();
    const data = {
      name,
      description,
      price: parseFloat(price),
      quantity: parseInt(quantity, 10),
      category
      // If image upload is needed, handle FormData or the image field separately.
    };

    api.put(`items/${id}/`, data)
      .then(() => {
        alert('Item updated successfully.');
        navigate('/items'); // redirect back to items list or wherever you prefer
      })
      .catch(() => alert('Error updating item.'));
  }

  function handleDelete() {
    if (window.confirm('Are you sure you want to delete this item?')) {
      api.delete(`items/${id}/`)
        .then(() => {
          alert('Item deleted successfully.');
          navigate('/items');
        })
        .catch(() => alert('Error deleting item.'));
    }
  }

  return (
    <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Edit Item</h1>

      <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow-md">
        <div className="flex flex-col">
          <label className="mb-1 font-semibold text-gray-700">Name</label>
          <input
            className="border rounded px-3 py-2"
            value={name}
            onChange={e => setName(e.target.value)}
            required
          />
        </div>

        <div className="flex flex-col">
          <label className="mb-1 font-semibold text-gray-700">Description</label>
          <textarea
            className="border rounded px-3 py-2"
            value={description}
            onChange={e => setDescription(e.target.value)}
          />
        </div>

        <div className="flex flex-col">
          <label className="mb-1 font-semibold text-gray-700">Price</label>
          <input
            type="number"
            step="0.01"
            className="border rounded px-3 py-2"
            value={price}
            onChange={e => setPrice(e.target.value)}
            required
          />
        </div>

        <div className="flex flex-col">
          <label className="mb-1 font-semibold text-gray-700">Quantity</label>
          <input
            type="number"
            className="border rounded px-3 py-2"
            value={quantity}
            onChange={e => setQuantity(e.target.value)}
            required
          />
        </div>

        <div className="flex flex-col">
          <label className="mb-1 font-semibold text-gray-700">Category</label>
          <input
            className="border rounded px-3 py-2"
            value={category}
            onChange={e => setCategory(e.target.value)}
          />
        </div>

        {/* If you have an image field:
        <div className="flex flex-col">
          <label className="mb-1 font-semibold text-gray-700">Image</label>
          <input
            type="file"
            onChange={e => setImage(e.target.files[0])}
          />
        </div>
        */}

        <button
          type="submit"
          className="inline-block bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Save Changes
        </button>
      </form>

      <div className="mt-8 border-t pt-4">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Delete Item</h2>
        <p className="text-gray-600 mb-4">
          If you no longer need this item, you can remove it from the store.
        </p>
        <button
          onClick={handleDelete}
          className="inline-block bg-red-600 text-white px-6 py-2 rounded hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
        >
          Delete This Item
        </button>
      </div>
    </div>
  );
}

export default EditItem;