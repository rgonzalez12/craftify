import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function parseJwt(token) {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace('-', '+').replace('_', '/');
    return JSON.parse(window.atob(base64));
  } catch (error) {
    return null;
  }
}

function Layout({ children }) {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
      const payload = parseJwt(token);
      if (payload) {
        // Adjust depending on if JWT has a different field name for user ID, e.g. "sub" or "user_id"
        setUserId(payload.user_id || payload.sub || null);
      }
    } else {
      setIsAuthenticated(false);
      setUserId(null);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    setUserId(null);
    navigate('/login');
  };

  return (
    <div>
      <header>
        <h1>Craftify: Where Handmade Finds a Home</h1>
        <nav>
          <ul className="flex space-x-4">
            <li><Link to="/">Home</Link></li>
            <li><Link to="/users">Seller List</Link></li>
            {isAuthenticated ? (
              <>
                <li><Link to="/cart">My Cart</Link></li>
                <li><Link to="/items">My Items for Sale</Link></li>
                {userId && (
                  <>
                    <li><Link to={`/profile/${userId}`}>Edit Profile</Link></li>
                    <li><Link to={`/delete_user/${userId}`}>Delete Account</Link></li>
                  </>
                )}
                <li>
                  {/* Instead of a <Link> for logout, use a button or onClick */}
                  <button 
                    onClick={handleLogout}
                    className="px-3 py-1 bg-red-600 text-white rounded"
                  >
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <>
                <li><Link to="/signup">Sign Up</Link></li>
                <li><Link to="/login">Login</Link></li>
              </>
            )}
          </ul>
        </nav>
      </header>
      <main>
        {children}
      </main>
      <footer>
        <p>&copy; 2023 Craftify</p>
      </footer>
    </div>
  );
}

export default Layout;