import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Globe, Cpu, Shield } from 'lucide-react';

function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-col">
            <div className="logo" style={{ color: 'white', marginBottom: '1.5rem' }}>PlagCheck</div>
            <p style={{ marginBottom: '2rem' }}>Transform your document intelligence with a platform that supports complex workflows, global compliance, and operational skill validation in one consistent experience.</p>
            <div style={{ display: 'flex', gap: '1.5rem', color: '#94a3b8' }}>
              <Globe size={20} />
              <Cpu size={20} />
              <Shield size={20} />
            </div>
          </div>
          
          <div className="footer-col">
            <h4>Quick Links</h4>
            <p><Link to="/" style={{ color: 'inherit', textDecoration: 'none' }}>Home</Link></p>
            <p><a href="/#features" style={{ color: 'inherit', textDecoration: 'none' }}>Features</a></p>
            <p><a href="/#how-it-works" style={{ color: 'inherit', textDecoration: 'none' }}>How It Works</a></p>
            <p><a href="/#about" style={{ color: 'inherit', textDecoration: 'none' }}>About Us</a></p>
            <p><Link to="/contact" style={{ color: 'inherit', textDecoration: 'none' }}>Contact Us</Link></p>
          </div>
          
          <div className="footer-col">
            <h4>Contact & Support</h4>
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
              <Mail size={20} color="var(--primary)" style={{ flexShrink: 0 }} />
              <div>
                <p style={{ color: 'white' }}>info@shnoor.com</p>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
              <Phone size={20} color="var(--primary)" style={{ flexShrink: 0 }} />
              <div>
                <p style={{ color: 'white' }}>+91-9429694298</p>
                <p style={{ color: 'white' }}>+91-9041914601</p>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <MapPin size={20} color="var(--primary)" style={{ flexShrink: 0 }} />
              <p style={{ color: 'white' }}>10009 Mount Tabor Road, City, Odessa<br />Missouri, United States</p>
            </div>
          </div>
        </div>
        
        <div className="footer-bottom" style={{ borderTop: '1px solid #1e292f', paddingTop: '2.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.85rem', color: '#94a3b8' }}>
          <div>© 2026 PlagCheck System. All rights reserved.</div>
          <div className="footer-bottom-links" style={{ display: 'flex', gap: '2rem' }}>
            <Link to="/privacy-policy" style={{ color: 'inherit', textDecoration: 'none' }}>Privacy Policy</Link>
            <Link to="/terms-conditions" style={{ color: 'inherit', textDecoration: 'none' }}>Terms & Conditions</Link>
            <a href="/Shnoor_Company_Profile (1).pdf" download="Shnoor_Company_Profile.pdf" style={{ color: 'inherit', textDecoration: 'none' }}>Company Profile</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
