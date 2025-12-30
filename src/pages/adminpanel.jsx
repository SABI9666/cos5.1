import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getProducts, addProduct, updateProduct, deleteProduct, uploadImage, getOrders, updateOrderStatus, getCategories, updateCategory } from '../services/api';
import AdminEvents from '../components/AdminEvents.jsx';
import './adminpanel.css';

function AdminPanel() {
  var productsState = useState([]);
  var products = productsState[0];
  var setProducts = productsState[1];
  var formOpenState = useState(false);
  var isFormOpen = formOpenState[0];
  var setIsFormOpen = formOpenState[1];
  var editingState = useState(null);
  var editingProduct = editingState[0];
  var setEditingProduct = editingState[1];
  var loadingState = useState(false);
  var loading = loadingState[0];
  var setLoading = loadingState[1];
  var imageFileState = useState(null);
  var imageFile = imageFileState[0];
  var setImageFile = imageFileState[1];
  var imagePreviewState = useState(null);
  var imagePreview = imagePreviewState[0];
  var setImagePreview = imagePreviewState[1];
  var formDataState = useState({ name: '', description: '', price: '', category: 'wall-light', quantity: '', imageUrl: '', badge: '' });
  var formData = formDataState[0];
  var setFormData = formDataState[1];
  
  var tabState = useState('products');
  var activeTab = tabState[0];
  var setActiveTab = tabState[1];
  
  var ordersState = useState([]);
  var orders = ordersState[0];
  var setOrders = ordersState[1];
  
  var ordersLoadingState = useState(true);
  var ordersLoading = ordersLoadingState[0];
  var setOrdersLoading = ordersLoadingState[1];

  // Order filter state
  var orderFilterState = useState('all');
  var orderFilter = orderFilterState[0];
  var setOrderFilter = orderFilterState[1];

  var categoriesState = useState([
    { id: 'wall-light', name: 'Wall Light', image: '' },
    { id: 'fan', name: 'Fan', image: '' },
    { id: 'hanging', name: 'Hanging', image: '' },
    { id: 'gate-light', name: 'Gate Light', image: '' },
    { id: 'bldc-fan', name: 'BLDC Fan', image: '' },
    { id: 'wall-fan', name: 'Wall Fan', image: '' },
    { id: 'wall-washer', name: 'Wall Washer', image: '' },
    { id: 'bulb', name: 'Bulb', image: '' },
    { id: 'surface-lights', name: 'Surface Lights', image: '' }
  ]);
  var categories = categoriesState[0];
  var setCategories = categoriesState[1];
  
  var categoryLoadingState = useState({});
  var categoryLoading = categoryLoadingState[0];
  var setCategoryLoading = categoryLoadingState[1];
  
  var categorySavedState = useState({});
  var categorySaved = categorySavedState[0];
  var setCategorySaved = categorySavedState[1];

  useEffect(function() { 
    loadProducts(); 
    loadOrders();
    loadCategoriesData();
  }, []);

  function loadProducts() {
    getProducts().then(function(data) { setProducts(data); }).catch(function(error) { console.error('Error loading products:', error); });
  }

  function loadOrders() {
    setOrdersLoading(true);
    getOrders().then(function(ordersList) {
      ordersList.sort(function(a, b) {
        var dateA = a.createdAt ? new Date(a.createdAt.seconds * 1000) : new Date(0);
        var dateB = b.createdAt ? new Date(b.createdAt.seconds * 1000) : new Date(0);
        return dateB - dateA;
      });
      setOrders(ordersList);
      setOrdersLoading(false);
    }).catch(function(error) {
      console.error('Error loading orders:', error);
      setOrdersLoading(false);
    });
  }

  function loadCategoriesData() {
    getCategories().then(function(data) {
      if (data && data.length > 0) {
        setCategories(data);
      }
    }).catch(function(error) {
      console.error('Error loading categories:', error);
    });
  }

  function handleCategoryImageUpload(categoryId, e) {
    var file = e.target.files[0];
    if (file) {
      var newLoading = {};
      newLoading[categoryId] = true;
      setCategoryLoading(newLoading);
      
      uploadImage(file).then(function(imageUrl) {
        var updatedCategories = categories.map(function(cat) {
          if (cat.id === categoryId) {
            return { id: cat.id, name: cat.name, image: imageUrl };
          }
          return cat;
        });
        setCategories(updatedCategories);
        
        var categoryToUpdate = updatedCategories.find(function(c) { return c.id === categoryId; });
        return updateCategory(categoryId, categoryToUpdate);
      }).then(function() {
        var newLoadingDone = {};
        newLoadingDone[categoryId] = false;
        setCategoryLoading(newLoadingDone);
        
        var newSaved = {};
        newSaved[categoryId] = true;
        setCategorySaved(newSaved);
        
        setTimeout(function() {
          var resetSaved = {};
          resetSaved[categoryId] = false;
          setCategorySaved(resetSaved);
        }, 2000);
      }).catch(function(error) {
        console.error('Error uploading category image:', error);
        var newLoadingError = {};
        newLoadingError[categoryId] = false;
        setCategoryLoading(newLoadingError);
        alert('Error uploading image. Please try again.');
      });
    }
  }

  function handleCategoryImageUrl(categoryId, imageUrl) {
    var updatedCategories = categories.map(function(cat) {
      if (cat.id === categoryId) {
        return { id: cat.id, name: cat.name, image: imageUrl };
      }
      return cat;
    });
    setCategories(updatedCategories);
  }

  function saveCategoryUrl(categoryId) {
    var newLoading = {};
    newLoading[categoryId] = true;
    setCategoryLoading(newLoading);
    
    var categoryToUpdate = categories.find(function(c) { return c.id === categoryId; });
    updateCategory(categoryId, categoryToUpdate).then(function() {
      var newLoadingDone = {};
      newLoadingDone[categoryId] = false;
      setCategoryLoading(newLoadingDone);
      
      var newSaved = {};
      newSaved[categoryId] = true;
      setCategorySaved(newSaved);
      
      setTimeout(function() {
        var resetSaved = {};
        resetSaved[categoryId] = false;
        setCategorySaved(resetSaved);
      }, 2000);
    }).catch(function(error) {
      console.error('Error saving category:', error);
      var newLoadingError = {};
      newLoadingError[categoryId] = false;
      setCategoryLoading(newLoadingError);
      alert('Error saving category. Please try again.');
    });
  }

  function handleOrderStatus(orderId, newStatus) {
    updateOrderStatus(orderId, newStatus).then(function() {
      loadOrders();
    }).catch(function(error) {
      console.error('Error updating order:', error);
      alert('Error updating order status');
    });
  }

  function formatDate(timestamp) {
    if (!timestamp) return 'N/A';
    var date = new Date(timestamp.seconds * 1000);
    return date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  }

  function getCustomersFromOrders() {
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
          hasPaid: false,
          lastOrder: null
        };
      }
      customerMap[email].orders += 1;
      customerMap[email].totalSpent += order.totalAmount || 0;
      if (order.paymentStatus === 'paid') {
        customerMap[email].hasPaid = true;
      }
      if (!customerMap[email].lastOrder || (order.createdAt && order.createdAt.seconds > customerMap[email].lastOrder)) {
        customerMap[email].lastOrder = order.createdAt ? order.createdAt.seconds : null;
      }
    });
    return Object.values(customerMap);
  }

  // Order filtering functions
  function getPaymentCompletedOrders() {
    return orders.filter(function(order) {
      return order.paymentStatus === 'paid';
    });
  }

  function getPaymentPendingOrders() {
    return orders.filter(function(order) {
      return order.paymentStatus !== 'paid';
    });
  }

  function getProcessingOrders() {
    return orders.filter(function(order) {
      return order.status === 'processing';
    });
  }

  function getShippedOrders() {
    return orders.filter(function(order) {
      return order.status === 'shipped';
    });
  }

  function getDeliveredOrders() {
    return orders.filter(function(order) {
      return order.status === 'completed' || order.status === 'delivered';
    });
  }

  function getNewPendingOrders() {
    return orders.filter(function(order) {
      return order.status === 'pending' || !order.status;
    });
  }

  function getCancelledOrders() {
    return orders.filter(function(order) {
      return order.status === 'cancelled';
    });
  }

  function getFilteredOrders() {
    switch(orderFilter) {
      case 'payment-completed':
        return getPaymentCompletedOrders();
      case 'payment-pending':
        return getPaymentPendingOrders();
      case 'processing':
        return getProcessingOrders();
      case 'shipped':
        return getShippedOrders();
      case 'delivered':
        return getDeliveredOrders();
      case 'new-pending':
        return getNewPendingOrders();
      case 'cancelled':
        return getCancelledOrders();
      default:
        return orders;
    }
  }

  function getOrderTotal(orderList) {
    return orderList.reduce(function(sum, order) {
      return sum + (order.totalAmount || 0);
    }, 0);
  }

  function handleInputChange(e) {
    var name = e.target.name;
    var value = e.target.value;
    setFormData(Object.assign({}, formData, { [name]: value }));
  }

  function handleImageChange(e) {
    var file = e.target.files[0];
    if (file) {
      setImageFile(file);
      var reader = new FileReader();
      reader.onloadend = function() { setImagePreview(reader.result); };
      reader.readAsDataURL(file);
    }
  }

  function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    var submitPromise;
    if (imageFile) {
      submitPromise = uploadImage(imageFile).then(function(url) { return url; });
    } else {
      submitPromise = Promise.resolve(formData.imageUrl);
    }
    submitPromise.then(function(imageUrl) {
      var productData = {
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        category: formData.category,
        quantity: parseInt(formData.quantity),
        imageUrl: imageUrl,
        badge: formData.badge
      };
      if (editingProduct) {
        return updateProduct(editingProduct.id, productData);
      } else {
        return addProduct(productData);
      }
    }).then(function() {
      resetForm();
      loadProducts();
    }).catch(function(error) {
      console.error('Error saving product:', error);
      alert('Error saving product. Please try again.');
    }).finally(function() {
      setLoading(false);
    });
  }

  function handleEdit(product) {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      category: product.category,
      quantity: product.quantity.toString(),
      imageUrl: product.imageUrl || '',
      badge: product.badge || ''
    });
    setImagePreview(product.imageUrl);
    setIsFormOpen(true);
  }

  function handleDelete(id) {
    if (window.confirm('Are you sure you want to delete this product?')) {
      deleteProduct(id).then(function() { loadProducts(); }).catch(function(error) {
        console.error('Error deleting product:', error);
        alert('Error deleting product.');
      });
    }
  }

  function resetForm() {
    setIsFormOpen(false);
    setEditingProduct(null);
    setFormData({ name: '', description: '', price: '', category: 'wall-light', quantity: '', imageUrl: '', badge: '' });
    setImageFile(null);
    setImagePreview(null);
  }

  function openForm() { setIsFormOpen(true); }

  function renderOrderCard(order) {
    var isPaid = order.paymentStatus === 'paid';
    var statusClass = order.status || 'pending';
    
    return (
      <div key={order.id} className={'order-card status-' + statusClass + (isPaid ? ' paid-order' : ' unpaid-order')}>
        <div className="order-card-header">
          <div className="order-id-section">
            <span className="order-label">Order ID</span>
            <span className="order-id-value">#{order.id.slice(-8).toUpperCase()}</span>
          </div>
          <div className="order-date-section">
            <span className="order-label">Date</span>
            <span className="order-date-value">{formatDate(order.createdAt)}</span>
          </div>
          <div className={isPaid ? 'payment-status-tag paid' : 'payment-status-tag pending'}>
            {isPaid ? (
              <>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="20 6 9 17 4 12" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Payment Done
              </>
            ) : (
              <>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" strokeLinecap="round" strokeLinejoin="round"/>
                  <polyline points="12 6 12 12 16 14" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Payment Pending
              </>
            )}
          </div>
          <div className={'order-status-badge status-' + statusClass}>
            {statusClass === 'pending' && 'New Order'}
            {statusClass === 'processing' && 'Processing'}
            {statusClass === 'shipped' && 'Shipped'}
            {statusClass === 'completed' && 'Delivered'}
            {statusClass === 'delivered' && 'Delivered'}
            {statusClass === 'cancelled' && 'Cancelled'}
          </div>
        </div>
        
        <div className="order-card-body">
          <div className="order-section customer-section">
            <h4>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" strokeLinecap="round" strokeLinejoin="round"/>
                <circle cx="12" cy="7" r="4" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Customer Details
            </h4>
            <div className="info-rows">
              <div className="info-row">
                <span className="info-label">Name:</span>
                <span className="info-value">{order.customerName || order.userName || 'N/A'}</span>
              </div>
              <div className="info-row">
                <span className="info-label">Email:</span>
                <span className="info-value">{order.email || order.userEmail || 'N/A'}</span>
              </div>
              <div className="info-row">
                <span className="info-label">Phone:</span>
                <span className="info-value">{order.phone || 'N/A'}</span>
              </div>
              <div className="info-row">
                <span className="info-label">Address:</span>
                <span className="info-value address-value">{order.address || 'Not provided'}</span>
              </div>
            </div>
          </div>
          
          <div className="order-section payment-section">
            <h4>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="1" y="4" width="22" height="16" rx="2" ry="2" strokeLinecap="round" strokeLinejoin="round"/>
                <line x1="1" y1="10" x2="23" y2="10" strokeLinecap="round"/>
              </svg>
              Payment Details
            </h4>
            <div className="info-rows">
              <div className="info-row">
                <span className="info-label">Payment:</span>
                <span className={isPaid ? 'payment-status-value paid' : 'payment-status-value pending'}>
                  {isPaid ? '✓ Completed' : '○ Pending'}
                </span>
              </div>
              <div className="info-row">
                <span className="info-label">Method:</span>
                <span className="info-value">{order.paymentMethod || 'Razorpay'}</span>
              </div>
              {isPaid && (
                <div className="info-row">
                  <span className="info-label">Transaction ID:</span>
                  <span className="info-value transaction-id">{order.paymentId || order.transactionId || 'N/A'}</span>
                </div>
              )}
              <div className="info-row">
                <span className="info-label">Total Amount:</span>
                <span className="info-value total-amount">₹{order.totalAmount ? order.totalAmount.toLocaleString() : '0'}</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="order-items-section">
          <h4>Order Items ({order.items ? order.items.length : 0})</h4>
          <div className="order-items-list">
            {order.items && order.items.map(function(item, index) {
              return (
                <div key={index} className="order-item">
                  <img src={item.imageUrl || 'https://via.placeholder.com/50'} alt={item.name} className="order-item-image" />
                  <div className="order-item-details">
                    <span className="order-item-name">{item.name}</span>
                    <span className="order-item-qty">Qty: {item.quantity}</span>
                  </div>
                  <span className="order-item-price">₹{item.price ? (item.price * item.quantity).toLocaleString() : '0'}</span>
                </div>
              );
            })}
          </div>
        </div>
        
        <div className="order-card-footer">
          <div className="status-update">
            <span>Update Order Status:</span>
            <select 
              value={order.status || 'pending'} 
              onChange={function(e) { handleOrderStatus(order.id, e.target.value); }}
              className="status-select"
            >
              <option value="pending">New Order</option>
              <option value="processing">Processing</option>
              <option value="shipped">Shipped</option>
              <option value="completed">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-panel">
      <div className="admin-header">
        <h1>LaxoraLED Admin Panel</h1>
        <div className="admin-header-actions">
          <Link to="/" className="back-to-store-btn">Back to Store</Link>
        </div>
      </div>
      
      <div className="admin-tabs">
        <button className={activeTab === 'products' ? 'admin-tab active' : 'admin-tab'} onClick={function() { setActiveTab('products'); }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Products
        </button>
        <button className={activeTab === 'categories' ? 'admin-tab active' : 'admin-tab'} onClick={function() { setActiveTab('categories'); }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/>
            <rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>
          </svg>
          Categories
        </button>
        <button className={activeTab === 'orders' ? 'admin-tab active' : 'admin-tab'} onClick={function() { setActiveTab('orders'); }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2" strokeLinecap="round" strokeLinejoin="round"/>
            <rect x="9" y="3" width="6" height="4" rx="1" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Orders
          {orders.length > 0 && <span className="tab-badge">{orders.length}</span>}
        </button>
        <button className={activeTab === 'customers' ? 'admin-tab active' : 'admin-tab'} onClick={function() { setActiveTab('customers'); }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" strokeLinecap="round" strokeLinejoin="round"/>
            <circle cx="9" cy="7" r="4" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Customers
        </button>
        <button className={activeTab === 'events' ? 'admin-tab active' : 'admin-tab'} onClick={function() { setActiveTab('events'); }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
            <line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
          </svg>
          Events
        </button>
      </div>

      {activeTab === 'products' && (
        <>
          <div className="tab-header">
            <h2>Products ({products.length})</h2>
            <button className="add-product-btn" onClick={openForm}>+ Add New Product</button>
          </div>
          
          {isFormOpen && (
            <div className="modal-overlay" onClick={resetForm}>
              <div className="modal-content" onClick={function(e) { e.stopPropagation(); }}>
                <div className="modal-header">
                  <h2>{editingProduct ? 'Edit Product' : 'Add New Product'}</h2>
                  <button className="close-btn" onClick={resetForm}>×</button>
                </div>
                <form onSubmit={handleSubmit} className="product-form">
                  <div className="form-row">
                    <div className="form-group">
                      <label>Product Name *</label>
                      <input type="text" name="name" value={formData.name} onChange={handleInputChange} required placeholder="e.g., RGB LED Strip 5M" />
                    </div>
                    <div className="form-group">
                      <label>Category *</label>
                      <select name="category" value={formData.category} onChange={handleInputChange} required>
                        <option value="wall-light">Wall Light</option>
                        <option value="fan">Fan</option>
                        <option value="hanging">Hanging</option>
                        <option value="gate-light">Gate Light</option>
                        <option value="bldc-fan">BLDC Fan</option>
                        <option value="wall-fan">Wall Fan</option>
                        <option value="wall-washer">Wall Washer</option>
                        <option value="bulb">Bulb</option>
                        <option value="surface-lights">Surface Lights</option>
                      </select>
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Description *</label>
                    <textarea name="description" value={formData.description} onChange={handleInputChange} required rows="4" placeholder="Detailed product description..." />
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Price (₹) *</label>
                      <input type="number" name="price" value={formData.price} onChange={handleInputChange} required min="0" placeholder="e.g., 999" />
                    </div>
                    <div className="form-group">
                      <label>Stock Quantity *</label>
                      <input type="number" name="quantity" value={formData.quantity} onChange={handleInputChange} required min="0" placeholder="e.g., 50" />
                    </div>
                    <div className="form-group">
                      <label>Badge (optional)</label>
                      <input type="text" name="badge" value={formData.badge} onChange={handleInputChange} placeholder="e.g., NEW, SALE" />
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Product Image</label>
                    <div className="image-upload-section">
                      {imagePreview && <div className="image-preview"><img src={imagePreview} alt="Preview" /></div>}
                      <div className="upload-options">
                        <input type="file" accept="image/*" onChange={handleImageChange} id="product-image" className="file-input" />
                        <label htmlFor="product-image" className="upload-btn">Choose Image</label>
                        <span className="or-text">or</span>
                        <input type="text" name="imageUrl" value={formData.imageUrl} onChange={handleInputChange} placeholder="Paste image URL" className="url-input" />
                      </div>
                    </div>
                  </div>
                  <div className="form-actions">
                    <button type="button" onClick={resetForm} className="cancel-btn">Cancel</button>
                    <button type="submit" className="submit-btn" disabled={loading}>{loading ? 'Saving...' : (editingProduct ? 'Update Product' : 'Add Product')}</button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {products.length === 0 ? (
            <div className="empty-state-container">
              <div className="empty-state">
                <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <h3>No Products Yet</h3>
                <p>Add your first product to get started!</p>
                <button className="add-product-btn" onClick={openForm}>+ Add Product</button>
              </div>
            </div>
          ) : (
            <div className="products-table">
              <div className="table-header">
                <div className="table-cell">Image</div>
                <div className="table-cell">Product</div>
                <div className="table-cell">Category</div>
                <div className="table-cell">Price</div>
                <div className="table-cell">Stock</div>
                <div className="table-cell">Actions</div>
              </div>
              {products.map(function(product) {
                return (
                  <div key={product.id} className="table-row">
                    <div className="table-cell" data-label="Image"><img src={product.imageUrl || 'https://via.placeholder.com/60'} alt={product.name} className="product-thumb" /></div>
                    <div className="table-cell" data-label="Product"><div className="product-name-cell"><span className="product-name">{product.name}</span>{product.badge && <span className="product-badge">{product.badge}</span>}</div></div>
                    <div className="table-cell" data-label="Category"><span className="category-tag">{product.category}</span></div>
                    <div className="table-cell" data-label="Price">₹{product.price ? product.price.toLocaleString() : '0'}</div>
                    <div className="table-cell" data-label="Stock"><span className={product.quantity > 10 ? 'stock-badge in-stock' : product.quantity > 0 ? 'stock-badge low-stock' : 'stock-badge out-of-stock'}>{product.quantity > 0 ? product.quantity + ' units' : 'Out of Stock'}</span></div>
                    <div className="table-cell actions" data-label="Actions">
                      <button className="edit-btn" onClick={function() { handleEdit(product); }}>Edit</button>
                      <button className="delete-btn" onClick={function() { handleDelete(product.id); }}>Delete</button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}

      {activeTab === 'categories' && (
        <>
          <div className="tab-header">
            <h2>Category Images</h2>
            <p className="tab-subtitle">Manage images for "What are you looking for?" section on homepage</p>
          </div>
          <div className="categories-management">
            {categories.map(function(category) {
              return (
                <div key={category.id} className="category-edit-card">
                  <div className="category-preview-box">
                    {category.image ? (
                      <img src={category.image} alt={category.name} className="category-preview-img" />
                    ) : (
                      <div className="category-placeholder">
                        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                          <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/>
                        </svg>
                        <span>No Image</span>
                      </div>
                    )}
                  </div>
                  <div className="category-edit-content">
                    <h3 className="category-edit-name">{category.name}</h3>
                    <div className="category-image-form">
                      <div className="url-input-group">
                        <input type="text" value={category.image || ''} onChange={function(e) { handleCategoryImageUrl(category.id, e.target.value); }} placeholder="Paste image URL here..." className="category-url-input" />
                        <button className="save-url-btn" onClick={function() { saveCategoryUrl(category.id); }} disabled={categoryLoading[category.id]}>{categoryLoading[category.id] ? 'Saving...' : 'Save'}</button>
                      </div>
                      <div className="upload-divider"><span>OR</span></div>
                      <div className="category-file-upload">
                        <input type="file" accept="image/*" onChange={function(e) { handleCategoryImageUpload(category.id, e); }} id={'cat-upload-' + category.id} className="file-input" />
                        <label htmlFor={'cat-upload-' + category.id} className="category-upload-btn">
                          {categoryLoading[category.id] ? <span>Uploading...</span> : <><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>Upload Image</>}
                        </label>
                      </div>
                    </div>
                    {categorySaved[category.id] && <div className="category-saved-msg"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>Saved successfully!</div>}
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      {activeTab === 'orders' && (
        <>
          <div className="tab-header">
            <h2>Orders Management</h2>
            <button className="add-product-btn" onClick={loadOrders}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{marginRight: '8px'}}>
                <path d="M23 4v6h-6M1 20v-6h6M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Refresh
            </button>
          </div>
          
          {ordersLoading ? (
            <div className="loading-container"><div className="loading-spinner"></div></div>
          ) : orders.length === 0 ? (
            <div className="empty-state-container">
              <div className="empty-state">
                <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2" strokeLinecap="round" strokeLinejoin="round"/>
                  <rect x="9" y="3" width="6" height="4" rx="1" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <h3>No Orders Yet</h3>
                <p>Orders will appear here when customers make purchases</p>
              </div>
            </div>
          ) : (
            <div className="orders-management">
              {/* Status Overview Cards */}
              <div className="status-overview">
                <div className="overview-section payment-overview">
                  <h3 className="overview-title">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/>
                      <line x1="1" y1="10" x2="23" y2="10"/>
                    </svg>
                    Payment Status
                  </h3>
                  <div className="overview-cards">
                    <div className={'overview-card payment-completed' + (orderFilter === 'payment-completed' ? ' active' : '')} onClick={function() { setOrderFilter(orderFilter === 'payment-completed' ? 'all' : 'payment-completed'); }}>
                      <div className="card-icon">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                          <polyline points="22 4 12 14.01 9 11.01"/>
                        </svg>
                      </div>
                      <div className="card-content">
                        <span className="card-count">{getPaymentCompletedOrders().length}</span>
                        <span className="card-label">Payment Completed</span>
                        <span className="card-amount">₹{getOrderTotal(getPaymentCompletedOrders()).toLocaleString()}</span>
                      </div>
                    </div>
                    <div className={'overview-card payment-pending' + (orderFilter === 'payment-pending' ? ' active' : '')} onClick={function() { setOrderFilter(orderFilter === 'payment-pending' ? 'all' : 'payment-pending'); }}>
                      <div className="card-icon">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <circle cx="12" cy="12" r="10"/>
                          <polyline points="12 6 12 12 16 14"/>
                        </svg>
                      </div>
                      <div className="card-content">
                        <span className="card-count">{getPaymentPendingOrders().length}</span>
                        <span className="card-label">Payment Pending</span>
                        <span className="card-amount">₹{getOrderTotal(getPaymentPendingOrders()).toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="overview-section order-overview">
                  <h3 className="overview-title">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2"/>
                      <rect x="9" y="3" width="6" height="4" rx="1"/>
                    </svg>
                    Order Status
                  </h3>
                  <div className="overview-cards order-status-cards">
                    <div className={'overview-card new-orders' + (orderFilter === 'new-pending' ? ' active' : '')} onClick={function() { setOrderFilter(orderFilter === 'new-pending' ? 'all' : 'new-pending'); }}>
                      <div className="card-icon">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <circle cx="12" cy="12" r="10"/>
                          <line x1="12" y1="8" x2="12" y2="16"/>
                          <line x1="8" y1="12" x2="16" y2="12"/>
                        </svg>
                      </div>
                      <div className="card-content">
                        <span className="card-count">{getNewPendingOrders().length}</span>
                        <span className="card-label">New Orders</span>
                      </div>
                    </div>
                    <div className={'overview-card processing' + (orderFilter === 'processing' ? ' active' : '')} onClick={function() { setOrderFilter(orderFilter === 'processing' ? 'all' : 'processing'); }}>
                      <div className="card-icon">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
                        </svg>
                      </div>
                      <div className="card-content">
                        <span className="card-count">{getProcessingOrders().length}</span>
                        <span className="card-label">Processing</span>
                      </div>
                    </div>
                    <div className={'overview-card shipped' + (orderFilter === 'shipped' ? ' active' : '')} onClick={function() { setOrderFilter(orderFilter === 'shipped' ? 'all' : 'shipped'); }}>
                      <div className="card-icon">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <rect x="1" y="3" width="15" height="13"/>
                          <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/>
                          <circle cx="5.5" cy="18.5" r="2.5"/>
                          <circle cx="18.5" cy="18.5" r="2.5"/>
                        </svg>
                      </div>
                      <div className="card-content">
                        <span className="card-count">{getShippedOrders().length}</span>
                        <span className="card-label">Shipped</span>
                      </div>
                    </div>
                    <div className={'overview-card delivered' + (orderFilter === 'delivered' ? ' active' : '')} onClick={function() { setOrderFilter(orderFilter === 'delivered' ? 'all' : 'delivered'); }}>
                      <div className="card-icon">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <polyline points="20 6 9 17 4 12"/>
                        </svg>
                      </div>
                      <div className="card-content">
                        <span className="card-count">{getDeliveredOrders().length}</span>
                        <span className="card-label">Delivered</span>
                      </div>
                    </div>
                    <div className={'overview-card cancelled' + (orderFilter === 'cancelled' ? ' active' : '')} onClick={function() { setOrderFilter(orderFilter === 'cancelled' ? 'all' : 'cancelled'); }}>
                      <div className="card-icon">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <circle cx="12" cy="12" r="10"/>
                          <line x1="15" y1="9" x2="9" y2="15"/>
                          <line x1="9" y1="9" x2="15" y2="15"/>
                        </svg>
                      </div>
                      <div className="card-content">
                        <span className="card-count">{getCancelledOrders().length}</span>
                        <span className="card-label">Cancelled</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Filter Info */}
              <div className="filter-info">
                <div className="filter-label">
                  {orderFilter === 'all' && <span>Showing All Orders ({orders.length})</span>}
                  {orderFilter === 'payment-completed' && <span className="filter-active payment-completed">Payment Completed ({getPaymentCompletedOrders().length})</span>}
                  {orderFilter === 'payment-pending' && <span className="filter-active payment-pending">Payment Pending ({getPaymentPendingOrders().length})</span>}
                  {orderFilter === 'new-pending' && <span className="filter-active new-orders">New Orders ({getNewPendingOrders().length})</span>}
                  {orderFilter === 'processing' && <span className="filter-active processing">Processing ({getProcessingOrders().length})</span>}
                  {orderFilter === 'shipped' && <span className="filter-active shipped">Shipped ({getShippedOrders().length})</span>}
                  {orderFilter === 'delivered' && <span className="filter-active delivered">Delivered ({getDeliveredOrders().length})</span>}
                  {orderFilter === 'cancelled' && <span className="filter-active cancelled">Cancelled ({getCancelledOrders().length})</span>}
                </div>
                {orderFilter !== 'all' && (
                  <button className="clear-filter-btn" onClick={function() { setOrderFilter('all'); }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <line x1="18" y1="6" x2="6" y2="18"/>
                      <line x1="6" y1="6" x2="18" y2="18"/>
                    </svg>
                    Clear Filter
                  </button>
                )}
              </div>

              {/* Orders List */}
              <div className="orders-list">
                {getFilteredOrders().length === 0 ? (
                  <div className="no-orders-message">
                    <p>No orders found for this filter</p>
                  </div>
                ) : (
                  getFilteredOrders().map(function(order) {
                    return renderOrderCard(order);
                  })
                )}
              </div>
            </div>
          )}
        </>
      )}

      {activeTab === 'customers' && (
        <>
          <div className="tab-header"><h2>Customers ({getCustomersFromOrders().length})</h2></div>
          {orders.length === 0 ? (
            <div className="empty-state-container">
              <div className="empty-state">
                <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" strokeLinecap="round" strokeLinejoin="round"/>
                  <circle cx="9" cy="7" r="4" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <h3>No Customers Yet</h3>
                <p>Customer data will appear when orders are placed</p>
              </div>
            </div>
          ) : (
            <div className="customers-table-container">
              <div className="customers-table">
                <div className="table-header">
                  <div className="table-cell">Customer</div>
                  <div className="table-cell">Contact</div>
                  <div className="table-cell">Address</div>
                  <div className="table-cell">Orders</div>
                  <div className="table-cell">Total Spent</div>
                  <div className="table-cell">Payment</div>
                </div>
                {getCustomersFromOrders().map(function(customer, index) {
                  return (
                    <div key={index} className="table-row">
                      <div className="table-cell" data-label="Customer"><div className="customer-cell"><div className="customer-avatar">{customer.name.charAt(0).toUpperCase()}</div><span className="customer-name">{customer.name}</span></div></div>
                      <div className="table-cell" data-label="Contact"><div className="contact-info"><span className="contact-email">{customer.email}</span><span className="contact-phone">{customer.phone}</span></div></div>
                      <div className="table-cell" data-label="Address"><span className="address-text">{customer.address}</span></div>
                      <div className="table-cell" data-label="Orders"><span className="orders-count">{customer.orders}</span></div>
                      <div className="table-cell" data-label="Total Spent"><span className="total-spent">₹{customer.totalSpent.toLocaleString()}</span></div>
                      <div className="table-cell" data-label="Payment"><span className={customer.hasPaid ? 'payment-badge paid' : 'payment-badge pending'}>{customer.hasPaid ? 'Paid' : 'Pending'}</span></div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </>
      )}

      {activeTab === 'events' && <AdminEvents />}
    </div>
  );
}

export default AdminPanel;
