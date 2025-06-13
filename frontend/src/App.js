import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import SellForm from './components/SellForm';
import Transactions from './components/Transactions';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import ItemsList from './pages/ItemsList';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);

    const interval = setInterval(() => {
      const token = localStorage.getItem('token');
      setIsLoggedIn(!!token);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <Router>
      <Navbar isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
      <div className="container mt-3">
        <Routes>
          <Route path="/" element={<ItemsList />} />
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

          <Route path="*" element={<h2>Page not found</h2>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
