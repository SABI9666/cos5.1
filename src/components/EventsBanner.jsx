import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { getActiveEvents } from '../services/api';
import './eventsbanner.css';

function EventsBanner() {
  var eventsState = useState([]);
  var events = eventsState[0];
  var setEvents = eventsState[1];
  var indexState = useState(0);
  var currentIndex = indexState[0];
  var setCurrentIndex = indexState[1];
  var loadingState = useState(true);
  var loading = loadingState[0];
  var setLoading = loadingState[1];
  var intervalRef = useRef(null);

  // Default banners if no events exist
  var defaultBanners = [
    {
      id: 'default-1',
      title: 'Premium LED Lighting',
      description: 'Transform your space with our energy-efficient LED solutions',
      discount: '20%',
      imageUrl: 'https://images.unsplash.com/photo-1565814329452-e1efa11c5b89?w=1200',
      buttonText: 'Shop Now',
      buttonLink: '/products'
    },
    {
      id: 'default-2',
      title: 'Smart Home Collection',
      description: 'Control your lights with voice and app',
      discount: '30%',
      imageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200',
      buttonText: 'Explore',
      buttonLink: '/products'
    },
    {
      id: 'default-3',
      title: 'Outdoor LED Lights',
      description: 'Weather-resistant lights for your garden and patio',
      discount: '25%',
      imageUrl: 'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=1200',
      buttonText: 'View Collection',
      buttonLink: '/products'
    }
  ];

  useEffect(function() {
    loadEvents();
  }, []);

  // Auto-slide effect
  useEffect(function() {
    var displayEvents = events.length > 0 ? events : defaultBanners;
    
    if (displayEvents.length <= 1) return;
    
    // Clear any existing interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    
    // Set new interval
    intervalRef.current = setInterval(function() {
      setCurrentIndex(function(prev) {
        var nextIndex = (prev + 1) % displayEvents.length;
        return nextIndex;
      });
    }, 4000);

    return function() {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [events]);

  function loadEvents() {
    setLoading(true);
    getActiveEvents()
      .then(function(data) {
        console.log('Events loaded:', data);
        setEvents(data);
        setLoading(false);
      })
      .catch(function(error) {
        console.error('Error loading events:', error);
        setLoading(false);
      });
  }

  function goToSlide(index) {
    setCurrentIndex(index);
  }

  function goToPrevious() {
    var displayEvents = events.length > 0 ? events : defaultBanners;
    setCurrentIndex(function(prev) {
      return prev === 0 ? displayEvents.length - 1 : prev - 1;
    });
  }

  function goToNext() {
    var displayEvents = events.length > 0 ? events : defaultBanners;
    setCurrentIndex(function(prev) {
      return (prev + 1) % displayEvents.length;
    });
  }

  // Use events if available, otherwise use defaults
  var displayEvents = events.length > 0 ? events : defaultBanners;

  if (loading) {
    return (
      <section className="events-banner-section">
        <div className="banner-loading">
          <div className="banner-loading-spinner"></div>
        </div>
      </section>
    );
  }

  return (
    <section className="events-banner-section">
      <div className="events-banner-container">
        <div className="banner-header">
          <div className="banner-badge">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
            </svg>
            <span>Hot Deals & Offers</span>
          </div>
        </div>
        
        <div className="banner-slider">
          <div 
            className="banner-track"
            style={{ transform: 'translateX(-' + (currentIndex * 100) + '%)' }}
          >
            {displayEvents.map(function(event, index) {
              return (
                <div key={event.id} className="banner-slide">
                  <div className="slide-image-wrapper">
                    <img src={event.imageUrl} alt={event.title} />
                    <div className="slide-overlay"></div>
                  </div>
                  
                  <div className="slide-content">
                    {event.discount && (
                      <div className="discount-tag">
                        <span className="discount-value">{event.discount}</span>
                        <span className="discount-text">OFF</span>
                      </div>
                    )}
                    
                    <h2 className="slide-title">{event.title}</h2>
                    
                    {event.description && (
                      <p className="slide-desc">{event.description}</p>
                    )}
                    
                    <div className="slide-buttons">
                      <Link to={event.buttonLink || '/products'} className="btn-primary">
                        {event.buttonText || 'Shop Now'}
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M5 12h14M12 5l7 7-7 7"/>
                        </svg>
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {displayEvents.length > 1 && (
            <button className="slider-arrow arrow-prev" onClick={goToPrevious}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M15 18l-6-6 6-6"/>
              </svg>
            </button>
          )}
          
          {displayEvents.length > 1 && (
            <button className="slider-arrow arrow-next" onClick={goToNext}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 18l6-6-6-6"/>
              </svg>
            </button>
          )}

          {displayEvents.length > 1 && (
            <div className="slider-pagination">
              {displayEvents.map(function(_, index) {
                return (
                  <button
                    key={index}
                    className={index === currentIndex ? 'pagination-dot active' : 'pagination-dot'}
                    onClick={function() { goToSlide(index); }}
                  />
                );
              })}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default EventsBanner;
