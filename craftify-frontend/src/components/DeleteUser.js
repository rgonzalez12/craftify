import React, { useContext, useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';

function DeleteUser() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, userId, logout, authLoading } = useContext(AuthContext);

  const [error, setError] = useState('');

  useEffect(() => {
    if (authLoading) return;

    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (parseInt(id, 10) !== userId) {
      setError('You are not authorized to delete this account.');
    }
  }, [id, userId, isAuthenticated, authLoading, navigate]);

  async function handleDelete(e) {
    e.preventDefault();
    setError('');

    if (parseInt(id, 10) !== userId) {
      setError('You are not authorized to delete this account.');
      return;
    }

    try {
      await api.delete(`users/${id}/`);
      // After successful deletion, log out and redirect to home
      logout(); // This clears token and sets userId to null
      navigate('/');
    } catch (err) {
      console.error('Error deleting user:', err);
      setError('Error deleting user. Please try again.');
    }
  }

  // If we're still loading auth info, or if there's an error
  if (authLoading) {
    return (
      <div className="container mx-auto py-8">
        <p>Checking authorization...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-8">
        <p className="text-red-500 mb-4">{error}</p>
        <Link
          to="/"
          className="px-4 py-2 bg-gray-300 text-gray-800 font-semibold rounded hover:bg-gray-400"
        >
          Go Home
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <h2 className="text-2xl font-semibold mb-4">Delete User</h2>
      <p>Are you sure you want to delete your account?</p>
      <form onSubmit={handleDelete} className="mt-4">
        <button
          type="submit"
          className="px-4 py-2 bg-red-600 text-white font-semibold rounded hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 mr-4"
        >
          Confirm
        </button>
        <Link
          to="/"
          className="px-4 py-2 bg-gray-300 text-gray-800 font-semibold rounded hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500"
        >
          Cancel
        </Link>
      </form>
    </div>
  );
}

export default DeleteUser;