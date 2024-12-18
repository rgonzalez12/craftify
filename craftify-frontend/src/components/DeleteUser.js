import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../services/api';

function DeleteUser() {
  const { id } = useParams();
  const navigate = useNavigate();

  function handleDelete(e) {
    e.preventDefault();
    api.delete(`users/${id}/`)
      .then(() => {
        alert('User deleted successfully.');
        navigate('/users');
      })
      .catch(() => {
        alert('Error deleting user.');
      });
  }

  return (
    <div className="container mx-auto py-8">
      <h2 className="text-2xl font-semibold mb-4">Delete User</h2>
      <p>Are you sure you want to delete your account?</p>
      <form onSubmit={handleDelete}>
        <button 
          type="submit" 
          className="px-4 py-2 bg-red-600 text-white font-semibold rounded hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 mr-4"
        >
          Confirm
        </button>
        <Link 
          to="/users"
          className="px-4 py-2 bg-gray-300 text-gray-800 font-semibold rounded hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500"
        >
          Cancel
        </Link>
      </form>
    </div>
  );
}

export default DeleteUser;