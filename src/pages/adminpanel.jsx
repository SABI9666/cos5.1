import React, { useState, useEffect } from 'react';
import { getProducts, addProduct, updateProduct, deleteProduct, uploadImage } from '../services/api';
import './AdminPanel.css';

const AdminPanel = () => {
  const [products, setProducts] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: 'strip',
    quantity: '',
    imageUrl: '',
    badge: ''
  });

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const data = await getProducts();
      setProducts(data);
    } catch (error) {
      console.error('Error loading products:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let imageUrl = formData.imageUrl;

      // Upload image if a new file is selected
      if (imageFile) {
        imageUrl = await uploadImage(imageFile);
      }

      const productData = {
        ...formData,
        imageUrl,
        price: parseFloat(formData.price),
        quantity: parseInt(formData.quantity)
      };

      if (editingProduct) {
        await updateProduct(editingProduct.id, productData);
      } else {
        await addProduct(productData);
      }

      // Reset form
      setFormData({
        name: '',
        description: '',
        price: '',
        category: 'strip',
        quantity: '',
        imageUrl: '',
        badge: ''
      });
      setImageFile(null);
      setImagePreview(null);
      setIsFormOpen(false);
      setEditingProduct(null);
      loadProducts();
    } catch (error) {
      console.error('Error saving product:', error);
      alert('Error saving product. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (product) => {
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
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await deleteProduct(id);
        loadProducts();
      } catch (error) {
        console.error('Error deleting product:', error);
        alert('Error deleting product. Please try again.');
      }
    }
  };

  const cancelForm = () => {
    setIsFormOpen(false);
    setEditingProduct(null);
    setFormData({
      name: '',
      description: '',
      price: '',
      category: 'strip',
      quantity: '',
      imageUrl: '',
      badge: ''
    });
    setImageFile(null);
    setImagePreview(null);
  };

  return (
    <div className="admin-panel">
      <div className="admin-header">
        <h1>LED Store Admin Panel</h1>
        <button 
          className="add-product-btn"
          onClick={() => setIsFormOpen(true)}
        >
          + Add New Product
        </button>
      </div>

      {isFormOpen && (
        <div className="modal-overlay" onClick={cancelForm}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingProduct ? 'Edit Product' : 'Add New Product'}</h2>
              <button className="close-btn" onClick={cancelForm}>×</button>
            </div>

            <form onSubmit={handleSubmit} className="product-form">
              <div className="form-row">
                <div className="form-group">
                  <label>Product Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    placeholder="e.g., RGB LED Strip 5M"
                  />
                </div>

                <div className="form-group">
                  <label>Category *</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    required
                  >
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
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                  rows="4"
                  placeholder="Detailed product description..."
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Price (₹) *</label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    required
                    min="0"
                    step="0.01"
                    placeholder="0.00"
                  />
                </div>

                <div className="form-group">
                  <label>Quantity *</label>
                  <input
                    type="number"
                    name="quantity"
                    value={formData.quantity}
                    onChange={handleInputChange}
                    required
                    min="0"
                    placeholder="0"
                  />
                </div>

                <div className="form-group">
                  <label>Badge (Optional)</label>
                  <input
                    type="text"
                    name="badge"
                    value={formData.badge}
                    onChange={handleInputChange}
                    placeholder="e.g., New, Sale -20%"
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Product Image *</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="file-input"
                />
                {imagePreview && (
                  <div className="image-preview">
                    <img src={imagePreview} alt="Preview" />
                  </div>
                )}
                {!imageFile && !imagePreview && (
                  <p className="form-help-text">
                    Recommended: 800x800px, JPG or PNG
                  </p>
                )}
              </div>

              <div className="form-actions">
                <button type="button" onClick={cancelForm} className="cancel-btn">
                  Cancel
                </button>
                <button type="submit" className="submit-btn" disabled={loading}>
                  {loading ? 'Saving...' : (editingProduct ? 'Update Product' : 'Add Product')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="products-table-container">
        <h2>Products ({products.length})</h2>
        <div className="products-table">
          <div className="table-header">
            <div className="table-cell">Image</div>
            <div className="table-cell">Name</div>
            <div className="table-cell">Category</div>
            <div className="table-cell">Price</div>
            <div className="table-cell">Quantity</div>
            <div className="table-cell">Actions</div>
          </div>
          {products.map(product => (
            <div key={product.id} className="table-row">
              <div className="table-cell">
                <img 
                  src={product.imageUrl || 'https://via.placeholder.com/60'} 
                  alt={product.name}
                  className="product-thumbnail"
                />
              </div>
              <div className="table-cell">
                <strong>{product.name}</strong>
                {product.badge && <span className="mini-badge">{product.badge}</span>}
              </div>
              <div className="table-cell">{product.category}</div>
              <div className="table-cell">₹{product.price}</div>
              <div className="table-cell">
                <span className={`stock-badge ${product.quantity < 10 ? 'low-stock' : ''}`}>
                  {product.quantity} units
                </span>
              </div>
              <div className="table-cell actions">
                <button 
                  className="edit-btn"
                  onClick={() => handleEdit(product)}
                >
                  Edit
                </button>
                <button 
                  className="delete-btn"
                  onClick={() => handleDelete(product.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
