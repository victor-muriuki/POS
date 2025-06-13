import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Navbar({ isLoggedIn, setIsLoggedIn }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    navigate('/');
  };

  return (
    <nav className="navbar navbar-expand navbar-light bg-light mb-3">
      <div className="container">
        <Link className="navbar-brand" to="/">Bookshop</Link>
        <div>
          {isLoggedIn ? (
            <>
              <Link className="nav-link d-inline" to="/items">Items</Link>
              <button className="btn btn-link nav-link d-inline" onClick={handleLogout}>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link className="nav-link d-inline" to="/login">Login</Link>
              <Link className="nav-link d-inline" to="/register">Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
