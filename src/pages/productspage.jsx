import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import Navbar from '../components/Navbar.jsx';
import Footer from '../components/Footer.jsx';
import { getProducts } from '../services/api';
import './ProductsPage.css';

const ProductsPage = ({ addToCart, onCartClick, cartCount }) => {
  const [searchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [loading, setLoading] = useState(true);

  const categories = [
    { id: 'all', name: 'All Products' },
    { id: 'strip', name: 'LED Strips' },
    { id: 'bulbs', name: 'Smart Bulbs' },
    { id: 'panels', name: 'Panel Lights' },
    { id: 'outdoor', name: 'Outdoor Lighting' },
    { id: 'accessories', name: 'Accessories' }
  ];

  useEffect(() => {
    loadProducts();
  }, []);

  useEffect(() => {
    const category = searchParams.get('category');
    if (category) {
      setSelectedCategory(category);
    }
  }, [searchParams]);

  useEffect(() => {
    if (selectedCategory === 'all') {
      setFilteredProducts(products);
    } else {
      setFilteredProducts(products.filter(p => p.category === selectedCategory));
    }
  }, [selectedCategory, products]);

  const loadProducts = async () => {
    try {
      const data = await getProducts();
      setProducts(data);
      setLoading(false);
    } catch (error) {
      console.error('Error loading products:', error);
      setLoading(false);
    }
  };

  return (
    <div className="products-page">
      <Navbar onCartClick={onCartClick} cartCount={cartCount} />

      <div className="products-hero">
        <h1>Our Collection</h1>
        <p>Discover premium LED lighting solutions for every space</p>
      </div>

      <div className="products-container">
        <aside className="products-sidebar">
          <h3>Categories</h3>
          <ul className="category-list">
            {categories.map(category => (
              <li key={category.id}>
                <button
                  className={`category-btn ${selectedCategory === category.id ? 'active' : ''}`}
                  onClick={() => setSelectedCategory(category.id)}
                >
                  {category.name}
                </button>
              </li>
            ))}
          </ul>
        </aside>

        <main className="products-main">
          <div className="products-header">
            <h2>
              {selectedCategory === 'all' ? 'All Products' : categories.find(c => c.id === selectedCategory)?.name}
            </h2>
            <p className="products-count">{filteredProducts.length} products</p>
          </div>

          {loading ? (
            <div className="loading-container">
              <div className="loading-spinner"></div>
            </div>
          ) : (
            <div className="product-grid">
              {filteredProducts.map((product, index) => (
                <div 
                  key={product.id} 
                  className="product-card"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <div className="product-image-container">
                    <Link to={`/product/${product.id}`}>
                      <img 
                        src={product.imageUrl || 'https://via.placeholder.com/400'} 
                        alt={product.name} 
                        className="product-image"
                      />
                    </Link>
                    {product.badge && (
                      <span className="product-badge">{product.badge}</span>
                    )}
                  </div>
                  <div className="product-info">
                    <span className="product-category">{product.category}</span>
                    <Link to={`/product/${product.id}`} className="product-name-link">
                      <h3 className="product-name">{product.name}</h3>
                    </Link>
                    <p className="product-description">
                      {product.description}
                    </p>
                    <div className="product-footer">
                      <span className="product-price">₹{product.price}</span>
                      <button 
                        className="add-to-cart-btn"
                        onClick={() => addToCart(product)}
                      >
                        Add to Cart
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>

      <Footer />
    </div>
  );
};

export default ProductsPage;
