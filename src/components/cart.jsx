import React from 'react';
import './cart.css';

function Cart(props) {
  var items = props.items;
  var isOpen = props.isOpen;
  var onClose = props.onClose;
  var updateQuantity = props.updateQuantity;
  var removeFromCart = props.removeFromCart;
  var clearCart = props.clearCart;

  var subtotal = items.reduce(function(sum, item) { return sum + (item.price * item.quantity); }, 0);
  var shipping = subtotal >= 2000 ? 0 : 99;
  var total = subtotal + shipping;

  function handleImageError(e) {
    e.target.src = 'https://via.placeholder.com/100x100?text=LED';
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

  return (
    <React.Fragment>
      {isOpen && <div className="cart-overlay" onClick={onClose}></div>}
      <div className={isOpen ? "cart-panel open" : "cart-panel"}>
        <div className="cart-header">
          <h2>Shopping Cart</h2>
          <button className="cart-close-btn" onClick={onClose} aria-label="Close cart">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="24" height="24">
              <line x1="18" y1="6" x2="6" y2="18" strokeLinecap="round" strokeLinejoin="round"/>
              <line x1="6" y1="6" x2="18" y2="18" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>

        <div className="cart-content">
          {items.length === 0 ? (
            <div className="empty-cart">
              <div className="empty-cart-icon">
                <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M9 2L7 6H3L6 20H18L21 6H17L15 2H9Z" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M9 6V8C9 9.65685 10.3431 11 12 11C13.6569 11 15 9.65685 15 8V6" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <p>Your cart is empty</p>
              <button className="continue-shopping-btn" onClick={onClose}>Continue Shopping</button>
            </div>
          ) : (
            <React.Fragment>
              <div className="cart-items">
                {items.map(function(item) {
                  return (
                    <div key={item.id} className="cart-item">
                      <div className="cart-item-image">
                        <img src={item.imageUrl || 'https://via.placeholder.com/100'} alt={item.name} onError={handleImageError} />
                      </div>
                      <div className="cart-item-details">
                        <h4 className="cart-item-name">{item.name}</h4>
                        <p className="cart-item-category">{item.category}</p>
                        <p className="cart-item-price">Rs.{item.price.toLocaleString()}</p>
                        <div className="cart-item-controls">
                          <div className="quantity-controls">
                            <button onClick={function() { handleDecrease(item); }} aria-label="Decrease quantity">-</button>
                            <span>{item.quantity}</span>
                            <button onClick={function() { handleIncrease(item); }} aria-label="Increase quantity">+</button>
                          </div>
                          <button className="remove-item-btn" onClick={function() { handleRemove(item); }} aria-label="Remove item">
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18">
                              <polyline points="3 6 5 6 21 6" strokeLinecap="round" strokeLinejoin="round"/>
                              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          </button>
                        </div>
                      </div>
                      <div className="cart-item-total">Rs.{(item.price * item.quantity).toLocaleString()}</div>
                    </div>
                  );
                })}
              </div>
              <div className="cart-footer">
                {items.length > 0 && <button className="clear-cart-btn" onClick={clearCart}>Clear Cart</button>}
                <div className="cart-summary">
                  <div className="summary-row">
                    <span>Subtotal</span>
                    <span>Rs.{subtotal.toLocaleString()}</span>
                  </div>
                  <div className="summary-row">
                    <span>Shipping</span>
                    <span className={shipping === 0 ? 'free-shipping' : ''}>{shipping === 0 ? 'FREE' : 'Rs.' + shipping}</span>
                  </div>
                  {subtotal < 2000 && <p className="shipping-note">Add Rs.{(2000 - subtotal).toLocaleString()} more for FREE shipping!</p>}
                  <div className="summary-row total-row">
                    <span>Total</span>
                    <span className="total-amount">Rs.{total.toLocaleString()}</span>
                  </div>
                </div>
                <button className="checkout-btn">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20">
                    <rect x="1" y="4" width="22" height="16" rx="2" ry="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <line x1="1" y1="10" x2="23" y2="10" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Proceed to Checkout
                </button>
              </div>
            </React.Fragment>
          )}
        </div>
      </div>
    </React.Fragment>
  );
}

export default Cart;
