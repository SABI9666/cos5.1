import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getUserOrders } from '../services/api';
import Navbar from '../components/navbar.jsx';
import Footer from '../components/footer.jsx';
import './orders.css';

function OrdersPage({ onCartClick, cartCount }) {
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate('/auth', { state: { from: '/orders' } });
    }
  }, [authLoading, isAuthenticated, navigate]);

  useEffect(() => {
    if (location.state?.success) {
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 5000);
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  useEffect(() => {
    if (user) {
      loadOrders();
    }
  }, [user]);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const userOrders = await getUserOrders(user.uid);
      setOrders(userOrders);
    } catch (error) {
      console.error('Error loading orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleOrderExpand = (orderId) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'paid': return 'status-paid';
      case 'shipped': return 'status-shipped';
      case 'delivered': return 'status-delivered';
      case 'cancelled': return 'status-cancelled';
      default: return 'status-pending';
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (authLoading) {
    return (
      <div className="orders-page">
        <Navbar onCartClick={onCartClick} cartCount={cartCount} />
        <div className="orders-loading">
          <div className="loading-spinner"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="orders-page">
      <Navbar onCartClick={onCartClick} cartCount={cartCount} />
      
      <div className="orders-container">
        <div className="orders-header">
          <h1>My Orders</h1>
          <p>Track and manage your orders</p>
        </div>

        {showSuccess && (
          <div className="success-banner">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
              <polyline points="22 4 12 14.01 9 11.01"/>
            </svg>
            <span>Order placed successfully! Thank you for shopping with LuxeLED.</span>
          </div>
        )}

        {loading ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
          </div>
        ) : orders.length === 0 ? (
          <div className="no-orders">
            <div className="no-orders-icon">
              <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>
              </svg>
            </div>
            <h3>No Orders Yet</h3>
            <p>You haven't placed any orders yet. Start shopping to see your orders here!</p>
            <Link to="/products" className="shop-now-btn">Shop Now</Link>
          </div>
        ) : (
          <div className="orders-list">
            {orders.map(order => (
              <div key={order.id} className="order-card">
                <div className="order-header" onClick={() => toggleOrderExpand(order.id)}>
                  <div className="order-info">
                    <div className="order-id">
                      <span className="label">Order ID:</span>
                      <span className="value">#{order.id.slice(-8).toUpperCase()}</span>
                    </div>
                    <div className="order-date">{formatDate(order.createdAt)}</div>
                  </div>
                  <div className="order-status-total">
                    <span className={`status-badge ${getStatusBadgeClass(order.status)}`}>
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>
                    <span className="order-total">Rs.{order.total.toLocaleString()}</span>
                  </div>
                  <div className="expand-icon">
                    <svg 
                      width="20" height="20" viewBox="0 0 24 24" 
                      fill="none" stroke="currentColor" strokeWidth="2"
                      style={{ transform: expandedOrder === order.id ? 'rotate(180deg)' : 'rotate(0deg)' }}
                    >
                      <polyline points="6 9 12 15 18 9"/>
                    </svg>
                  </div>
                </div>

                {expandedOrder === order.id && (
                  <div className="order-details">
                    <div className="order-items">
                      <h4>Items</h4>
                      {order.items.map((item, index) => (
                        <div key={index} className="order-item">
                          <img src={item.imageUrl || 'https://via.placeholder.com/60'} alt={item.name}/>
                          <div className="item-details">
                            <span className="item-name">{item.name}</span>
                            <span className="item-qty">Qty: {item.quantity}</span>
                          </div>
                          <span className="item-price">Rs.{(item.price * item.quantity).toLocaleString()}</span>
                        </div>
                      ))}
                    </div>

                    <div className="order-address">
                      <h4>Delivery Address</h4>
                      <p><strong>{order.address.fullName}</strong></p>
                      <p>{order.address.addressLine1}</p>
                      {order.address.addressLine2 && <p>{order.address.addressLine2}</p>}
                      <p>{order.address.city}, {order.address.state} - {order.address.pincode}</p>
                      <p>Phone: {order.address.phone}</p>
                    </div>

                    <div className="order-summary-section">
                      <h4>Order Summary</h4>
                      <div className="summary-row">
                        <span>Subtotal</span>
                        <span>Rs.{order.subtotal.toLocaleString()}</span>
                      </div>
                      <div className="summary-row">
                        <span>Shipping</span>
                        <span>{order.shipping === 0 ? 'FREE' : `Rs.${order.shipping}`}</span>
                      </div>
                      <div className="summary-row total">
                        <span>Total</span>
                        <span>Rs.{order.total.toLocaleString()}</span>
                      </div>
                    </div>

                    {order.paymentDetails && (
                      <div className="payment-info">
                        <h4>Payment Information</h4>
                        <p>Payment ID: {order.paymentDetails.paymentId}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}

export default OrdersPage;
