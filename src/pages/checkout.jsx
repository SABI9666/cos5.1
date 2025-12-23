import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  getUserAddresses, 
  saveAddress, 
  createOrder, 
  updateOrderStatus,
  loadRazorpayScript, 
  initializeRazorpayPayment 
} from '../services/api';
import Navbar from '../components/navbar.jsx';
import './checkout.css';

// ⚠️ REPLACE WITH YOUR RAZORPAY KEY
const RAZORPAY_KEY_ID = 'rzp_test_YOUR_KEY_HERE';

function CheckoutPage({ cartItems, onCartClick, cartCount, clearCart }) {
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  
  const [step, setStep] = useState(1);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [paymentProcessing, setPaymentProcessing] = useState(false);
  
  const [addressForm, setAddressForm] = useState({
    fullName: '',
    phone: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    pincode: '',
    isDefault: false
  });

  const indianStates = [
    'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
    'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
    'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
    'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
    'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
    'Delhi', 'Jammu and Kashmir', 'Ladakh'
  ];

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shipping = subtotal >= 2000 ? 0 : 99;
  const total = subtotal + shipping;

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate('/auth', { state: { from: '/checkout' } });
    }
  }, [authLoading, isAuthenticated, navigate]);

  useEffect(() => {
    if (cartItems.length === 0 && !authLoading) {
      navigate('/products');
    }
  }, [cartItems, navigate, authLoading]);

  useEffect(() => {
    if (user) {
      loadAddresses();
    }
  }, [user]);

  const loadAddresses = async () => {
    try {
      setLoading(true);
      const userAddresses = await getUserAddresses(user.uid);
      setAddresses(userAddresses);
      const defaultAddr = userAddresses.find(a => a.isDefault);
      if (defaultAddr) {
        setSelectedAddress(defaultAddr);
      } else if (userAddresses.length > 0) {
        setSelectedAddress(userAddresses[0]);
      }
    } catch (error) {
      console.error('Error loading addresses:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddressFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setAddressForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const validateAddressForm = () => {
    if (!addressForm.fullName.trim()) return 'Please enter full name';
    if (!addressForm.phone.trim() || !/^\d{10}$/.test(addressForm.phone)) return 'Please enter valid 10-digit phone number';
    if (!addressForm.addressLine1.trim()) return 'Please enter address';
    if (!addressForm.city.trim()) return 'Please enter city';
    if (!addressForm.state) return 'Please select state';
    if (!addressForm.pincode.trim() || !/^\d{6}$/.test(addressForm.pincode)) return 'Please enter valid 6-digit pincode';
    return null;
  };

  const handleSaveAddress = async (e) => {
    e.preventDefault();
    const validationError = validateAddressForm();
    if (validationError) {
      setError(validationError);
      return;
    }
    
    try {
      setLoading(true);
      setError('');
      await saveAddress(user.uid, addressForm);
      await loadAddresses();
      setShowAddressForm(false);
      setAddressForm({
        fullName: '',
        phone: '',
        addressLine1: '',
        addressLine2: '',
        city: '',
        state: '',
        pincode: '',
        isDefault: false
      });
    } catch (error) {
      setError('Failed to save address. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleProceedToPayment = () => {
    if (!selectedAddress) {
      setError('Please select a delivery address');
      return;
    }
    setError('');
    setStep(2);
  };

  const handlePayment = async () => {
    if (!selectedAddress) {
      setError('Please select a delivery address');
      return;
    }

    setPaymentProcessing(true);
    setError('');

    try {
      const loaded = await loadRazorpayScript();
      if (!loaded) {
        throw new Error('Failed to load payment gateway');
      }

      const orderData = {
        userId: user.uid,
        userEmail: user.email,
        userName: user.displayName || user.email,
        items: cartItems.map(item => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          imageUrl: item.imageUrl
        })),
        address: selectedAddress,
        subtotal,
        shipping,
        total,
        status: 'pending'
      };

      const orderId = await createOrder(orderData);

      const paymentOptions = {
        key: RAZORPAY_KEY_ID,
        amount: total * 100,
        currency: 'INR',
        name: 'LuxeLED',
        description: `Order #${orderId.slice(-8).toUpperCase()}`,
        order_id: '',
        prefill: {
          name: selectedAddress.fullName,
          email: user.email,
          contact: selectedAddress.phone
        },
        theme: {
          color: '#D4AF37'
        },
        notes: {
          orderId: orderId
        }
      };

      const paymentResponse = await initializeRazorpayPayment(paymentOptions);

      await updateOrderStatus(orderId, 'paid', {
        paymentId: paymentResponse.razorpay_payment_id,
        orderId: paymentResponse.razorpay_order_id || '',
        signature: paymentResponse.razorpay_signature || ''
      });

      clearCart();
      navigate('/orders', { state: { success: true } });

    } catch (error) {
      console.error('Payment error:', error);
      if (error.message === 'Payment cancelled by user') {
        setError('Payment was cancelled. Please try again.');
      } else {
        setError('Payment failed. Please try again.');
      }
    } finally {
      setPaymentProcessing(false);
    }
  };

  if (authLoading) {
    return (
      <div className="checkout-page">
        <Navbar onCartClick={onCartClick} cartCount={cartCount} />
        <div className="checkout-loading">
          <div className="loading-spinner"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      <Navbar onCartClick={onCartClick} cartCount={cartCount} />
      
      <div className="checkout-container">
        <div className="checkout-header">
          <Link to="/products" className="back-link">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M12 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Continue Shopping
          </Link>
          <h1>Checkout</h1>
        </div>

        <div className="checkout-steps">
          <div className={`step ${step >= 1 ? 'active' : ''}`}>
            <span className="step-number">1</span>
            <span className="step-label">Address</span>
          </div>
          <div className="step-line"></div>
          <div className={`step ${step >= 2 ? 'active' : ''}`}>
            <span className="step-number">2</span>
            <span className="step-label">Payment</span>
          </div>
        </div>

        {error && (
          <div className="checkout-error">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"/>
              <line x1="12" y1="8" x2="12" y2="12"/>
              <line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
            {error}
          </div>
        )}

        <div className="checkout-content">
          <div className="checkout-main">
            {step === 1 && (
              <div className="address-section">
                <h2>Select Delivery Address</h2>
                
                {loading ? (
                  <div className="loading-container">
                    <div className="loading-spinner"></div>
                  </div>
                ) : (
                  <>
                    {addresses.length > 0 && (
                      <div className="address-list">
                        {addresses.map(address => (
                          <div 
                            key={address.id} 
                            className={`address-card ${selectedAddress?.id === address.id ? 'selected' : ''}`}
                            onClick={() => setSelectedAddress(address)}
                          >
                            <div className="address-radio">
                              <input 
                                type="radio" 
                                name="address" 
                                checked={selectedAddress?.id === address.id}
                                onChange={() => setSelectedAddress(address)}
                              />
                            </div>
                            <div className="address-details">
                              <div className="address-name">
                                {address.fullName}
                                {address.isDefault && <span className="default-badge">Default</span>}
                              </div>
                              <p>{address.addressLine1}</p>
                              {address.addressLine2 && <p>{address.addressLine2}</p>}
                              <p>{address.city}, {address.state} - {address.pincode}</p>
                              <p className="address-phone">Phone: {address.phone}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    <button 
                      className="add-address-btn"
                      onClick={() => setShowAddressForm(!showAddressForm)}
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <line x1="12" y1="5" x2="12" y2="19"/>
                        <line x1="5" y1="12" x2="19" y2="12"/>
                      </svg>
                      Add New Address
                    </button>

                    {showAddressForm && (
                      <form className="address-form" onSubmit={handleSaveAddress}>
                        <div className="form-row">
                          <div className="form-group">
                            <label>Full Name *</label>
                            <input
                              type="text"
                              name="fullName"
                              value={addressForm.fullName}
                              onChange={handleAddressFormChange}
                              placeholder="Enter full name"
                              required
                            />
                          </div>
                          <div className="form-group">
                            <label>Phone Number *</label>
                            <input
                              type="tel"
                              name="phone"
                              value={addressForm.phone}
                              onChange={handleAddressFormChange}
                              placeholder="10-digit mobile number"
                              pattern="[0-9]{10}"
                              required
                            />
                          </div>
                        </div>

                        <div className="form-group">
                          <label>Address Line 1 *</label>
                          <input
                            type="text"
                            name="addressLine1"
                            value={addressForm.addressLine1}
                            onChange={handleAddressFormChange}
                            placeholder="House/Flat No., Building, Street"
                            required
                          />
                        </div>

                        <div className="form-group">
                          <label>Address Line 2</label>
                          <input
                            type="text"
                            name="addressLine2"
                            value={addressForm.addressLine2}
                            onChange={handleAddressFormChange}
                            placeholder="Landmark, Area (Optional)"
                          />
                        </div>

                        <div className="form-row">
                          <div className="form-group">
                            <label>City *</label>
                            <input
                              type="text"
                              name="city"
                              value={addressForm.city}
                              onChange={handleAddressFormChange}
                              placeholder="Enter city"
                              required
                            />
                          </div>
                          <div className="form-group">
                            <label>State *</label>
                            <select
                              name="state"
                              value={addressForm.state}
                              onChange={handleAddressFormChange}
                              required
                            >
                              <option value="">Select State</option>
                              {indianStates.map(state => (
                                <option key={state} value={state}>{state}</option>
                              ))}
                            </select>
                          </div>
                          <div className="form-group">
                            <label>Pincode *</label>
                            <input
                              type="text"
                              name="pincode"
                              value={addressForm.pincode}
                              onChange={handleAddressFormChange}
                              placeholder="6-digit pincode"
                              pattern="[0-9]{6}"
                              required
                            />
                          </div>
                        </div>

                        <div className="form-group checkbox-group">
                          <label className="checkbox-label">
                            <input
                              type="checkbox"
                              name="isDefault"
                              checked={addressForm.isDefault}
                              onChange={handleAddressFormChange}
                            />
                            <span>Set as default address</span>
                          </label>
                        </div>

                        <div className="form-actions">
                          <button type="button" className="cancel-btn" onClick={() => setShowAddressForm(false)}>
                            Cancel
                          </button>
                          <button type="submit" className="save-btn" disabled={loading}>
                            {loading ? 'Saving...' : 'Save Address'}
                          </button>
                        </div>
                      </form>
                    )}

                    <button 
                      className="proceed-btn"
                      onClick={handleProceedToPayment}
                      disabled={!selectedAddress}
                    >
                      Proceed to Payment
                    </button>
                  </>
                )}
              </div>
            )}

            {step === 2 && (
              <div className="payment-section">
                <h2>Payment</h2>
                
                <div className="selected-address-summary">
                  <div className="summary-header">
                    <h3>Delivering to:</h3>
                    <button className="change-btn" onClick={() => setStep(1)}>Change</button>
                  </div>
                  <div className="address-summary">
                    <strong>{selectedAddress.fullName}</strong>
                    <p>{selectedAddress.addressLine1}</p>
                    {selectedAddress.addressLine2 && <p>{selectedAddress.addressLine2}</p>}
                    <p>{selectedAddress.city}, {selectedAddress.state} - {selectedAddress.pincode}</p>
                    <p>Phone: {selectedAddress.phone}</p>
                  </div>
                </div>

                <div className="payment-method">
                  <h3>Payment Method</h3>
                  <div className="payment-option selected">
                    <div className="payment-radio">
                      <input type="radio" checked readOnly />
                    </div>
                    <div className="payment-details">
                      <img src="https://razorpay.com/assets/razorpay-glyph.svg" alt="Razorpay" className="razorpay-logo" />
                      <div>
                        <strong>Pay with Razorpay</strong>
                        <p>Cards, UPI, Net Banking, Wallets</p>
                      </div>
                    </div>
                  </div>
                </div>

                <button 
                  className="pay-btn"
                  onClick={handlePayment}
                  disabled={paymentProcessing}
                >
                  {paymentProcessing ? (
                    <>
                      <span className="loading-spinner-small"></span>
                      Processing...
                    </>
                  ) : (
                    <>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/>
                        <line x1="1" y1="10" x2="23" y2="10"/>
                      </svg>
                      Pay Rs.{total.toLocaleString()}
                    </>
                  )}
                </button>

                <div className="payment-trust">
                  <div className="trust-item">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                    </svg>
                    <span>Secure Payment</span>
                  </div>
                  <div className="trust-item">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                      <polyline points="22 4 12 14.01 9 11.01"/>
                    </svg>
                    <span>Safe & Secure</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="checkout-sidebar">
            <div className="order-summary">
              <h3>Order Summary</h3>
              
              <div className="summary-items">
                {cartItems.map(item => (
                  <div key={item.id} className="summary-item">
                    <img src={item.imageUrl || 'https://via.placeholder.com/60'} alt={item.name} />
                    <div className="item-info">
                      <span className="item-name">{item.name}</span>
                      <span className="item-qty">Qty: {item.quantity}</span>
                    </div>
                    <span className="item-price">Rs.{(item.price * item.quantity).toLocaleString()}</span>
                  </div>
                ))}
              </div>

              <div className="summary-totals">
                <div className="summary-row">
                  <span>Subtotal</span>
                  <span>Rs.{subtotal.toLocaleString()}</span>
                </div>
                <div className="summary-row">
                  <span>Shipping</span>
                  <span className={shipping === 0 ? 'free' : ''}>
                    {shipping === 0 ? 'FREE' : `Rs.${shipping}`}
                  </span>
                </div>
                {subtotal < 2000 && (
                  <p className="free-shipping-note">
                    Add Rs.{(2000 - subtotal).toLocaleString()} more for FREE shipping!
                  </p>
                )}
                <div className="summary-row total">
                  <span>Total</span>
                  <span>Rs.{total.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CheckoutPage;
