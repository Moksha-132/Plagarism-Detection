import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

function Register() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch('https://moksha132.pythonanywhere.com/register', {
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
      <Navbar />

      <main className="container" style={{ paddingTop: '2rem' }}>
        <div className="auth-form card" style={{ marginTop: '2rem', marginBottom: '8rem' }}>
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
      </main>
      <Footer />
    </div>
  );
}

export default Register;
