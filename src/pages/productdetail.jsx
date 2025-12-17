import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '../components/navbar.jsx';
import Footer from '../components/footer.jsx';
import { getProducts } from '../services/api';
import './productdetail.css';

function ProductDetail(props) {
  var addToCart = props.addToCart;
  var onCartClick = props.onCartClick;
  var cartCount = props.cartCount;
  var params = useParams();
  var id = params.id;
  var productState = useState(null);
  var product = productState[0];
  var setProduct = productState[1];
  var quantityState = useState(1);
  var quantity = quantityState[0];
  var setQuantity = quantityState[1];
  var loadingState = useState(true);
  var loading = loadingState[0];
  var setLoading = loadingState[1];
  var relatedState = useState([]);
  var relatedProducts = relatedState[0];
  var setRelatedProducts = relatedState[1];
  var addedState = useState(false);
  var addedToCart = addedState[0];
  var setAddedToCart = addedState[1];

  useEffect(function() {
    loadProduct();
    window.scrollTo(0, 0);
  }, [id]);

  function loadProduct() {
    setLoading(true);
    getProducts().then(function(products) {
      var foundProduct = products.find(function(p) { return p.id === id; });
      setProduct(foundProduct);
      if (foundProduct) {
        var related = products.filter(function(p) { return p.category === foundProduct.category && p.id !== foundProduct.id; }).slice(0, 4);
        setRelatedProducts(related);
      }
      setLoading(false);
    }).catch(function(error) {
      console.error('Error loading product:', error);
      setLoading(false);
    });
  }

  function handleAddToCart() {
    for (var i = 0; i < quantity; i++) {
      addToCart(product);
    }
    setAddedToCart(true);
    setTimeout(function() { setAddedToCart(false); }, 2000);
  }

  function handleImageError(e) {
    e.target.src = 'https://via.placeholder.com/800x800?text=LED+Product';
  }

  function decreaseQty() {
    setQuantity(Math.max(1, quantity - 1));
  }

  function increaseQty() {
    setQuantity(Math.min(product.quantity || 99, quantity + 1));
  }

  if (loading) {
    return (
      <div className="product-detail-page">
        <Navbar onCartClick={onCartClick} cartCount={cartCount} />
        <div className="loading-container"><div className="loading-spinner"></div></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="product-detail-page">
        <Navbar onCartClick={onCartClick} cartCount={cartCount} />
        <div className="not-found">
          <h2>Product Not Found</h2>
          <p>Sorry, we could not find the product.</p>
          <Link to="/products" className="back-link">Browse Products</Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="product-detail-page">
      <Navbar onCartClick={onCartClick} cartCount={cartCount} />
      <div className="breadcrumb">
        <Link to="/">Home</Link>
        <span>/</span>
        <Link to="/products">Products</Link>
        <span>/</span>
        <span>{product.name}</span>
      </div>
      <div className="product-detail-container">
        <div className="product-image-section">
          <div className="image-wrapper">
            <img src={product.imageUrl || 'https://via.placeholder.com/800'} alt={product.name} className="detail-image" onError={handleImageError} />
            {product.badge && <span className="detail-badge">{product.badge}</span>}
          </div>
        </div>
        <div className="product-info-section">
          <span className="detail-category">{product.category}</span>
          <h1 className="detail-title">{product.name}</h1>
          <div className="detail-price">Rs.{product.price ? product.price.toLocaleString() : '0'}</div>
          <div className="detail-description">
            <h3>Description</h3>
            <p>{product.description}</p>
          </div>
          <div className="detail-specs">
            <h3>Specifications</h3>
            <div className="specs-grid">
              <div className="spec-item"><span className="spec-label">Category</span><span className="spec-value">{product.category}</span></div>
              <div className="spec-item"><span className="spec-label">Stock</span><span className="spec-value">{product.quantity} units</span></div>
              <div className="spec-item"><span className="spec-label">Warranty</span><span className="spec-value">2 years</span></div>
              <div className="spec-item"><span className="spec-label">Energy Rating</span><span className="spec-value">A+</span></div>
            </div>
          </div>
          <div className="detail-actions">
            <div className="quantity-selector">
              <button onClick={decreaseQty} aria-label="Decrease quantity">-</button>
              <span>{quantity}</span>
              <button onClick={increaseQty} aria-label="Increase quantity">+</button>
            </div>
            <button className={addedToCart ? "add-to-cart-large added" : "add-to-cart-large"} onClick={handleAddToCart} disabled={addedToCart}>
              {addedToCart ? 'Added to Cart!' : 'Add to Cart'}
            </button>
          </div>
          <div className="detail-features">
            <div className="feature-item"><span>Free shipping on orders over Rs.2000</span></div>
            <div className="feature-item"><span>30-day easy returns</span></div>
            <div className="feature-item"><span>2-year manufacturer warranty</span></div>
          </div>
        </div>
      </div>
      {relatedProducts.length > 0 && (
        <section className="related-products">
          <h2>Related Products</h2>
          <div className="related-grid">
            {relatedProducts.map(function(item) {
              return (
                <Link to={'/product/' + item.id} key={item.id} className="related-card">
                  <div className="related-image">
                    <img src={item.imageUrl || 'https://via.placeholder.com/200'} alt={item.name} onError={handleImageError} />
                  </div>
                  <div className="related-info">
                    <h4>{item.name}</h4>
                    <span className="related-price">Rs.{item.price ? item.price.toLocaleString() : '0'}</span>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>
      )}
      <Footer />
    </div>
  );
}

export default ProductDetail;
