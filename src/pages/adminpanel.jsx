import React, { useState, useEffect } from 'react';
import { getProducts, addProduct, deleteProduct } from '../services/api';
import { collection, getDocs, updateDoc, doc } from 'firebase/firestore';
import { db } from '../services/firebase';
import './adminpanel.css';

function AdminPanel() {
  var activeTabState = useState('products');
  var activeTab = activeTabState[0];
  var setActiveTab = activeTabState[1];
  
  var productsState = useState([]);
  var products = productsState[0];
  var setProducts = productsState[1];
  
  var ordersState = useState([]);
  var orders = ordersState[0];
  var setOrders = ordersState[1];
  
  var loadingState = useState(true);
  var loading = loadingState[0];
  var setLoading = loadingState[1];
  
  var formState = useState({
    name: '',
    description: '',
    price: '',
    category: 'bulbs',
    imageUrl: '',
    badge: ''
  });
  var formData = formState[0];
  var setFormData = formState[1];
  
  var editingState = useState(null);
  var editing = editingState[0];
  var setEditing = editingState[1];
  
  var submitState = useState(false);
  var submitting = submitState[0];
  var setSubmitting = submitState[1];

  useEffect(function() {
    loadProducts();
    loadOrders();
  }, []);

  function loadProducts() {
    setLoading(true);
    getProducts().then(function(data) {
      setProducts(data);
      setLoading(false);
    }).catch(function(error) {
      console.error('Error loading products:', error);
      setLoading(false);
    });
  }

  function loadOrders() {
    getDocs(collection(db, 'orders')).then(function(snapshot) {
      var ordersList = [];
      snapshot.forEach(function(doc) {
        ordersList.push(Object.assign({ id: doc.id }, doc.data()));
      });
      ordersList.sort(function(a, b) {
        var dateA = a.createdAt ? new Date(a.createdAt.seconds * 1000) : new Date(0);
        var dateB = b.createdAt ? new Date(b.createdAt.seconds * 1000) : new Date(0);
        return dateB - dateA;
      });
      setOrders(ordersList);
    }).catch(function(error) {
      console.error('Error loading orders:', error);
    });
  }

  function handleInputChange(e) {
    var name = e.target.name;
    var value = e.target.value;
    setFormData(function(prev) {
      var updated = {};
      for (var key in prev) {
        updated[key] = prev[key];
      }
      updated[name] = value;
      return updated;
    });
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!formData.name || !formData.price) {
      alert('Please fill in required fields');
      return;
    }
    setSubmitting(true);
    var productData = {
      name: formData.name,
      description: formData.description,
      price: parseFloat(formData.price),
      category: formData.category,
      imageUrl: formData.imageUrl,
      badge: formData.badge
    };
    addProduct(productData).then(function() {
      loadProducts();
      setFormData({ name: '', description: '', price: '', category: 'bulbs', imageUrl: '', badge: '' });
      setSubmitting(false);
      alert('Product added successfully!');
    }).catch(function(error) {
      console.error('Error adding product:', error);
      setSubmitting(false);
      alert('Error adding product');
    });
  }

  function handleDelete(productId) {
    if (window.confirm('Are you sure you want to delete this product?')) {
      deleteProduct(productId).then(function() {
        loadProducts();
      }).catch(function(error) {
        console.error('Error deleting product:', error);
      });
    }
  }

  function handleOrderStatus(orderId, newStatus) {
    updateDoc(doc(db, 'orders', orderId), { status: newStatus }).then(function() {
      loadOrders();
    }).catch(function(error) {
      console.error('Error updating order:', error);
    });
  }

  function formatDate(timestamp) {
    if (!timestamp) return 'N/A';
    var date = new Date(timestamp.seconds * 1000);
    return date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  }

  function getStatusClass(status) {
    switch(status) {
      case 'completed': return 'status-completed';
      case 'processing': return 'status-processing';
      case 'shipped': return 'status-shipped';
      case 'cancelled': return 'status-cancelled';
      default: return 'status-pending';
    }
  }

  return (
    <div className="admin-panel">
      <div className="admin-sidebar">
        <div className="admin-logo">
          <h2>LuxeLED</h2>
          <span>Admin Panel</span>
        </div>
        
        <nav className="admin-nav">
          <button 
            className={activeTab === 'products' ? 'nav-item active' : 'nav-item'} 
            onClick={function() { setActiveTab('products'); }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span>Products</span>
          </button>
          
          <button 
            className={activeTab === 'orders' ? 'nav-item active' : 'nav-item'} 
            onClick={function() { setActiveTab('orders'); }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2" strokeLinecap="round" strokeLinejoin="round"/>
              <rect x="9" y="3" width="6" height="4" rx="1" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M9 12h6M9 16h6" strokeLinecap="round"/>
            </svg>
            <span>Orders</span>
            {orders.length > 0 && <span className="nav-badge">{orders.length}</span>}
          </button>
          
          <button 
            className={activeTab === 'customers' ? 'nav-item active' : 'nav-item'} 
            onClick={function() { setActiveTab('customers'); }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" strokeLinecap="round" strokeLinejoin="round"/>
              <circle cx="9" cy="7" r="4" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span>Customers</span>
          </button>
          
          <button 
            className={activeTab === 'add' ? 'nav-item active' : 'nav-item'} 
            onClick={function() { setActiveTab('add'); }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M12 8v8M8 12h8" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span>Add Product</span>
          </button>
        </nav>
        
        <a href="/" className="back-to-store">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span>Back to Store</span>
        </a>
      </div>
      
      <main className="admin-main">
        {activeTab === 'products' && (
          <div className="admin-section">
            <div className="section-header">
              <h1>Products</h1>
              <p>Manage your product inventory</p>
            </div>
            
            {loading ? (
              <div className="loading-container"><div className="loading-spinner"></div></div>
            ) : products.length === 0 ? (
              <div className="empty-state">
                <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <h3>No Products Yet</h3>
                <p>Add your first product to get started</p>
                <button className="primary-btn" onClick={function() { setActiveTab('add'); }}>Add Product</button>
              </div>
            ) : (
              <div className="products-table-container">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Image</th>
                      <th>Product</th>
                      <th>Category</th>
                      <th>Price</th>
                      <th>Badge</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map(function(product) {
                      return (
                        <tr key={product.id}>
                          <td>
                            <div className="table-image">
                              <img src={product.imageUrl || 'https://via.placeholder.com/50'} alt={product.name} />
                            </div>
                          </td>
                          <td>
                            <div className="product-cell">
                              <span className="product-name">{product.name}</span>
                              <span className="product-desc">{product.description}</span>
                            </div>
                          </td>
                          <td><span className="category-tag">{product.category}</span></td>
                          <td className="price-cell">Rs.{product.price ? product.price.toLocaleString() : '0'}</td>
                          <td>{product.badge ? <span className="badge-tag">{product.badge}</span> : '-'}</td>
                          <td>
                            <button className="delete-btn" onClick={function() { handleDelete(product.id); }}>
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" strokeLinecap="round" strokeLinejoin="round"/>
                              </svg>
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
        
        {activeTab === 'orders' && (
          <div className="admin-section">
            <div className="section-header">
              <h1>Orders</h1>
              <p>View and manage customer orders</p>
            </div>
            
            {orders.length === 0 ? (
              <div className="empty-state">
                <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2" strokeLinecap="round" strokeLinejoin="round"/>
                  <rect x="9" y="3" width="6" height="4" rx="1" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <h3>No Orders Yet</h3>
                <p>Orders will appear here when customers make purchases</p>
              </div>
            ) : (
              <div className="orders-list">
                {orders.map(function(order) {
                  return (
                    <div key={order.id} className="order-card">
                      <div className="order-header">
                        <div className="order-id">
                          <span className="label">Order ID</span>
                          <span className="value">#{order.id.slice(-8).toUpperCase()}</span>
                        </div>
                        <div className="order-date">
                          <span className="label">Date</span>
                          <span className="value">{formatDate(order.createdAt)}</span>
                        </div>
                        <div className={getStatusClass(order.status) + ' order-status'}>
                          {order.status || 'pending'}
                        </div>
                      </div>
                      
                      <div className="order-body">
                        <div className="customer-info">
                          <h4>Customer Details</h4>
                          <div className="info-grid">
                            <div className="info-item">
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" strokeLinecap="round" strokeLinejoin="round"/>
                                <circle cx="12" cy="7" r="4" strokeLinecap="round" strokeLinejoin="round"/>
                              </svg>
                              <span>{order.customerName || order.userName || 'N/A'}</span>
                            </div>
                            <div className="info-item">
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" strokeLinecap="round" strokeLinejoin="round"/>
                                <polyline points="22,6 12,13 2,6" strokeLinecap="round" strokeLinejoin="round"/>
                              </svg>
                              <span>{order.email || order.userEmail || 'N/A'}</span>
                            </div>
                            <div className="info-item">
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" strokeLinecap="round" strokeLinejoin="round"/>
                              </svg>
                              <span>{order.phone || 'N/A'}</span>
                            </div>
                            <div className="info-item full-width">
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" strokeLinecap="round" strokeLinejoin="round"/>
                                <circle cx="12" cy="10" r="3" strokeLinecap="round" strokeLinejoin="round"/>
                              </svg>
                              <span>{order.address || 'Address not provided'}</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="payment-info">
                          <h4>Payment Details</h4>
                          <div className="payment-grid">
                            <div className="payment-item">
                              <span className="label">Payment Status</span>
                              <span className={order.paymentStatus === 'paid' ? 'payment-status paid' : 'payment-status pending'}>
                                {order.paymentStatus === 'paid' ? '✓ Paid' : '○ Pending'}
                              </span>
                            </div>
                            <div className="payment-item">
                              <span className="label">Payment Method</span>
                              <span className="value">{order.paymentMethod || 'Razorpay'}</span>
                            </div>
                            <div className="payment-item">
                              <span className="label">Transaction ID</span>
                              <span className="value transaction-id">{order.paymentId || order.transactionId || 'N/A'}</span>
                            </div>
                            <div className="payment-item">
                              <span className="label">Total Amount</span>
                              <span className="value total-amount">Rs.{order.totalAmount ? order.totalAmount.toLocaleString() : '0'}</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="order-items">
                          <h4>Order Items</h4>
                          <div className="items-list">
                            {order.items && order.items.map(function(item, index) {
                              return (
                                <div key={index} className="order-item">
                                  <img src={item.imageUrl || 'https://via.placeholder.com/40'} alt={item.name} />
                                  <div className="item-details">
                                    <span className="item-name">{item.name}</span>
                                    <span className="item-qty">Qty: {item.quantity}</span>
                                  </div>
                                  <span className="item-price">Rs.{item.price ? (item.price * item.quantity).toLocaleString() : '0'}</span>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                      
                      <div className="order-footer">
                        <div className="status-actions">
                          <span>Update Status:</span>
                          <select 
                            value={order.status || 'pending'} 
                            onChange={function(e) { handleOrderStatus(order.id, e.target.value); }}
                            className="status-select"
                          >
                            <option value="pending">Pending</option>
                            <option value="processing">Processing</option>
                            <option value="shipped">Shipped</option>
                            <option value="completed">Completed</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
        
        {activeTab === 'customers' && (
          <div className="admin-section">
            <div className="section-header">
              <h1>Customers</h1>
              <p>View registered customers and their orders</p>
            </div>
            
            {orders.length === 0 ? (
              <div className="empty-state">
                <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" strokeLinecap="round" strokeLinejoin="round"/>
                  <circle cx="9" cy="7" r="4" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <h3>No Customers Yet</h3>
                <p>Customer data will appear when orders are placed</p>
              </div>
            ) : (
              <div className="customers-table-container">
                <table className="admin-table customers-table">
                  <thead>
                    <tr>
                      <th>Customer</th>
                      <th>Contact</th>
                      <th>Address</th>
                      <th>Orders</th>
                      <th>Total Spent</th>
                      <th>Payment Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(function() {
                      var customerMap = {};
                      orders.forEach(function(order) {
                        var email = order.email || order.userEmail || 'unknown';
                        if (!customerMap[email]) {
                          customerMap[email] = {
                            name: order.customerName || order.userName || 'N/A',
                            email: email,
                            phone: order.phone || 'N/A',
                            address: order.address || 'N/A',
                            orders: 0,
                            totalSpent: 0,
                            hasPaid: false
                          };
                        }
                        customerMap[email].orders += 1;
                        customerMap[email].totalSpent += order.totalAmount || 0;
                        if (order.paymentStatus === 'paid') {
                          customerMap[email].hasPaid = true;
                        }
                      });
                      return Object.values(customerMap).map(function(customer, index) {
                        return (
                          <tr key={index}>
                            <td>
                              <div className="customer-cell">
                                <div className="customer-avatar">{customer.name.charAt(0).toUpperCase()}</div>
                                <span className="customer-name">{customer.name}</span>
                              </div>
                            </td>
                            <td>
                              <div className="contact-cell">
                                <span className="customer-email">{customer.email}</span>
                                <span className="customer-phone">{customer.phone}</span>
                              </div>
                            </td>
                            <td><span className="address-cell">{customer.address}</span></td>
                            <td><span className="orders-count">{customer.orders}</span></td>
                            <td><span className="total-spent">Rs.{customer.totalSpent.toLocaleString()}</span></td>
                            <td>
                              <span className={customer.hasPaid ? 'payment-badge paid' : 'payment-badge pending'}>
                                {customer.hasPaid ? 'Paid' : 'Pending'}
                              </span>
                            </td>
                          </tr>
                        );
                      });
                    })()}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
        
        {activeTab === 'add' && (
          <div className="admin-section">
            <div className="section-header">
              <h1>Add New Product</h1>
              <p>Fill in the details to add a new product</p>
            </div>
            
            <form className="product-form" onSubmit={handleSubmit}>
              <div className="form-grid">
                <div className="form-group">
                  <label>Product Name *</label>
                  <input type="text" name="name" value={formData.name} onChange={handleInputChange} placeholder="Enter product name" required />
                </div>
                
                <div className="form-group">
                  <label>Category *</label>
                  <select name="category" value={formData.category} onChange={handleInputChange}>
                    <option value="bulbs">Smart Bulbs</option>
                    <option value="strip">LED Strips</option>
                    <option value="panels">Panel Lights</option>
                    <option value="outdoor">Outdoor Lighting</option>
                    <option value="decorative">Decorative</option>
                    <option value="accessories">Accessories</option>
                  </select>
                </div>
                
                <div className="form-group">
                  <label>Price (Rs.) *</label>
                  <input type="number" name="price" value={formData.price} onChange={handleInputChange} placeholder="Enter price" required />
                </div>
                
                <div className="form-group">
                  <label>Badge (Optional)</label>
                  <input type="text" name="badge" value={formData.badge} onChange={handleInputChange} placeholder="e.g. 20% OFF, NEW" />
                </div>
                
                <div className="form-group full-width">
                  <label>Image URL</label>
                  <input type="url" name="imageUrl" value={formData.imageUrl} onChange={handleInputChange} placeholder="Enter image URL" />
                </div>
                
                <div className="form-group full-width">
                  <label>Description</label>
                  <textarea name="description" value={formData.description} onChange={handleInputChange} placeholder="Enter product description" rows="4"></textarea>
                </div>
              </div>
              
              <div className="form-actions">
                <button type="button" className="secondary-btn" onClick={function() { setFormData({ name: '', description: '', price: '', category: 'bulbs', imageUrl: '', badge: '' }); }}>Clear</button>
                <button type="submit" className="primary-btn" disabled={submitting}>
                  {submitting ? 'Adding...' : 'Add Product'}
                </button>
              </div>
            </form>
          </div>
        )}
      </main>
    </div>
  );
}

export default AdminPanel;
