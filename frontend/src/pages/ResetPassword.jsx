import React, { useState, useEffect } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const API_BASE = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
  ? 'http://localhost:5000'
  : 'https://moksha132.pythonanywhere.com';

function ResetPassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      setError('Invalid reset link. No reset token was found in the URL.');
    }
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token) {
      setError('Cannot reset password without a valid token.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (password.length < 4) {
      setError('Password should be at least 4 characters long.');
      return;
    }

    setLoading(true);
    setMessage('');
    setError('');

    try {
      const res = await fetch(`${API_BASE}/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password })
      });

      const data = await res.json();
      if (res.ok) {
        setMessage('Password has been reset successfully! Redirecting you to login...');
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      } else {
        setError(data.error || 'Failed to reset password. The link may have expired.');
      }
    } catch (err) {
      setError('An error occurred. Please verify your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Navbar />

      <main className="container" style={{ paddingTop: '2rem' }}>
        <div className="auth-form card" style={{ marginTop: '2rem', marginBottom: '8rem' }}>
          <h2 style={{ marginBottom: '1.5rem', textAlign: 'center', color: '#0a192f' }}>Reset Password</h2>
          <p style={{ textAlign: 'center', color: '#64748b', marginBottom: '2rem' }}>
            Enter your new secure password below to regain access to your account.
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

          {token && !message && (
            <form onSubmit={handleSubmit}>
              <input
                type="password"
                placeholder="New Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
              />
              
              <input
                type="password"
                placeholder="Confirm New Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                disabled={loading}
              />
              
              <button 
                type="submit" 
                style={{ width: '100%', padding: '1rem', marginTop: '0.5rem' }}
                disabled={loading}
              >
                {loading ? 'Updating Password...' : 'Reset Password'}
              </button>
            </form>
          )}

          <p className="link-text" style={{ marginTop: '2rem' }}>
            Back to <Link to="/login">Sign In</Link>
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default ResetPassword;
