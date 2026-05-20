import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const API_BASE = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
  ? 'http://localhost:5000'
  : 'https://moksha132.pythonanywhere.com';

function ForgotPassword() {
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');

    try {
      const res = await fetch(`${API_BASE}/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username,
          frontend_url: window.location.origin
        })
      });

      const data = await res.json();
      if (res.ok) {
        setMessage(data.message || 'Reset link sent! Please check your email.');
        setUsername('');
      } else {
        setError(data.error || 'Failed to request password reset. Please try again.');
      }
    } catch (err) {
      setError('An error occurred. Please make sure the backend server is running and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Navbar />

      <main className="container" style={{ paddingTop: '2rem' }}>
        <div className="auth-form card" style={{ marginTop: '2rem', marginBottom: '8rem' }}>
          <h2 style={{ marginBottom: '1.5rem', textAlign: 'center', color: '#0a192f' }}>Forgot Password</h2>
          <p style={{ textAlign: 'center', color: '#64748b', marginBottom: '2rem' }}>
            Enter your registered email / username. We'll send you a secure link to reset your password.
          </p>

          {message && (
            <div style={{ 
              padding: '1rem', 
              backgroundColor: 'rgba(34, 197, 94, 0.15)', 
              color: '#16a34a', 
              borderRadius: '12px', 
              marginBottom: '1.5rem',
              fontSize: '0.9rem',
              fontWeight: '500',
              textAlign: 'center',
              border: '1px solid rgba(34, 197, 94, 0.25)'
            }}>
              {message}
            </div>
          )}

          {error && (
            <div style={{ 
              padding: '1rem', 
              backgroundColor: 'rgba(239, 68, 68, 0.15)', 
              color: '#dc2626', 
              borderRadius: '12px', 
              marginBottom: '1.5rem',
              fontSize: '0.9rem',
              fontWeight: '500',
              textAlign: 'center',
              border: '1px solid rgba(239, 68, 68, 0.25)'
            }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Enter your Email / Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              disabled={loading}
            />
            
            <button 
              type="submit" 
              style={{ width: '100%', padding: '1rem', marginTop: '0.5rem' }}
              disabled={loading}
            >
              {loading ? 'Sending Request...' : 'Send Reset Link'}
            </button>
          </form>

          <p className="link-text" style={{ marginTop: '2rem' }}>
            Back to <Link to="/login">Sign In</Link>
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default ForgotPassword;
