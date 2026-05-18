import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import Footer from '../components/Footer';

function TermsConditions() {
  const navigate = useNavigate();
  const location = useLocation();
  const isFromAuth = location.state?.fromAuth;
  const user = localStorage.getItem('user');

  return (
    <div>
      <div className="container">
        <nav className="navbar">
          <div className="logo">PlagCheck</div>
          <div className="nav-links">
            <Link to="/" style={{ color: 'var(--text-dim)', textDecoration: 'none', fontWeight: 500 }}>Home</Link>
          </div>
        </nav>
        
        <div className="card" style={{ marginTop: '4rem', marginBottom: '8rem', padding: '3rem' }}>
          <h1 style={{ marginBottom: '2rem' }}>Terms and Conditions</h1>
          <div style={{ lineHeight: '1.8', color: 'var(--text-dim)' }}>
            <p style={{ marginBottom: '1rem' }}>Last updated: May 2026</p>
            <h2 style={{ color: 'var(--dark-bg)', marginTop: '2rem', marginBottom: '1rem' }}>1. Acceptance of Terms</h2>
            <p style={{ marginBottom: '1rem' }}>By accessing and using PlagCheck, you agree to be bound by these Terms and Conditions. If you disagree with any part of the terms, you may not access the service.</p>
            
            <h2 style={{ color: 'var(--dark-bg)', marginTop: '2rem', marginBottom: '1rem' }}>2. Use License</h2>
            <p style={{ marginBottom: '1rem' }}>Permission is granted to temporarily use our services for personal, non-commercial transitory viewing only. You may not modify or copy our materials, or use them for any commercial purpose.</p>
            
            <h2 style={{ color: 'var(--dark-bg)', marginTop: '2rem', marginBottom: '1rem' }}>3. Service Accuracy</h2>
            <p style={{ marginBottom: '1rem' }}>While we strive for the highest accuracy, our AI detection and plagiarism scoring algorithms are provided "as is". We do not warrant that the results are 100% accurate, complete, or current.</p>
            
            <h2 style={{ color: 'var(--dark-bg)', marginTop: '2rem', marginBottom: '1rem' }}>4. Limitations</h2>
            <p style={{ marginBottom: '1rem' }}>In no event shall PlagCheck be liable for any damages arising out of the use or inability to use the materials on our website.</p>
            
            {isFromAuth && !user && (
              <div style={{ marginTop: '3rem', textAlign: 'center' }}>
                <button 
                  onClick={() => {
                    sessionStorage.setItem('acceptedTerms', 'true');
                    navigate(-1);
                  }}
                  style={{ padding: '1rem 3rem', fontSize: '1.1rem' }}
                >
                  Accept and Return to Login
                </button>
              </div>
            )}
            
            {user && (
              <div style={{ marginTop: '3rem', textAlign: 'center' }}>
                <button 
                  onClick={() => navigate(-1)}
                  style={{ padding: '1rem 3rem', fontSize: '1.1rem' }}
                >
                  I Accept
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default TermsConditions;
