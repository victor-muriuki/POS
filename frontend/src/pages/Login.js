import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import api from '../api/api';
import heroImage from '../assets/hero.jpg';

function Login({ setIsLoggedIn }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (location.state?.message) setMessage(location.state.message);
  }, [location.state]);

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post('/login', { username, password });

      localStorage.setItem('token', res.data.access_token);
      localStorage.setItem('username', res.data.username);
      localStorage.setItem('role', res.data.role);

      setIsLoggedIn(true);
      setMessage('Login successful!');
      setUsername('');
      setPassword('');

      const from = location.state?.from?.pathname || '/';
      navigate(from, { replace: true });
    } catch (err) {
      setMessage('Login failed. Check credentials.');
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
        backgroundRepeat: 'no-repeat',
        fontFamily: "'Poppins', sans-serif",
      }}
    >
      <div
        className="card p-5 shadow-lg border-0"
        style={{
          maxWidth: '420px',
          width: '100%',
          borderRadius: '20px',
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(6px)',
        }}
      >
        <h2
          className="text-center mb-4 fw-bold"
          style={{ color: '#343a40', letterSpacing: '1px' }}
        >
          Welcome Back 👋
        </h2>

        {message && (
          <div
            className={`alert text-center py-2 fw-semibold ${
              message.includes('successful')
                ? 'alert-success'
                : 'alert-danger'
            }`}
            style={{ borderRadius: '8px' }}
          >
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="form-label fw-semibold text-muted">
              Username
            </label>
            <input
              type="text"
              className="form-control p-3"
              value={username}
              onChange={e => setUsername(e.target.value)}
              required
              style={{
                borderRadius: '10px',
                border: '1px solid #ced4da',
                transition: 'all 0.3s ease',
              }}
              onFocus={e =>
                (e.target.style.border = '1px solid #007bff')
              }
              onBlur={e =>
                (e.target.style.border = '1px solid #ced4da')
              }
            />
          </div>

          <div className="mb-4">
            <label className="form-label fw-semibold text-muted">
              Password
            </label>
            <input
              type="password"
              className="form-control p-3"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              style={{
                borderRadius: '10px',
                border: '1px solid #ced4da',
                transition: 'all 0.3s ease',
              }}
              onFocus={e =>
                (e.target.style.border = '1px solid #007bff')
              }
              onBlur={e =>
                (e.target.style.border = '1px solid #ced4da')
              }
            />
          </div>

          <button
            type="submit"
            className="btn w-100 fw-bold py-3"
            disabled={loading}
            style={{
              backgroundColor: '#007bff',
              border: 'none',
              color: 'white',
              borderRadius: '10px',
              transition: 'background-color 0.3s ease',
            }}
            onMouseEnter={e =>
              (e.target.style.backgroundColor = '#0056b3')
            }
            onMouseLeave={e =>
              (e.target.style.backgroundColor = '#007bff')
            }
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <p
          className="text-center mt-4"
          style={{ color: '#6c757d', fontSize: '0.95rem' }}
        >
          Don't have an account?{' '}
          <span
            className="fw-semibold"
            style={{
              color: '#007bff',
              cursor: 'pointer',
              textDecoration: 'underline',
            }}
            onClick={() => navigate('/register')}
          >
            Register
          </span>
        </p>
      </div>
    </div>
  );
}

export default Login;
