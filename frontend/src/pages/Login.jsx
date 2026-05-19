import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [acceptTerms, setAcceptTerms] = useState(sessionStorage.getItem('acceptedTerms') === 'true');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!acceptTerms) {
      alert('Please accept the Terms & Conditions and Privacy Policy to proceed.');
      return;
    }
    const res = await fetch('https://moksha132.pythonanywhere.com/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });

    if (res.ok) {
      const user = await res.json();
      localStorage.setItem('user', JSON.stringify(user));
      navigate('/dashboard');
    } else {
      alert('Authentication failed. Please check your credentials.');
    }
  };

  return (
    <div>
      <Navbar />

      <div className="container" style={{ paddingTop: '2rem' }}>
        <div className="auth-form card" style={{ marginTop: '2rem', marginBottom: '8rem' }}>
          <h2 style={{ marginBottom: '1.5rem', textAlign: 'center', color: '#0a192f' }}>Sign In to PlagCheck</h2>
          <p style={{ textAlign: 'center', color: '#64748b', marginBottom: '2rem' }}>Enter your details to access the originality scanner.</p>

          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <div style={{ marginBottom: '1.5rem', textAlign: 'left', fontSize: '0.9rem', color: 'var(--text-dim)' }}>
              <label style={{ display: 'flex', alignItems: 'flex-start', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={acceptTerms}
                  onClick={(e) => {
                    if (!acceptTerms) {
                      e.preventDefault();
                      alert('Please read our Terms & Conditions and Privacy Policy by clicking the links, and accept them there.');
                    }
                  }}
                  onChange={(e) => {
                    setAcceptTerms(e.target.checked);
                    sessionStorage.setItem('acceptedTerms', e.target.checked.toString());
                  }}
                  required
                  style={{ marginRight: '0.5rem', marginTop: '0.25rem', width: 'auto', flexShrink: 0 }}
                />
                <span>I accept the <Link to="/terms-conditions" state={{ fromAuth: true }} style={{ color: 'var(--primary)' }}>Terms & Conditions</Link> and <Link to="/privacy-policy" state={{ fromAuth: true }} style={{ color: 'var(--primary)' }}>Privacy Policy</Link></span>
              </label>
            </div>

            <button type="submit" style={{ width: '100%', padding: '1rem' }}>Access Dashboard</button>
          </form>

          <p className="link-text" style={{ marginTop: '2rem' }}>
            New to PlagCheck? <Link to="/register">Create an account</Link>
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Login;
