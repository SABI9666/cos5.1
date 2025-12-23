import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { logout } from '../services/api';

function Navbar(props) {
  var onCartClick = props.onCartClick;
  var cartCount = props.cartCount;
  var scrolledState = useState(false);
  var scrolled = scrolledState[0];
  var setScrolled = scrolledState[1];
  var mobileMenuState = useState(false);
  var mobileMenuOpen = mobileMenuState[0];
  var setMobileMenuOpen = mobileMenuState[1];
  var userMenuState = useState(false);
  var userMenuOpen = userMenuState[0];
  var setUserMenuOpen = userMenuState[1];
  var location = useLocation();
  var navigate = useNavigate();
  var userMenuRef = useRef(null);
  
  var auth = useAuth();
  var user = auth.user;
  var isAuthenticated = auth.isAuthenticated;

  useEffect(function() {
    function handleScroll() {
      setScrolled(window.scrollY > 50);
    }
    window.addEventListener('scroll', handleScroll);
    return function() {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(function() {
    setMobileMenuOpen(false);
    setUserMenuOpen(false);
  }, [location]);

  useEffect(function() {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return function() {
      document.body.style.overflow = 'unset';
    };
  }, [mobileMenuOpen]);

  useEffect(function() {
    function handleClickOutside(event) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setUserMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return function() {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  function toggleMobileMenu() {
    setMobileMenuOpen(!mobileMenuOpen);
  }

  function closeMobileMenu() {
    setMobileMenuOpen(false);
  }

  function handleCartClick() {
    setMobileMenuOpen(false);
    onCartClick();
  }

  function toggleUserMenu() {
    setUserMenuOpen(!userMenuOpen);
  }

  function handleLogout() {
    logout().then(function() {
      setUserMenuOpen(false);
      navigate('/');
    });
  }

  function getUserInitials() {
    if (user && user.displayName) {
      var names = user.displayName.split(' ');
      if (names.length >= 2) {
        return names[0].charAt(0) + names[names.length - 1].charAt(0);
      }
      return names[0].charAt(0).toUpperCase();
    }
    if (user && user.email) {
      return user.email.substring(0, 2).toUpperCase();
    }
    return 'U';
  }

  return (
    <React.Fragment>
      <nav className={scrolled ? "navbar scrolled" : "navbar"}>
        <div className="navbar-container">
          <Link to="/" className="logo">LUXELED</Link>
          <ul className="nav-links desktop-nav">
            <li><Link to="/" className={location.pathname === '/' ? 'active' : ''}>Home</Link></li>
            <li><Link to="/products" className={location.pathname === '/products' ? 'active' : ''}>Products</Link></li>
            <li><Link to="/admin" className={location.pathname === '/admin' ? 'active' : ''}>Admin</Link></li>
            <li className="cart-icon" onClick={onCartClick}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 2L7 6H3L6 20H18L21 6H17L15 2H9Z" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M9 6V8C9 9.65685 10.3431 11 12 11C13.6569 11 15 9.65685 15 8V6" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
            </li>
            
            {isAuthenticated ? (
              <li className="user-menu-container" ref={userMenuRef}>
                <button className="user-avatar-btn" onClick={toggleUserMenu}>
                  {user.photoURL ? (
                    <img src={user.photoURL} alt="User" className="user-avatar-img" />
                  ) : (
                    <span className="user-avatar-initials">{getUserInitials()}</span>
                  )}
                </button>
                {userMenuOpen && (
                  <div className="user-dropdown">
                    <div className="user-dropdown-header">
                      <div className="user-dropdown-avatar">
                        {user.photoURL ? (
                          <img src={user.photoURL} alt="User" />
                        ) : (
                          <span>{getUserInitials()}</span>
                        )}
                      </div>
                      <div className="user-dropdown-info">
                        <span className="user-dropdown-name">{user.displayName || 'User'}</span>
                        <span className="user-dropdown-email">{user.email}</span>
                      </div>
                    </div>
                    <div className="user-dropdown-divider"></div>
                    <Link to="/orders" className="user-dropdown-item">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>
                      </svg>
                      My Orders
                    </Link>
                    <button className="user-dropdown-item logout" onClick={handleLogout}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                        <polyline points="16 17 21 12 16 7"/>
                        <line x1="21" y1="12" x2="9" y2="12"/>
                      </svg>
                      Logout
                    </button>
                  </div>
                )}
              </li>
            ) : (
              <li>
                <Link to="/auth" className="login-btn">Login</Link>
              </li>
            )}
          </ul>
          
          <div className="mobile-controls">
            <div className="cart-icon mobile-cart" onClick={onCartClick}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 2L7 6H3L6 20H18L21 6H17L15 2H9Z" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M9 6V8C9 9.65685 10.3431 11 12 11C13.6569 11 15 9.65685 15 8V6" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
            </div>
            <button className={mobileMenuOpen ? "hamburger active" : "hamburger"} onClick={toggleMobileMenu} aria-label="Toggle menu">
              <span className="hamburger-line"></span>
              <span className="hamburger-line"></span>
              <span className="hamburger-line"></span>
            </button>
          </div>
        </div>
      </nav>
      {mobileMenuOpen && <div className="mobile-menu-overlay" onClick={closeMobileMenu}></div>}
      <div className={mobileMenuOpen ? "mobile-menu open" : "mobile-menu"}>
        <div className="mobile-menu-header">
          <span className="mobile-menu-title">Menu</span>
          <button className="mobile-menu-close" onClick={closeMobileMenu}>&times;</button>
        </div>
        
        {isAuthenticated && (
          <div className="mobile-user-info">
            <div className="mobile-user-avatar">
              {user.photoURL ? (
                <img src={user.photoURL} alt="User" />
              ) : (
                <span>{getUserInitials()}</span>
              )}
            </div>
            <div className="mobile-user-details">
              <span className="mobile-user-name">{user.displayName || 'User'}</span>
              <span className="mobile-user-email">{user.email}</span>
            </div>
          </div>
        )}
        
        <ul className="mobile-nav-links">
          <li><Link to="/" className={location.pathname === '/' ? 'active' : ''}>Home</Link></li>
          <li><Link to="/products" className={location.pathname === '/products' ? 'active' : ''}>Products</Link></li>
          {isAuthenticated && (
            <li><Link to="/orders" className={location.pathname === '/orders' ? 'active' : ''}>My Orders</Link></li>
          )}
          <li><Link to="/admin" className={location.pathname === '/admin' ? 'active' : ''}>Admin Panel</Link></li>
        </ul>
        <div className="mobile-menu-footer">
          <button className="mobile-cart-btn" onClick={handleCartClick}>
            View Cart {cartCount > 0 && <span className="mobile-cart-count">({cartCount})</span>}
          </button>
          {isAuthenticated ? (
            <button className="mobile-logout-btn" onClick={handleLogout}>
              Logout
            </button>
          ) : (
            <Link to="/auth" className="mobile-login-btn" onClick={closeMobileMenu}>
              Login / Sign Up
            </Link>
          )}
        </div>
      </div>
    </React.Fragment>
  );
}

export default Navbar;
