import React, { useState, useEffect } from 'react';
import { getEvents, addEvent, updateEvent, deleteEvent, uploadEventImage } from '../services/api';
import './adminevents.css';

function AdminEvents() {
  var [events, setEvents] = useState([]);
  var [loading, setLoading] = useState(true);
  var [showForm, setShowForm] = useState(false);
  var [editingEvent, setEditingEvent] = useState(null);
  var [uploading, setUploading] = useState(false);
  var [saving, setSaving] = useState(false);
  
  var [formData, setFormData] = useState({
    title: '',
    description: '',
    imageUrl: '',
    startDate: '',
    endDate: '',
    discount: '',
    buttonText: 'Shop Now',
    buttonLink: '/products',
    isActive: true
  });

  useEffect(function() {
    loadEvents();
  }, []);

  function loadEvents() {
    setLoading(true);
    getEvents()
      .then(function(data) {
        setEvents(data);
        setLoading(false);
      })
      .catch(function(error) {
        console.error('Error loading events:', error);
        setLoading(false);
      });
  }

  function resetForm() {
    setFormData({
      title: '',
      description: '',
      imageUrl: '',
      startDate: '',
      endDate: '',
      discount: '',
      buttonText: 'Shop Now',
      buttonLink: '/products',
      isActive: true
    });
    setEditingEvent(null);
    setShowForm(false);
  }

  function handleInputChange(e) {
    var name = e.target.name;
    var value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData(function(prev) {
      return { ...prev, [name]: value };
    });
  }

  function handleImageUpload(e) {
    var file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Image size should be less than 5MB');
      return;
    }

    setUploading(true);
    uploadEventImage(file)
      .then(function(url) {
        setFormData(function(prev) {
          return { ...prev, imageUrl: url };
        });
        setUploading(false);
      })
      .catch(function(error) {
        console.error('Error uploading image:', error);
        alert('Failed to upload image');
        setUploading(false);
      });
  }

  function handleSubmit(e) {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      alert('Please enter event title');
      return;
    }
    
    if (!formData.imageUrl) {
      alert('Please upload an event image');
      return;
    }

    setSaving(true);

    if (editingEvent) {
      updateEvent(editingEvent.id, formData)
        .then(function() {
          loadEvents();
          resetForm();
          setSaving(false);
        })
        .catch(function(error) {
          console.error('Error updating event:', error);
          alert('Failed to update event');
          setSaving(false);
        });
    } else {
      addEvent(formData)
        .then(function() {
          loadEvents();
          resetForm();
          setSaving(false);
        })
        .catch(function(error) {
          console.error('Error adding event:', error);
          alert('Failed to add event');
          setSaving(false);
        });
    }
  }

  function handleEdit(event) {
    setFormData({
      title: event.title || '',
      description: event.description || '',
      imageUrl: event.imageUrl || '',
      startDate: event.startDate || '',
      endDate: event.endDate || '',
      discount: event.discount || '',
      buttonText: event.buttonText || 'Shop Now',
      buttonLink: event.buttonLink || '/products',
      isActive: event.isActive !== false
    });
    setEditingEvent(event);
    setShowForm(true);
  }

  function handleDelete(eventId) {
    if (!confirm('Are you sure you want to delete this event?')) return;
    
    deleteEvent(eventId)
      .then(function() {
        loadEvents();
      })
      .catch(function(error) {
        console.error('Error deleting event:', error);
        alert('Failed to delete event');
      });
  }

  function toggleEventStatus(event) {
    updateEvent(event.id, { isActive: !event.isActive })
      .then(function() {
        loadEvents();
      })
      .catch(function(error) {
        console.error('Error updating event status:', error);
      });
  }

  function formatDate(dateString) {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  }

  return (
    <div className="admin-events">
      <div className="events-header">
        <div className="header-left">
          <h2>Events & Promotions</h2>
          <p>Manage your promotional events and banners</p>
        </div>
        <button 
          className="add-event-btn"
          onClick={function() { setShowForm(true); }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="12" y1="5" x2="12" y2="19"/>
            <line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          Add Event
        </button>
      </div>

      {/* Event Form Modal */}
      {showForm && (
        <div className="modal-overlay" onClick={resetForm}>
          <div className="event-form-modal" onClick={function(e) { e.stopPropagation(); }}>
            <div className="modal-header">
              <h3>{editingEvent ? 'Edit Event' : 'Add New Event'}</h3>
              <button className="close-btn" onClick={resetForm}>&times;</button>
            </div>
            
            <form onSubmit={handleSubmit} className="event-form">
              {/* Image Upload */}
              <div className="form-group image-upload-group">
                <label>Event Banner Image *</label>
                <div className="image-upload-area">
                  {formData.imageUrl ? (
                    <div className="image-preview">
                      <img src={formData.imageUrl} alt="Event banner" />
                      <button 
                        type="button" 
                        className="remove-image"
                        onClick={function() { setFormData(function(prev) { return { ...prev, imageUrl: '' }; }); }}
                      >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <line x1="18" y1="6" x2="6" y2="18"/>
                          <line x1="6" y1="6" x2="18" y2="18"/>
                        </svg>
                      </button>
                    </div>
                  ) : (
                    <label className="upload-placeholder">
                      <input 
                        type="file" 
                        accept="image/*" 
                        onChange={handleImageUpload}
                        disabled={uploading}
                      />
                      {uploading ? (
                        <div className="upload-loading">
                          <div className="spinner"></div>
                          <span>Uploading...</span>
                        </div>
                      ) : (
                        <>
                          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                            <circle cx="8.5" cy="8.5" r="1.5"/>
                            <polyline points="21 15 16 10 5 21"/>
                          </svg>
                          <span>Click to upload banner image</span>
                          <small>Recommended: 1200x600px, Max 5MB</small>
                        </>
                      )}
                    </label>
                  )}
                </div>
              </div>

              {/* Title */}
              <div className="form-group">
                <label>Event Title *</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="e.g., Diwali Sale - Up to 50% Off"
                  required
                />
              </div>

              {/* Description */}
              <div className="form-group">
                <label>Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Brief description of the event..."
                  rows="3"
                />
              </div>

              {/* Discount */}
              <div className="form-group">
                <label>Discount / Offer Text</label>
                <input
                  type="text"
                  name="discount"
                  value={formData.discount}
                  onChange={handleInputChange}
                  placeholder="e.g., 50% OFF, Buy 1 Get 1, Free Shipping"
                />
              </div>

              {/* Dates */}
              <div className="form-row">
                <div className="form-group">
                  <label>Start Date</label>
                  <input
                    type="date"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="form-group">
                  <label>End Date</label>
                  <input
                    type="date"
                    name="endDate"
                    value={formData.endDate}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              {/* Button Settings */}
              <div className="form-row">
                <div className="form-group">
                  <label>Button Text</label>
                  <input
                    type="text"
                    name="buttonText"
                    value={formData.buttonText}
                    onChange={handleInputChange}
                    placeholder="Shop Now"
                  />
                </div>
                <div className="form-group">
                  <label>Button Link</label>
                  <input
                    type="text"
                    name="buttonLink"
                    value={formData.buttonLink}
                    onChange={handleInputChange}
                    placeholder="/products"
                  />
                </div>
              </div>

              {/* Active Status */}
              <div className="form-group checkbox-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    name="isActive"
                    checked={formData.isActive}
                    onChange={handleInputChange}
                  />
                  <span className="checkmark"></span>
                  <span>Active (Show on website)</span>
                </label>
              </div>

              {/* Submit Button */}
              <div className="form-actions">
                <button type="button" className="cancel-btn" onClick={resetForm}>
                  Cancel
                </button>
                <button type="submit" className="submit-btn" disabled={saving || uploading}>
                  {saving ? 'Saving...' : (editingEvent ? 'Update Event' : 'Add Event')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Events List */}
      {loading ? (
        <div className="loading-container">
          <div className="loading-spinner"></div>
        </div>
      ) : events.length === 0 ? (
        <div className="no-events">
          <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
            <line x1="16" y1="2" x2="16" y2="6"/>
            <line x1="8" y1="2" x2="8" y2="6"/>
            <line x1="3" y1="10" x2="21" y2="10"/>
          </svg>
          <h3>No Events Yet</h3>
          <p>Create your first promotional event to attract customers</p>
          <button onClick={function() { setShowForm(true); }}>
            Create Event
          </button>
        </div>
      ) : (
        <div className="events-grid">
          {events.map(function(event) {
            return (
              <div key={event.id} className={'event-card ' + (event.isActive ? '' : 'inactive')}>
                <div className="event-image">
                  <img src={event.imageUrl} alt={event.title} />
                  {event.discount && (
                    <span className="event-discount">{event.discount}</span>
                  )}
                  <span className={'event-status ' + (event.isActive ? 'active' : 'inactive')}>
                    {event.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
                <div className="event-content">
                  <h4>{event.title}</h4>
                  {event.description && (
                    <p className="event-description">{event.description}</p>
                  )}
                  <div className="event-dates">
                    <span>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                        <line x1="16" y1="2" x2="16" y2="6"/>
                        <line x1="8" y1="2" x2="8" y2="6"/>
                        <line x1="3" y1="10" x2="21" y2="10"/>
                      </svg>
                      {formatDate(event.startDate)} - {formatDate(event.endDate)}
                    </span>
                  </div>
                </div>
                <div className="event-actions">
                  <button 
                    className="toggle-btn"
                    onClick={function() { toggleEventStatus(event); }}
                    title={event.isActive ? 'Deactivate' : 'Activate'}
                  >
                    {event.isActive ? (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                        <circle cx="12" cy="12" r="3"/>
                      </svg>
                    ) : (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                        <line x1="1" y1="1" x2="23" y2="23"/>
                      </svg>
                    )}
                  </button>
                  <button 
                    className="edit-btn"
                    onClick={function() { handleEdit(event); }}
                    title="Edit"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                    </svg>
                  </button>
                  <button 
                    className="delete-btn"
                    onClick={function() { handleDelete(event.id); }}
                    title="Delete"
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="3 6 5 6 21 6"/>
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                      <line x1="10" y1="11" x2="10" y2="17"/>
                      <line x1="14" y1="11" x2="14" y2="17"/>
                    </svg>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default AdminEvents;
