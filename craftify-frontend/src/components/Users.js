import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

function Users() {
  // I store users, pagination data (like total pages), and current page
  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const pageSize = 20;

  useEffect(() => {
    fetchUsers(currentPage);
  }, [currentPage]);

  async function fetchUsers(page) {
    setLoading(true);
    setError('');
    try {
      // backend uses query param ?page=1
      // optional support for /api/users/?page=1&page_size=20:
      const response = await api.get(`users/?page=${page}`);
      // response.data = { count, results, next, previous }
      setUsers(response.data.results);
      setTotalCount(response.data.count);
    } catch (err) {
      console.error('Error fetching users:', err);
      setError('Unable to load sellers. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  // Calculate total pages from count & pageSize
  const totalPages = Math.ceil(totalCount / pageSize);

  function handlePageChange(newPage) {
    if (newPage < 1 || newPage > totalPages) return;
    setCurrentPage(newPage);
  }

  // Create a small array of page numbers
  // If totalPages is large, I might consider only show a subset.
  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  if (loading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <p className="text-gray-700">Loading sellers...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-8 px-4">
        <p className="text-red-500 mb-4">{error}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">All Sellers</h1>

      {/* Sellers Grid */}
      {users.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {users.map((user) => (
            <div
              key={user.id}
              className="bg-white rounded shadow-md p-4 flex flex-col items-center"
            >
              {/* If user has a profile_picture field */}
              {user.profile_picture ? (
                <img
                  src={user.profile_picture}
                  alt={user.username}
                  className="w-24 h-24 object-cover rounded-full mb-3"
                />
              ) : (
                <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mb-3">
                  <span className="text-gray-500">No Image</span>
                </div>
              )}

              <h2 className="text-lg font-semibold text-gray-800">
                {user.username}
              </h2>
              {/* Possibly user bio or short info */}
              {user.bio && (
                <p className="text-gray-600 text-center mt-2 text-sm line-clamp-3">
                  {user.bio}
                </p>
              )}
              {/* Link to user profile */}
              <Link
                to={`/profile/${user.id}`}
                className="mt-4 inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-sm"
              >
                View Profile
              </Link>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-600">No sellers found.</p>
      )}

      {/* Pagination Bar */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center space-x-2 mt-6">
          {/* Previous Button */}
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            className={`px-3 py-1 rounded ${
              currentPage === 1
                ? 'bg-gray-300 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
            disabled={currentPage === 1}
          >
            Prev
          </button>

          {/* Page Numbers (If you want direct page links) */}
          <div className="space-x-1">
            {pageNumbers.map((num) => (
              <button
                key={num}
                onClick={() => handlePageChange(num)}
                className={`px-3 py-1 rounded focus:outline-none ${
                  num === currentPage
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 hover:bg-gray-200'
                }`}
              >
                {num}
              </button>
            ))}
          </div>

          {/* Next Button */}
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            className={`px-3 py-1 rounded ${
              currentPage === totalPages
                ? 'bg-gray-300 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}

export default Users;