import React, { useState, useEffect } from 'react';
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
  var pausedState = useState(false);
  var isPaused = pausedState[0];
  var setIsPaused = pausedState[1];

  useEffect(function() {
    loadEvents();
  }, []);

  useEffect(function() {
    if (events.length <= 1 || isPaused) return;
    
    var interval = setInterval(function() {
      setCurrentIndex(function(prev) {
        return (prev + 1) % events.length;
      });
    }, 5000);

    return function() {
      clearInterval(interval);
    };
  }, [events.length, isPaused]);

  function loadEvents() {
    setLoading(true);
    getActiveEvents()
      .then(function(data) {
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
    setCurrentIndex(function(prev) {
      return prev === 0 ? events.length - 1 : prev - 1;
    });
  }

  function goToNext() {
    setCurrentIndex(function(prev) {
      return (prev + 1) % events.length;
    });
  }

  function handleMouseEnter() {
    setIsPaused(true);
  }

  function handleMouseLeave() {
    setIsPaused(false);
  }

  if (loading || events.length === 0) {
    return null;
  }

  return (
    <section className="events-banner-section">
      <div className="events-banner-container">
        <div className="section-badge">
          <span className="badge-icon">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </span>
          <span>Hot Deals & Offers</span>
        </div>
        
        <div 
          className="events-slider"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <div 
            className="slides-wrapper"
            style={{ transform: 'translateX(-' + (currentIndex * 100) + '%)' }}
          >
            {events.map(function(event, index) {
              var isActive = index === currentIndex;
              return (
                <div key={event.id} className={isActive ? 'event-slide active' : 'event-slide'}>
                  <div className="slide-background">
                    <img src={event.imageUrl} alt={event.title} />
                    <div className="slide-gradient"></div>
                    <div className="slide-particles">
                      <span className="particle"></span>
                      <span className="particle"></span>
                      <span className="particle"></span>
                      <span className="particle"></span>
                      <span className="particle"></span>
                    </div>
                  </div>
                  
                  <div className="slide-content-wrapper">
                    <div className={isActive ? 'slide-content animate' : 'slide-content'}>
                      {event.discount && (
                        <div className="discount-badge">
                          <span className="discount-value">{event.discount}</span>
                          <span className="discount-label">OFF</span>
                        </div>
                      )}
                      
                      <h2 className="slide-title">{event.title}</h2>
                      
                      {event.description && (
                        <p className="slide-description">{event.description}</p>
                      )}
                      
                      <div className="slide-cta">
                        <Link to={event.buttonLink || '/products'} className="cta-button primary">
                          <span>{event.buttonText || 'Shop Now'}</span>
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <line x1="5" y1="12" x2="19" y2="12"/>
                            <polyline points="12 5 19 12 12 19"/>
                          </svg>
                        </Link>
                        <Link to="/products" className="cta-button secondary">
                          View All Deals
                        </Link>
                      </div>
                      
                      {event.endDate && (
                        <div className="offer-timer">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="12" cy="12" r="10"/>
                            <polyline points="12 6 12 12 16 14"/>
                          </svg>
                          <span>Ends: {new Date(event.endDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {events.length > 1 && (
            <button className="nav-button prev" onClick={goToPrevious} aria-label="Previous">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="15 18 9 12 15 6"/>
              </svg>
            </button>
          )}
          
          {events.length > 1 && (
            <button className="nav-button next" onClick={goToNext} aria-label="Next">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="9 18 15 12 9 6"/>
              </svg>
            </button>
          )}

          {events.length > 1 && (
            <div className="slider-controls">
              <div className="slider-dots">
                {events.map(function(_, index) {
                  return (
                    <button
                      key={index}
                      className={index === currentIndex ? 'dot active' : 'dot'}
                      onClick={function() { goToSlide(index); }}
                      aria-label={'Go to slide ' + (index + 1)}
                    >
                      <span className="dot-progress"></span>
                    </button>
                  );
                })}
              </div>
              <div className="slide-counter">
                <span className="current">{String(currentIndex + 1).padStart(2, '0')}</span>
                <span className="separator">/</span>
                <span className="total">{String(events.length).padStart(2, '0')}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default EventsBanner;
