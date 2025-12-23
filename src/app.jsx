import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.jsx';
import HomePage from './pages/homepage.jsx';
import ProductsPage from './pages/productspage.jsx';
import ProductDetail from './pages/productdetail.jsx';
import AdminPanel from './pages/adminpanel.jsx';
import AuthPage from './pages/auth.jsx';
import CheckoutPage from './pages/checkout.jsx';
import OrdersPage from './pages/orders.jsx';
import Cart from './components/cart.jsx';
import './app.css';

function App() {
  // Initialize with empty array to avoid hydration mismatch
  var cartState = useState([]);
  var cartItems = cartState[0];
  var setCartItems = cartState[1];
  
  var cartOpenState = useState(false);
  var isCartOpen = cartOpenState[0];
  var setIsCartOpen = cartOpenState[1];
  
  var notificationState = useState('');
  var cartNotification = notificationState[0];
  var setCartNotification = notificationState[1];
  
  var mountedState = useState(false);
  var isMounted = mountedState[0];
  var setIsMounted = mountedState[1];

  // Load cart from localStorage ONLY after component mounts (client-side)
  useEffect(function() {
    setIsMounted(true);
    try {
      var savedCart = localStorage.getItem('luxeled-cart');
      if (savedCart) {
        var parsedCart = JSON.parse(savedCart);
        if (Array.isArray(parsedCart)) {
          setCartItems(parsedCart);
        }
      }
    } catch (error) {
      console.error('Error loading cart:', error);
    }
  }, []);

  // Save cart to localStorage whenever it changes (but only after mounted)
  useEffect(function() {
    if (isMounted) {
      try {
        localStorage.setItem('luxeled-cart', JSON.stringify(cartItems));
      } catch (error) {
        console.error('Error saving cart:', error);
      }
    }
  }, [cartItems, isMounted]);

  // Handle body scroll when cart is open
  useEffect(function() {
    if (isCartOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return function() {
      document.body.style.overflow = 'unset';
    };
  }, [isCartOpen]);

  function addToCart(product) {
    var cartProduct = {
      id: product.id,
      name: product.name,
      price: product.price,
      imageUrl: product.imageUrl || 'https://via.placeholder.com/100',
      category: product.category
    };
    
    setCartItems(function(prev) {
      var existing = prev.find(function(item) {
        return item.id === cartProduct.id;
      });
      
      if (existing) {
        return prev.map(function(item) {
          if (item.id === cartProduct.id) {
            return Object.assign({}, item, { quantity: item.quantity + 1 });
          }
          return item;
        });
      }
      return prev.concat([Object.assign({}, cartProduct, { quantity: 1 })]);
    });
    
    setCartNotification(product.name + ' added to cart!');
    setTimeout(function() {
      setCartNotification('');
    }, 2000);
    setIsCartOpen(true);
  }

  function removeFromCart(productId) {
    setCartItems(function(prev) {
      return prev.filter(function(item) {
        return item.id !== productId;
      });
    });
  }

  function updateQuantity(productId, newQuantity) {
    if (newQuantity === 0) {
      removeFromCart(productId);
      return;
    }
    setCartItems(function(prev) {
      return prev.map(function(item) {
        if (item.id === productId) {
          return Object.assign({}, item, { quantity: newQuantity });
        }
        return item;
      });
    });
  }

  function clearCart() {
    setCartItems([]);
  }

  function getCartCount() {
    return cartItems.reduce(function(total, item) {
      return total + item.quantity;
    }, 0);
  }

  function openCart() {
    setIsCartOpen(true);
  }

  function closeCart() {
    setIsCartOpen(false);
  }

  var cartCount = getCartCount();

  return (
    <AuthProvider>
      <Router>
        <div className="App">
          {cartNotification && (
            <div className="cart-notification">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              {cartNotification}
            </div>
          )}
          
          <Cart 
            items={cartItems} 
            isOpen={isCartOpen} 
            onClose={closeCart} 
            updateQuantity={updateQuantity} 
            removeFromCart={removeFromCart} 
            clearCart={clearCart} 
          />
          
          <Routes>
            <Route path="/" element={
              <HomePage 
                onCartClick={openCart} 
                cartCount={cartCount} 
                addToCart={addToCart} 
              />
            } />
            <Route path="/products" element={
              <ProductsPage 
                addToCart={addToCart} 
                onCartClick={openCart} 
                cartCount={cartCount} 
              />
            } />
            <Route path="/product/:id" element={
              <ProductDetail 
                addToCart={addToCart} 
                onCartClick={openCart} 
                cartCount={cartCount} 
              />
            } />
            <Route path="/admin" element={<AdminPanel />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/checkout" element={
              <CheckoutPage 
                cartItems={cartItems} 
                onCartClick={openCart} 
                cartCount={cartCount}
                clearCart={clearCart}
              />
            } />
            <Route path="/orders" element={
              <OrdersPage 
                onCartClick={openCart} 
                cartCount={cartCount} 
              />
            } />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
