import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import Navbar from '../components/navbar.jsx';
import Footer from '../components/footer.jsx';
import { getProducts, getCategories } from '../services/api';
import './productspage.css';

// Main Categories Data Structure - Same as homepage and admin
var DEFAULT_MAIN_CATEGORIES = {
  'led-lights': {
    id: 'led-lights',
    name: 'LED Lights',
    description: 'Premium lighting solutions for every space',
    icon: 'bulb',
    color: '#f59e0b',
    subcategories: [
      { id: 'wall-light', name: 'Wall Light' },
      { id: 'fan', name: 'Fan' },
      { id: 'hanging', name: 'Hanging' },
      { id: 'gate-light', name: 'Gate Light' },
      { id: 'bldc-fan', name: 'BLDC Fan' },
      { id: 'wall-fan', name: 'Wall Fan' },
      { id: 'wall-washer', name: 'Wall Washer' },
      { id: 'bulb', name: 'Bulb' },
      { id: 'surface-lights', name: 'Surface Lights' },
      { id: 'street-light', name: 'Street Light' },
      { id: 'spot-light', name: 'Spot Light' },
      { id: 'cylinder-light', name: 'Cylinder Light' },
      { id: 'smps', name: 'SMPS' }
    ]
  },
  'dress': {
    id: 'dress',
    name: 'Dress',
    description: 'Stylish clothing for all occasions',
    icon: 'shirt',
    color: '#ec4899',
    subcategories: [
      { id: 'gents-dress', name: 'Gents Dress' },
      { id: 'ladies-dress', name: 'Ladies Dress' }
    ]
  },
  'kids-items': {
    id: 'kids-items',
    name: 'Kids Items',
    description: 'Everything for your little ones',
    icon: 'baby',
    color: '#8b5cf6',
    subcategories: [
      { id: 'kids-clothing', name: 'Kids Clothing' },
      { id: 'kids-toys', name: 'Kids Toys' },
      { id: 'kids-accessories', name: 'Kids Accessories' }
    ]
  }
};

function ProductsPage(props) {
  var addToCart = props.addToCart;
  var onCartClick = props.onCartClick;
  var cartCount = props.cartCount;

  var searchParamsResult = useSearchParams();
  var searchParams = searchParamsResult[0];
  var setSearchParams = searchParamsResult[1];

  var productsState = useState([]);
  var products = productsState[0];
  var setProducts = productsState[1];

  var loadingState = useState(true);
  var loading = loadingState[0];
  var setLoading = loadingState[1];

  var categoriesDataState = useState([]);
  var categoriesData = categoriesDataState[0];
  var setCategoriesData = categoriesDataState[1];

  var mainCategoriesState = useState(DEFAULT_MAIN_CATEGORIES);
  var mainCategories = mainCategoriesState[0];
  var setMainCategories = mainCategoriesState[1];

  var selectedMainCatState = useState(null);
  var selectedMainCat = selectedMainCatState[0];
  var setSelectedMainCat = selectedMainCatState[1];

  var selectedSubcatState = useState(null);
  var selectedSubcat = selectedSubcatState[0];
  var setSelectedSubcat = selectedSubcatState[1];

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
    loadCategoriesData();
    loadSavedCategories();
  }, []);

  useEffect(function() {
    var mainCategoryParam = searchParams.get('mainCategory');
    var categoryParam = searchParams.get('category');
    
    if (mainCategoryParam && mainCategories[mainCategoryParam]) {
      setSelectedMainCat(mainCategoryParam);
      if (categoryParam) {
        setSelectedSubcat(categoryParam);
      } else {
        setSelectedSubcat(null);
      }
    } else if (categoryParam) {
      var foundMainCat = null;
      var foundSubcat = categoryParam;
      
      Object.keys(mainCategories).forEach(function(mainCatId) {
        var mainCat = mainCategories[mainCatId];
        var subcat = mainCat.subcategories.find(function(sub) {
          return sub.id === categoryParam || 
                 sub.id.toLowerCase() === categoryParam.toLowerCase() ||
                 sub.name.toLowerCase() === categoryParam.toLowerCase();
        });
        if (subcat) {
          foundMainCat = mainCatId;
          foundSubcat = subcat.id;
        }
      });
      
      if (foundMainCat) {
        setSelectedMainCat(foundMainCat);
        setSelectedSubcat(foundSubcat);
      } else {
        setSelectedMainCat(null);
        setSelectedSubcat(categoryParam);
      }
    } else {
      setSelectedMainCat(null);
      setSelectedSubcat(null);
    }
  }, [searchParams, mainCategories]);

  function loadSavedCategories() {
    var savedCategories = localStorage.getItem('laxora_main_categories');
    if (savedCategories) {
      try {
        var parsed = JSON.parse(savedCategories);
        var merged = { ...DEFAULT_MAIN_CATEGORIES };
        Object.keys(parsed).forEach(function(key) {
          if (merged[key]) {
            merged[key].subcategories = parsed[key].subcategories;
          } else {
            merged[key] = parsed[key];
          }
        });
        setMainCategories(merged);
      } catch (e) {
        console.error('Error parsing saved categories:', e);
      }
    }
  }

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

  function getSubcategoryIds(mainCatId) {
    if (!mainCatId || !mainCategories[mainCatId]) return [];
    return mainCategories[mainCatId].subcategories.map(function(sub) {
      return sub.id.toLowerCase();
    });
  }

  function productMatchesSubcategory(product, subcatId) {
    if (!product.category) return false;
    var productCat = product.category.toLowerCase().replace(/[-\s]/g, '');
    var subcatNormalized = subcatId.toLowerCase().replace(/[-\s]/g, '');
    return productCat === subcatNormalized ||
           product.category.toLowerCase() === subcatId.toLowerCase() ||
           product.category.toLowerCase().replace(/\s+/g, '-') === subcatId.toLowerCase();
  }

  var filteredProducts = products.filter(function(product) {
    var matchesCategory = false;
    
    if (!selectedMainCat && !selectedSubcat) {
      matchesCategory = true;
    } else if (selectedMainCat && !selectedSubcat) {
      var subcatIds = getSubcategoryIds(selectedMainCat);
      matchesCategory = subcatIds.some(function(subcatId) {
        return productMatchesSubcategory(product, subcatId);
      });
    } else if (selectedSubcat) {
      matchesCategory = productMatchesSubcategory(product, selectedSubcat);
    }
    
    var matchesSearch = !searchQuery || 
      (product.name && product.name.toLowerCase().indexOf(searchQuery.toLowerCase()) !== -1) ||
      (product.category && product.category.toLowerCase().indexOf(searchQuery.toLowerCase()) !== -1);
    
    return matchesCategory && matchesSearch;
  });

  if (sortBy === 'price-low') {
    filteredProducts.sort(function(a, b) { return a.price - b.price; });
  } else if (sortBy === 'price-high') {
    filteredProducts.sort(function(a, b) { return b.price - a.price; });
  } else if (sortBy === 'name') {
    filteredProducts.sort(function(a, b) { return a.name.localeCompare(b.name); });
  }

  function getSubcategoryCount(subcatId) {
    return products.filter(function(p) {
      return productMatchesSubcategory(p, subcatId);
    }).length;
  }

  function handleMainCategoryClick(mainCatId) {
    setSelectedMainCat(mainCatId);
    setSelectedSubcat(null);
    setShowMobileFilter(false);
    
    if (mainCatId) {
      searchParams.set('mainCategory', mainCatId);
      searchParams.delete('category');
    } else {
      searchParams.delete('mainCategory');
      searchParams.delete('category');
    }
    setSearchParams(searchParams);
  }

  function handleSubcategoryClick(subcatId) {
    setSelectedSubcat(subcatId);
    setShowMobileFilter(false);
    
    if (subcatId) {
      searchParams.set('category', subcatId);
      if (selectedMainCat) {
        searchParams.set('mainCategory', selectedMainCat);
      }
    } else {
      searchParams.delete('category');
    }
    setSearchParams(searchParams);
  }

  function handleImageError(e) {
    e.target.src = 'https://images.unsplash.com/photo-1565814329452-e1efa11c5b89?w=400';
  }

  function handleAddToCart(e, product) {
    e.preventDefault();
    e.stopPropagation();
    if (addToCart) {
      addToCart(product);
    }
  }

  function handleClearAll() {
    setSelectedMainCat(null);
    setSelectedSubcat(null);
    setSearchQuery('');
    setSortBy('default');
    searchParams.delete('category');
    searchParams.delete('mainCategory');
    setSearchParams(searchParams);
  }

  var currentMainCat = selectedMainCat ? mainCategories[selectedMainCat] : null;
  
  var currentSubcatName = null;
  if (selectedSubcat && currentMainCat) {
    var foundSubcat = currentMainCat.subcategories.find(function(sub) {
      return sub.id === selectedSubcat;
    });
    if (foundSubcat) {
      currentSubcatName = foundSubcat.name;
    }
  }

  function getHeroDescription() {
    if (currentMainCat) {
      return currentMainCat.description;
    }
    return 'Discover premium products for every need';
  }

  function getMainCategoryIcon(iconType) {
    switch (iconType) {
      case 'bulb':
        return (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 18h6"/><path d="M10 22h4"/>
            <path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0 0 18 8 6 6 0 0 0 6 8c0 1 .23 2.23 1.5 3.5A4.61 4.61 0 0 1 8.91 14"/>
          </svg>
        );
      case 'shirt':
        return (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20.38 3.46 16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.47a1 1 0 0 0 .99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.47a2 2 0 0 0-1.34-2.23z"/>
          </svg>
        );
      case 'baby':
        return (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 12h.01"/><path d="M15 12h.01"/><path d="M10 16c.5.3 1.2.5 2 .5s1.5-.2 2-.5"/>
            <path d="M19 6.3a9 9 0 0 1 1.8 3.9 2 2 0 0 1 0 3.6 9 9 0 0 1-17.6 0 2 2 0 0 1 0-3.6A9 9 0 0 1 12 3c2 0 3.5 1.1 3.5 2.5s-.9 2.5-2 2.5c-.8 0-1.5-.4-1.5-1"/>
          </svg>
        );
      default:
        return (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
            <rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
          </svg>
        );
    }
  }

  return (
    <div className="products-page">
      <Navbar onCartClick={onCartClick} cartCount={cartCount} />

      {/* Hero Section */}
      <section className="products-hero" style={currentMainCat ? { '--hero-accent': currentMainCat.color } : {}}>
        {(selectedMainCat || selectedSubcat) && (
          <nav className="products-breadcrumb">
            <Link to="/products" onClick={function(e) { e.preventDefault(); handleClearAll(); }}>All Products</Link>
            {currentMainCat && (
              <React.Fragment>
                <span className="breadcrumb-separator">/</span>
                <Link 
                  to={'/products?mainCategory=' + selectedMainCat}
                  onClick={function(e) { e.preventDefault(); handleMainCategoryClick(selectedMainCat); }}
                  className={!selectedSubcat ? 'active' : ''}
                >
                  {currentMainCat.name}
                </Link>
              </React.Fragment>
            )}
            {currentSubcatName && (
              <React.Fragment>
                <span className="breadcrumb-separator">/</span>
                <span className="active">{currentSubcatName}</span>
              </React.Fragment>
            )}
          </nav>
        )}
        
        <h1>
          {currentMainCat ? (
            <React.Fragment>{currentSubcatName ? currentSubcatName : currentMainCat.name}</React.Fragment>
          ) : (
            <React.Fragment>Our <span>Collection</span></React.Fragment>
          )}
        </h1>
        <p>{getHeroDescription()}</p>
      </section>

      {/* Subcategory Filter Pills - Show when main category is selected */}
      {selectedMainCat && currentMainCat && (
        <div className="subcategory-filter-section" style={{ '--section-color': currentMainCat.color }}>
          <div className="subcategory-container">
            <div className="subcategory-header">
              <button className="back-to-all" onClick={function() { handleMainCategoryClick(null); }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M19 12H5M12 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                All Categories
              </button>
              <span className="subcategory-label">
                {currentMainCat.name}:
              </span>
            </div>
            <div className="subcategory-pills">
              <button 
                className={!selectedSubcat ? 'subcat-pill active' : 'subcat-pill'}
                onClick={function() { handleSubcategoryClick(null); }}
              >
                All
                <span className="pill-count">{filteredProducts.length}</span>
              </button>
              {currentMainCat.subcategories.map(function(subcat) {
                var count = getSubcategoryCount(subcat.id);
                return (
                  <button 
                    key={subcat.id}
                    className={selectedSubcat === subcat.id ? 'subcat-pill active' : 'subcat-pill'}
                    onClick={function() { handleSubcategoryClick(subcat.id); }}
                  >
                    {subcat.name}
                    <span className="pill-count">{count}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      <div className="products-container">
        <div className="products-layout">
          
          {/* Sidebar - Desktop */}
          <aside className="products-sidebar">
            <div className="sidebar-section">
              <h3>Shop By Category</h3>
              <ul className="main-category-list">
                <li>
                  <button
                    className={!selectedMainCat ? 'main-cat-btn active' : 'main-cat-btn'}
                    onClick={function() { handleMainCategoryClick(null); }}
                  >
                    <span className="cat-icon all">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
                        <rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
                      </svg>
                    </span>
                    <span className="cat-name">All Products</span>
                    <span className="cat-count">{products.length}</span>
                  </button>
                </li>
                {Object.keys(mainCategories).map(function(mainCatId) {
                  var mainCat = mainCategories[mainCatId];
                  var isActive = selectedMainCat === mainCatId;
                  var mainCatCount = 0;
                  mainCat.subcategories.forEach(function(sub) {
                    mainCatCount += getSubcategoryCount(sub.id);
                  });
                  
                  return (
                    <li key={mainCatId}>
                      <button
                        className={isActive ? 'main-cat-btn active' : 'main-cat-btn'}
                        style={{ '--cat-color': mainCat.color }}
                        onClick={function() { handleMainCategoryClick(mainCatId); }}
                      >
                        <span className="cat-icon" style={{ background: mainCat.color }}>
                          {getMainCategoryIcon(mainCat.icon)}
                        </span>
                        <span className="cat-name">{mainCat.name}</span>
                        <span className="cat-count">{mainCatCount}</span>
                      </button>
                      
                      {isActive && (
                        <ul className="subcategory-list">
                          {mainCat.subcategories.map(function(subcat) {
                            var subCount = getSubcategoryCount(subcat.id);
                            return (
                              <li key={subcat.id}>
                                <button
                                  className={selectedSubcat === subcat.id ? 'subcat-btn active' : 'subcat-btn'}
                                  onClick={function() { handleSubcategoryClick(subcat.id); }}
                                >
                                  <span className="subcat-name">{subcat.name}</span>
                                  <span className="subcat-count">{subCount}</span>
                                </button>
                              </li>
                            );
                          })}
                        </ul>
                      )}
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
            <div className="products-topbar">
              <div className="topbar-left">
                <button 
                  className="mobile-filter-btn"
                  onClick={function() { setShowMobileFilter(!showMobileFilter); }}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="4" y1="6" x2="20" y2="6"/><line x1="4" y1="12" x2="16" y2="12"/><line x1="4" y1="18" x2="12" y2="18"/>
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
                    <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
                  </svg>
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={function(e) { setSearchQuery(e.target.value); }}
                  />
                  {searchQuery && (
                    <button className="clear-search" onClick={function() { setSearchQuery(''); }}>×</button>
                  )}
                </div>
                <select className="sort-select" value={sortBy} onChange={function(e) { setSortBy(e.target.value); }}>
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
                    <div className="mobile-main-categories">
                      <button
                        className={!selectedMainCat ? 'mobile-main-cat-btn active' : 'mobile-main-cat-btn'}
                        onClick={function() { handleMainCategoryClick(null); }}
                      >
                        All Products
                      </button>
                      {Object.keys(mainCategories).map(function(mainCatId) {
                        var mainCat = mainCategories[mainCatId];
                        return (
                          <button
                            key={mainCatId}
                            className={selectedMainCat === mainCatId ? 'mobile-main-cat-btn active' : 'mobile-main-cat-btn'}
                            style={{ '--btn-color': mainCat.color }}
                            onClick={function() { handleMainCategoryClick(mainCatId); }}
                          >
                            {mainCat.name}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                  
                  {selectedMainCat && currentMainCat && (
                    <div className="filter-section">
                      <h4>{currentMainCat.name} Subcategories</h4>
                      <div className="mobile-categories">
                        <button
                          className={!selectedSubcat ? 'mobile-cat-btn active' : 'mobile-cat-btn'}
                          onClick={function() { handleSubcategoryClick(null); }}
                        >
                          All {currentMainCat.name}
                        </button>
                        {currentMainCat.subcategories.map(function(subcat) {
                          return (
                            <button
                              key={subcat.id}
                              className={selectedSubcat === subcat.id ? 'mobile-cat-btn active' : 'mobile-cat-btn'}
                              onClick={function() { handleSubcategoryClick(subcat.id); }}
                            >
                              {subcat.name}
                              <span>({getSubcategoryCount(subcat.id)})</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                  
                  <div className="filter-section">
                    <h4>Sort By</h4>
                    <div className="mobile-sort">
                      <button className={sortBy === 'price-low' ? 'active' : ''} onClick={function() { setSortBy('price-low'); setShowMobileFilter(false); }}>
                        Price: Low to High
                      </button>
                      <button className={sortBy === 'price-high' ? 'active' : ''} onClick={function() { setSortBy('price-high'); setShowMobileFilter(false); }}>
                        Price: High to Low
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Active Filters */}
            {(selectedMainCat || selectedSubcat || searchQuery) && (
              <div className="active-filters">
                {selectedMainCat && currentMainCat && (
                  <span className="filter-tag main-cat-tag" style={{ '--tag-color': currentMainCat.color }}>
                    {currentMainCat.name}
                    <button onClick={function() { handleMainCategoryClick(null); }}>×</button>
                  </span>
                )}
                {selectedSubcat && currentSubcatName && (
                  <span className="filter-tag">
                    {currentSubcatName}
                    <button onClick={function() { handleSubcategoryClick(null); }}>×</button>
                  </span>
                )}
                {searchQuery && (
                  <span className="filter-tag">
                    "{searchQuery}"
                    <button onClick={function() { setSearchQuery(''); }}>×</button>
                  </span>
                )}
                <button className="clear-all-btn" onClick={handleClearAll}>Clear All</button>
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
                    <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/><line x1="8" y1="11" x2="14" y2="11"/>
                  </svg>
                </div>
                <h3>No products found</h3>
                <p>Try adjusting your filters or search query</p>
                <button className="clear-filters-btn" onClick={handleClearAll}>Clear Filters</button>
              </div>
            ) : (
              <div className="products-grid">
                {filteredProducts.map(function(product) {
                  return (
                    <Link to={'/product/' + product.id} key={product.id} className="product-card">
                      <div className="product-image-wrapper">
                        <div className="product-image">
                          <img 
                            src={product.imageUrl || 'https://images.unsplash.com/photo-1565814329452-e1efa11c5b89?w=400'} 
                            alt={product.name}
                            onError={handleImageError}
                          />
                        </div>
                        {product.badge && (<span className="product-badge">{product.badge}</span>)}
                        {product.discount && (<span className="product-badge sale">{product.discount}% OFF</span>)}
                        <div className="product-overlay">
                          <span className="quick-view-btn">Quick View</span>
                        </div>
                      </div>
                      
                      <div className="product-details">
                        <span className="product-category">{product.category || 'Product'}</span>
                        <h3 className="product-name">{product.name || 'Product Name'}</h3>
                        <div className="product-footer">
                          <div className="product-price">
                            <span className="price-current">₹{product.price ? product.price.toLocaleString() : '0'}</span>
                            {product.originalPrice && (<span className="price-original">₹{product.originalPrice.toLocaleString()}</span>)}
                          </div>
                          <button 
                            className="add-to-cart-btn"
                            onClick={function(e) { handleAddToCart(e, product); }}
                            aria-label="Add to cart"
                          >
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
                              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
                            </svg>
                            <span>Add</span>
                          </button>
                        </div>
                        {product.quantity !== undefined && product.quantity <= 5 && product.quantity > 0 && (
                          <span className="stock-warning">Only {product.quantity} left!</span>
                        )}
                        {product.quantity === 0 && (<span className="out-of-stock">Out of Stock</span>)}
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
