import React, { useState } from 'react';
import api from '../api/api';

function Register() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      await api.post('/register', { username, password });
      setMessage('Registration successful! You can now log in.');
    } catch (err) {
      setMessage('Registration failed. Username may already exist.');
    }
  };

  return (
    <div className="container">
      <h2>Register</h2>
      <form onSubmit={handleSubmit} style={{ maxWidth: '400px' }}>
        <div className="mb-3">
          <label>Username</label>
          <input type="text" className="form-control" value={username}
                 onChange={e => setUsername(e.target.value)} required />
        </div>
        <div className="mb-3">
          <label>Password</label>
          <input type="password" className="form-control" value={password}
                 onChange={e => setPassword(e.target.value)} required />
        </div>
        <button type="submit" className="btn btn-primary">Register</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}

export default Register;
