import React, { useState } from 'react';
import { Mail, Phone, MapPin } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { motion } from 'framer-motion';

function Contact() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('Sending...');
    try {
      const res = await fetch('https://moksha132.pythonanywhere.com/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, message })
      });
      if (res.ok) {
        setStatus('Message sent successfully!');
        setName('');
        setEmail('');
        setMessage('');
      } else {
        setStatus('Failed to send message.');
      }
    } catch (err) {
      setStatus('Failed to send message.');
    }
  };

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  return (
    <div>
      <Navbar />

      <main className="container" style={{ paddingTop: '2rem' }}>
        <motion.section
          className="hero"
          style={{ padding: '4rem 0' }}
          {...fadeInUp}
        >
          <h1>Get in <span className="text-gradient">Touch.</span></h1>
          <p>Have questions about our scanner or enterprise solutions? Our team is here to help you.</p>
        </motion.section>

        <div className="contact-grid">
          <motion.div
            className="card"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <h2 style={{ marginBottom: '2rem' }}>Contact Information</h2>

            <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '2rem' }}>
              <Mail color="var(--primary)" style={{ flexShrink: 0 }} />
              <div>
                <p style={{ fontWeight: '700' }}>Email Us</p>
                <p style={{ color: 'var(--text-dim)' }}>info@shnoor.com</p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '2rem' }}>
              <Phone color="var(--primary)" style={{ flexShrink: 0 }} />
              <div>
                <p style={{ fontWeight: '700' }}>Call Us</p>
                <p style={{ color: 'var(--text-dim)' }}>+91-9429694298</p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1.5rem' }}>
              <MapPin color="var(--primary)" style={{ flexShrink: 0 }} />
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
            <form onSubmit={handleSubmit}>
              <input type="text" placeholder="Your Name" value={name} onChange={(e) => setName(e.target.value)} required />
              <input type="email" placeholder="Email Address" value={email} onChange={(e) => setEmail(e.target.value)} required />
              <textarea 
                style={{ 
                  height: '150px', 
                  background: '#f8fafc', 
                  border: '1px solid var(--border)', 
                  borderRadius: '12px', 
                  padding: '1rem', 
                  width: '100%', 
                  marginBottom: '1rem',
                  resize: 'none'
                }} 
                placeholder="How can we help?" 
                value={message} 
                onChange={(e) => setMessage(e.target.value)} 
                required
              ></textarea>
              <button style={{ width: '100%' }}>Send Message</button>
              {status && <p style={{ marginTop: '1rem', color: status.includes('success') ? 'green' : 'red', fontWeight: '500' }}>{status}</p>}
            </form>
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default Contact;
