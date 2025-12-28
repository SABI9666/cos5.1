import React, { useState, useEffect } from 'react';
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
  var activeCategoryState = useState(null);
  var activeCategory = activeCategoryState[0];
  var setActiveCategory = activeCategoryState[1];

  useEffect(function() {
    loadFeaturedProducts();
  }, []);

  function loadFeaturedProducts() {
    getProducts().then(function(products) {
      setFeaturedProducts(products.slice(0, 4));
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
    addToCart(product);
  }

  var categories = [
    { 
      id: 'wall-light',
      name: 'Wall Light', 
      description: 'Elegant wall-mounted lighting fixtures',
      icon: 'wall-light',
      link: '/products?category=wall-light' 
    },
    { 
      id: 'fan',
      name: 'Fan', 
      description: 'Premium ceiling fans with LED lights',
      icon: 'fan',
      link: '/products?category=fan' 
    },
    { 
      id: 'hanging',
      name: 'Hanging', 
      description: 'Pendant & chandelier hanging lights',
      icon: 'hanging',
      link: '/products?category=hanging' 
    },
    { 
      id: 'gate-light',
      name: 'Gate Light', 
      description: 'Outdoor gate & pillar lighting',
      icon: 'gate-light',
      link: '/products?category=gate-light' 
    },
    { 
      id: 'bldc-fan',
      name: 'BLDC Fan', 
      description: 'Energy-efficient brushless DC fans',
      icon: 'bldc-fan',
      link: '/products?category=bldc-fan' 
    },
    { 
      id: 'wall-fan',
      name: 'Wall Fan', 
      description: 'Space-saving wall-mounted fans',
      icon: 'wall-fan',
      link: '/products?category=wall-fan' 
    },
    { 
      id: 'wall-washer',
      name: 'Wall Washer', 
      description: 'Professional wall wash lighting',
      icon: 'wall-washer',
      link: '/products?category=wall-washer' 
    },
    { 
      id: 'bulb',
      name: 'Bulb', 
      description: 'LED bulbs for every fitting',
      icon: 'bulb',
      link: '/products?category=bulb' 
    },
    { 
      id: 'surface-lights',
      name: 'Surface Lights', 
      description: 'Modern surface-mounted fixtures',
      icon: 'surface-lights',
      link: '/products?category=surface-lights' 
    }
  ];

  function getCategoryIcon(iconType) {
    switch(iconType) {
      case 'wall-light':
        return (
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M3 12h2M5 6l1.5 1.5M12 3v2M19 6l-1.5 1.5M21 12h-2" strokeLinecap="round"/>
            <path d="M12 8a4 4 0 0 1 4 4v4H8v-4a4 4 0 0 1 4-4z" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M8 16h8v2a2 2 0 0 1-2 2h-4a2 2 0 0 1-2-2v-2z" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        );
      case 'fan':
        return (
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <circle cx="12" cy="12" r="3" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M12 9c0-3-2-5-2-7 4 0 6 3 6 7" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M15 12c3 0 5-2 7-2 0 4-3 6-7 6" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M12 15c0 3 2 5 2 7-4 0-6-3-6-7" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M9 12c-3 0-5 2-7 2 0-4 3-6 7-6" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        );
      case 'hanging':
        return (
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M12 2v4" strokeLinecap="round"/>
            <path d="M12 6l-4 4v4l4 4 4-4v-4l-4-4z" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M8 14l-2 1v2l6 3 6-3v-2l-2-1" strokeLinecap="round" strokeLinejoin="round"/>
            <circle cx="12" cy="12" r="2" fill="currentColor"/>
          </svg>
        );
      case 'gate-light':
        return (
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M6 22V8l6-5 6 5v14" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M6 12h12" strokeLinecap="round"/>
            <path d="M9 22v-4h6v4" strokeLinecap="round" strokeLinejoin="round"/>
            <circle cx="12" cy="8" r="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M12 6v-3" strokeLinecap="round"/>
          </svg>
        );
      case 'bldc-fan':
        return (
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <circle cx="12" cy="12" r="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M12 10c-1-4-3-6-3-8 5 0 7 4 7 8" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M14 12c4-1 6-3 8-3 0 5-4 7-8 7" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M12 14c1 4 3 6 3 8-5 0-7-4-7-8" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M10 12c-4 1-6 3-8 3 0-5 4-7 8-7" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M3 21l2-2M21 21l-2-2" strokeLinecap="round"/>
          </svg>
        );
      case 'wall-fan':
        return (
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <circle cx="12" cy="10" r="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M12 8c-.5-2-1.5-3-1.5-4 2.5 0 3.5 2 3.5 4" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M14 10c2-.5 3-1.5 4-1.5 0 2.5-2 3.5-4 3.5" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M12 12c.5 2 1.5 3 1.5 4-2.5 0-3.5-2-3.5-4" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M10 10c-2 .5-3 1.5-4 1.5 0-2.5 2-3.5 4-3.5" strokeLinecap="round" strokeLinejoin="round"/>
            <rect x="4" y="4" width="16" height="14" rx="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M10 18v3M14 18v3M8 21h8" strokeLinecap="round"/>
          </svg>
        );
      case 'wall-washer':
        return (
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <rect x="4" y="4" width="16" height="6" rx="1" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M6 10v10M10 10v8M14 10v6M18 10v4" strokeLinecap="round" opacity="0.6"/>
            <circle cx="7" cy="7" r="1" fill="currentColor"/>
            <circle cx="11" cy="7" r="1" fill="currentColor"/>
            <circle cx="15" cy="7" r="1" fill="currentColor"/>
          </svg>
        );
      case 'bulb':
        return (
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M9 21h6M12 3a6 6 0 0 0-6 6c0 2.22 1.21 4.16 3 5.19V17a1 1 0 0 0 1 1h4a1 1 0 0 0 1-1v-2.81c1.79-1.03 3-2.97 3-5.19a6 6 0 0 0-6-6z" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M12 3v1M5.6 5.6l.7.7M3 12h1M5.6 18.4l.7-.7M18.4 5.6l-.7.7M21 12h-1M18.4 18.4l-.7-.7" strokeLinecap="round"/>
          </svg>
        );
      case 'surface-lights':
        return (
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <rect x="3" y="6" width="18" height="12" rx="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M7 10h10M7 14h10" strokeLinecap="round" opacity="0.6"/>
            <circle cx="12" cy="12" r="3" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M12 3v3M12 18v3" strokeLinecap="round"/>
          </svg>
        );
      default:
        return (
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <circle cx="12" cy="12" r="10" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        );
    }
  }

  return (
    <div className="home-page">
      <Navbar onCartClick={onCartClick} cartCount={cartCount} />
      
      <section className="hero-section">
        <div className="hero-background-container">
          <img src="https://images.unsplash.com/photo-1524484485831-a92ffc0de03f?w=1920&q=80" alt="Premium Hanging Lights" className="hero-background" />
        </div>
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <h1 className="hero-title">Illuminate Your <span className="highlight">World</span></h1>
          <p className="hero-subtitle">Premium LED lighting solutions for modern living spaces</p>
          <Link to="/products" className="cta-button">Explore Collection</Link>
        </div>
      </section>

      {/* Events Banner - Promotional Slider */}
      <EventsBanner />

      <section className="section category-section">
        <h2 className="section-title">Shop by Category</h2>
        <p className="section-subtitle">Discover the perfect lighting solution for every space</p>
        
        <div className="category-menu">
          {categories.map(function(category, index) {
            return (
              <Link 
                to={category.link} 
                key={category.id} 
                className={activeCategory === category.id ? "category-menu-item active" : "category-menu-item"}
                onMouseEnter={function() { setActiveCategory(category.id); }}
                onMouseLeave={function() { setActiveCategory(null); }}
              >
                <div className="category-menu-icon">
                  {getCategoryIcon(category.icon)}
                </div>
                <div className="category-menu-content">
                  <h3 className="category-menu-name">{category.name}</h3>
                  <p className="category-menu-desc">{category.description}</p>
                </div>
                <div className="category-menu-arrow">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M9 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div className="category-menu-glow"></div>
              </Link>
            );
          })}
        </div>

        <div className="category-browse-all">
          <Link to="/products" className="browse-all-btn">
            <span>Browse All Products</span>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </Link>
        </div>
      </section>

      <section className="section featured-section">
        <h2 className="section-title">Featured Products</h2>
        <p className="section-subtitle">Handpicked premium LED solutions</p>
        {loading ? (
          <div className="loading-container"><div className="loading-spinner"></div></div>
        ) : featuredProducts.length === 0 ? (
          <div className="no-products-message">
            <div className="no-products-icon">
              <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h3>No Products Yet</h3>
            <p>Add products from the Admin Panel to display here</p>
            <Link to="/admin" className="admin-link-btn">Go to Admin Panel</Link>
          </div>
        ) : (
          <div className="product-grid">
            {featuredProducts.map(function(product) {
              return (
                <div key={product.id} className="product-card">
                  <Link to={'/product/' + product.id} className="product-image-container">
                    <img src={product.imageUrl || 'https://images.unsplash.com/photo-1565814329452-e1efa11c5b89?w=400'} alt={product.name} className="product-image" onError={handleImageError} />
                    {product.badge && <span className="product-badge">{product.badge}</span>}
                  </Link>
                  <div className="product-info">
                    <span className="product-category">{product.category}</span>
                    <h3 className="product-name">{product.name}</h3>
                    <p className="product-description">{product.description}</p>
                    <div className="product-footer">
                      <span className="product-price">Rs.{product.price ? product.price.toLocaleString() : '0'}</span>
                      <button className="add-to-cart-btn" onClick={function(e) { handleAddToCart(e, product); }}>Add to Cart</button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
        <div className="view-all-container">
          <Link to="/products" className="view-all-btn">View All Products</Link>
        </div>
      </section>

      <section className="section features-section">
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                <path d="M13 2L3 14h8l-1 8 10-12h-8l1-8z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h3>Energy Efficient</h3>
            <p>Save up to 80% on energy costs</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                <rect x="5" y="2" width="14" height="20" rx="2" ry="2" stroke="currentColor" strokeWidth="2"/>
                <line x1="12" y1="18" x2="12.01" y2="18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </div>
            <h3>Smart Control</h3>
            <p>WiFi-enabled control via smartphone</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                <polyline points="12 6 12 12 16 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h3>Long Lifespan</h3>
            <p>50,000+ hours of operation</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h3>Quality Assured</h3>
            <p>2-year warranty on all products</p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default HomePage;
