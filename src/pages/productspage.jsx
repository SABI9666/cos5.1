import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import Navbar from '../components/navbar.jsx';
import Footer from '../components/footer.jsx';
import { getProducts, getCategories } from '../services/api';
import './productspage.css';

function ProductsPage(props) {
  var addToCart = props.addToCart;
  var onCartClick = props.onCartClick;
  var cartCount = props.cartCount;

  // Get URL search params
  var searchParamsResult = useSearchParams();
  var searchParams = searchParamsResult[0];
  var setSearchParams = searchParamsResult[1];

  var productsState = useState([]);
  var products = productsState[0];
  var setProducts = productsState[1];

  var loadingState = useState(true);
  var loading = loadingState[0];
  var setLoading = loadingState[1];

  // Categories from Firebase
  var categoriesDataState = useState([]);
  var categoriesData = categoriesDataState[0];
  var setCategoriesData = categoriesDataState[1];

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

  // Load products and categories
  useEffect(function() {
    loadProducts();
    loadCategoriesData();
  }, []);

  // Handle URL query parameter for category
  useEffect(function() {
    var categoryParam = searchParams.get('category');
    if (categoryParam && categoriesData.length > 0) {
      // Find category by ID or name (case-insensitive)
      var foundCategory = categoriesData.find(function(cat) {
        return cat.id === categoryParam || 
               cat.id.toLowerCase() === categoryParam.toLowerCase() ||
               cat.name.toLowerCase() === categoryParam.toLowerCase();
      });
      
      if (foundCategory) {
        setSelectedCategory(foundCategory.name);
      } else {
        // Try direct match with product categories
        var productCategory = products.find(function(p) {
          return p.category && p.category.toLowerCase() === categoryParam.toLowerCase();
        });
        if (productCategory) {
          setSelectedCategory(productCategory.category);
        }
      }
    } else if (!categoryParam) {
      setSelectedCategory('All');
    }
  }, [searchParams, categoriesData, products]);

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

  function loadCategoriesData() {
    getCategories()
      .then(function(data) {
        if (data && data.length > 0) {
          setCategoriesData(data);
        }
      })
      .catch(function(error) {
        console.error('Error loading categories:', error);
      });
  }

  // Build categories list from both Firebase categories and actual product categories
  var categories = ['All'];
  
  // First add categories from Firebase
  categoriesData.forEach(function(cat) {
    if (cat.name && categories.indexOf(cat.name) === -1) {
      categories.push(cat.name);
    }
  });
  
  // Then add any product categories that might not be in Firebase
  products.forEach(function(product) {
    if (product.category && categories.indexOf(product.category) === -1) {
      categories.push(product.category);
    }
  });

  // Get category count - check both exact match and ID match
  function getCategoryCount(categoryName) {
    if (categoryName === 'All') return products.length;
    
    // Find the category data to get the ID
    var catData = categoriesData.find(function(c) {
      return c.name === categoryName;
    });
    
    return products.filter(function(p) {
      if (!p.category) return false;
      
      // Check for exact name match (case-insensitive)
      if (p.category.toLowerCase() === categoryName.toLowerCase()) {
        return true;
      }
      
      // Check if product category matches category ID
      if (catData && p.category.toLowerCase() === catData.id.toLowerCase()) {
        return true;
      }
      
      // Check if product category matches without hyphens/spaces
      var normalizedProductCat = p.category.toLowerCase().replace(/[-\s]/g, '');
      var normalizedCategoryName = categoryName.toLowerCase().replace(/[-\s]/g, '');
      if (normalizedProductCat === normalizedCategoryName) {
        return true;
      }
      
      return false;
    }).length;
  }

  // Filter products - match by category name or category ID
  var filteredProducts = products.filter(function(product) {
    var matchesCategory = false;
    
    if (selectedCategory === 'All') {
      matchesCategory = true;
    } else {
      // Find the category data to get the ID
      var catData = categoriesData.find(function(c) {
        return c.name === selectedCategory;
      });
      
      if (product.category) {
        // Check for exact name match (case-insensitive)
        if (product.category.toLowerCase() === selectedCategory.toLowerCase()) {
          matchesCategory = true;
        }
        // Check if product category matches category ID
        else if (catData && product.category.toLowerCase() === catData.id.toLowerCase()) {
          matchesCategory = true;
        }
        // Check normalized match (without hyphens/spaces)
        else {
          var normalizedProductCat = product.category.toLowerCase().replace(/[-\s]/g, '');
          var normalizedSelectedCat = selectedCategory.toLowerCase().replace(/[-\s]/g, '');
          if (normalizedProductCat === normalizedSelectedCat) {
            matchesCategory = true;
          }
        }
      }
    }
    
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
    
    // Update URL parameter
    if (category === 'All') {
      searchParams.delete('category');
    } else {
      // Find category ID for URL
      var catData = categoriesData.find(function(c) {
        return c.name === category;
      });
      if (catData) {
        searchParams.set('category', catData.id);
      } else {
        searchParams.set('category', category.toLowerCase().replace(/\s+/g, '-'));
      }
    }
    setSearchParams(searchParams);
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

  function handleClearAll() {
    setSelectedCategory('All');
    setSearchQuery('');
    setSortBy('default');
    searchParams.delete('category');
    setSearchParams(searchParams);
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
                    <button onClick={function() { handleCategoryClick('All'); }}>×</button>
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
                  onClick={handleClearAll}
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
                  onClick={handleClearAll}
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
