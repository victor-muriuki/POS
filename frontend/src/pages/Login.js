import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import api from '../api/api';
import heroImage from '../assets/hero.jpg'; // Make sure you have a hero image

function Login({ setIsLoggedIn }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (location.state?.message) setMessage(location.state.message);
  }, [location.state]);

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const res = await api.post('/login', { username, password });

      localStorage.setItem('token', res.data.access_token);
      localStorage.setItem('username', res.data.username);
      localStorage.setItem('role', res.data.role);

      setIsLoggedIn(true);
      setMessage('Login successful!');

      const from = location.state?.from?.pathname || '/';
      navigate(from, { replace: true });
    } catch (err) {
      setMessage('Login failed. Check credentials.');
    }
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center vh-100"
      style={{
        backgroundImage: `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url(${heroImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="card p-4 shadow" style={{ width: '350px', borderRadius: '10px' }}>
        <h3 className="text-center mb-4">Login</h3>
        {message && <div className="alert alert-info">{message}</div>}
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label>Username</label>
            <input
              type="text"
              className="form-control"
              value={username}
              onChange={e => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label>Password</label>
            <input
              type="password"
              className="form-control"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary w-100">
            Login
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
