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
  FaUserPlus,
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
    color: '#2b2b2b',
    fontWeight: '500',
    fontSize: '1rem',
    transition: 'all 0.3s',
    padding: '0.5rem 0.8rem',
    borderRadius: '8px',
  };

  const linkHover = (e, color) => {
    e.target.style.color = color;
    e.target.style.backgroundColor = 'rgba(0,0,0,0.05)';
  };

  const linkLeave = (e) => {
    e.target.style.color = linkStyle.color;
    e.target.style.backgroundColor = 'transparent';
  };

  return (
    <nav
      className="navbar navbar-expand-lg shadow-sm"
      style={{
        backgroundColor: '#f8f9fb',
        borderBottom: '2px solid #e6e9ef',
      }}
    >
      <div className="container">
        {/* Brand */}
        <Link
          className="navbar-brand fw-bold"
          to="/"
          style={{
            fontSize: '1.8rem',
            color: '#2b2b2b',
            letterSpacing: '0.5px',
            fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
          }}
        >
          📚 <span style={{ color: '#007bff' }}>Purlow</span> Agencies
        </Link>

        {/* Mobile Toggle */}
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
          <ul className="navbar-nav mx-auto">
            {isLoggedIn ? (
              <>
                {/* Common for all logged-in users */}
                <li className="nav-item">
                  <Link
                    className="nav-link"
                    to="/items"
                    style={linkStyle}
                    onMouseEnter={(e) => linkHover(e, '#007bff')}
                    onMouseLeave={linkLeave}
                  >
                    <FaClipboardList className="me-1" /> Inventory
                  </Link>
                </li>

                <li className="nav-item">
                  <Link
                    className="nav-link"
                    to="/sell"
                    style={linkStyle}
                    onMouseEnter={(e) => linkHover(e, '#28a745')}
                    onMouseLeave={linkLeave}
                  >
                    <FaCashRegister className="me-1" /> Sell
                  </Link>
                </li>

                <li className="nav-item">
                  <Link
                    className="nav-link"
                    to="/inventory-form"
                    style={linkStyle}
                    onMouseEnter={(e) => linkHover(e, '#17a2b8')}
                    onMouseLeave={linkLeave}
                  >
                    <FaWarehouse className="me-1" /> Add Inventory
                  </Link>
                </li>

                {/* Admin-only links */}
                {role === 'admin' && (
                  <>
                    <li className="nav-item">
                      <Link
                        className="nav-link"
                        to="/transactions"
                        style={linkStyle}
                        onMouseEnter={(e) => linkHover(e, '#6f42c1')}
                        onMouseLeave={linkLeave}
                      >
                        <FaFileInvoiceDollar className="me-1" /> Transactions
                      </Link>
                    </li>

                    <li className="nav-item">
                      <Link
                        className="nav-link"
                        to="/quotation"
                        style={linkStyle}
                        onMouseEnter={(e) => linkHover(e, '#ffc107')}
                        onMouseLeave={linkLeave}
                      >
                        <FaFileInvoiceDollar className="me-1" /> Quotation
                      </Link>
                    </li>
                  </>
                )}
              </>
            ) : (
              <>
                {/* Guest links */}
                <li className="nav-item">
                  <Link
                    className="nav-link"
                    to="/login"
                    style={linkStyle}
                    onMouseEnter={(e) => linkHover(e, '#ff6b6b')}
                    onMouseLeave={linkLeave}
                  >
                    <FaSignInAlt className="me-1" /> Login
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    className="nav-link"
                    to="/register"
                    style={linkStyle}
                    onMouseEnter={(e) => linkHover(e, '#20c997')}
                    onMouseLeave={linkLeave}
                  >
                    <FaUserPlus className="me-1" /> Register
                  </Link>
                </li>
              </>
            )}
          </ul>

          {/* User info + Logout */}
          {isLoggedIn && (
            <ul className="navbar-nav ms-auto align-items-center">
              <li className="nav-item me-3">
                <span className="nav-link text-dark fw-semibold">
                  <FaUser className="me-1 text-primary" /> {username}
                </span>
              </li>
              <li className="nav-item">
                <button
                  className="btn btn-sm btn-outline-danger rounded-pill fw-semibold px-3"
                  onClick={handleLogout}
                >
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
