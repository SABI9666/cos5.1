import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';

// Firebase configuration - Replace with your actual Firebase config
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

// Collection reference
const productsCollection = collection(db, 'led-products');

/**
 * Get all products from Firestore
 */
export const getProducts = async () => {
  try {
    const snapshot = await getDocs(productsCollection);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error getting products:', error);
    throw error;
  }
};

/**
 * Add a new product to Firestore
 */
export const addProduct = async (productData) => {
  try {
    const docRef = await addDoc(productsCollection, {
      ...productData,
      createdAt: new Date().toISOString()
    });
    return docRef.id;
  } catch (error) {
    console.error('Error adding product:', error);
    throw error;
  }
};

/**
 * Update an existing product
 */
export const updateProduct = async (productId, productData) => {
  try {
    const productRef = doc(db, 'led-products', productId);
    await updateDoc(productRef, {
      ...productData,
      updatedAt: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error updating product:', error);
    throw error;
  }
};

/**
 * Delete a product
 */
export const deleteProduct = async (productId) => {
  try {
    const productRef = doc(db, 'led-products', productId);
    await deleteDoc(productRef);
  } catch (error) {
    console.error('Error deleting product:', error);
    throw error;
  }
};

/**
 * Upload image to Firebase Storage
 */
export const uploadImage = async (file) => {
  try {
    const timestamp = Date.now();
    const fileName = `${timestamp}_${file.name}`;
    const storageRef = ref(storage, `product-images/${fileName}`);
    
    await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(storageRef);
    
    return downloadURL;
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
};

/**
 * Alternative: Use a local mock API for development
 * Comment out Firebase functions and use these instead
 */

// Mock data store
let mockProducts = [
  {
    id: '1',
    name: 'RGB LED Strip Light 5M',
    description: 'Flexible RGB LED strip with remote control, 16 million colors, and music sync mode. Perfect for home decoration.',
    price: 1299,
    category: 'strip',
    quantity: 50,
    imageUrl: 'https://images.unsplash.com/photo-1600375739037-ae4f0b32e340?w=800',
    badge: 'Best Seller'
  },
  {
    id: '2',
    name: 'Smart WiFi LED Bulb',
    description: 'Voice-controlled smart bulb compatible with Alexa and Google Home. Adjustable brightness and color temperature.',
    price: 599,
    category: 'bulbs',
    quantity: 100,
    imageUrl: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=800',
    badge: 'New'
  },
  {
    id: '3',
    name: 'LED Panel Light 600x600',
    description: 'Energy-efficient ceiling panel light with uniform illumination. Ideal for offices and commercial spaces.',
    price: 2499,
    category: 'panels',
    quantity: 30,
    imageUrl: 'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=800',
    badge: ''
  },
  {
    id: '4',
    name: 'Outdoor LED Floodlight',
    description: 'Waterproof IP65 floodlight with wide beam angle. Perfect for outdoor security and landscape lighting.',
    price: 1899,
    category: 'outdoor',
    quantity: 25,
    imageUrl: 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=800',
    badge: 'Sale -20%'
  }
];

// Mock API functions (for development without Firebase)
/*
export const getProducts = async () => {
  return new Promise((resolve) => {
    setTimeout(() => resolve([...mockProducts]), 500);
  });
};

export const addProduct = async (productData) => {
  return new Promise((resolve) => {
    const newProduct = {
      id: Date.now().toString(),
      ...productData
    };
    mockProducts.push(newProduct);
    setTimeout(() => resolve(newProduct.id), 500);
  });
};

export const updateProduct = async (productId, productData) => {
  return new Promise((resolve) => {
    const index = mockProducts.findIndex(p => p.id === productId);
    if (index !== -1) {
      mockProducts[index] = { ...mockProducts[index], ...productData };
    }
    setTimeout(() => resolve(), 500);
  });
};

export const deleteProduct = async (productId) => {
  return new Promise((resolve) => {
    mockProducts = mockProducts.filter(p => p.id !== productId);
    setTimeout(() => resolve(), 500);
  });
};

export const uploadImage = async (file) => {
  return new Promise((resolve) => {
    // In a real app, this would upload to a server
    // For now, return a placeholder or use FileReader to create a data URL
    const reader = new FileReader();
    reader.onloadend = () => {
      setTimeout(() => resolve(reader.result), 500);
    };
    reader.readAsDataURL(file);
  });
};
