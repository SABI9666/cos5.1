import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/navbar.jsx';
import Footer from '../components/footer.jsx';
import EventsBanner from '../components/EventsBanner.jsx';
import { getProducts } from '../services/api';
import './homepage.css';

function HomePage(props) {
  var onCartClick = props.onCartClick;
  var cartCount = props.cartCount;
  var addToCart = props.addToCart;
  
  var productsState = useState([]);
  var featuredProducts = productsState[0];
  var setFeaturedProducts = productsState[1];
  
  var loadingState = useState(true);
  var loading = loadingState[0];
  var setLoading = loadingState[1];
  
  var visibleState = useState(false);
  var isVisible = visibleState[0];
  var setIsVisible = visibleState[1];

  var heroRef = useRef(null);

  useEffect(function() {
    setIsVisible(true);
    loadFeaturedProducts();
  }, []);

  function loadFeaturedProducts() {
    getProducts().then(function(products) {
      setFeaturedProducts(products.slice(0, 8));
      setLoading(false);
    }).catch(function(error) {
      console.error('Error loading products:', error);
      setLoading(false);
    });
  }

  function handleImageError(e) {
    e.target.src = 'https://images.unsplash.com/photo-1565814329452-e1efa11c5b89?w=400';
  }

  function handleAddToCart(e, product) {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
  }

  var categories = [
    { 
      id: 'wall-light',
      name: 'Wall Light', 
      description: 'Elegant wall-mounted fixtures',
      image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=600',
      link: '/products?category=wall-light' 
    },
    { 
      id: 'fan',
      name: 'Fan', 
      description: 'Premium ceiling fans',
      image: 'https://images.unsplash.com/photo-1622372738946-62e02505feb3?w=600',
      link: '/products?category=fan' 
    },
    { 
      id: 'hanging',
      name: 'Hanging', 
      description: 'Pendant & chandeliers',
      image: 'https://images.unsplash.com/photo-1524484485831-a92ffc0de03f?w=600',
      link: '/products?category=hanging' 
    },
    { 
      id: 'gate-light',
      name: 'Gate Light', 
      description: 'Outdoor gate lighting',
      image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600',
      link: '/products?category=gate-light' 
    },
    { 
      id: 'bldc-fan',
      name: 'BLDC Fan', 
      description: 'Energy-efficient fans',
      image: 'https://images.unsplash.com/photo-1635108200979-05da6600dc8c?w=600',
      link: '/products?category=bldc-fan' 
    },
    { 
      id: 'surface-lights',
      name: 'Surface Lights', 
      description: 'Modern surface fixtures',
      image: 'https://images.unsplash.com/photo-1540932239986-30128078f3c5?w=600',
      link: '/products?category=surface-lights' 
    }
  ];

  var stats = [
    { number: '50K+', label: 'Happy Customers' },
    { number: '500+', label: 'Products' },
    { number: '99%', label: 'Satisfaction' },
    { number: '24/7', label: 'Support' }
  ];

  return (
    <div className="home-page">
      <Navbar onCartClick={onCartClick} cartCount={cartCount} />
      
      {/* Hero Section */}
      <section className={isVisible ? "hero-section visible" : "hero-section"} ref={heroRef}>
        <div className="hero-bg-wrapper">
          <div className="hero-bg-image"></div>
          <div className="hero-bg-overlay"></div>
          <div className="hero-floating-elements">
            <div className="floating-circle circle-1"></div>
            <div className="floating-circle circle-2"></div>
            <div className="floating-circle circle-3"></div>
          </div>
        </div>
        
        <div className="hero-content">
          <div className="hero-badge">
            <span className="badge-dot"></span>
            Premium Lighting Collection 2025
          </div>
          <h1 className="hero-title">
            <span className="title-line">Illuminate Your</span>
            <span className="title-line highlight">Living Space</span>
          </h1>
          <p className="hero-description">
            Discover our curated collection of premium LED lighting solutions. 
            Transform any room into a masterpiece of light and shadow.
          </p>
          <div className="hero-cta">
            <Link to="/products" className="btn-primary">
              <span>Explore Collection</span>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Link>
            <Link to="/products?category=hanging" className="btn-secondary">
              <span>View Bestsellers</span>
            </Link>
          </div>
          
          <div className="hero-stats">
            {stats.map(function(stat, index) {
              return (
                <div key={index} className="stat-item">
                  <span className="stat-number">{stat.number}</span>
                  <span className="stat-label">{stat.label}</span>
                </div>
              );
            })}
          </div>
        </div>
        
        <div className="hero-scroll-indicator">
          <span>Scroll to explore</span>
          <div className="scroll-line">
            <div className="scroll-dot"></div>
          </div>
        </div>
      </section>

      {/* Events Banner */}
      <EventsBanner />

      {/* Categories Section */}
      <section className="categories-section">
        <div className="section-container">
          <div className="section-header">
            <div className="section-label">Categories</div>
            <h2 className="section-title">Shop by Category</h2>
            <p className="section-subtitle">Find the perfect lighting for every corner of your home</p>
          </div>
          
          <div className="categories-grid">
            {categories.map(function(category, index) {
              return (
                <Link 
                  to={category.link} 
                  key={category.id} 
                  className="category-card"
                  style={{ animationDelay: (index * 0.1) + 's' }}
                >
                  <div className="category-image-wrapper">
                    <img src={category.image} alt={category.name} className="category-image" />
                    <div className="category-overlay"></div>
                  </div>
                  <div className="category-content">
                    <h3 className="category-name">{category.name}</h3>
                    <p className="category-desc">{category.description}</p>
                    <span className="category-link">
                      Shop Now
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="products-section">
        <div className="section-container">
          <div className="section-header">
            <div className="section-label">Featured</div>
            <h2 className="section-title">Trending Products</h2>
            <p className="section-subtitle">Handpicked premium lighting solutions for modern homes</p>
          </div>
          
          {loading ? (
            <div className="loading-container">
              <div className="loading-spinner"></div>
            </div>
          ) : featuredProducts.length === 0 ? (
            <div className="empty-products">
              <div className="empty-icon">
                <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                  <path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>
                </svg>
              </div>
              <h3>No Products Yet</h3>
              <p>Add products from the Admin Panel to display here</p>
              <Link to="/admin" className="btn-primary">Go to Admin Panel</Link>
            </div>
          ) : (
            <div className="products-grid">
              {featuredProducts.map(function(product, index) {
                return (
                  <div 
                    key={product.id} 
                    className="product-card"
                    style={{ animationDelay: (index * 0.08) + 's' }}
                  >
                    <Link to={'/product/' + product.id} className="product-image-wrapper">
                      <img 
                        src={product.imageUrl || 'https://images.unsplash.com/photo-1565814329452-e1efa11c5b89?w=400'} 
                        alt={product.name} 
                        className="product-image" 
                        onError={handleImageError} 
                      />
                      {product.badge && <span className="product-badge">{product.badge}</span>}
                      <div className="product-overlay">
                        <span className="quick-view">Quick View</span>
                      </div>
                    </Link>
                    <div className="product-details">
                      <span className="product-category">{product.category}</span>
                      <h3 className="product-name">
                        <Link to={'/product/' + product.id}>{product.name}</Link>
                      </h3>
                      <div className="product-footer">
                        <span className="product-price">₹{product.price ? product.price.toLocaleString() : '0'}</span>
                        <button 
                          className="add-cart-btn"
                          onClick={function(e) { handleAddToCart(e, product); }}
                          aria-label="Add to cart"
                        >
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M9 2L7 6H3L6 20H18L21 6H17L15 2H9Z" strokeLinecap="round" strokeLinejoin="round"/>
                            <line x1="12" y1="10" x2="12" y2="16"/>
                            <line x1="9" y1="13" x2="15" y2="13"/>
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
          
          <div className="section-cta">
            <Link to="/products" className="btn-outline">
              View All Products
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="section-container">
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M13 2L3 14h8l-1 8 10-12h-8l1-8z" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div className="feature-content">
                <h3>Energy Efficient</h3>
                <p>Save up to 80% on electricity bills with our LED technology</p>
              </div>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <rect x="5" y="2" width="14" height="20" rx="2" ry="2"/>
                  <line x1="12" y1="18" x2="12.01" y2="18" strokeLinecap="round"/>
                </svg>
              </div>
              <div className="feature-content">
                <h3>Smart Control</h3>
                <p>Control your lights from anywhere with our smart app</p>
              </div>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <circle cx="12" cy="12" r="10"/>
                  <polyline points="12 6 12 12 16 14" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div className="feature-content">
                <h3>Long Lasting</h3>
                <p>50,000+ hours of premium lighting experience</p>
              </div>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div className="feature-content">
                <h3>2 Year Warranty</h3>
                <p>Complete peace of mind with our extended warranty</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonial / Banner Section */}
      <section className="promo-section">
        <div className="promo-bg"></div>
        <div className="promo-content">
          <div className="promo-badge">Limited Time Offer</div>
          <h2 className="promo-title">Get 20% Off on Your First Order</h2>
          <p className="promo-text">Use code <span className="promo-code">LUXE20</span> at checkout</p>
          <Link to="/products" className="btn-light">
            Shop Now
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </Link>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="newsletter-section">
        <div className="section-container">
          <div className="newsletter-wrapper">
            <div className="newsletter-content">
              <h2>Stay Updated</h2>
              <p>Subscribe to get exclusive offers and lighting tips</p>
            </div>
            <form className="newsletter-form" onSubmit={function(e) { e.preventDefault(); }}>
              <input type="email" placeholder="Enter your email" required />
              <button type="submit">
                Subscribe
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="22" y1="2" x2="11" y2="13"/>
                  <polygon points="22 2 15 22 11 13 2 9 22 2"/>
                </svg>
              </button>
            </form>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default HomePage;
