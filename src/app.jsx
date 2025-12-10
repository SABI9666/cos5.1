import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/homepage.jsx';
import ProductsPage from './pages/productspage.jsx';
import ProductDetail from './pages/productdetail.jsx';
import AdminPanel from './pages/adminpanel.jsx';
import Cart from './components/cart.jsx';
import './app.css';

function App() {
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const addToCart = (product) => {
    const existingItem = cartItems.find(item => item.id === product.id);
    if (existingItem) {
      setCartItems(cartItems.map(item =>
        item.id === product.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCartItems([...cartItems, { ...product, quantity: 1 }]);
    }
  };

  const removeFromCart = (productId) => {
    setCartItems(cartItems.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId, quantity) => {
    if (quantity === 0) {
      removeFromCart(productId);
    } else {
      setCartItems(cartItems.map(item =>
        item.id === productId ? { ...item, quantity } : item
      ));
    }
  };

  return (
    <Router>
      <div className="App">
        <Cart
          items={cartItems}
          isOpen={isCartOpen}
          onClose={() => setIsCartOpen(false)}
          updateQuantity={updateQuantity}
          removeFromCart={removeFromCart}
        />
        <Routes>
          <Route path="/" element={<HomePage onCartClick={() => setIsCartOpen(true)} cartCount={cartItems.length} />} />
          <Route path="/products" element={<ProductsPage addToCart={addToCart} onCartClick={() => setIsCartOpen(true)} cartCount={cartItems.length} />} />
          <Route path="/product/:id" element={<ProductDetail addToCart={addToCart} onCartClick={() => setIsCartOpen(true)} cartCount={cartItems.length} />} />
          <Route path="/admin" element={<AdminPanel />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
