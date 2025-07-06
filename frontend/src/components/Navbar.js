import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Navbar({ isLoggedIn, setIsLoggedIn }) {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [role, setRole] = useState('');

  useEffect(() => {
    if (isLoggedIn) {
      const storedUsername = localStorage.getItem('username');
      const storedRole = localStorage.getItem('role');
      setUsername(storedUsername || '');
      setRole(storedRole || '');
    }
  }, [isLoggedIn]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('role');
    setIsLoggedIn(false);
    navigate('/');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light shadow-sm">
      <div className="container">
        <Link className="navbar-brand fw-bold" to="/">Bookshop</Link>

        {/* Toggle button for mobile view */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse justify-content-end" id="navbarNav">
          <ul className="navbar-nav align-items-center">
            {isLoggedIn ? (
              <>
                <li className="nav-item">
                  <span className="nav-link text-primary">Welcome, {username}!</span>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/items">Inventory</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/sell">Make Sales</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/transactions">Transactions</Link>
                </li>

                {/* ✅ Admin-only links */}
                {role === 'admin' && (
                  <>
                    <li className="nav-item">
                      <Link className="nav-link" to="/inventory-form">Inventory Management</Link>
                    </li>
                    <li className="nav-item">
                      <Link className="nav-link" to="/quotation">Generate Quotation</Link>
                    </li>
                  </>
                )}

                <li className="nav-item">
                  <button className="btn btn-outline-danger ms-3" onClick={handleLogout}>
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/login">Login</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/register">Register</Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
