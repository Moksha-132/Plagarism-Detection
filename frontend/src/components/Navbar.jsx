import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, LogOut, User, Home, HelpCircle, FileText, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const saved = localStorage.getItem('user');
    if (saved) {
      setUser(JSON.parse(saved));
    }
  }, [location.pathname]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
    setIsOpen(false);
    navigate('/');
  };

  const isDashboard = location.pathname === '/dashboard';
  const isAuth = location.pathname === '/login' || location.pathname === '/register';
  const isHome = location.pathname === '/';

  const menuVariants = {
    closed: {
      opacity: 0,
      height: 0,
      transition: {
        duration: 0.3,
        ease: 'easeInOut',
        staggerChildren: 0.05,
        staggerDirection: -1
      }
    },
    open: {
      opacity: 1,
      height: 'auto',
      transition: {
        duration: 0.3,
        ease: 'easeInOut',
        staggerChildren: 0.07,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    closed: { opacity: 0, y: -10 },
    open: { opacity: 1, y: 0 }
  };

  return (
    <header className="navbar-wrapper">
      <div className="container">
        <nav className="navbar-container">
          <Link to="/" className="logo-link" onClick={() => setIsOpen(false)}>
            <div className="logo">PlagCheck</div>
          </Link>

          <div className="desktop-nav">
            {isDashboard ? (
              <div className="nav-profile-group">
                <span className="user-badge">
                  <User size={16} />
                  {user?.username}
                </span>
                <button onClick={handleLogout} className="logout-btn">
                  <LogOut size={16} />
                  Log Out
                </button>
              </div>
            ) : isHome ? (
              <div className="nav-links-group">
                <a href="#features" className="nav-link">Features</a>
                <a href="#how-it-works" className="nav-link">How It Works</a>
                <a href="#about" className="nav-link">About Us</a>
                <Link to="/contact" className="nav-link">Contact</Link>
                {user ? (
                  <>
                    <Link to="/dashboard" className="nav-link dashboard-link">Dashboard</Link>
                    <button onClick={handleLogout} className="logout-btn-minimal">
                      <LogOut size={16} />
                    </button>
                  </>
                ) : (
                  <>
                    <Link to="/login" className="nav-link login-link">Log In</Link>
                    <Link to="/register" className="nav-btn-link">
                      <button className="primary-nav-btn">Get Started</button>
                    </Link>
                  </>
                )}
              </div>
            ) : (
              <div className="nav-links-group">
                <Link to="/" className="nav-link">Home</Link>
                <Link to="/contact" className="nav-link">Contact</Link>
                {user ? (
                  <>
                    <Link to="/dashboard" className="nav-link dashboard-link">Dashboard</Link>
                    <button onClick={handleLogout} className="logout-btn-minimal">
                      <LogOut size={16} />
                    </button>
                  </>
                ) : (
                  <>
                    {location.pathname !== '/login' && <Link to="/login" className="nav-link login-link">Log In</Link>}
                    {location.pathname !== '/register' && (
                      <Link to="/register" className="nav-btn-link">
                        <button className="primary-nav-btn">Get Started</button>
                      </Link>
                    )}
                  </>
                )}
              </div>
            )}
          </div>

          <button 
            className="mobile-menu-toggle"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle Menu"
          >
            <motion.div
              animate={{ rotate: isOpen ? 90 : 0 }}
              transition={{ duration: 0.2 }}
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </motion.div>
          </button>
        </nav>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            className="mobile-nav"
            initial="closed"
            animate="open"
            exit="closed"
            variants={menuVariants}
          >
            <div className="container mobile-nav-content">
              {isDashboard ? (
                <div className="mobile-nav-stack">
                  <motion.div variants={itemVariants} className="mobile-user-badge">
                    <User size={20} />
                    <span>{user?.username}</span>
                  </motion.div>
                  <motion.div variants={itemVariants}>
                    <button onClick={handleLogout} className="mobile-logout-btn">
                      <LogOut size={18} />
                      Log Out
                    </button>
                  </motion.div>
                </div>
              ) : isHome ? (
                <div className="mobile-nav-stack">
                  <motion.a variants={itemVariants} href="#features" onClick={() => setIsOpen(false)} className="mobile-nav-link">Features</motion.a>
                  <motion.a variants={itemVariants} href="#how-it-works" onClick={() => setIsOpen(false)} className="mobile-nav-link">How It Works</motion.a>
                  <motion.a variants={itemVariants} href="#about" onClick={() => setIsOpen(false)} className="mobile-nav-link">About Us</motion.a>
                  <motion.div variants={itemVariants}>
                    <Link to="/contact" onClick={() => setIsOpen(false)} className="mobile-nav-link">Contact</Link>
                  </motion.div>
                  
                  {user ? (
                    <>
                      <motion.div variants={itemVariants}>
                        <Link to="/dashboard" onClick={() => setIsOpen(false)} className="mobile-nav-link highlight">Dashboard</Link>
                      </motion.div>
                      <motion.div variants={itemVariants}>
                        <button onClick={handleLogout} className="mobile-logout-btn">
                          <LogOut size={18} />
                          Log Out
                        </button>
                      </motion.div>
                    </>
                  ) : (
                    <>
                      <motion.div variants={itemVariants} className="mobile-nav-divider" />
                      <motion.div variants={itemVariants}>
                        <Link to="/login" onClick={() => setIsOpen(false)} className="mobile-nav-link">Log In</Link>
                      </motion.div>
                      <motion.div variants={itemVariants}>
                        <Link to="/register" onClick={() => setIsOpen(false)} className="mobile-nav-btn-link">
                          <button className="mobile-primary-btn">Get Started</button>
                        </Link>
                      </motion.div>
                    </>
                  )}
                </div>
              ) : (
                <div className="mobile-nav-stack">
                  <motion.div variants={itemVariants}>
                    <Link to="/" onClick={() => setIsOpen(false)} className="mobile-nav-link">Home</Link>
                  </motion.div>
                  <motion.div variants={itemVariants}>
                    <Link to="/contact" onClick={() => setIsOpen(false)} className="mobile-nav-link">Contact</Link>
                  </motion.div>

                  {user ? (
                    <>
                      <motion.div variants={itemVariants}>
                        <Link to="/dashboard" onClick={() => setIsOpen(false)} className="mobile-nav-link highlight">Dashboard</Link>
                      </motion.div>
                      <motion.div variants={itemVariants}>
                        <button onClick={handleLogout} className="mobile-logout-btn">
                          <LogOut size={18} />
                          Log Out
                        </button>
                      </motion.div>
                    </>
                  ) : (
                    <>
                      <motion.div variants={itemVariants} className="mobile-nav-divider" />
                      {location.pathname !== '/login' && (
                        <motion.div variants={itemVariants}>
                          <Link to="/login" onClick={() => setIsOpen(false)} className="mobile-nav-link">Log In</Link>
                        </motion.div>
                      )}
                      {location.pathname !== '/register' && (
                        <motion.div variants={itemVariants}>
                          <Link to="/register" onClick={() => setIsOpen(false)} className="mobile-nav-btn-link">
                            <button className="mobile-primary-btn">Get Started</button>
                          </Link>
                        </motion.div>
                      )}
                    </>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

export default Navbar;
