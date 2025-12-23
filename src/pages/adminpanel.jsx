import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getProducts, addProduct, updateProduct, deleteProduct, uploadImage } from '../services/api';
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
  var formDataState = useState({ name: '', description: '', price: '', category: 'strip', quantity: '', imageUrl: '', badge: '' });
  var formData = formDataState[0];
  var setFormData = formDataState[1];
  
  // Tab state for switching between Products and Events
  var tabState = useState('products');
  var activeTab = tabState[0];
  var setActiveTab = tabState[1];

  useEffect(function() { loadProducts(); }, []);

  function loadProducts() {
    getProducts().then(function(data) { setProducts(data); }).catch(function(error) { console.error('Error loading products:', error); });
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
    setFormData({ name: '', description: '', price: '', category: 'strip', quantity: '', imageUrl: '', badge: '' });
    setImageFile(null);
    setImagePreview(null);
  }

  function openForm() { setIsFormOpen(true); }

  return (
    <div className="admin-panel">
      <div className="admin-header">
        <h1>LED Store Admin Panel</h1>
        <div className="admin-header-actions">
          <Link to="/" className="back-to-store-btn">Back to Store</Link>
        </div>
      </div>
      
      {/* Tab Navigation */}
      <div className="admin-tabs">
        <button 
          className={activeTab === 'products' ? 'admin-tab active' : 'admin-tab'}
          onClick={function() { setActiveTab('products'); }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Products
        </button>
        <button 
          className={activeTab === 'events' ? 'admin-tab active' : 'admin-tab'}
          onClick={function() { setActiveTab('events'); }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
            <line x1="16" y1="2" x2="16" y2="6"/>
            <line x1="8" y1="2" x2="8" y2="6"/>
            <line x1="3" y1="10" x2="21" y2="10"/>
          </svg>
          Events & Promotions
        </button>
      </div>

      {/* Products Tab Content */}
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
                        <option value="strip">LED Strip Lights</option>
                        <option value="bulbs">Smart Bulbs</option>
                        <option value="panels">Panel Lights</option>
                        <option value="outdoor">Outdoor Lighting</option>
                        <option value="accessories">Accessories</option>
                      </select>
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Description *</label>
                    <textarea name="description" value={formData.description} onChange={handleInputChange} required rows="4" placeholder="Detailed product description..." />
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Price (Rs.) *</label>
                      <input type="number" name="price" value={formData.price} onChange={handleInputChange} required min="0" step="0.01" placeholder="0.00" />
                    </div>
                    <div className="form-group">
                      <label>Quantity *</label>
                      <input type="number" name="quantity" value={formData.quantity} onChange={handleInputChange} required min="0" placeholder="0" />
                    </div>
                    <div className="form-group">
                      <label>Badge (Optional)</label>
                      <input type="text" name="badge" value={formData.badge} onChange={handleInputChange} placeholder="e.g., New, Sale -20%" />
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Product Image</label>
                    <input type="file" accept="image/*" onChange={handleImageChange} className="file-input" />
                    {imagePreview && <div className="image-preview"><img src={imagePreview} alt="Preview" /></div>}
                  </div>
                  <div className="form-actions">
                    <button type="button" onClick={resetForm} className="cancel-btn">Cancel</button>
                    <button type="submit" className="submit-btn" disabled={loading}>{loading ? 'Saving...' : (editingProduct ? 'Update Product' : 'Add Product')}</button>
                  </div>
                </form>
              </div>
            </div>
          )}
          
          <div className="products-table-container">
            <div className="products-table">
              <div className="table-header">
                <div className="table-cell">Image</div>
                <div className="table-cell">Name</div>
                <div className="table-cell">Category</div>
                <div className="table-cell">Price</div>
                <div className="table-cell">Quantity</div>
                <div className="table-cell">Actions</div>
              </div>
              {products.length === 0 ? (
                <div className="no-products">
                  <p>No products yet. Click "Add New Product" to get started.</p>
                </div>
              ) : (
                products.map(function(product) {
                  return (
                    <div key={product.id} className="table-row">
                      <div className="table-cell"><img src={product.imageUrl || 'https://via.placeholder.com/60'} alt={product.name} className="product-thumbnail" /></div>
                      <div className="table-cell"><strong>{product.name}</strong>{product.badge && <span className="mini-badge">{product.badge}</span>}</div>
                      <div className="table-cell">{product.category}</div>
                      <div className="table-cell">Rs.{product.price}</div>
                      <div className="table-cell"><span className={product.quantity < 10 ? "stock-badge low-stock" : "stock-badge"}>{product.quantity} units</span></div>
                      <div className="table-cell actions">
                        <button className="edit-btn" onClick={function() { handleEdit(product); }}>Edit</button>
                        <button className="delete-btn" onClick={function() { handleDelete(product.id); }}>Delete</button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </>
      )}

      {/* Events Tab Content */}
      {activeTab === 'events' && (
        <AdminEvents />
      )}
    </div>
  );
}

export default AdminPanel;
