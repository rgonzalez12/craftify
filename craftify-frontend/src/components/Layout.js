import React from 'react';
import { Link } from 'react-router-dom'; // for navigation in React
// If you have authentication info, you'd get it from context or a global state
// e.g., const { user, isAuthenticated } = useAuth(); (just an example)
const isAuthenticated = false; // Replace with real auth logic
const userId = 1; // Replace with actual user ID from auth context or state

function Layout({ children }) {
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
                <li><Link to={`/profile/${userId}`}>Edit Profile</Link></li>
                <li><Link to={`/delete_user/${userId}`}>Delete Account</Link></li>
                <li><Link to="/logout">Logout</Link></li>
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