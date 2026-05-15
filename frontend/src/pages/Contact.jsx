import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin } from 'lucide-react';
import Footer from '../components/Footer';
import { motion } from 'framer-motion';

function Contact() {
  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  return (
    <div>
      <div className="container">
        <motion.nav 
          className="navbar"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="logo">PlagCheck</div>
          <div className="nav-links">
            <Link to="/" style={{ color: 'var(--text-dim)', textDecoration: 'none', marginLeft: '2rem', fontWeight: 500 }}>Home</Link>
            <Link to="/login" style={{ marginLeft: '2rem' }}>Log In</Link>
          </div>
        </motion.nav>

        <motion.section 
          className="hero" 
          style={{ padding: '6rem 0' }}
          {...fadeInUp}
        >
          <h1>Get in <span className="text-gradient">Touch.</span></h1>
          <p>Have questions about our scanner or enterprise solutions? Our team is here to help you.</p>
        </motion.section>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', marginBottom: '8rem' }}>
          <motion.div 
            className="card"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <h2 style={{ marginBottom: '2rem' }}>Contact Information</h2>
            
            <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '2rem' }}>
              <Mail color="var(--primary)" />
              <div>
                <p style={{ fontWeight: '700' }}>Email Us</p>
                <p style={{ color: 'var(--text-dim)' }}>info@shnoor.com</p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '2rem' }}>
              <Phone color="var(--primary)" />
              <div>
                <p style={{ fontWeight: '700' }}>Call Us</p>
                <p style={{ color: 'var(--text-dim)' }}>+91-9429694298</p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1.5rem' }}>
              <MapPin color="var(--primary)" />
              <div>
                <p style={{ fontWeight: '700' }}>Our Location</p>
                <p style={{ color: 'var(--text-dim)' }}>10009 Mount Tabor Road, City, Odessa<br />Missouri, United States</p>
              </div>
            </div>
          </motion.div>

          <motion.div 
            className="card"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            <h2 style={{ marginBottom: '2rem' }}>Send a Message</h2>
            <form onSubmit={(e) => e.preventDefault()}>
              <input type="text" placeholder="Your Name" required />
              <input type="email" placeholder="Email Address" required />
              <textarea style={{ height: '150px', background: '#f8fafc', border: '1px solid var(--border)', borderRadius: '12px', padding: '1rem', width: '100%', marginBottom: '1rem' }} placeholder="How can we help?"></textarea>
              <button style={{ width: '100%' }}>Send Message</button>
            </form>
          </motion.div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Contact;
