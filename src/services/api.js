// Firebase configuration and API functions
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, addDoc, updateDoc, deleteDoc, doc, query, where, orderBy } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { 
  getAuth, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signInWithPopup, 
  GoogleAuthProvider, 
  signOut, 
  onAuthStateChanged,
  updateProfile 
} from 'firebase/auth';

// Firebase configuration
var firebaseConfig = {
  apiKey: "AIzaSyAoRjQqAP-3QO9rjoQK7SSZ788lyMmhXmU",
  authDomain: "eb-tracker-42881.firebaseapp.com",
  projectId: "eb-tracker-42881",
  storageBucket: "eb-tracker-42881.firebasestorage.app",
  messagingSenderId: "922340749018",
  appId: "1:922340749018:web:68296d8775a79e71b2bfe3"
};

// Initialize Firebase
var app = initializeApp(firebaseConfig);
var db = getFirestore(app);
var storage = getStorage(app);
var auth = getAuth(app);
var googleProvider = new GoogleAuthProvider();

// Collection references
var productsCollection = collection(db, 'led-products');
var ordersCollection = collection(db, 'led-orders');
var addressesCollection = collection(db, 'led-addresses');
var eventsCollection = collection(db, 'led-events');

// ==================== PRODUCT FUNCTIONS ====================

export var getProducts = async function() {
  try {
    var snapshot = await getDocs(productsCollection);
    return snapshot.docs.map(function(doc) {
      return {
        id: doc.id,
        ...doc.data()
      };
    });
  } catch (error) {
    console.error('Error getting products:', error);
    throw error;
  }
};

export var addProduct = async function(productData) {
  try {
    var docRef = await addDoc(productsCollection, {
      ...productData,
      createdAt: new Date().toISOString()
    });
    return docRef.id;
  } catch (error) {
    console.error('Error adding product:', error);
    throw error;
  }
};

export var updateProduct = async function(productId, productData) {
  try {
    var productRef = doc(db, 'led-products', productId);
    await updateDoc(productRef, {
      ...productData,
      updatedAt: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error updating product:', error);
    throw error;
  }
};

export var deleteProduct = async function(productId) {
  try {
    var productRef = doc(db, 'led-products', productId);
    await deleteDoc(productRef);
  } catch (error) {
    console.error('Error deleting product:', error);
    throw error;
  }
};

export var uploadImage = async function(file) {
  try {
    var timestamp = Date.now();
    var fileName = timestamp + '_' + file.name;
    var storageRef = ref(storage, 'product-images/' + fileName);
    
    await uploadBytes(storageRef, file);
    var downloadURL = await getDownloadURL(storageRef);
    
    return downloadURL;
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
};

// ==================== AUTHENTICATION FUNCTIONS ====================

export var registerWithEmail = async function(email, password, displayName) {
  try {
    var userCredential = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(userCredential.user, { displayName: displayName });
    return userCredential.user;
  } catch (error) {
    console.error('Error registering:', error);
    throw error;
  }
};

export var loginWithEmail = async function(email, password) {
  try {
    var userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    console.error('Error logging in:', error);
    throw error;
  }
};

export var loginWithGoogle = async function() {
  try {
    var result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (error) {
    console.error('Error with Google login:', error);
    throw error;
  }
};

export var logout = async function() {
  try {
    await signOut(auth);
  } catch (error) {
    console.error('Error logging out:', error);
    throw error;
  }
};

export var getCurrentUser = function() {
  return auth.currentUser;
};

export var onAuthChange = function(callback) {
  return onAuthStateChanged(auth, callback);
};

// ==================== ORDER FUNCTIONS ====================

export var createOrder = async function(orderData) {
  try {
    var docRef = await addDoc(ordersCollection, {
      ...orderData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
    return docRef.id;
  } catch (error) {
    console.error('Error creating order:', error);
    throw error;
  }
};

// Get all orders for admin panel
export var getOrders = async function() {
  try {
    var snapshot = await getDocs(ordersCollection);
    return snapshot.docs.map(function(docSnap) {
      var data = docSnap.data();
      return {
        id: docSnap.id,
        customerName: data.customerName || data.userName || data.name || 'N/A',
        email: data.email || data.userEmail || 'N/A',
        phone: data.phone || data.mobile || 'N/A',
        address: data.address || data.shippingAddress || 'N/A',
        items: data.items || data.cartItems || [],
        totalAmount: data.totalAmount || data.total || 0,
        paymentStatus: data.paymentStatus || data.paymentDetails?.status || 'pending',
        paymentId: data.paymentId || data.paymentDetails?.paymentId || data.razorpayPaymentId || null,
        paymentMethod: data.paymentMethod || 'Razorpay',
        transactionId: data.transactionId || data.paymentDetails?.orderId || data.razorpayOrderId || null,
        status: data.status || 'pending',
        createdAt: data.createdAt,
        updatedAt: data.updatedAt
      };
    });
  } catch (error) {
    console.error('Error getting orders:', error);
    throw error;
  }
};

// Update order status (for admin)
export var updateOrderStatus = async function(orderId, status, paymentDetails) {
  try {
    var orderRef = doc(db, 'led-orders', orderId);
    var updateData = {
      status: status,
      updatedAt: new Date().toISOString()
    };
    if (paymentDetails) {
      updateData.paymentDetails = paymentDetails;
      updateData.paymentStatus = paymentDetails.status || 'pending';
    }
    await updateDoc(orderRef, updateData);
  } catch (error) {
    console.error('Error updating order:', error);
    throw error;
  }
};

// Update just the order status (simpler version for admin dropdown)
export var updateOrderStatusOnly = async function(orderId, newStatus) {
  try {
    var orderRef = doc(db, 'led-orders', orderId);
    await updateDoc(orderRef, {
      status: newStatus,
      updatedAt: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error updating order status:', error);
    throw error;
  }
};

export var getUserOrders = async function(userId) {
  try {
    var q = query(ordersCollection, where('userId', '==', userId), orderBy('createdAt', 'desc'));
    var snapshot = await getDocs(q);
    return snapshot.docs.map(function(doc) {
      return {
        id: doc.id,
        ...doc.data()
      };
    });
  } catch (error) {
    console.error('Error getting orders:', error);
    throw error;
  }
};

// ==================== ADDRESS FUNCTIONS ====================

export var saveAddress = async function(userId, addressData) {
  try {
    var docRef = await addDoc(addressesCollection, {
      userId: userId,
      ...addressData,
      createdAt: new Date().toISOString()
    });
    return docRef.id;
  } catch (error) {
    console.error('Error saving address:', error);
    throw error;
  }
};

export var getUserAddresses = async function(userId) {
  try {
    var q = query(addressesCollection, where('userId', '==', userId));
    var snapshot = await getDocs(q);
    return snapshot.docs.map(function(doc) {
      return {
        id: doc.id,
        ...doc.data()
      };
    });
  } catch (error) {
    console.error('Error getting addresses:', error);
    throw error;
  }
};

export var deleteAddress = async function(addressId) {
  try {
    var addressRef = doc(db, 'led-addresses', addressId);
    await deleteDoc(addressRef);
  } catch (error) {
    console.error('Error deleting address:', error);
    throw error;
  }
};

// ==================== EVENTS FUNCTIONS ====================

export var getEvents = async function() {
  try {
    var q = query(eventsCollection, orderBy('createdAt', 'desc'));
    var snapshot = await getDocs(q);
    return snapshot.docs.map(function(doc) {
      return {
        id: doc.id,
        ...doc.data()
      };
    });
  } catch (error) {
    console.error('Error getting events:', error);
    throw error;
  }
};

export var getActiveEvents = async function() {
  try {
    var snapshot = await getDocs(eventsCollection);
    var today = new Date().toISOString().split('T')[0];
    var events = snapshot.docs.map(function(doc) {
      return {
        id: doc.id,
        ...doc.data()
      };
    });
    // Filter active events (endDate >= today or no endDate)
    return events.filter(function(event) {
      if (!event.isActive) return false;
      if (!event.endDate) return true;
      return event.endDate >= today;
    }).sort(function(a, b) {
      return new Date(b.createdAt) - new Date(a.createdAt);
    });
  } catch (error) {
    console.error('Error getting active events:', error);
    throw error;
  }
};

export var addEvent = async function(eventData) {
  try {
    var docRef = await addDoc(eventsCollection, {
      ...eventData,
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
    return docRef.id;
  } catch (error) {
    console.error('Error adding event:', error);
    throw error;
  }
};

export var updateEvent = async function(eventId, eventData) {
  try {
    var eventRef = doc(db, 'led-events', eventId);
    await updateDoc(eventRef, {
      ...eventData,
      updatedAt: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error updating event:', error);
    throw error;
  }
};

export var deleteEvent = async function(eventId) {
  try {
    var eventRef = doc(db, 'led-events', eventId);
    await deleteDoc(eventRef);
  } catch (error) {
    console.error('Error deleting event:', error);
    throw error;
  }
};

export var uploadEventImage = async function(file) {
  try {
    var timestamp = Date.now();
    var fileName = 'event_' + timestamp + '_' + file.name;
    var storageRef = ref(storage, 'event-images/' + fileName);
    
    await uploadBytes(storageRef, file);
    var downloadURL = await getDownloadURL(storageRef);
    
    return downloadURL;
  } catch (error) {
    console.error('Error uploading event image:', error);
    throw error;
  }
};

// ==================== RAZORPAY FUNCTIONS ====================

export var loadRazorpayScript = function() {
  return new Promise(function(resolve) {
    if (document.getElementById('razorpay-script')) {
      resolve(true);
      return;
    }
    var script = document.createElement('script');
    script.id = 'razorpay-script';
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = function() { resolve(true); };
    script.onerror = function() { resolve(false); };
    document.body.appendChild(script);
  });
};

export var initializeRazorpayPayment = function(options) {
  return new Promise(function(resolve, reject) {
    var rzp = new window.Razorpay({
      ...options,
      handler: function(response) {
        resolve(response);
      },
      modal: {
        ondismiss: function() {
          reject(new Error('Payment cancelled by user'));
        }
      }
    });
    rzp.on('payment.failed', function(response) {
      reject(response.error);
    });
    rzp.open();
  });
};
