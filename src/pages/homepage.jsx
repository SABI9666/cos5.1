import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/navbar.jsx';
import Footer from '../components/footer.jsx';
import EventsBanner from '../components/EventsBanner.jsx';
import { getProducts, getCategories, getSocialSettings } from '../services/api';
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

  // Categories state - fetched from Firebase
  var categoriesState = useState([
    { id: 'wall-light', name: 'Wall Light', image: '', link: '/products?category=wall-light' },
    { id: 'fan', name: 'Fan', image: '', link: '/products?category=fan' },
    { id: 'hanging', name: 'Hanging', image: '', link: '/products?category=hanging' },
    { id: 'gate-light', name: 'Gate Light', image: '', link: '/products?category=gate-light' },
    { id: 'bldc-fan', name: 'BLDC Fan', image: '', link: '/products?category=bldc-fan' },
    { id: 'wall-fan', name: 'Wall Fan', image: '', link: '/products?category=wall-fan' },
    { id: 'wall-washer', name: 'Wall Washer', image: '', link: '/products?category=wall-washer' },
    { id: 'bulb', name: 'Bulb', image: '', link: '/products?category=bulb' },
    { id: 'surface-lights', name: 'Surface Lights', image: '', link: '/products?category=surface-lights' },
    { id: 'street-light', name: 'Street Light', image: '', link: '/products?category=street-light' },
    { id: 'spot-light', name: 'Spot Light', image: '', link: '/products?category=spot-light' },
    { id: 'cylinder-light', name: 'Cylinder Light', image: '', link: '/products?category=cylinder-light' },
    { id: 'smps', name: 'SMPS', image: '', link: '/products?category=smps' }
  ]);
  var categories = categoriesState[0];
  var setCategories = categoriesState[1];

  // Social settings state
  var socialState = useState({ whatsapp: '', instagram: '' });
  var socialSettings = socialState[0];
  var setSocialSettings = socialState[1];

  useEffect(function() {
    setIsVisible(true);
    loadFeaturedProducts();
    loadCategoriesData();
    loadSocialSettings();
  }, []);

  function loadSocialSettings() {
    getSocialSettings().then(function(settings) {
      if (settings) {
        setSocialSettings(settings);
      }
    }).catch(function(error) {
      console.error('Error loading social settings:', error);
    });
  }

  function loadFeaturedProducts() {
    getProducts().then(function(products) {
      setFeaturedProducts(products.slice(0, 8));
      setLoading(false);
    }).catch(function(error) {
      console.error('Error loading products:', error);
      setLoading(false);
    });
  }

  function loadCategoriesData() {
    getCategories().then(function(data) {
      if (data && data.length > 0) {
        var updatedCategories = data.map(function(cat) {
          return {
            id: cat.id,
            name: cat.name,
            image: cat.image || '',
            link: '/products?category=' + cat.id
          };
        });
        setCategories(updatedCategories);
      }
    }).catch(function(error) {
      console.error('Error loading categories:', error);
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
            Premium Lighting Collection 2026
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

      {/* Categories Section - Kohl's Style */}
      <section className="categories-section">
        <div className="section-container">
          <div className="section-header">
            <h2 className="section-title">What are you looking for?</h2>
          </div>
          
          <div className="categories-scroll">
            {categories.map(function(category, index) {
              return (
                <Link 
                  to={category.link} 
                  key={category.id} 
                  className="category-item"
                >
                  <div className="category-circle">
                    {category.image ? (
                      <img src={category.image} alt={category.name} className="category-image" />
                    ) : (
                      <div className="category-placeholder-icon">
                        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                          <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                          <circle cx="8.5" cy="8.5" r="1.5"/>
                          <polyline points="21 15 16 10 5 21"/>
                        </svg>
                      </div>
                    )}
                  </div>
                  <span className="category-name">{category.name}</span>
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
          <p className="promo-text">Use code <span className="promo-code">LAXORA20</span> at checkout</p>
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

      {/* Floating Social Buttons */}
      <div className="floating-social-buttons">
        {socialSettings.whatsapp && (
          <a 
            href={'https://wa.me/' + socialSettings.whatsapp.replace(/[^0-9]/g, '')} 
            target="_blank" 
            rel="noopener noreferrer"
            className="floating-btn whatsapp-btn"
            title="Chat on WhatsApp"
          >
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            <span className="btn-tooltip">WhatsApp</span>
          </a>
        )}
        {socialSettings.instagram && (
          <a 
            href={socialSettings.instagram.startsWith('http') ? socialSettings.instagram : 'https://instagram.com/' + socialSettings.instagram} 
            target="_blank" 
            rel="noopener noreferrer"
            className="floating-btn instagram-btn"
            title="Follow on Instagram"
          >
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
            </svg>
            <span className="btn-tooltip">Instagram</span>
          </a>
        )}
      </div>

      <Footer />
    </div>
  );
}

export default HomePage;
