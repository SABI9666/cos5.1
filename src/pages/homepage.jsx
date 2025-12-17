import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/navbar.jsx';
import Footer from '../components/footer.jsx';
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
      name: 'LED Strip Lights', 
      description: 'Flexible RGB lighting solutions', 
      image: 'https://images.unsplash.com/photo-1550535424-b498819c412f?w=800&q=80', 
      link: '/products?category=strip' 
    },
    { 
      name: 'Smart Bulbs', 
      description: 'WiFi-enabled color-changing bulbs', 
      image: 'https://images.unsplash.com/photo-1532007942811-ed0b29c9f374?w=800&q=80', 
      link: '/products?category=bulbs' 
    },
    { 
      name: 'Panel Lights', 
      description: 'Modern ceiling & wall panels', 
      image: 'https://images.unsplash.com/photo-1540932239986-30128078f3c5?w=800&q=80', 
      link: '/products?category=panels' 
    },
    { 
      name: 'Outdoor Lighting', 
      description: 'Weather-resistant LED solutions', 
      image: 'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=800&q=80', 
      link: '/products?category=outdoor' 
    }
  ];

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

      <section className="section">
        <h2 className="section-title">Shop by Category</h2>
        <p className="section-subtitle">Discover the perfect lighting solution for every space</p>
        <div className="category-grid">
          {categories.map(function(category, index) {
            return (
              <Link to={category.link} key={index} className="category-card">
                <div className="category-image-wrapper">
                  <img src={category.image} alt={category.name} className="category-image" onError={handleImageError} />
                </div>
                <div className="category-overlay"></div>
                <div className="category-info">
                  <h3 className="category-name">{category.name}</h3>
                  <p className="category-description">{category.description}</p>
                  <span className="shop-link">
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
