import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getProducts, addProduct, updateProduct, deleteProduct, getOrders, updateOrderStatusOnly, getCategories, updateCategory, uploadImage, uploadCategoryImage, getSocialSettings, saveSocialSettings } from '../services/api';
import './adminpanel.css';

// SVG Icons
var ShieldIcon = function() {
  return (
    <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
      <path d="M9 12l2 2 4-4"/>
    </svg>
  );
};

var UserIcon = function() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
      <circle cx="12" cy="7" r="4"/>
    </svg>
  );
};

var LockIcon = function() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
      <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
    </svg>
  );
};

var EyeIcon = function() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
      <circle cx="12" cy="12" r="3"/>
    </svg>
  );
};

var EyeOffIcon = function() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
      <line x1="1" y1="1" x2="23" y2="23"/>
    </svg>
  );
};

var AlertIcon = function() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/>
      <line x1="12" y1="8" x2="12" y2="12"/>
      <line x1="12" y1="16" x2="12.01" y2="16"/>
    </svg>
  );
};

var ArrowRightIcon = function() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="5" y1="12" x2="19" y2="12"/>
      <polyline points="12 5 19 12 12 19"/>
    </svg>
  );
};

var PackageIcon = function() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16.5 9.4l-9-5.19M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
      <polyline points="3.27 6.96 12 12.01 20.73 6.96"/>
      <line x1="12" y1="22.08" x2="12" y2="12"/>
    </svg>
  );
};

var UsersIcon = function() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
      <circle cx="9" cy="7" r="4"/>
      <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
      <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
    </svg>
  );
};

var ShoppingBagIcon = function() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
      <line x1="3" y1="6" x2="21" y2="6"/>
      <path d="M16 10a4 4 0 0 1-8 0"/>
    </svg>
  );
};

var CalendarIcon = function() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
      <line x1="16" y1="2" x2="16" y2="6"/>
      <line x1="8" y1="2" x2="8" y2="6"/>
      <line x1="3" y1="10" x2="21" y2="10"/>
    </svg>
  );
};

var RefreshIcon = function() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="23 4 23 10 17 10"/>
      <polyline points="1 20 1 14 7 14"/>
      <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/>
    </svg>
  );
};

var ExternalLinkIcon = function() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
      <polyline points="15 3 21 3 21 9"/>
      <line x1="10" y1="14" x2="21" y2="3"/>
    </svg>
  );
};

var LogOutIcon = function() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
      <polyline points="16 17 21 12 16 7"/>
      <line x1="21" y1="12" x2="9" y2="12"/>
    </svg>
  );
};

var PlusIcon = function() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="5" x2="12" y2="19"/>
      <line x1="5" y1="12" x2="19" y2="12"/>
    </svg>
  );
};

var EditIcon = function() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
    </svg>
  );
};

var TrashIcon = function() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="3 6 5 6 21 6"/>
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
    </svg>
  );
};

var XIcon = function() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18"/>
      <line x1="6" y1="6" x2="18" y2="18"/>
    </svg>
  );
};

var ImageIcon = function() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
      <circle cx="8.5" cy="8.5" r="1.5"/>
      <polyline points="21 15 16 10 5 21"/>
    </svg>
  );
};

var CheckIcon = function() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12"/>
    </svg>
  );
};

var ClockIcon = function() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/>
      <polyline points="12 6 12 12 16 14"/>
    </svg>
  );
};

var TruckIcon = function() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="1" y="3" width="15" height="13"/>
      <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/>
      <circle cx="5.5" cy="18.5" r="2.5"/>
      <circle cx="18.5" cy="18.5" r="2.5"/>
    </svg>
  );
};

var SpinnerIcon = function() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="spin-icon">
      <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
    </svg>
  );
};

var FilterIcon = function() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/>
    </svg>
  );
};

var CreditCardIcon = function() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/>
      <line x1="1" y1="10" x2="23" y2="10"/>
    </svg>
  );
};

var WalletIcon = function() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4"/>
      <path d="M3 5v14a2 2 0 0 0 2 2h16v-5"/>
      <path d="M18 12a2 2 0 0 0 0 4h4v-4h-4z"/>
    </svg>
  );
};

var UploadIcon = function() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
      <polyline points="17 8 12 3 7 8"/>
      <line x1="12" y1="3" x2="12" y2="15"/>
    </svg>
  );
};

var BoxIcon = function() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/>
      <path d="m3.3 7 8.7 5 8.7-5"/>
      <path d="M12 22V12"/>
    </svg>
  );
};

var ReceiptIcon = function() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1-2-1Z"/>
      <path d="M14 8H8"/>
      <path d="M16 12H8"/>
      <path d="M13 16H8"/>
    </svg>
  );
};

var SettingsIcon = function() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3"/>
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
    </svg>
  );
};

var WhatsAppIcon = function() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
    </svg>
  );
};

var InstagramIcon = function() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
    </svg>
  );
};

var LightBulbIcon = function() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 18h6"/>
      <path d="M10 22h4"/>
      <path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0 0 18 8 6 6 0 0 0 6 8c0 1 .23 2.23 1.5 3.5A4.61 4.61 0 0 1 8.91 14"/>
    </svg>
  );
};

var ShirtIcon = function() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.38 3.46 16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.47a1 1 0 0 0 .99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.47a2 2 0 0 0-1.34-2.23z"/>
    </svg>
  );
};

var BabyIcon = function() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 12h.01"/>
      <path d="M15 12h.01"/>
      <path d="M10 16c.5.3 1.2.5 2 .5s1.5-.2 2-.5"/>
      <path d="M19 6.3a9 9 0 0 1 1.8 3.9 2 2 0 0 1 0 3.6 9 9 0 0 1-17.6 0 2 2 0 0 1 0-3.6A9 9 0 0 1 12 3c2 0 3.5 1.1 3.5 2.5s-.9 2.5-2 2.5c-.8 0-1.5-.4-1.5-1"/>
    </svg>
  );
};

var GridIcon = function() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7"/>
      <rect x="14" y="3" width="7" height="7"/>
      <rect x="14" y="14" width="7" height="7"/>
      <rect x="3" y="14" width="7" height="7"/>
    </svg>
  );
};

var ChevronDownIcon = function() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="6 9 12 15 18 9"/>
    </svg>
  );
};

var ChevronRightIcon = function() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="9 18 15 12 9 6"/>
    </svg>
  );
};

// Main Category Data Structure
var MAIN_CATEGORIES = {
  'led-lights': {
    id: 'led-lights',
    name: 'LED Lights',
    icon: 'bulb',
    color: '#f59e0b',
    subcategories: [
      { id: 'wall-light', name: 'Wall Light' },
      { id: 'fan', name: 'Fan' },
      { id: 'hanging', name: 'Hanging' },
      { id: 'gate-light', name: 'Gate Light' },
      { id: 'bldc-fan', name: 'BLDC Fan' },
      { id: 'wall-fan', name: 'Wall Fan' },
      { id: 'wall-washer', name: 'Wall Washer' },
      { id: 'bulb', name: 'Bulb' },
      { id: 'surface-lights', name: 'Surface Lights' },
      { id: 'street-light', name: 'Street Light' },
      { id: 'spot-light', name: 'Spot Light' },
      { id: 'cylinder-light', name: 'Cylinder Light' },
      { id: 'smps', name: 'SMPS' }
    ]
  },
  'dress': {
    id: 'dress',
    name: 'Dress',
    icon: 'shirt',
    color: '#ec4899',
    subcategories: [
      { id: 'gents-dress', name: 'Gents Dress' },
      { id: 'ladies-dress', name: 'Ladies Dress' }
    ]
  },
  'kids-items': {
    id: 'kids-items',
    name: 'Kids Items',
    icon: 'baby',
    color: '#8b5cf6',
    subcategories: [
      { id: 'kids-clothing', name: 'Kids Clothing' },
      { id: 'kids-toys', name: 'Kids Toys' },
      { id: 'kids-accessories', name: 'Kids Accessories' }
    ]
  }
};

function AdminPanel() {
  var authState = useState(false);
  var isLoggedIn = authState[0];
  var setIsLoggedIn = authState[1];

  var usernameState = useState('');
  var username = usernameState[0];
  var setUsername = usernameState[1];

  var passwordState = useState('');
  var password = passwordState[0];
  var setPassword = passwordState[1];

  var showPasswordState = useState(false);
  var showPassword = showPasswordState[0];
  var setShowPassword = showPasswordState[1];

  var loginErrorState = useState('');
  var loginError = loginErrorState[0];
  var setLoginError = loginErrorState[1];

  var tabState = useState('orders');
  var activeTab = tabState[0];
  var setActiveTab = tabState[1];

  var ordersState = useState([]);
  var orders = ordersState[0];
  var setOrders = ordersState[1];

  var productsState = useState([]);
  var products = productsState[0];
  var setProducts = productsState[1];

  var customersState = useState([]);
  var customers = customersState[0];
  var setCustomers = customersState[1];

  var categoriesState = useState({});
  var categories = categoriesState[0];
  var setCategories = categoriesState[1];

  // Main categories state for dynamic management
  var mainCategoriesState = useState(MAIN_CATEGORIES);
  var mainCategories = mainCategoriesState[0];
  var setMainCategories = mainCategoriesState[1];

  // Category management states
  var expandedCategoriesState = useState({ 'led-lights': true, 'dress': true, 'kids-items': true });
  var expandedCategories = expandedCategoriesState[0];
  var setExpandedCategories = expandedCategoriesState[1];

  var newSubcategoryState = useState({});
  var newSubcategory = newSubcategoryState[0];
  var setNewSubcategory = newSubcategoryState[1];

  // Quick Add Subcategory states
  var quickAddMainCatState = useState('');
  var quickAddMainCat = quickAddMainCatState[0];
  var setQuickAddMainCat = quickAddMainCatState[1];

  var quickAddSubcatNameState = useState('');
  var quickAddSubcatName = quickAddSubcatNameState[0];
  var setQuickAddSubcatName = quickAddSubcatNameState[1];

  // Main Category Modal states
  var showMainCategoryModalState = useState(false);
  var showMainCategoryModal = showMainCategoryModalState[0];
  var setShowMainCategoryModal = showMainCategoryModalState[1];

  var editingMainCategoryState = useState(null);
  var editingMainCategory = editingMainCategoryState[0];
  var setEditingMainCategory = editingMainCategoryState[1];

  var mainCatFormDataState = useState({
    name: '',
    description: '',
    icon: 'grid',
    color: '#3b82f6',
    image: ''
  });
  var mainCatFormData = mainCatFormDataState[0];
  var setMainCatFormData = mainCatFormDataState[1];

  // Subcategory Edit Modal states
  var showSubcategoryModalState = useState(false);
  var showSubcategoryModal = showSubcategoryModalState[0];
  var setShowSubcategoryModal = showSubcategoryModalState[1];

  var editSubcatMainCatState = useState('');
  var editSubcatMainCat = editSubcatMainCatState[0];
  var setEditSubcatMainCat = editSubcatMainCatState[1];

  var editSubcatIdState = useState('');
  var editSubcatId = editSubcatIdState[0];
  var setEditSubcatId = editSubcatIdState[1];

  var editSubcatNameState = useState('');
  var editSubcatName = editSubcatNameState[0];
  var setEditSubcatName = editSubcatNameState[1];

  var loadingState = useState(true);
  var loading = loadingState[0];
  var setLoading = loadingState[1];

  var orderFilterState = useState('all');
  var orderFilter = orderFilterState[0];
  var setOrderFilter = orderFilterState[1];

  var modalState = useState(false);
  var showModal = modalState[0];
  var setShowModal = modalState[1];

  var editingProductState = useState(null);
  var editingProduct = editingProductState[0];
  var setEditingProduct = editingProductState[1];

  var formDataState = useState({ name: '', price: '', description: '', mainCategory: '', category: '', stock: '', image: '' });
  var formData = formDataState[0];
  var setFormData = formDataState[1];

  var uploadingState = useState(false);
  var isUploading = uploadingState[0];
  var setIsUploading = uploadingState[1];

  var savingState = useState(false);
  var isSaving = savingState[0];
  var setIsSaving = savingState[1];

  var imageFileState = useState(null);
  var imageFile = imageFileState[0];
  var setImageFile = imageFileState[1];

  var imagePreviewState = useState('');
  var imagePreview = imagePreviewState[0];
  var setImagePreview = imagePreviewState[1];

  // Social Settings State
  var socialSettingsState = useState({ whatsapp: '', instagram: '' });
  var socialSettings = socialSettingsState[0];
  var setSocialSettings = socialSettingsState[1];

  var savingSocialState = useState(false);
  var isSavingSocial = savingSocialState[0];
  var setIsSavingSocial = savingSocialState[1];

  // Login Credentials
  var ADMIN_USERNAME = 'Laxora';
  var ADMIN_PASSWORD = 'Laxora@9666';

  useEffect(function() {
    var session = sessionStorage.getItem('laxora_admin');
    if (session === 'authenticated') { setIsLoggedIn(true); }
    
    // Load saved categories from localStorage
    var savedCategories = localStorage.getItem('laxora_main_categories');
    if (savedCategories) {
      try {
        setMainCategories(JSON.parse(savedCategories));
      } catch (e) {
        console.error('Error parsing saved categories:', e);
      }
    }
  }, []);

  useEffect(function() {
    if (isLoggedIn) { fetchAllData(); }
  }, [isLoggedIn]);

  // Save categories to localStorage whenever they change
  useEffect(function() {
    localStorage.setItem('laxora_main_categories', JSON.stringify(mainCategories));
  }, [mainCategories]);

  var handleLogin = function(e) {
    e.preventDefault();
    setLoginError('');
    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      sessionStorage.setItem('laxora_admin', 'authenticated');
      setIsLoggedIn(true);
    } else {
      setLoginError('Invalid credentials. Please try again.');
    }
  };

  var handleLogout = function() {
    sessionStorage.removeItem('laxora_admin');
    setIsLoggedIn(false);
    setUsername('');
    setPassword('');
  };

  var fetchAllData = async function() {
    setLoading(true);
    try {
      var ordersData = await getOrders();
      setOrders(ordersData);

      var productsData = await getProducts();
      setProducts(productsData);

      var categoriesData = await getCategories();
      var categoriesObj = {};
      categoriesData.forEach(function(cat) {
        categoriesObj[cat.id] = cat.image || '';
      });
      setCategories(categoriesObj);
      
      // Load social settings
      var socialData = await getSocialSettings();
      if (socialData) {
        setSocialSettings(socialData);
      }
      
      // Customers derived from orders
      var customersMap = {};
      ordersData.forEach(function(order) {
        var email = order.email || 'unknown';
        if (!customersMap[email]) {
          customersMap[email] = {
            id: email,
            name: order.customerName || 'Unknown',
            email: email,
            phone: order.phone || 'N/A',
            city: '',
            orderCount: 0,
            totalSpent: 0,
            lastPaymentStatus: order.paymentStatus
          };
        }
        customersMap[email].orderCount += 1;
        customersMap[email].totalSpent += order.totalAmount || 0;
        customersMap[email].lastPaymentStatus = order.paymentStatus;
      });
      setCustomers(Object.values(customersMap));
    } catch (error) {
      console.error('Error fetching data:', error);
    }
    setLoading(false);
  };

  // Payment Status Filters
  var getPaymentCompletedOrders = function() {
    return orders.filter(function(order) { return order.paymentStatus === 'paid' || order.paymentStatus === 'completed'; });
  };

  var getPaymentPendingOrders = function() {
    return orders.filter(function(order) { return order.paymentStatus !== 'paid' && order.paymentStatus !== 'completed'; });
  };

  // Order Lifecycle Filters
  var getNewPendingOrders = function() {
    return orders.filter(function(order) { return !order.status || order.status === 'pending' || order.status === 'new'; });
  };

  var getProcessingOrders = function() {
    return orders.filter(function(order) { return order.status === 'processing'; });
  };

  var getShippedOrders = function() {
    return orders.filter(function(order) { return order.status === 'shipped'; });
  };

  var getDeliveredOrders = function() {
    return orders.filter(function(order) { return order.status === 'delivered' || order.status === 'completed'; });
  };

  var getCancelledOrders = function() {
    return orders.filter(function(order) { return order.status === 'cancelled'; });
  };

  var getFilteredOrders = function() {
    switch (orderFilter) {
      case 'payment-completed': return getPaymentCompletedOrders();
      case 'payment-pending': return getPaymentPendingOrders();
      case 'new-pending': return getNewPendingOrders();
      case 'processing': return getProcessingOrders();
      case 'shipped': return getShippedOrders();
      case 'delivered': return getDeliveredOrders();
      case 'cancelled': return getCancelledOrders();
      default: return orders;
    }
  };

  var getOrderTotal = function(ordersList) {
    return ordersList.reduce(function(sum, order) { return sum + (order.totalAmount || order.total || order.amount || 0); }, 0);
  };

  var handleFilterClick = function(filter) {
    if (orderFilter === filter) { setOrderFilter('all'); } else { setOrderFilter(filter); }
  };

  var formatDate = function(timestamp) {
    if (!timestamp) return 'N/A';
    var date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  var formatCurrency = function(amount) {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 0 }).format(amount || 0);
  };

  var handleAddProduct = function() {
    setEditingProduct(null);
    setFormData({ name: '', price: '', description: '', mainCategory: '', category: '', stock: '', image: '' });
    setImageFile(null);
    setImagePreview('');
    setIsSaving(false);
    setShowModal(true);
  };

  var handleEditProduct = function(product) {
    setEditingProduct(product);
    
    // Determine main category from subcategory
    var foundMainCategory = '';
    Object.keys(mainCategories).forEach(function(mainCatId) {
      var mainCat = mainCategories[mainCatId];
      mainCat.subcategories.forEach(function(subcat) {
        if (subcat.id === product.category || subcat.name === product.category) {
          foundMainCategory = mainCatId;
        }
      });
    });
    
    setFormData({ 
      name: product.name || '', 
      price: product.price || '', 
      description: product.description || '', 
      mainCategory: foundMainCategory || product.mainCategory || '',
      category: product.category || '', 
      stock: product.stock || '', 
      image: product.imageUrl || product.image || '' 
    });
    setImageFile(null);
    setImagePreview(product.imageUrl || product.image || '');
    setIsSaving(false);
    setShowModal(true);
  };

  var handleImageChange = function(e) {
    var file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        alert('Image size should be less than 5MB');
        return;
      }
      setImageFile(file);
      var reader = new FileReader();
      reader.onloadend = function() {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  var handleRemoveImage = function() {
    setImageFile(null);
    setImagePreview('');
    setFormData({ ...formData, image: '' });
  };

  var handleDeleteProduct = async function(productId) {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await deleteProduct(productId);
        setProducts(products.filter(function(p) { return p.id !== productId; }));
      } catch (error) { console.error('Error deleting product:', error); }
    }
  };

  var handleFormSubmit = async function(e) {
    e.preventDefault();
    
    if (!formData.name || !formData.price || !formData.category) {
      alert('Please fill in all required fields');
      return;
    }
    
    setIsSaving(true);
    
    try {
      var imageUrl = formData.image;
      
      if (imageFile) {
        imageUrl = await uploadImage(imageFile);
      }
      
      var productData = {
        name: formData.name,
        price: parseFloat(formData.price),
        description: formData.description,
        mainCategory: formData.mainCategory,
        category: formData.category,
        stock: parseInt(formData.stock) || 0,
        quantity: parseInt(formData.stock) || 0,
        imageUrl: imageUrl
      };
      
      if (editingProduct) {
        await updateProduct(editingProduct.id, productData);
        setProducts(products.map(function(p) {
          if (p.id === editingProduct.id) {
            return { ...p, ...productData };
          }
          return p;
        }));
      } else {
        var newId = await addProduct(productData);
        setProducts([...products, { id: newId, ...productData }]);
      }
      
      setShowModal(false);
      setImageFile(null);
      setImagePreview('');
    } catch (error) {
      console.error('Error saving product:', error);
      alert('Error saving product. Please try again.');
    }
    
    setIsSaving(false);
  };

  var handleUpdateOrderStatus = async function(orderId, newStatus) {
    try {
      await updateOrderStatusOnly(orderId, newStatus);
      setOrders(orders.map(function(order) {
        if (order.id === orderId) {
          return { ...order, status: newStatus };
        }
        return order;
      }));
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };

  var handleCategoryImageSave = async function(categoryId, imageUrl) {
    try {
      await updateCategory(categoryId, { name: categoryId.split('-').map(function(w) { return w.charAt(0).toUpperCase() + w.slice(1); }).join(' '), image: imageUrl });
      setCategories({ ...categories, [categoryId]: imageUrl });
    } catch (error) {
      console.error('Error saving category image:', error);
    }
  };

  var handleCategoryFileUpload = async function(categoryId, e) {
    var file = e.target.files[0];
    if (file) {
      try {
        var imageUrl = await uploadCategoryImage(file);
        await handleCategoryImageSave(categoryId, imageUrl);
      } catch (error) {
        console.error('Error uploading category image:', error);
      }
    }
  };

  var handleCategoryImageDelete = async function(categoryId) {
    try {
      await updateCategory(categoryId, { name: categoryId.split('-').map(function(w) { return w.charAt(0).toUpperCase() + w.slice(1); }).join(' '), image: '' });
      setCategories({ ...categories, [categoryId]: '' });
    } catch (error) {
      console.error('Error deleting category image:', error);
    }
  };

  var handleSaveSocialSettings = async function() {
    setIsSavingSocial(true);
    try {
      await saveSocialSettings(socialSettings);
      alert('Social settings saved successfully!');
    } catch (error) {
      console.error('Error saving social settings:', error);
      alert('Error saving settings. Please try again.');
    }
    setIsSavingSocial(false);
  };

  // Category Management Functions
  var toggleCategoryExpand = function(categoryId) {
    setExpandedCategories({
      ...expandedCategories,
      [categoryId]: !expandedCategories[categoryId]
    });
  };

  var handleAddSubcategory = function(mainCategoryId) {
    var newSubcatName = newSubcategory[mainCategoryId];
    if (!newSubcatName || !newSubcatName.trim()) {
      alert('Please enter a subcategory name');
      return;
    }
    
    var newSubcatId = newSubcatName.toLowerCase().replace(/\s+/g, '-');
    
    var updatedCategories = { ...mainCategories };
    updatedCategories[mainCategoryId].subcategories.push({
      id: newSubcatId,
      name: newSubcatName.trim()
    });
    
    setMainCategories(updatedCategories);
    setNewSubcategory({ ...newSubcategory, [mainCategoryId]: '' });
  };

  var handleDeleteSubcategory = function(mainCategoryId, subcategoryId) {
    if (!window.confirm('Are you sure you want to delete this subcategory?')) {
      return;
    }
    
    var updatedCategories = { ...mainCategories };
    updatedCategories[mainCategoryId].subcategories = updatedCategories[mainCategoryId].subcategories.filter(function(sub) {
      return sub.id !== subcategoryId;
    });
    
    setMainCategories(updatedCategories);
  };

  // Quick Add Subcategory handler
  var handleQuickAddSubcategory = function() {
    if (!quickAddMainCat || !quickAddSubcatName.trim()) {
      alert('Please select a main category and enter subcategory name');
      return;
    }
    
    var newSubcatId = quickAddSubcatName.trim().toLowerCase().replace(/\s+/g, '-');
    
    // Check if subcategory already exists
    var exists = mainCategories[quickAddMainCat].subcategories.some(function(sub) {
      return sub.id === newSubcatId;
    });
    
    if (exists) {
      alert('A subcategory with this name already exists!');
      return;
    }
    
    var updatedCategories = { ...mainCategories };
    updatedCategories[quickAddMainCat].subcategories.push({
      id: newSubcatId,
      name: quickAddSubcatName.trim()
    });
    
    setMainCategories(updatedCategories);
    setQuickAddSubcatName('');
    alert('Subcategory added successfully!');
  };

  // Main Category handlers
  var resetMainCategoryForm = function() {
    setMainCatFormData({
      name: '',
      description: '',
      icon: 'grid',
      color: '#3b82f6',
      image: ''
    });
    setEditingMainCategory(null);
  };

  var handleEditMainCategory = function(mainCatId) {
    var cat = mainCategories[mainCatId];
    setEditingMainCategory(mainCatId);
    setMainCatFormData({
      name: cat.name,
      description: cat.description || '',
      icon: cat.icon || 'grid',
      color: cat.color || '#3b82f6',
      image: cat.image || ''
    });
    setShowMainCategoryModal(true);
  };

  var handleDeleteMainCategory = function(mainCatId) {
    var cat = mainCategories[mainCatId];
    if (!window.confirm('Are you sure you want to delete "' + cat.name + '" and all its subcategories? This action cannot be undone.')) {
      return;
    }
    
    var updatedCategories = { ...mainCategories };
    delete updatedCategories[mainCatId];
    setMainCategories(updatedCategories);
  };

  var handleMainCategorySubmit = function(e) {
    e.preventDefault();
    
    if (!mainCatFormData.name.trim()) {
      alert('Please enter a category name');
      return;
    }
    
    var catId = editingMainCategory || mainCatFormData.name.trim().toLowerCase().replace(/\s+/g, '-');
    
    // Check if new category ID already exists (only when adding)
    if (!editingMainCategory && mainCategories[catId]) {
      alert('A category with this name already exists!');
      return;
    }
    
    var updatedCategories = { ...mainCategories };
    
    if (editingMainCategory) {
      // Update existing
      updatedCategories[editingMainCategory] = {
        ...updatedCategories[editingMainCategory],
        name: mainCatFormData.name.trim(),
        description: mainCatFormData.description,
        icon: mainCatFormData.icon,
        color: mainCatFormData.color,
        gradient: 'linear-gradient(135deg, ' + mainCatFormData.color + ' 0%, ' + adjustColor(mainCatFormData.color, -20) + ' 100%)',
        image: mainCatFormData.image
      };
    } else {
      // Add new
      updatedCategories[catId] = {
        id: catId,
        name: mainCatFormData.name.trim(),
        description: mainCatFormData.description,
        icon: mainCatFormData.icon,
        color: mainCatFormData.color,
        gradient: 'linear-gradient(135deg, ' + mainCatFormData.color + ' 0%, ' + adjustColor(mainCatFormData.color, -20) + ' 100%)',
        image: mainCatFormData.image || 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=600',
        subcategories: []
      };
      
      // Expand the new category
      setExpandedCategories({ ...expandedCategories, [catId]: true });
    }
    
    setMainCategories(updatedCategories);
    setShowMainCategoryModal(false);
    resetMainCategoryForm();
  };

  // Helper function to adjust color brightness
  var adjustColor = function(color, percent) {
    var num = parseInt(color.replace('#', ''), 16);
    var amt = Math.round(2.55 * percent);
    var R = (num >> 16) + amt;
    var G = (num >> 8 & 0x00FF) + amt;
    var B = (num & 0x0000FF) + amt;
    R = Math.max(Math.min(255, R), 0);
    G = Math.max(Math.min(255, G), 0);
    B = Math.max(Math.min(255, B), 0);
    return '#' + (0x1000000 + R * 0x10000 + G * 0x100 + B).toString(16).slice(1);
  };

  // Subcategory Edit handlers
  var handleEditSubcategory = function(mainCatId, subcat) {
    setEditSubcatMainCat(mainCatId);
    setEditSubcatId(subcat.id);
    setEditSubcatName(subcat.name);
    setShowSubcategoryModal(true);
  };

  var handleSubcategoryEditSubmit = function(e) {
    e.preventDefault();
    
    if (!editSubcatName.trim()) {
      alert('Please enter a subcategory name');
      return;
    }
    
    var updatedCategories = { ...mainCategories };
    updatedCategories[editSubcatMainCat].subcategories = updatedCategories[editSubcatMainCat].subcategories.map(function(sub) {
      if (sub.id === editSubcatId) {
        return { ...sub, name: editSubcatName.trim() };
      }
      return sub;
    });
    
    setMainCategories(updatedCategories);
    setShowSubcategoryModal(false);
  };

  // Get subcategories for selected main category
  var getSubcategoriesForMainCategory = function(mainCategoryId) {
    if (!mainCategoryId || !mainCategories[mainCategoryId]) {
      return [];
    }
    return mainCategories[mainCategoryId].subcategories;
  };

  // Get all subcategories flat list for category images
  var getAllSubcategories = function() {
    var allSubs = [];
    Object.keys(mainCategories).forEach(function(mainCatId) {
      mainCategories[mainCatId].subcategories.forEach(function(sub) {
        allSubs.push({
          ...sub,
          mainCategory: mainCatId,
          mainCategoryName: mainCategories[mainCatId].name
        });
      });
    });
    return allSubs;
  };

  // Get main category icon component
  var getMainCategoryIcon = function(iconType) {
    switch (iconType) {
      case 'bulb': return <LightBulbIcon />;
      case 'shirt': return <ShirtIcon />;
      case 'baby': return <BabyIcon />;
      case 'box': return <BoxIcon />;
      case 'star': return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
        </svg>
      );
      case 'heart': return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
        </svg>
      );
      case 'home': return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
          <polyline points="9 22 9 12 15 12 15 22"/>
        </svg>
      );
      case 'gift': return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="20 12 20 22 4 22 4 12"/>
          <rect x="2" y="7" width="20" height="5"/>
          <line x1="12" y1="22" x2="12" y2="7"/>
          <path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"/>
          <path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"/>
        </svg>
      );
      default: return <GridIcon />;
    }
  };

  // LOGIN PAGE
  if (!isLoggedIn) {
    return (
      <div className="login-container">
        <div className="login-background">
          <div className="login-gradient"></div>
          <div className="login-grid"></div>
          <div className="login-orb orb-1"></div>
          <div className="login-orb orb-2"></div>
          <div className="login-orb orb-3"></div>
        </div>
        <div className="login-card">
          <div className="login-card-glow"></div>
          <div className="login-header">
            <div className="login-logo">
              <div className="logo-ring"></div>
              <ShieldIcon />
            </div>
            <h1>Admin Panel</h1>
            <p className="login-tagline">Laxorashopping Dashboard</p>
          </div>
          <form className="login-form" onSubmit={handleLogin}>
            <div className="login-field">
              <label>Username</label>
              <div className="input-wrapper">
                <input type="text" value={username} onChange={function(e) { setUsername(e.target.value); }} placeholder="Enter username" required />
                <span className="input-icon"><UserIcon /></span>
              </div>
            </div>
            <div className="login-field">
              <label>Password</label>
              <div className="input-wrapper">
                <input type={showPassword ? 'text' : 'password'} value={password} onChange={function(e) { setPassword(e.target.value); }} placeholder="Enter password" required />
                <span className="input-icon"><LockIcon /></span>
                <button type="button" className="toggle-password" onClick={function() { setShowPassword(!showPassword); }}>
                  {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                </button>
              </div>
            </div>
            {loginError && (<div className="login-error"><AlertIcon /><span>{loginError}</span></div>)}
            <button type="submit" className="login-btn"><span>Access Dashboard</span><ArrowRightIcon /></button>
          </form>
          <div className="login-footer">
            <div className="footer-divider"><span>Secure Access</span></div>
            <p>Protected by enterprise-grade security</p>
          </div>
        </div>
      </div>
    );
  }

  // ADMIN DASHBOARD
  return (
    <div className="admin-panel">
      {/* Header */}
      <header className="admin-header">
        <div className="admin-brand">
          <div className="brand-icon"><PackageIcon /></div>
          <div className="brand-text">
            <h1>Laxorashopping</h1>
            <span>Admin Dashboard</span>
          </div>
        </div>
        <div className="header-actions">
          <Link to="/" className="header-btn view-store"><ExternalLinkIcon /><span>View Store</span></Link>
          <button className="header-btn logout" onClick={handleLogout}><LogOutIcon /><span>Logout</span></button>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className="admin-tabs">
        <button className={activeTab === 'orders' ? 'admin-tab active' : 'admin-tab'} onClick={function() { setActiveTab('orders'); }}>
          <ShoppingBagIcon /><span>Orders</span>
          {orders.length > 0 && <span className="tab-badge">{orders.length}</span>}
        </button>
        <button className={activeTab === 'products' ? 'admin-tab active' : 'admin-tab'} onClick={function() { setActiveTab('products'); }}>
          <PackageIcon /><span>Products</span>
        </button>
        <button className={activeTab === 'customers' ? 'admin-tab active' : 'admin-tab'} onClick={function() { setActiveTab('customers'); }}>
          <UsersIcon /><span>Customers</span>
        </button>
        <button className={activeTab === 'categories' ? 'admin-tab active' : 'admin-tab'} onClick={function() { setActiveTab('categories'); }}>
          <GridIcon /><span>Categories</span>
        </button>
        <button className={activeTab === 'events' ? 'admin-tab active' : 'admin-tab'} onClick={function() { setActiveTab('events'); }}>
          <ImageIcon /><span>Category Images</span>
        </button>
        <button className={activeTab === 'settings' ? 'admin-tab active' : 'admin-tab'} onClick={function() { setActiveTab('settings'); }}>
          <SettingsIcon /><span>Settings</span>
        </button>
      </nav>

      {/* Loading State */}
      {loading && (
        <div className="loading-overlay">
          <div className="loading-spinner"><SpinnerIcon /></div>
          <p>Loading data...</p>
        </div>
      )}

      {/* ORDERS TAB */}
      {!loading && activeTab === 'orders' && (
        <>
          <div className="orders-dashboard">
            {/* Payment Status Cards */}
            <div className="dashboard-panel">
              <h3 className="panel-title"><CreditCardIcon />Payment Status</h3>
              <div className="payment-metrics">
                <div className={'metric-card success' + (orderFilter === 'payment-completed' ? ' active' : '')} onClick={function() { handleFilterClick('payment-completed'); }}>
                  <div className="metric-icon"><CheckIcon /></div>
                  <div className="metric-info">
                    <span className="metric-value">{getPaymentCompletedOrders().length}</span>
                    <span className="metric-label">Payment Completed</span>
                  </div>
                  <span className="metric-badge">{formatCurrency(getOrderTotal(getPaymentCompletedOrders()))}</span>
                </div>
                <div className={'metric-card warning' + (orderFilter === 'payment-pending' ? ' active' : '')} onClick={function() { handleFilterClick('payment-pending'); }}>
                  <div className="metric-icon"><ClockIcon /></div>
                  <div className="metric-info">
                    <span className="metric-value">{getPaymentPendingOrders().length}</span>
                    <span className="metric-label">Payment Pending</span>
                  </div>
                  <span className="metric-badge">{formatCurrency(getOrderTotal(getPaymentPendingOrders()))}</span>
                </div>
              </div>
            </div>

            {/* Order Pipeline */}
            <div className="dashboard-panel">
              <h3 className="panel-title"><TruckIcon />Order Pipeline</h3>
              <div className="pipeline-track">
                <div className={'pipeline-stage' + (orderFilter === 'new-pending' ? ' active' : '')} onClick={function() { handleFilterClick('new-pending'); }}>
                  <div className="stage-node new"><BoxIcon /></div>
                  <span className="stage-label">New</span>
                  <span className="stage-count">{getNewPendingOrders().length}</span>
                </div>
                <div className="pipeline-connector"></div>
                <div className={'pipeline-stage' + (orderFilter === 'processing' ? ' active' : '')} onClick={function() { handleFilterClick('processing'); }}>
                  <div className="stage-node processing"><SpinnerIcon /></div>
                  <span className="stage-label">Processing</span>
                  <span className="stage-count">{getProcessingOrders().length}</span>
                </div>
                <div className="pipeline-connector"></div>
                <div className={'pipeline-stage' + (orderFilter === 'shipped' ? ' active' : '')} onClick={function() { handleFilterClick('shipped'); }}>
                  <div className="stage-node shipped"><TruckIcon /></div>
                  <span className="stage-label">Shipped</span>
                  <span className="stage-count">{getShippedOrders().length}</span>
                </div>
                <div className="pipeline-connector"></div>
                <div className={'pipeline-stage' + (orderFilter === 'delivered' ? ' active' : '')} onClick={function() { handleFilterClick('delivered'); }}>
                  <div className="stage-node delivered"><CheckIcon /></div>
                  <span className="stage-label">Delivered</span>
                  <span className="stage-count">{getDeliveredOrders().length}</span>
                </div>
              </div>
              <div className="pipeline-cancelled">
                <div className={'pipeline-stage cancelled' + (orderFilter === 'cancelled' ? ' active' : '')} onClick={function() { handleFilterClick('cancelled'); }}>
                  <div className="stage-node cancelled"><XIcon /></div>
                  <span className="stage-label">Cancelled</span>
                  <span className="stage-count">{getCancelledOrders().length}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Active Filter Bar */}
          {orderFilter !== 'all' && (
            <div className="active-filter-bar">
              <FilterIcon />
              <span>Filtered by: <strong>{orderFilter.replace('-', ' ').replace(/\b\w/g, function(l) { return l.toUpperCase(); })}</strong></span>
              <button onClick={function() { setOrderFilter('all'); }}>Clear Filter</button>
            </div>
          )}

          {/* Orders List */}
          <div className="orders-section">
            <div className="section-header">
              <h3>
                {orderFilter === 'all' ? 'All Orders' : orderFilter.replace('-', ' ').replace(/\b\w/g, function(l) { return l.toUpperCase(); })}
                <span className="order-count">({getFilteredOrders().length})</span>
              </h3>
              <button className="refresh-btn" onClick={fetchAllData}><RefreshIcon /><span>Refresh</span></button>
            </div>
            <div className="orders-grid">
              {getFilteredOrders().length === 0 ? (
                <div className="empty-state">
                  <ReceiptIcon />
                  <p>No orders found</p>
                </div>
              ) : (
                getFilteredOrders().map(function(order) {
                  var orderStatus = order.status || 'pending';
                  return (
                    <div key={order.id} className="order-card">
                      <div className="order-header">
                        <div className="order-id">
                          <span className="order-number">#{order.id.slice(-8).toUpperCase()}</span>
                          <span className="order-date">{formatDate(order.createdAt)}</span>
                        </div>
                        <div className="order-badges">
                          <span className={'status-badge ' + orderStatus}>{orderStatus}</span>
                          <span className={'payment-badge ' + (order.paymentStatus === 'paid' ? 'paid' : 'pending')}>{order.paymentStatus || 'pending'}</span>
                        </div>
                      </div>
                      <div className="order-body">
                        <div className="order-info-grid">
                          <div className="info-item"><span className="info-label">Customer</span><span className="info-value">{order.customerName}</span></div>
                          <div className="info-item"><span className="info-label">Email</span><span className="info-value">{order.email}</span></div>
                          <div className="info-item"><span className="info-label">Phone</span><span className="info-value">{order.phone}</span></div>
                          <div className="info-item"><span className="info-label">Address</span><span className="info-value address">{order.address}</span></div>
                        </div>
                        <div className="order-items">
                          <span className="items-label">Items:</span>
                          <span className="items-value">{order.items}</span>
                        </div>
                        <div className="order-total">
                          <span>Total Amount</span>
                          <span className="total-value">{formatCurrency(order.totalAmount)}</span>
                        </div>
                        <div className="status-update">
                          <span className="update-label">Update Status:</span>
                          <select className="status-select" value={orderStatus} onChange={function(e) { handleUpdateOrderStatus(order.id, e.target.value); }}>
                            <option value="pending">New Order</option>
                            <option value="processing">Processing</option>
                            <option value="shipped">Shipped</option>
                            <option value="delivered">Delivered</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </>
      )}

      {/* PRODUCTS TAB */}
      {!loading && activeTab === 'products' && (
        <>
          <div className="tab-header">
            <div className="tab-title-section">
              <h2>Products</h2>
              <p className="tab-subtitle">Manage your product catalog</p>
            </div>
            <button className="add-btn" onClick={handleAddProduct}><PlusIcon /><span>Add Product</span></button>
          </div>
          <div className="products-table">
            <div className="table-header">
              <div className="table-cell">Image</div>
              <div className="table-cell">Product Name</div>
              <div className="table-cell">Category</div>
              <div className="table-cell">Price</div>
              <div className="table-cell">Stock</div>
              <div className="table-cell">Actions</div>
            </div>
            {products.map(function(product) {
              return (
                <div key={product.id} className="table-row">
                  <div className="table-cell" data-label="Image">
                    <div className="product-thumb">{(product.imageUrl || product.image) ? (<img src={product.imageUrl || product.image} alt={product.name} />) : (<ImageIcon />)}</div>
                  </div>
                  <div className="table-cell" data-label="Name"><span className="product-name">{product.name}</span></div>
                  <div className="table-cell" data-label="Category">
                    <span className="category-badge">{product.category || 'Uncategorized'}</span>
                    {product.mainCategory && <span className="main-category-tag">{mainCategories[product.mainCategory]?.name || product.mainCategory}</span>}
                  </div>
                  <div className="table-cell" data-label="Price"><span className="price">{formatCurrency(product.price)}</span></div>
                  <div className="table-cell" data-label="Stock"><span className={'stock-badge' + (product.stock > 10 ? ' in-stock' : product.stock > 0 ? ' low-stock' : ' out-stock')}>{product.stock || 0}</span></div>
                  <div className="table-cell actions">
                    <button className="edit-btn" onClick={function() { handleEditProduct(product); }}><EditIcon /></button>
                    <button className="delete-btn" onClick={function() { handleDeleteProduct(product.id); }}><TrashIcon /></button>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      {/* CUSTOMERS TAB */}
      {!loading && activeTab === 'customers' && (
        <>
          <div className="tab-header">
            <div className="tab-title-section">
              <h2>Customers</h2>
              <p className="tab-subtitle">View customer information</p>
            </div>
            <button className="refresh-btn" onClick={fetchAllData}><RefreshIcon /><span>Refresh</span></button>
          </div>
          <div className="customers-table-container">
            <div className="customers-table">
              <div className="table-header">
                <div className="table-cell">Customer</div>
                <div className="table-cell">Contact</div>
                <div className="table-cell">Location</div>
                <div className="table-cell">Orders</div>
                <div className="table-cell">Total Spent</div>
                <div className="table-cell">Status</div>
              </div>
              {customers.map(function(customer) {
                return (
                  <div key={customer.id} className="table-row">
                    <div className="table-cell customer-cell" data-label="Customer">
                      <div className="customer-avatar">{(customer.name || 'U').charAt(0).toUpperCase()}</div>
                      <span>{customer.name || 'Unknown'}</span>
                    </div>
                    <div className="table-cell" data-label="Contact">
                      <div className="contact-info">
                        <span className="contact-email">{customer.email || 'N/A'}</span>
                        <span className="contact-phone">{customer.phone || 'N/A'}</span>
                      </div>
                    </div>
                    <div className="table-cell" data-label="Location">{customer.city || customer.state || 'N/A'}</div>
                    <div className="table-cell" data-label="Orders"><span className="orders-count">{customer.orderCount || 0}</span></div>
                    <div className="table-cell" data-label="Total Spent"><span className="total-spent">{formatCurrency(customer.totalSpent || 0)}</span></div>
                    <div className="table-cell" data-label="Status"><span className={'payment-badge' + (customer.lastPaymentStatus === 'paid' ? ' paid' : ' pending')}>{customer.lastPaymentStatus || 'N/A'}</span></div>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}

      {/* CATEGORIES TAB - New Hierarchical Category Management */}
      {!loading && activeTab === 'categories' && (
        <>
          <div className="tab-header">
            <div className="tab-title-section">
              <h2>Category Management</h2>
              <p className="tab-subtitle">Manage main categories and subcategories</p>
            </div>
            <div className="tab-header-actions">
              <button className="add-btn" onClick={function() { setShowMainCategoryModal(true); }}>
                <PlusIcon /><span>Add Main Category</span>
              </button>
              <button className="refresh-btn" onClick={fetchAllData}><RefreshIcon /><span>Refresh</span></button>
            </div>
          </div>
          
          {/* Quick Add Subcategory Panel */}
          <div className="quick-add-panel">
            <div className="quick-add-header">
              <PlusIcon />
              <h3>Quick Add Subcategory</h3>
            </div>
            <div className="quick-add-form">
              <div className="quick-add-field">
                <label>Select Main Category</label>
                <select 
                  value={quickAddMainCat}
                  onChange={function(e) { setQuickAddMainCat(e.target.value); }}
                  className="quick-add-select"
                >
                  <option value="">-- Select Main Category --</option>
                  {Object.keys(mainCategories).map(function(catId) {
                    return (
                      <option key={catId} value={catId}>{mainCategories[catId].name}</option>
                    );
                  })}
                </select>
              </div>
              <div className="quick-add-field">
                <label>Subcategory Name</label>
                <input 
                  type="text"
                  placeholder="Enter subcategory name..."
                  value={quickAddSubcatName}
                  onChange={function(e) { setQuickAddSubcatName(e.target.value); }}
                  className="quick-add-input"
                />
              </div>
              <button 
                className="quick-add-btn"
                onClick={handleQuickAddSubcategory}
                disabled={!quickAddMainCat || !quickAddSubcatName.trim()}
              >
                <PlusIcon />
                <span>Add Subcategory</span>
              </button>
            </div>
          </div>
          
          <div className="categories-hierarchy-container">
            {Object.keys(mainCategories).map(function(mainCatId) {
              var mainCat = mainCategories[mainCatId];
              var isExpanded = expandedCategories[mainCatId];
              
              return (
                <div key={mainCatId} className="main-category-card" style={{ '--category-color': mainCat.color }}>
                  <div className="main-category-header" onClick={function() { toggleCategoryExpand(mainCatId); }}>
                    <div className="main-category-info">
                      <div className="main-category-icon" style={{ background: mainCat.color }}>
                        {getMainCategoryIcon(mainCat.icon)}
                      </div>
                      <div className="main-category-details">
                        <h3>{mainCat.name}</h3>
                        <span className="subcategory-count">{mainCat.subcategories.length} subcategories</span>
                      </div>
                    </div>
                    <div className="main-category-actions">
                      <button 
                        className="main-cat-edit-btn"
                        onClick={function(e) { 
                          e.stopPropagation();
                          handleEditMainCategory(mainCatId);
                        }}
                        title="Edit Category"
                      >
                        <EditIcon />
                      </button>
                      <button 
                        className="main-cat-delete-btn"
                        onClick={function(e) { 
                          e.stopPropagation();
                          handleDeleteMainCategory(mainCatId);
                        }}
                        title="Delete Category"
                      >
                        <TrashIcon />
                      </button>
                      <button className="expand-btn">
                        {isExpanded ? <ChevronDownIcon /> : <ChevronRightIcon />}
                      </button>
                    </div>
                  </div>
                  
                  {isExpanded && (
                    <div className="subcategories-section">
                      <div className="subcategories-list">
                        {mainCat.subcategories.length === 0 ? (
                          <div className="no-subcategories">
                            <span>No subcategories yet. Add one below!</span>
                          </div>
                        ) : (
                          mainCat.subcategories.map(function(subcat) {
                            return (
                              <div key={subcat.id} className="subcategory-item">
                                <span className="subcategory-name">{subcat.name}</span>
                                <span className="subcategory-id">{subcat.id}</span>
                                <div className="subcategory-actions">
                                  <button 
                                    className="subcategory-edit-btn"
                                    onClick={function() { handleEditSubcategory(mainCatId, subcat); }}
                                    title="Edit"
                                  >
                                    <EditIcon />
                                  </button>
                                  <button 
                                    className="subcategory-delete-btn"
                                    onClick={function() { handleDeleteSubcategory(mainCatId, subcat.id); }}
                                    title="Delete"
                                  >
                                    <TrashIcon />
                                  </button>
                                </div>
                              </div>
                            );
                          })
                        )}
                      </div>
                      
                      <div className="add-subcategory-form">
                        <div className="add-subcat-input-wrapper">
                          <input 
                            type="text" 
                            placeholder="Enter new subcategory name..."
                            value={newSubcategory[mainCatId] || ''}
                            onChange={function(e) { 
                              setNewSubcategory({ ...newSubcategory, [mainCatId]: e.target.value }); 
                            }}
                            onKeyPress={function(e) {
                              if (e.key === 'Enter') {
                                handleAddSubcategory(mainCatId);
                              }
                            }}
                          />
                        </div>
                        <button 
                          className="add-subcategory-btn"
                          onClick={function() { handleAddSubcategory(mainCatId); }}
                          disabled={!newSubcategory[mainCatId] || !newSubcategory[mainCatId].trim()}
                        >
                          <PlusIcon />
                          <span>Add Subcategory</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </>
      )}

      {/* Add/Edit Main Category Modal */}
      {showMainCategoryModal && (
        <div className="modal-overlay" onClick={function() { setShowMainCategoryModal(false); resetMainCategoryForm(); }}>
          <div className="modal-content category-modal" onClick={function(e) { e.stopPropagation(); }}>
            <div className="modal-header">
              <h2>{editingMainCategory ? 'Edit Main Category' : 'Add New Main Category'}</h2>
              <button className="modal-close" onClick={function() { setShowMainCategoryModal(false); resetMainCategoryForm(); }}><XIcon /></button>
            </div>
            <form className="category-form" onSubmit={handleMainCategorySubmit}>
              <div className="form-group">
                <label>Category Name *</label>
                <input 
                  type="text" 
                  value={mainCatFormData.name}
                  onChange={function(e) { setMainCatFormData({ ...mainCatFormData, name: e.target.value }); }}
                  placeholder="e.g., Electronics, Home Decor"
                  required
                />
              </div>
              <div className="form-group">
                <label>Description</label>
                <input 
                  type="text" 
                  value={mainCatFormData.description}
                  onChange={function(e) { setMainCatFormData({ ...mainCatFormData, description: e.target.value }); }}
                  placeholder="Brief description of this category"
                />
              </div>
              <div className="form-group">
                <label>Icon Type</label>
                <div className="icon-selector">
                  {['bulb', 'shirt', 'baby', 'grid', 'box', 'star'].map(function(iconType) {
                    return (
                      <button
                        key={iconType}
                        type="button"
                        className={'icon-option' + (mainCatFormData.icon === iconType ? ' selected' : '')}
                        onClick={function() { setMainCatFormData({ ...mainCatFormData, icon: iconType }); }}
                        style={{ '--icon-color': mainCatFormData.color }}
                      >
                        {getMainCategoryIcon(iconType)}
                        <span>{iconType}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
              <div className="form-group">
                <label>Theme Color</label>
                <div className="color-selector">
                  {[
                    { name: 'Amber', value: '#f59e0b' },
                    { name: 'Pink', value: '#ec4899' },
                    { name: 'Purple', value: '#8b5cf6' },
                    { name: 'Blue', value: '#3b82f6' },
                    { name: 'Green', value: '#10b981' },
                    { name: 'Red', value: '#ef4444' },
                    { name: 'Teal', value: '#14b8a6' },
                    { name: 'Orange', value: '#f97316' }
                  ].map(function(color) {
                    return (
                      <button
                        key={color.value}
                        type="button"
                        className={'color-option' + (mainCatFormData.color === color.value ? ' selected' : '')}
                        style={{ background: color.value }}
                        onClick={function() { setMainCatFormData({ ...mainCatFormData, color: color.value }); }}
                        title={color.name}
                      >
                        {mainCatFormData.color === color.value && <CheckIcon />}
                      </button>
                    );
                  })}
                </div>
              </div>
              <div className="form-group">
                <label>Category Image URL (Optional)</label>
                <input 
                  type="text" 
                  value={mainCatFormData.image}
                  onChange={function(e) { setMainCatFormData({ ...mainCatFormData, image: e.target.value }); }}
                  placeholder="https://example.com/image.jpg"
                />
                {mainCatFormData.image && (
                  <div className="image-preview small">
                    <img src={mainCatFormData.image} alt="Preview" onError={function(e) { e.target.style.display = 'none'; }} />
                  </div>
                )}
              </div>
              <div className="form-actions">
                <button type="button" className="cancel-btn" onClick={function() { setShowMainCategoryModal(false); resetMainCategoryForm(); }}>Cancel</button>
                <button type="submit" className="submit-btn">{editingMainCategory ? 'Update Category' : 'Add Category'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Subcategory Modal */}
      {showSubcategoryModal && (
        <div className="modal-overlay" onClick={function() { setShowSubcategoryModal(false); }}>
          <div className="modal-content subcategory-modal" onClick={function(e) { e.stopPropagation(); }}>
            <div className="modal-header">
              <h2>Edit Subcategory</h2>
              <button className="modal-close" onClick={function() { setShowSubcategoryModal(false); }}><XIcon /></button>
            </div>
            <form className="category-form" onSubmit={handleSubcategoryEditSubmit}>
              <div className="form-group">
                <label>Subcategory Name *</label>
                <input 
                  type="text" 
                  value={editSubcatName}
                  onChange={function(e) { setEditSubcatName(e.target.value); }}
                  placeholder="Enter subcategory name"
                  required
                />
              </div>
              <div className="form-info">
                <span className="info-label">ID:</span>
                <span className="info-value">{editSubcatId}</span>
                <span className="info-note">(ID cannot be changed)</span>
              </div>
              <div className="form-actions">
                <button type="button" className="cancel-btn" onClick={function() { setShowSubcategoryModal(false); }}>Cancel</button>
                <button type="submit" className="submit-btn">Update Subcategory</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CATEGORY IMAGES TAB */}
      {!loading && activeTab === 'events' && (
        <>
          <div className="tab-header">
            <div className="tab-title-section">
              <h2>Category Images</h2>
              <p className="tab-subtitle">Manage category banner images</p>
            </div>
            <button className="refresh-btn" onClick={fetchAllData}><RefreshIcon /><span>Refresh</span></button>
          </div>
          <div className="categories-management">
            {getAllSubcategories().map(function(subcat) {
              var hasImage = categories[subcat.id] && categories[subcat.id].length > 0;
              
              return (
                <div key={subcat.id} className="category-card">
                  <div className="category-header">
                    <div>
                      <h3>{subcat.name}</h3>
                      <span className="category-parent-tag">{subcat.mainCategoryName}</span>
                    </div>
                    {hasImage && (
                      <button 
                        type="button" 
                        className="category-delete-btn" 
                        onClick={function() { handleCategoryImageDelete(subcat.id); }}
                        title="Remove image"
                      >
                        <TrashIcon />
                      </button>
                    )}
                  </div>
                  <div className="category-preview">
                    {hasImage ? (
                      <img src={categories[subcat.id]} alt={subcat.name} className="category-image" />
                    ) : (
                      <div className="category-placeholder">
                        <ImageIcon />
                        <span>No image set</span>
                      </div>
                    )}
                  </div>
                  <div className="category-actions">
                    <div className="category-upload-row">
                      <input 
                        type="file" 
                        id={'category-upload-' + subcat.id}
                        accept="image/*" 
                        style={{ display: 'none' }}
                        onChange={function(e) { handleCategoryFileUpload(subcat.id, e); }}
                      />
                      <label htmlFor={'category-upload-' + subcat.id} className="category-upload-btn">
                        <UploadIcon />
                        <span>Upload</span>
                      </label>
                      <span className="category-or">or</span>
                      <input 
                        type="text" 
                        id={'category-url-' + subcat.id}
                        placeholder="Paste URL" 
                        className="category-url-input"
                      />
                      <button 
                        type="button" 
                        className="category-save-btn"
                        onClick={function() { 
                          var urlInput = document.getElementById('category-url-' + subcat.id);
                          if (urlInput && urlInput.value.trim()) {
                            handleCategoryImageSave(subcat.id, urlInput.value.trim()); 
                            urlInput.value = ''; 
                          }
                        }}
                      >
                        Save
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      {/* SETTINGS TAB */}
      {!loading && activeTab === 'settings' && (
        <>
          <div className="tab-header">
            <div className="tab-title-section">
              <h2>Settings</h2>
              <p className="tab-subtitle">Configure your store settings</p>
            </div>
          </div>
          <div className="settings-container">
            <div className="settings-section">
              <div className="settings-section-header">
                <h3>Social Media Links</h3>
                <p>Add your social media links to show floating buttons on the homepage</p>
              </div>
              
              <div className="settings-form">
                <div className="settings-field">
                  <label className="settings-label">
                    <WhatsAppIcon />
                    <span>WhatsApp Number</span>
                  </label>
                  <div className="settings-input-wrapper">
                    <input 
                      type="text" 
                      value={socialSettings.whatsapp || ''} 
                      onChange={function(e) { setSocialSettings({ ...socialSettings, whatsapp: e.target.value }); }}
                      placeholder="Enter WhatsApp number with country code (e.g., 919876543210)"
                      className="settings-input"
                    />
                    <span className="settings-hint">Include country code without + symbol (e.g., 91 for India)</span>
                  </div>
                </div>
                
                <div className="settings-field">
                  <label className="settings-label">
                    <InstagramIcon />
                    <span>Instagram Username or URL</span>
                  </label>
                  <div className="settings-input-wrapper">
                    <input 
                      type="text" 
                      value={socialSettings.instagram || ''} 
                      onChange={function(e) { setSocialSettings({ ...socialSettings, instagram: e.target.value }); }}
                      placeholder="Enter Instagram username or full URL"
                      className="settings-input"
                    />
                    <span className="settings-hint">Just username (e.g., laxorashopping) or full URL</span>
                  </div>
                </div>
                
                <div className="settings-preview">
                  <h4>Preview</h4>
                  <div className="preview-buttons">
                    {socialSettings.whatsapp ? (
                      <div className="preview-btn whatsapp">
                        <WhatsAppIcon />
                        <span>WhatsApp: {socialSettings.whatsapp}</span>
                      </div>
                    ) : (
                      <div className="preview-btn disabled">
                        <WhatsAppIcon />
                        <span>WhatsApp not configured</span>
                      </div>
                    )}
                    {socialSettings.instagram ? (
                      <div className="preview-btn instagram">
                        <InstagramIcon />
                        <span>Instagram: {socialSettings.instagram}</span>
                      </div>
                    ) : (
                      <div className="preview-btn disabled">
                        <InstagramIcon />
                        <span>Instagram not configured</span>
                      </div>
                    )}
                  </div>
                </div>
                
                <button 
                  type="button" 
                  className="settings-save-btn"
                  onClick={handleSaveSocialSettings}
                  disabled={isSavingSocial}
                >
                  {isSavingSocial ? 'Saving...' : 'Save Settings'}
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Product Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={function() { setShowModal(false); }}>
          <div className="modal-content" onClick={function(e) { e.stopPropagation(); }}>
            <div className="modal-header">
              <h2>{editingProduct ? 'Edit Product' : 'Add New Product'}</h2>
              <button className="modal-close" onClick={function() { setShowModal(false); }}><XIcon /></button>
            </div>
            <form className="product-form" onSubmit={handleFormSubmit}>
              <div className="form-group">
                <label>Product Name *</label>
                <input type="text" value={formData.name || ''} onChange={function(e) { setFormData({ ...formData, name: e.target.value }); }} placeholder="Enter product name" />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Price (₹) *</label>
                  <input type="number" value={formData.price || ''} onChange={function(e) { setFormData({ ...formData, price: e.target.value }); }} placeholder="0" min="0" />
                </div>
                <div className="form-group">
                  <label>Stock</label>
                  <input type="number" value={formData.stock || ''} onChange={function(e) { setFormData({ ...formData, stock: e.target.value }); }} placeholder="0" min="0" />
                </div>
              </div>
              
              {/* Main Category Selection */}
              <div className="form-group">
                <label>Main Category *</label>
                <select 
                  value={formData.mainCategory || ''} 
                  onChange={function(e) { 
                    setFormData({ ...formData, mainCategory: e.target.value, category: '' }); 
                  }}
                  className="category-select main-category-select"
                >
                  <option value="">Select Main Category</option>
                  {Object.keys(mainCategories).map(function(mainCatId) {
                    var mainCat = mainCategories[mainCatId];
                    return (
                      <option key={mainCatId} value={mainCatId}>{mainCat.name}</option>
                    );
                  })}
                </select>
              </div>
              
              {/* Subcategory Selection */}
              <div className="form-group">
                <label>Subcategory *</label>
                <select 
                  value={formData.category || ''} 
                  onChange={function(e) { setFormData({ ...formData, category: e.target.value }); }}
                  disabled={!formData.mainCategory}
                  className="category-select"
                >
                  <option value="">Select Subcategory</option>
                  {getSubcategoriesForMainCategory(formData.mainCategory).map(function(subcat) {
                    return (
                      <option key={subcat.id} value={subcat.id}>{subcat.name}</option>
                    );
                  })}
                </select>
                {!formData.mainCategory && (
                  <span className="form-hint">Please select a main category first</span>
                )}
              </div>
              
              <div className="form-group">
                <label>Description</label>
                <textarea value={formData.description || ''} onChange={function(e) { setFormData({ ...formData, description: e.target.value }); }} placeholder="Enter product description" rows="3" />
              </div>
              <div className="form-group">
                <label>Product Image</label>
                <div className="image-upload-section">
                  {(imagePreview || formData.image) && (
                    <div className="image-preview">
                      <img src={imagePreview || formData.image} alt="Product preview" />
                      <button type="button" className="remove-image-btn" onClick={handleRemoveImage}>
                        <XIcon />
                      </button>
                    </div>
                  )}
                  {!imagePreview && !formData.image && (
                    <div className="upload-options">
                      <div className="upload-box">
                        <input 
                          type="file" 
                          id="product-image-upload" 
                          accept="image/*" 
                          onChange={handleImageChange}
                          disabled={isSaving}
                          style={{ display: 'none' }}
                        />
                        <label htmlFor="product-image-upload" className="upload-label">
                          <UploadIcon />
                          <span>Click to upload image</span>
                          <span className="upload-hint">PNG, JPG up to 5MB</span>
                        </label>
                      </div>
                      <div className="upload-divider"><span>OR</span></div>
                      <input 
                        type="text" 
                        value={formData.image || ''} 
                        onChange={function(e) { setFormData({ ...formData, image: e.target.value }); setImagePreview(e.target.value); }} 
                        placeholder="Paste image URL here" 
                        className="url-input"
                      />
                    </div>
                  )}
                </div>
              </div>
              <div className="form-actions">
                <button type="button" className="cancel-btn" onClick={function() { setShowModal(false); }} disabled={isSaving}>Cancel</button>
                <button type="submit" className="submit-btn" disabled={isSaving}>{isSaving ? 'Saving...' : (editingProduct ? 'Update Product' : 'Add Product')}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminPanel;
