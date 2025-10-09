import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  FaUser,
  FaSignOutAlt,
  FaSignInAlt,
  FaClipboardList,
  FaWarehouse,
  FaCashRegister,
  FaFileInvoiceDollar,
  FaUserPlus
} from 'react-icons/fa';

function Navbar({ isLoggedIn, setIsLoggedIn }) {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [role, setRole] = useState('');

  useEffect(() => {
    if (isLoggedIn) {
      setUsername(localStorage.getItem('username') || '');
      setRole(localStorage.getItem('role') || '');
    }
  }, [isLoggedIn]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('role');
    setIsLoggedIn(false);
    navigate('/login'); 
  };

  const linkStyle = {
    color: '#4a4a4a',       // main link color
    fontWeight: '500',
    fontSize: '1rem',
    transition: 'all 0.3s'
  };

  const linkHoverStyle = {
    color: '#ff6b6b',       // hover color
    textDecoration: 'underline'
  };

  return (
    <nav className="navbar navbar-expand-lg shadow-sm" style={{ backgroundColor: '#f5f7fa' }}>
      <div className="container">
        {/* Brand */}
        <Link
          className="navbar-brand fw-bold"
          to="/"
          style={{
            fontSize: '1.8rem',
            color: '#4a4a4a',
            letterSpacing: '1px',
            fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
          }}
        >
          📚 <span style={{ color: '#ff6b6b' }}>Purlow</span> Agencies
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
          style={{ borderColor: '#ccc' }}
        >
          <span className="navbar-toggler-icon" style={{ filter: 'invert(0.3)' }}></span>
        </button>

        <div className="collapse navbar-collapse justify-content-center" id="navbarNav">
          {/* Centered links */}
          <ul className="navbar-nav mx-auto">
            {isLoggedIn ? (
              <>
                <li className="nav-item">
                  <Link
                    className="nav-link"
                    to="/items"
                    style={linkStyle}
                    onMouseEnter={e => e.target.style.color = linkHoverStyle.color}
                    onMouseLeave={e => e.target.style.color = linkStyle.color}
                  >
                    <FaClipboardList className="me-1" /> Inventory
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    className="nav-link"
                    to="/sell"
                    style={linkStyle}
                    onMouseEnter={e => e.target.style.color = linkHoverStyle.color}
                    onMouseLeave={e => e.target.style.color = linkStyle.color}
                  >
                    <FaCashRegister className="me-1" /> Sales
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    className="nav-link"
                    to="/transactions"
                    style={linkStyle}
                    onMouseEnter={e => e.target.style.color = linkHoverStyle.color}
                    onMouseLeave={e => e.target.style.color = linkStyle.color}
                  >
                    <FaFileInvoiceDollar className="me-1" /> Transactions
                  </Link>
                </li>

                {/* Admin-only links */}
                {role === 'admin' && (
                  <>
                    <li className="nav-item">
                      <Link
                        className="nav-link"
                        to="/inventory-form"
                        style={linkStyle}
                        onMouseEnter={e => e.target.style.color = '#28a745'}
                        onMouseLeave={e => e.target.style.color = linkStyle.color}
                      >
                        <FaWarehouse className="me-1" /> Add Inventory
                      </Link>
                    </li>
                    <li className="nav-item">
                      <Link
                        className="nav-link"
                        to="/quotation"
                        style={linkStyle}
                        onMouseEnter={e => e.target.style.color = '#ffc107'}
                        onMouseLeave={e => e.target.style.color = linkStyle.color}
                      >
                        <FaFileInvoiceDollar className="me-1" /> Quotation
                      </Link>
                    </li>
                  </>
                )}
              </>
            ) : (
              <>
                <li className="nav-item">
                  <Link
                    className="nav-link"
                    to="/login"
                    style={linkStyle}
                    onMouseEnter={e => e.target.style.color = linkHoverStyle.color}
                    onMouseLeave={e => e.target.style.color = linkStyle.color}
                  >
                    <FaSignInAlt className="me-1" /> Login
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    className="nav-link"
                    to="/register"
                    style={linkStyle}
                    onMouseEnter={e => e.target.style.color = linkHoverStyle.color}
                    onMouseLeave={e => e.target.style.color = linkStyle.color}
                  >
                    <FaUserPlus className="me-1" /> Register
                  </Link>
                </li>
              </>
            )}
          </ul>

          {/* User info + logout on far right */}
          {isLoggedIn && (
            <ul className="navbar-nav ms-auto align-items-center">
              <li className="nav-item me-3">
                <span className="nav-link text-dark">
                  <FaUser className="me-1" /> {username}
                </span>
              </li>
              <li className="nav-item">
                <button className="btn btn-sm btn-outline-danger" onClick={handleLogout}>
                  <FaSignOutAlt className="me-1" /> Logout
                </button>
              </li>
            </ul>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
