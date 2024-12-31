import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

function MyOrders() {
  const navigate = useNavigate();
  const { isAuthenticated, authLoading } = useContext(AuthContext);

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filterDays, setFilterDays] = useState(30); // default 30-day filter

  useEffect(() => {
    if (authLoading) return; // Wait until AuthContext finishes loading
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    fetchOrders(filterDays);
  }, [authLoading, isAuthenticated, filterDays, navigate]);

  async function fetchOrders(days) {
    setLoading(true);
    setError('');
    try {
      // We'll assume we can pass a query param ?days=XX to get orders within XX days
      const response = await api.get(`orders/?days=${days}`);
      setOrders(response.data);
    } catch (err) {
      console.error('Error fetching orders:', err);
      setError('Unable to load orders. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  function handleFilterChange(e) {
    // Set the filterDays state, which triggers a re-fetch in useEffect
    setFilterDays(e.target.value);
  }

  if (authLoading || loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p className="text-gray-700">Loading your orders...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p className="text-red-500 mb-4">{error}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">My Orders</h1>

      {/* Filter Section */}
      <div className="mb-4">
        <label className="mr-2 font-medium text-gray-700">Show orders within:</label>
        <select
          value={filterDays}
          onChange={handleFilterChange}
          className="border rounded px-3 py-1 focus:outline-none"
        >
          <option value={30}>Last 30 days</option>
          <option value={60}>Last 60 days</option>
          <option value={90}>Last 90 days</option>
        </select>
      </div>

      {/* Orders Table/List */}
      {orders.length > 0 ? (
        <table className="min-w-full border bg-white rounded shadow-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-4 py-2 text-left font-medium text-gray-700">Order ID</th>
              <th className="px-4 py-2 text-left font-medium text-gray-700">Date</th>
              <th className="px-4 py-2 text-left font-medium text-gray-700">Items</th>
              <th className="px-4 py-2 text-left font-medium text-gray-700">Total</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id} className="border-b hover:bg-gray-50">
                <td className="px-4 py-2 text-gray-700">{order.id}</td>
                <td className="px-4 py-2 text-gray-700">{order.created_at?.slice(0, 10)}</td>
                <td className="px-4 py-2 text-gray-700">
                  {order.items?.map((i) => `${i.quantity}x ${i.name}`).join(', ')}
                </td>
                <td className="px-4 py-2 text-gray-700">{order.total_amount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="text-gray-600">No orders found for the selected date range.</p>
      )}
    </div>
  );
}

export default MyOrders;