import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/api';
import heroImage from '../assets/hero.jpg';

function Register() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/register', { username, password });
      setMessage('Registration successful! You can now log in.');
      setUsername('');
      setPassword('');
    } catch (err) {
      setMessage('Registration failed. Username may already exist.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center vh-100"
      style={{
        backgroundImage: `linear-gradient(rgba(0,0,0,0.55), rgba(0,0,0,0.55)), url(${heroImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div
        className="card p-5 shadow-sm"
        style={{
          maxWidth: '450px',
          width: '100%',
          borderRadius: '15px',
          backgroundColor: 'rgba(248,249,250,0.95)',
        }}
      >
        <h2 className="text-center mb-4 fw-bold" style={{ color: '#343a40' }}>
          Register
        </h2>

        {message && (
          <div
            className={`alert text-center ${
              message.includes('successful') ? 'alert-success' : 'alert-danger'
            }`}
          >
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="form-label fw-semibold">Username</label>
            <input
              type="text"
              className="form-control"
              value={username}
              onChange={e => setUsername(e.target.value)}
              required
              minLength={3}
            />
          </div>

          <div className="mb-4">
            <label className="form-label fw-semibold">Password</label>
            <input
              type="password"
              className="form-control"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              minLength={6}
            />
            <small className="text-muted">Password must be at least 6 characters.</small>
          </div>

          <button
            type="submit"
            className="btn btn-primary w-100 fw-bold py-2"
            disabled={loading}
          >
            {loading ? 'Registering...' : 'Register'}
          </button>
        </form>

        <p className="text-center mt-4" style={{ color: '#6c757d' }}>
          Already have an account?{' '}
          <span
            className="text-primary"
            style={{ cursor: 'pointer', textDecoration: 'underline' }}
            onClick={() => navigate('/login')}
          >
            Login
          </span>
        </p>
      </div>
    </div>
  );
}

export default Register;
