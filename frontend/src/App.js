import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

import InventoryForm from './components/InventoryForm';
import Navbar from './components/Navbar';
import SellForm from './components/SellForm';
import Transactions from './components/Transactions';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import ItemsList from './pages/ItemsList';
import Home from './pages/Home';
import QuotationForm from './components/QuotationForm'; // ✅ Import Quotation component

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);

    const interval = setInterval(() => {
      const currentToken = localStorage.getItem('token');
      setIsLoggedIn(!!currentToken);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <Router>
      <Navbar isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />

      <div className="container mt-3">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} />} />
          <Route path="/register" element={<Register />} />

          <Route
            path="/items"
            element={
              <ProtectedRoute isLoggedIn={isLoggedIn}>
                <ItemsList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/sell"
            element={
              <ProtectedRoute isLoggedIn={isLoggedIn}>
                <SellForm />
              </ProtectedRoute>
            }
          />
          <Route
            path="/transactions"
            element={
              <ProtectedRoute isLoggedIn={isLoggedIn}>
                <Transactions />
              </ProtectedRoute>
            }
          />
          <Route
            path="/inventory-form"
            element={
              <ProtectedRoute isLoggedIn={isLoggedIn}>
                <InventoryForm />
              </ProtectedRoute>
            }
          />

          {/* ✅ Add quotation route */}
          <Route
            path="/quotation"
            element={
              <ProtectedRoute isLoggedIn={isLoggedIn}>
                <QuotationForm />
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<h2 className="text-center mt-5">Page not found</h2>} />
        </Routes>
      </div>

      <ToastContainer
        position="bottom-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
    </Router>
  );
}

export default App;
