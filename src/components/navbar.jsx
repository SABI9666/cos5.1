import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

function Navbar(props) {
  var onCartClick = props.onCartClick;
  var cartCount = props.cartCount;
  var scrolledState = useState(false);
  var scrolled = scrolledState[0];
  var setScrolled = scrolledState[1];
  var mobileMenuState = useState(false);
  var mobileMenuOpen = mobileMenuState[0];
  var setMobileMenuOpen = mobileMenuState[1];
  var location = useLocation();

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
        <ul className="mobile-nav-links">
          <li><Link to="/" className={location.pathname === '/' ? 'active' : ''}>Home</Link></li>
          <li><Link to="/products" className={location.pathname === '/products' ? 'active' : ''}>Products</Link></li>
          <li><Link to="/admin" className={location.pathname === '/admin' ? 'active' : ''}>Admin Panel</Link></li>
        </ul>
        <div className="mobile-menu-footer">
          <button className="mobile-cart-btn" onClick={handleCartClick}>
            View Cart {cartCount > 0 && <span className="mobile-cart-count">({cartCount})</span>}
          </button>
        </div>
      </div>
    </React.Fragment>
  );
}

export default Navbar;
