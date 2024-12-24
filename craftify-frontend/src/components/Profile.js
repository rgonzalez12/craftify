import React, { useEffect, useState, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';

function Profile() {
  const { id } = useParams();
  const { isAuthenticated, userId } = useContext(AuthContext);

  const [profileUser, setProfileUser] = useState(null);
  const [items, setItems] = useState([]);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // True if the logged-in user’s ID matches the param
  const isOwner = isAuthenticated && parseInt(id, 10) === userId;

  useEffect(() => {
    setLoading(true);
    setError(null);

    // Fetch user, items, and comments
    async function fetchProfileData() {
      try {
        const userResp = await api.get(`user/${id}/`);
        setProfileUser(userResp.data);

        const itemsResp = await api.get('items/');
        const userItems = itemsResp.data.filter(
          (item) => item.seller === parseInt(id, 10)
        );
        setItems(userItems);

        try {
          const commentsResp = await api.get(`user/${id}/comments/`);
          setComments(commentsResp.data);
        } catch (err) {
          if (err.response && err.response.status === 404) {
            setComments([]);
          } else {
            console.error('Error fetching comments:', err);
            setComments([]);
          }
        }
      } catch (err) {
        console.error('Error loading profile info:', err);
        setError('Error loading profile information.');
      } finally {
        setLoading(false);
      }
    }

    fetchProfileData();
  }, [id]);

  // Only logged-in users can leave a new comment
  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      const resp = await api.post(`user/${id}/comments/`, {
        comment: newComment,
      });
      // resp.data = newly created comment
      setComments((prev) => [...prev, resp.data]);
      setNewComment('');
    } catch (err) {
      console.error('Error posting comment:', err);
      setError('Error posting comment.');
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p className="text-gray-700">Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  if (!profileUser) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p className="text-gray-700">User not found.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Profile Header Section */}
      <div className="bg-white shadow-md rounded p-6 flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6">
        {/* Profile Picture */}
        <div className="w-32 h-32 flex-shrink-0">
          {profileUser.profile_picture ? (
            <img
              src={profileUser.profile_picture}
              alt="Profile"
              className="w-32 h-32 object-cover rounded-full"
            />
          ) : (
            <div className="w-32 h-32 bg-gray-200 rounded-full flex items-center justify-center text-gray-600">
              No Image
            </div>
          )}
        </div>

        {/* Basic Info */}
        <div>
          <h2 className="text-2xl font-bold text-gray-800">
            {profileUser.username || 'Unknown User'}
          </h2>
          <p className="text-gray-600 mt-2">
            {profileUser.bio || 'No bio available.'}
          </p>
          <p className="text-gray-500 mt-2">
            {profileUser.country_code
              ? `From: ${profileUser.country_code}`
              : 'No location info.'}
          </p>

          {isOwner && (
            <div className="mt-4">
              <Link to={`/profile/${id}/edit`} className="text-blue-500 underline">
                Edit Profile
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Items for Sale */}
      <div className="bg-white shadow-md rounded p-6">
        <h3 className="text-xl font-semibold mb-4">Items for Sale</h3>
        {items.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {items.map((item) => (
              <Link
                key={item.id}
                to={`/items/${item.id}`}
                className="block border rounded p-4 hover:shadow-md transition"
              >
                <h4 className="text-lg font-medium text-gray-800 mb-2">
                  {item.name}
                </h4>
                <p className="text-gray-600 mb-2">
                  ${item.price} {item.quantity ? `• Qty: ${item.quantity}` : ''}
                </p>
                {item.image ? (
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-32 object-cover rounded"
                  />
                ) : (
                  <div className="w-full h-32 bg-gray-200 rounded flex items-center justify-center text-gray-500">
                    No Image
                  </div>
                )}
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-gray-600">No items found for this user.</p>
        )}
      </div>

      {/* Comments/Reviews */}
      <div className="bg-white shadow-md rounded p-6">
        <h3 className="text-xl font-semibold mb-4">Comments</h3>
        {comments.length > 0 ? (
          <ul className="space-y-4">
            {comments.map((comment, index) => (
              <li key={index} className="border rounded p-3">
                <p className="text-gray-700">{comment.text || comment.comment}</p>
                <p className="text-sm text-gray-500 mt-2">
                  By: {comment.user_name || 'Anonymous'}
                </p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-600">No comments yet.</p>
        )}

        {/* Only logged-in users can post a comment */}
        {isAuthenticated ? (
          <form onSubmit={handleCommentSubmit} className="mt-6">
            <label className="block mb-2 text-gray-600">Leave a Comment</label>
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="w-full p-2 border rounded mb-2"
              placeholder="Write something..."
            />
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Post Comment
            </button>
          </form>
        ) : (
          <p className="text-gray-500 mt-4">Log in to leave a comment.</p>
        )}
      </div>
    </div>
  );
}

export default Profile;