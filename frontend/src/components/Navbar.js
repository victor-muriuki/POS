import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaUser, FaSignOutAlt, FaSignInAlt, FaClipboardList, FaWarehouse, FaCashRegister, FaFileInvoiceDollar, FaUserPlus } from 'react-icons/fa';

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
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary shadow-sm">
      <div className="container">
        <Link className="navbar-brand fw-bold text-white" to="/">📚 Bookshop</Link>

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
                <li className="nav-item me-2 text-white">
                  <span className="nav-link active">
                    <FaUser className="me-1" /> Welcome, {username}
                  </span>
                </li>
                <li className="nav-item">
                  <Link className="nav-link text-white" to="/items">
                    <FaClipboardList className="me-1" /> Inventory
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link text-white" to="/sell">
                    <FaCashRegister className="me-1" /> Sales
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link text-white" to="/transactions">
                    <FaFileInvoiceDollar className="me-1" /> Transactions
                  </Link>
                </li>

                {role === 'admin' && (
                  <>
                    <li className="nav-item">
                      <Link className="nav-link text-warning" to="/inventory-form">
                        <FaWarehouse className="me-1" /> Manage Inventory
                      </Link>
                    </li>
                    <li className="nav-item">
                      <Link className="nav-link text-warning" to="/quotation">
                        <FaFileInvoiceDollar className="me-1" /> Quotation
                      </Link>
                    </li>
                  </>
                )}

                <li className="nav-item ms-3">
                  <button className="btn btn-sm btn-danger" onClick={handleLogout}>
                    <FaSignOutAlt className="me-1" /> Logout
                  </button>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <Link className="nav-link text-white" to="/login">
                    <FaSignInAlt className="me-1" /> Login
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link text-white" to="/register">
                    <FaUserPlus className="me-1" /> Register
                  </Link>
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
