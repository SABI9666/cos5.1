import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/homepage.jsx';
import ProductsPage from './pages/productspage.jsx';
import ProductDetail from './pages/productdetail.jsx';
import AdminPanel from './pages/adminpanel.jsx';
import Cart from './components/cart.jsx';
import './app.css';

function App() {
  const [cartItems, setCartItems] = useState(getInitialCart);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartNotification, setCartNotification] = useState('');

  function getInitialCart() {
    var savedCart = localStorage.getItem('luxeled-cart');
    return savedCart ? JSON.parse(savedCart) : [];
  }

  useEffect(saveCart, [cartItems]);
  function saveCart() {
    localStorage.setItem('luxeled-cart', JSON.stringify(cartItems));
  }

  useEffect(handleBodyScroll, [isCartOpen]);
  function handleBodyScroll() {
    document.body.style.overflow = isCartOpen ? 'hidden' : 'unset';
    return resetScroll;
  }
  function resetScroll() {
    document.body.style.overflow = 'unset';
  }

  function addToCart(product) {
    var cartProduct = {
      id: product.id,
      name: product.name,
      price: product.price,
      imageUrl: product.imageUrl || 'https://via.placeholder.com/100',
      category: product.category
    };
    setCartItems(function(prev) {
      var existing = prev.find(function(i) { return i.id === cartProduct.id; });
      if (existing) {
        return prev.map(function(i) {
          if (i.id === cartProduct.id) {
            return Object.assign({}, i, { quantity: i.quantity + 1 });
          }
          return i;
        });
      }
      return prev.concat([Object.assign({}, cartProduct, { quantity: 1 })]);
    });
    setCartNotification(product.name + ' added to cart!');
    setTimeout(clearNotification, 2000);
    setIsCartOpen(true);
  }

  function clearNotification() {
    setCartNotification('');
  }

  function removeFromCart(productId) {
    setCartItems(function(prev) {
      return prev.filter(function(i) { return i.id !== productId; });
    });
  }

  function updateQuantity(productId, qty) {
    if (qty === 0) {
      removeFromCart(productId);
      return;
    }
    setCartItems(function(prev) {
      return prev.map(function(i) {
        if (i.id === productId) {
          return Object.assign({}, i, { quantity: qty });
        }
        return i;
      });
    });
  }

  function clearCart() {
    setCartItems([]);
  }

  function getCartCount() {
    return cartItems.reduce(function(t, i) { return t + i.quantity; }, 0);
  }

  function openCart() {
    setIsCartOpen(true);
  }

  function closeCart() {
    setIsCartOpen(false);
  }

  var cartCount = getCartCount();

  return (
    <Router>
      <div className="App">
        {cartNotification ? (
          <div className="cart-notification">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            {cartNotification}
          </div>
        ) : null}
        <Cart items={cartItems} isOpen={isCartOpen} onClose={closeCart} updateQuantity={updateQuantity} removeFromCart={removeFromCart} clearCart={clearCart} />
        <Routes>
          <Route path="/" element={<HomePage onCartClick={openCart} cartCount={cartCount} addToCart={addToCart} />} />
          <Route path="/products" element={<ProductsPage addToCart={addToCart} onCartClick={openCart} cartCount={cartCount} />} />
          <Route path="/product/:id" element={<ProductDetail addToCart={addToCart} onCartClick={openCart} cartCount={cartCount} />} />
          <Route path="/admin" element={<AdminPanel />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
