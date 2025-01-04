import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

function Layout({ children }) {
  const { isAuthenticated, userId, logout } = useContext(AuthContext);

  return (
    <div>
      <header>
        <h1>Craftify: Where Handmade Finds a Home</h1>
        <nav>
          <ul className="flex space-x-4">
            <li><Link to="/">Home</Link></li>
            <li><Link to="/users">Merchant Directory</Link></li>
            {isAuthenticated ? (
              <>
                <li><Link to="/items">My Items</Link></li>
                <li><Link to="/cart">My Cart</Link></li>
                <li><Link to="/myorders">My Orders</Link></li>
                {userId && (
                  <>
                    <li><Link to={`/profile/${userId}/edit`}>Edit Profile</Link></li>
                    <li><Link to={`/delete_user/${userId}`}>Delete Account</Link></li>
                  </>
                )}
                <li>
                  <button onClick={logout}>Logout</button>
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