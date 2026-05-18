import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Footer from '../components/Footer';

function Register() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch('http://localhost:5000/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });

    if (res.ok) {
      alert('Account created successfully!');
      navigate('/login');
    } else {
      alert('Registration failed. Try a different username.');
    }
  };

  return (
    <div>
      <div className="container">
        <nav className="navbar">
          <div className="logo">PlagCheck</div>
          <div className="nav-links" style={{ display: 'flex', alignItems: 'center' }}>
            <Link to="/" style={{ marginRight: '2rem', color: 'var(--text-dim)', textDecoration: 'none', fontWeight: '600' }}>Home</Link>
            <Link to="/login">
              <button style={{ padding: '0.6rem 1.5rem', fontSize: '0.9rem' }}>Log In</button>
            </Link>
          </div>
        </nav>

        <div className="auth-form card" style={{ marginTop: '6rem', marginBottom: '10rem' }}>
          <h2 style={{ marginBottom: '1.5rem', textAlign: 'center', color: '#0a192f' }}>Join PlagCheck</h2>
          <p style={{ textAlign: 'center', color: '#64748b', marginBottom: '2rem' }}>Create an account to start protecting your original work.</p>

          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Choose Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Create Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button type="submit" style={{ width: '100%', marginTop: '1rem', padding: '1rem' }}>Create Account</button>
          </form>

          <p className="link-text" style={{ marginTop: '2rem' }}>
            Already have an account? <Link to="/login">Sign in here</Link>
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Register;
