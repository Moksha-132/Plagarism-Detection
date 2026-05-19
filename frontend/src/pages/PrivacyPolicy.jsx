import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

function PrivacyPolicy() {
  const navigate = useNavigate();
  const location = useLocation();
  const isFromAuth = location.state?.fromAuth;
  const user = localStorage.getItem('user');

  return (
    <div>
      <Navbar />
      
      <main className="container" style={{ paddingTop: '2rem' }}>
        <div className="card" style={{ marginTop: '2rem', marginBottom: '8rem' }}>
          <h1 style={{ marginBottom: '2rem' }}>Privacy Policy</h1>
          <div style={{ lineHeight: '1.8', color: 'var(--text-dim)' }}>
            <p style={{ marginBottom: '1rem' }}>Last updated: May 2026</p>
            <h2 style={{ color: 'var(--dark-bg)', marginTop: '2rem', marginBottom: '1rem' }}>1. Information We Collect</h2>
            <p style={{ marginBottom: '1rem' }}>We collect information you provide directly to us when you create an account, submit a contact form, or use our scanning services. This may include your name, email address, and the content you submit for plagiarism and AI detection.</p>
            
            <h2 style={{ color: 'var(--dark-bg)', marginTop: '2rem', marginBottom: '1rem' }}>2. How We Use Your Information</h2>
            <p style={{ marginBottom: '1rem' }}>We use the information we collect to operate, maintain, and improve our services. Your uploaded documents and source code are analyzed by our engine but are not stored permanently unless you explicitly opt-in to contribute to our dataset.</p>
            
            <h2 style={{ color: 'var(--dark-bg)', marginTop: '2rem', marginBottom: '1rem' }}>3. Data Security</h2>
            <p style={{ marginBottom: '1rem' }}>We implement appropriate technical and organizational security measures designed to protect your personal information against accidental or unlawful destruction, loss, alteration, or unauthorized disclosure.</p>
            
            <h2 style={{ color: 'var(--dark-bg)', marginTop: '2rem', marginBottom: '1rem' }}>4. Contact Us</h2>
            <p style={{ marginBottom: '1rem' }}>If you have any questions about this Privacy Policy, please contact us at info@shnoor.com.</p>
            
            {isFromAuth && !user && (
              <div style={{ marginTop: '3rem', textAlign: 'center' }}>
                <button 
                  onClick={() => {
                    sessionStorage.setItem('acceptedTerms', 'true');
                    navigate(-1);
                  }}
                  style={{ padding: '1rem 3rem', fontSize: '1.1rem', width: '100%', maxWidth: '350px' }}
                >
                  Accept and Return to Login
                </button>
              </div>
            )}
            
            {user && (
              <div style={{ marginTop: '3rem', textAlign: 'center' }}>
                <button 
                  onClick={() => navigate(-1)}
                  style={{ padding: '1rem 3rem', fontSize: '1.1rem', width: '100%', maxWidth: '350px' }}
                >
                  I Accept
                </button>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default PrivacyPolicy;
