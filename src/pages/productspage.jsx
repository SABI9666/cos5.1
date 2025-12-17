import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import Navbar from '../components/navbar.jsx';
import Footer from '../components/footer.jsx';
import { getProducts } from '../services/api';
import './productspage.css';

function ProductsPage(props) {
  var addToCart = props.addToCart;
  var onCartClick = props.onCartClick;
  var cartCount = props.cartCount;
  var searchParamsResult = useSearchParams();
  var searchParams = searchParamsResult[0];
  var productsState = useState([]);
  var products = productsState[0];
  var setProducts = productsState[1];
  var filteredState = useState([]);
  var filteredProducts = filteredState[0];
  var setFilteredProducts = filteredState[1];
  var categoryState = useState('all');
  var selectedCategory = categoryState[0];
  var setSelectedCategory = categoryState[1];
  var loadingState = useState(true);
  var loading = loadingState[0];
  var setLoading = loadingState[1];
  var filterState = useState(false);
  var filterOpen = filterState[0];
  var setFilterOpen = filterState[1];

  var categories = [
    { id: 'all', name: 'All Products', icon: 'all' },
    { id: 'strip', name: 'LED Strips', icon: 'strip' },
    { id: 'bulbs', name: 'Smart Bulbs', icon: 'bulb' },
    { id: 'panels', name: 'Panel Lights', icon: 'panel' },
    { id: 'outdoor', name: 'Outdoor Lighting', icon: 'outdoor' },
    { id: 'decorative', name: 'Decorative', icon: 'decorative' },
    { id: 'accessories', name: 'Accessories', icon: 'accessories' }
  ];

  useEffect(function() { loadProducts(); }, []);
  useEffect(function() {
    var category = searchParams.get('category');
    if (category) setSelectedCategory(category);
  }, [searchParams]);
  useEffect(function() {
    if (selectedCategory === 'all') {
      setFilteredProducts(products);
    } else {
      setFilteredProducts(products.filter(function(p) { return p.category === selectedCategory; }));
    }
  }, [selectedCategory, products]);

  function loadProducts() {
    getProducts().then(function(data) {
      setProducts(data);
      setLoading(false);
    }).catch(function(error) {
      console.error('Error loading products:', error);
      setLoading(false);
    });
  }

  function handleCategorySelect(categoryId) {
    setSelectedCategory(categoryId);
    setFilterOpen(false);
  }

  function handleAddToCart(e, product) {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
  }

  function handleImageError(e) {
    e.target.src = 'https://images.unsplash.com/photo-1565814329452-e1efa11c5b89?w=400';
  }

  function toggleFilter() {
    setFilterOpen(!filterOpen);
  }

  function closeFilter() {
    setFilterOpen(false);
  }

  function getCategoryName() {
    var cat = categories.find(function(c) { return c.id === selectedCategory; });
    return cat ? cat.name : 'All Products';
  }

  function getCategoryIcon(iconType) {
    switch(iconType) {
      case 'all':
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <rect x="3" y="3" width="7" height="7" rx="1" strokeLinecap="round" strokeLinejoin="round"/>
            <rect x="14" y="3" width="7" height="7" rx="1" strokeLinecap="round" strokeLinejoin="round"/>
            <rect x="3" y="14" width="7" height="7" rx="1" strokeLinecap="round" strokeLinejoin="round"/>
            <rect x="14" y="14" width="7" height="7" rx="1" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        );
      case 'strip':
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M2 12h20M2 12c0-1.5 1-3 3-3h14c2 0 3 1.5 3 3s-1 3-3 3H5c-2 0-3-1.5-3-3z" strokeLinecap="round" strokeLinejoin="round"/>
            <circle cx="7" cy="12" r="1" fill="currentColor"/>
            <circle cx="12" cy="12" r="1" fill="currentColor"/>
            <circle cx="17" cy="12" r="1" fill="currentColor"/>
          </svg>
        );
      case 'bulb':
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M9 21h6M12 3a6 6 0 0 0-6 6c0 2.22 1.21 4.16 3 5.19V17a1 1 0 0 0 1 1h4a1 1 0 0 0 1-1v-2.81c1.79-1.03 3-2.97 3-5.19a6 6 0 0 0-6-6z" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        );
      case 'panel':
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <rect x="3" y="3" width="18" height="18" rx="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M3 9h18M9 3v18" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        );
      case 'outdoor':
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <circle cx="12" cy="12" r="4" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" strokeLinecap="round"/>
          </svg>
        );
      case 'decorative':
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M12 2L8 8h8l-4-6zM12 8v4" strokeLinecap="round" strokeLinejoin="round"/>
            <circle cx="12" cy="15" r="3" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M12 18v4M8 22h8" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        );
      case 'accessories':
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <circle cx="12" cy="12" r="3" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        );
      default:
        return (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <circle cx="12" cy="12" r="10" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        );
    }
  }

  function getCategoryCount(categoryId) {
    if (categoryId === 'all') return products.length;
    return products.filter(function(p) { return p.category === categoryId; }).length;
  }

  return (
    <div className="products-page">
      <Navbar onCartClick={onCartClick} cartCount={cartCount} />
      
      <div className="products-hero">
        <h1>Our Collection</h1>
        <p>Discover premium LED lighting solutions for every space</p>
      </div>
      
      <div className="products-container">
        <button className={filterOpen ? "mobile-filter-toggle active" : "mobile-filter-toggle"} onClick={toggleFilter}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M4 21v-7M4 10V3M12 21v-9M12 8V3M20 21v-5M20 12V3M1 14h6M9 8h6M17 16h6" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span>Filter</span>
          <span className="current-filter">{getCategoryName()}</span>
        </button>
        
        <aside className={filterOpen ? "products-sidebar open" : "products-sidebar"}>
          <div className="sidebar-header">
            <h3>Categories</h3>
            <button className="sidebar-close" onClick={closeFilter}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
          
          <div className="category-filter-list">
            {categories.map(function(category) {
              var count = getCategoryCount(category.id);
              return (
                <button 
                  key={category.id} 
                  className={selectedCategory === category.id ? "category-filter-item active" : "category-filter-item"} 
                  onClick={function() { handleCategorySelect(category.id); }}
                >
                  <div className="category-filter-icon">
                    {getCategoryIcon(category.icon)}
                  </div>
                  <span className="category-filter-name">{category.name}</span>
                  <span className="category-filter-count">{count}</span>
                </button>
              );
            })}
          </div>
        </aside>
        
        {filterOpen && <div className="sidebar-overlay" onClick={closeFilter}></div>}
        
        <main className="products-main">
          <div className="products-header">
            <h2>{getCategoryName()}</h2>
            <p className="products-count">{filteredProducts.length} products</p>
          </div>
          
          {loading ? (
            <div className="loading-container"><div className="loading-spinner"></div></div>
          ) : filteredProducts.length === 0 ? (
            <div className="no-products">
              <div className="no-products-icon">
                <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h3>No Products Found</h3>
              <p>No products available in this category</p>
              <button className="reset-filter-btn" onClick={function() { setSelectedCategory('all'); }}>View All Products</button>
            </div>
          ) : (
            <div className="product-grid">
              {filteredProducts.map(function(product) {
                return (
                  <div key={product.id} className="product-card">
                    <Link to={'/product/' + product.id} className="product-image-container">
                      <img src={product.imageUrl || 'https://images.unsplash.com/photo-1565814329452-e1efa11c5b89?w=400'} alt={product.name} className="product-image" onError={handleImageError} />
                      {product.badge && <span className="product-badge">{product.badge}</span>}
                    </Link>
                    <div className="product-info">
                      <span className="product-category">{product.category}</span>
                      <Link to={'/product/' + product.id} className="product-name-link">
                        <h3 className="product-name">{product.name}</h3>
                      </Link>
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
        </main>
      </div>
      
      <Footer />
    </div>
  );
}

export default ProductsPage;
