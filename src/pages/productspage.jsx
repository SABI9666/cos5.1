import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/navbar.jsx';
import Footer from '../components/footer.jsx';
import { getProducts } from '../services/api';
import './productspage.css';

function ProductsPage(props) {
  var addToCart = props.addToCart;
  var onCartClick = props.onCartClick;
  var cartCount = props.cartCount;

  var productsState = useState([]);
  var products = productsState[0];
  var setProducts = productsState[1];

  var loadingState = useState(true);
  var loading = loadingState[0];
  var setLoading = loadingState[1];

  var categoryState = useState('All');
  var selectedCategory = categoryState[0];
  var setSelectedCategory = categoryState[1];

  var sortState = useState('default');
  var sortBy = sortState[0];
  var setSortBy = sortState[1];

  var searchState = useState('');
  var searchQuery = searchState[0];
  var setSearchQuery = searchState[1];

  var mobileFilterState = useState(false);
  var showMobileFilter = mobileFilterState[0];
  var setShowMobileFilter = mobileFilterState[1];

  useEffect(function() {
    loadProducts();
  }, []);

  function loadProducts() {
    setLoading(true);
    getProducts()
      .then(function(data) {
        setProducts(data);
        setLoading(false);
      })
      .catch(function(error) {
        console.error('Error loading products:', error);
        setLoading(false);
      });
  }

  // Get unique categories
  var categories = ['All'];
  products.forEach(function(product) {
    if (product.category && categories.indexOf(product.category) === -1) {
      categories.push(product.category);
    }
  });

  // Get category counts
  function getCategoryCount(category) {
    if (category === 'All') return products.length;
    return products.filter(function(p) {
      return p.category === category;
    }).length;
  }

  // Filter and sort products
  var filteredProducts = products.filter(function(product) {
    var matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
    var matchesSearch = !searchQuery || 
      (product.name && product.name.toLowerCase().indexOf(searchQuery.toLowerCase()) !== -1) ||
      (product.category && product.category.toLowerCase().indexOf(searchQuery.toLowerCase()) !== -1);
    return matchesCategory && matchesSearch;
  });

  // Sort products
  if (sortBy === 'price-low') {
    filteredProducts.sort(function(a, b) { return a.price - b.price; });
  } else if (sortBy === 'price-high') {
    filteredProducts.sort(function(a, b) { return b.price - a.price; });
  } else if (sortBy === 'name') {
    filteredProducts.sort(function(a, b) { return a.name.localeCompare(b.name); });
  }

  function handleCategoryClick(category) {
    setSelectedCategory(category);
    setShowMobileFilter(false);
  }

  function handleImageError(e) {
    e.target.src = 'https://via.placeholder.com/400x400?text=LED+Light';
  }

  function handleAddToCart(e, product) {
    e.preventDefault();
    e.stopPropagation();
    if (addToCart) {
      addToCart(product);
    }
  }

  return (
    <div className="products-page">
      <Navbar onCartClick={onCartClick} cartCount={cartCount} />

      {/* Hero Section */}
      <section className="products-hero">
        <h1>Our <span>Collection</span></h1>
        <p>Discover premium LED lighting solutions for every space</p>
      </section>

      <div className="products-container">
        {/* Desktop Sidebar + Mobile Filter Toggle */}
        <div className="products-layout">
          
          {/* Sidebar - Desktop */}
          <aside className="products-sidebar">
            <div className="sidebar-section">
              <h3>Categories</h3>
              <ul className="category-list">
                {categories.map(function(category) {
                  return (
                    <li key={category}>
                      <button
                        className={selectedCategory === category ? 'category-btn active' : 'category-btn'}
                        onClick={function() { handleCategoryClick(category); }}
                      >
                        <span className="category-name">{category}</span>
                        <span className="category-count">{getCategoryCount(category)}</span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>

            <div className="sidebar-section">
              <h3>Price Range</h3>
              <div className="price-filters">
                <button 
                  className={sortBy === 'price-low' ? 'price-btn active' : 'price-btn'}
                  onClick={function() { setSortBy(sortBy === 'price-low' ? 'default' : 'price-low'); }}
                >
                  Low to High
                </button>
                <button 
                  className={sortBy === 'price-high' ? 'price-btn active' : 'price-btn'}
                  onClick={function() { setSortBy(sortBy === 'price-high' ? 'default' : 'price-high'); }}
                >
                  High to Low
                </button>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="products-main">
            {/* Top Bar */}
            <div className="products-topbar">
              <div className="topbar-left">
                {/* Mobile Filter Button */}
                <button 
                  className="mobile-filter-btn"
                  onClick={function() { setShowMobileFilter(!showMobileFilter); }}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="4" y1="6" x2="20" y2="6"/>
                    <line x1="4" y1="12" x2="16" y2="12"/>
                    <line x1="4" y1="18" x2="12" y2="18"/>
                  </svg>
                  Filters
                </button>
                <span className="products-count">
                  <span>{filteredProducts.length}</span> products
                </span>
              </div>

              <div className="topbar-right">
                <div className="search-box">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="11" cy="11" r="8"/>
                    <path d="M21 21l-4.35-4.35"/>
                  </svg>
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={function(e) { setSearchQuery(e.target.value); }}
                  />
                  {searchQuery && (
                    <button 
                      className="clear-search"
                      onClick={function() { setSearchQuery(''); }}
                    >
                      ×
                    </button>
                  )}
                </div>

                <select 
                  className="sort-select"
                  value={sortBy}
                  onChange={function(e) { setSortBy(e.target.value); }}
                >
                  <option value="default">Sort by</option>
                  <option value="name">Name A-Z</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                </select>
              </div>
            </div>

            {/* Mobile Filter Panel */}
            {showMobileFilter && (
              <div className="mobile-filter-panel">
                <div className="mobile-filter-header">
                  <h3>Filters</h3>
                  <button onClick={function() { setShowMobileFilter(false); }}>×</button>
                </div>
                <div className="mobile-filter-content">
                  <div className="filter-section">
                    <h4>Categories</h4>
                    <div className="mobile-categories">
                      {categories.map(function(category) {
                        return (
                          <button
                            key={category}
                            className={selectedCategory === category ? 'mobile-cat-btn active' : 'mobile-cat-btn'}
                            onClick={function() { handleCategoryClick(category); }}
                          >
                            {category}
                            <span>({getCategoryCount(category)})</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                  <div className="filter-section">
                    <h4>Sort By</h4>
                    <div className="mobile-sort">
                      <button
                        className={sortBy === 'price-low' ? 'active' : ''}
                        onClick={function() { setSortBy('price-low'); setShowMobileFilter(false); }}
                      >
                        Price: Low to High
                      </button>
                      <button
                        className={sortBy === 'price-high' ? 'active' : ''}
                        onClick={function() { setSortBy('price-high'); setShowMobileFilter(false); }}
                      >
                        Price: High to Low
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Active Filters */}
            {(selectedCategory !== 'All' || searchQuery) && (
              <div className="active-filters">
                {selectedCategory !== 'All' && (
                  <span className="filter-tag">
                    {selectedCategory}
                    <button onClick={function() { setSelectedCategory('All'); }}>×</button>
                  </span>
                )}
                {searchQuery && (
                  <span className="filter-tag">
                    "{searchQuery}"
                    <button onClick={function() { setSearchQuery(''); }}>×</button>
                  </span>
                )}
                <button 
                  className="clear-all-btn"
                  onClick={function() { setSelectedCategory('All'); setSearchQuery(''); setSortBy('default'); }}
                >
                  Clear All
                </button>
              </div>
            )}

            {/* Products Grid */}
            {loading ? (
              <div className="loading-container">
                <div className="loading-spinner"></div>
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="no-products">
                <div className="no-products-icon">
                  <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <circle cx="11" cy="11" r="8"/>
                    <path d="M21 21l-4.35-4.35"/>
                    <line x1="8" y1="11" x2="14" y2="11"/>
                  </svg>
                </div>
                <h3>No products found</h3>
                <p>Try adjusting your filters or search query</p>
                <button 
                  className="clear-filters-btn"
                  onClick={function() { setSelectedCategory('All'); setSearchQuery(''); }}
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <div className="products-grid">
                {filteredProducts.map(function(product) {
                  return (
                    <Link to={'/product/' + product.id} key={product.id} className="product-card">
                      {/* Product Image */}
                      <div className="product-image-wrapper">
                        <div className="product-image">
                          <img 
                            src={product.imageUrl || 'https://via.placeholder.com/400x400?text=LED+Light'} 
                            alt={product.name}
                            onError={handleImageError}
                          />
                        </div>
                        {product.badge && (
                          <span className="product-badge">{product.badge}</span>
                        )}
                        {product.discount && (
                          <span className="product-badge sale">{product.discount}% OFF</span>
                        )}
                        <div className="product-overlay">
                          <span className="quick-view-btn">Quick View</span>
                        </div>
                      </div>
                      
                      {/* Product Details */}
                      <div className="product-details">
                        <span className="product-category">{product.category || 'LED Light'}</span>
                        <h3 className="product-name">{product.name || 'LED Product'}</h3>
                        <div className="product-footer">
                          <div className="product-price">
                            <span className="price-current">₹{product.price ? product.price.toLocaleString() : '0'}</span>
                            {product.originalPrice && (
                              <span className="price-original">₹{product.originalPrice.toLocaleString()}</span>
                            )}
                          </div>
                          <button 
                            className="add-to-cart-btn"
                            onClick={function(e) { handleAddToCart(e, product); }}
                            aria-label="Add to cart"
                          >
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <circle cx="9" cy="21" r="1"/>
                              <circle cx="20" cy="21" r="1"/>
                              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
                            </svg>
                            <span>Add</span>
                          </button>
                        </div>
                        {product.quantity !== undefined && product.quantity <= 5 && product.quantity > 0 && (
                          <span className="stock-warning">Only {product.quantity} left!</span>
                        )}
                        {product.quantity === 0 && (
                          <span className="out-of-stock">Out of Stock</span>
                        )}
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </main>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default ProductsPage;
