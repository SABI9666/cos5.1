import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './cart.css';

function Cart(props) {
  var items = props.items;
  var isOpen = props.isOpen;
  var onClose = props.onClose;
  var updateQuantity = props.updateQuantity;
  var removeFromCart = props.removeFromCart;
  var clearCart = props.clearCart;
  
  var navigate = useNavigate();

  var subtotal = items.reduce(function(sum, item) { return sum + (item.price * item.quantity); }, 0);
  var shipping = subtotal >= 2000 ? 0 : 99;
  var total = subtotal + shipping;
  var totalItems = items.reduce(function(sum, item) { return sum + item.quantity; }, 0);

  // Prevent body scroll when cart is open
  useEffect(function() {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return function() {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  function handleImageError(e) {
    e.target.src = 'https://images.unsplash.com/photo-1565814329452-e1efa11c5b89?w=100';
  }

  function handleDecrease(item) {
    updateQuantity(item.id, item.quantity - 1);
  }

  function handleIncrease(item) {
    updateQuantity(item.id, item.quantity + 1);
  }

  function handleRemove(item) {
    removeFromCart(item.id);
  }

  function handleCheckout() {
    onClose();
    navigate('/checkout');
  }

  function handleOverlayClick(e) {
    if (e.target === e.currentTarget) {
      onClose();
    }
  }

  function handleContinueShopping() {
    onClose();
  }

  return (
    <React.Fragment>
      {/* Overlay */}
      <div 
        className={isOpen ? "cart-overlay active" : "cart-overlay"} 
        onClick={handleOverlayClick}
        aria-hidden="true"
      ></div>
      
      {/* Cart Panel */}
      <div className={isOpen ? "cart-panel open" : "cart-panel"} role="dialog" aria-modal="true" aria-label="Shopping Cart">
        {/* Header */}
        <div className="cart-header">
          <div className="cart-header-left">
            <div className="cart-icon-wrapper">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="24" height="24">
                <path d="M9 2L7 6H3L6 20H18L21 6H17L15 2H9Z" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              {totalItems > 0 && <span className="cart-badge">{totalItems}</span>}
            </div>
            <div className="cart-header-text">
              <h2>Shopping Cart</h2>
              <span className="cart-item-count">{totalItems} {totalItems === 1 ? 'item' : 'items'}</span>
            </div>
          </div>
          <button className="cart-close-btn" onClick={onClose} aria-label="Close cart">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="24" height="24">
              <line x1="18" y1="6" x2="6" y2="18" strokeLinecap="round" strokeLinejoin="round"/>
              <line x1="6" y1="6" x2="18" y2="18" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="cart-content">
          {items.length === 0 ? (
            <div className="empty-cart">
              <div className="empty-cart-icon">
                <svg width="100" height="100" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                  <path d="M9 2L7 6H3L6 20H18L21 6H17L15 2H9Z" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M9 6V8C9 9.65685 10.3431 11 12 11C13.6569 11 15 9.65685 15 8V6" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h3>Your cart is empty</h3>
              <p>Looks like you haven't added anything yet</p>
              <button className="continue-shopping-btn" onClick={handleContinueShopping}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20">
                  <path d="M19 12H5M12 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Continue Shopping
              </button>
            </div>
          ) : (
            <React.Fragment>
              {/* Cart Items */}
              <div className="cart-items">
                {items.map(function(item) {
                  return (
                    <div key={item.id} className="cart-item">
                      <div className="cart-item-image">
                        <img src={item.imageUrl || 'https://images.unsplash.com/photo-1565814329452-e1efa11c5b89?w=100'} alt={item.name} onError={handleImageError} />
                      </div>
                      <div className="cart-item-info">
                        <div className="cart-item-top">
                          <div className="cart-item-details">
                            <h4 className="cart-item-name">{item.name}</h4>
                            {item.category && <span className="cart-item-category">{item.category}</span>}
                          </div>
                          <button className="remove-item-btn" onClick={function() { handleRemove(item); }} aria-label="Remove item">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
                              <polyline points="3 6 5 6 21 6" strokeLinecap="round" strokeLinejoin="round"/>
                              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          </button>
                        </div>
                        <div className="cart-item-bottom">
                          <div className="quantity-controls">
                            <button 
                              onClick={function() { handleDecrease(item); }} 
                              aria-label="Decrease quantity"
                              disabled={item.quantity <= 1}
                            >
                              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="14" height="14">
                                <line x1="5" y1="12" x2="19" y2="12" strokeLinecap="round"/>
                              </svg>
                            </button>
                            <span className="quantity-value">{item.quantity}</span>
                            <button onClick={function() { handleIncrease(item); }} aria-label="Increase quantity">
                              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="14" height="14">
                                <line x1="12" y1="5" x2="12" y2="19" strokeLinecap="round"/>
                                <line x1="5" y1="12" x2="19" y2="12" strokeLinecap="round"/>
                              </svg>
                            </button>
                          </div>
                          <div className="cart-item-price">
                            <span className="unit-price">₹{item.price.toLocaleString()}</span>
                            <span className="total-price">₹{(item.price * item.quantity).toLocaleString()}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Footer */}
              <div className="cart-footer">
                {/* Clear Cart Button */}
                {items.length > 0 && (
                  <button className="clear-cart-btn" onClick={clearCart}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
                      <polyline points="3 6 5 6 21 6" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    Clear Cart
                  </button>
                )}

                {/* Summary */}
                <div className="cart-summary">
                  <div className="summary-row">
                    <span>Subtotal ({totalItems} items)</span>
                    <span>₹{subtotal.toLocaleString()}</span>
                  </div>
                  <div className="summary-row">
                    <span>Shipping</span>
                    <span className={shipping === 0 ? 'free-shipping' : ''}>
                      {shipping === 0 ? 'FREE' : '₹' + shipping}
                    </span>
                  </div>
                  {subtotal > 0 && subtotal < 2000 && (
                    <div className="shipping-progress">
                      <div className="progress-bar">
                        <div className="progress-fill" style={{ width: Math.min((subtotal / 2000) * 100, 100) + '%' }}></div>
                      </div>
                      <p className="shipping-note">
                        Add ₹{(2000 - subtotal).toLocaleString()} more for <span>FREE shipping!</span>
                      </p>
                    </div>
                  )}
                  <div className="summary-row total-row">
                    <span>Total</span>
                    <span className="total-amount">₹{total.toLocaleString()}</span>
                  </div>
                </div>

                {/* Checkout Button */}
                <button className="checkout-btn" onClick={handleCheckout}>
                  <span>Proceed to Checkout</span>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20">
                    <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>

                {/* Continue Shopping Link */}
                <button className="continue-link" onClick={handleContinueShopping}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
                    <path d="M19 12H5M12 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Continue Shopping
                </button>
              </div>
            </React.Fragment>
          )}
        </div>

        {/* Mobile Close Bar */}
        <div className="mobile-close-bar">
          <button className="mobile-close-btn" onClick={onClose}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20">
              <path d="M19 12H5M12 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span>Back to Shop</span>
          </button>
        </div>
      </div>
    </React.Fragment>
  );
}

export default Cart;
