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
  var pausedState = useState(false);
  var isPaused = pausedState[0];
  var setIsPaused = pausedState[1];
  var progressState = useState(0);
  var progress = progressState[0];
  var setProgress = progressState[1];
  var intervalRef = useRef(null);
  var progressRef = useRef(null);

  var defaultBanners = [
    {
      id: 'default-1',
      title: 'Premium LED Lighting',
      description: 'Transform your space with our energy-efficient LED solutions. Experience the future of lighting.',
      discount: '20%',
      imageUrl: 'https://images.unsplash.com/photo-1565814329452-e1efa11c5b89?w=1400&q=80',
      buttonText: 'Shop Now',
      buttonLink: '/products'
    },
    {
      id: 'default-2',
      title: 'Smart Home Collection',
      description: 'Control your lights with voice commands and smartphone apps. Modern living starts here.',
      discount: '30%',
      imageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1400&q=80',
      buttonText: 'Explore',
      buttonLink: '/products'
    },
    {
      id: 'default-3',
      title: 'Outdoor LED Lights',
      description: 'Weather-resistant lights for your garden, patio, and outdoor spaces. Built to last.',
      discount: '25%',
      imageUrl: 'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=1400&q=80',
      buttonText: 'View Collection',
      buttonLink: '/products'
    }
  ];

  useEffect(function() {
    loadEvents();
  }, []);

  useEffect(function() {
    var displayEvents = events.length > 0 ? events : defaultBanners;
    if (displayEvents.length <= 1) return;

    if (intervalRef.current) clearInterval(intervalRef.current);
    if (progressRef.current) clearInterval(progressRef.current);

    if (!isPaused) {
      setProgress(0);
      
      progressRef.current = setInterval(function() {
        setProgress(function(prev) {
          if (prev >= 100) return 0;
          return prev + 0.5;
        });
      }, 25);

      intervalRef.current = setInterval(function() {
        setCurrentIndex(function(prev) {
          return (prev + 1) % displayEvents.length;
        });
        setProgress(0);
      }, 5000);
    }

    return function() {
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (progressRef.current) clearInterval(progressRef.current);
    };
  }, [events, isPaused, currentIndex]);

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
    setProgress(0);
  }

  function goToPrevious() {
    var displayEvents = events.length > 0 ? events : defaultBanners;
    setCurrentIndex(function(prev) {
      return prev === 0 ? displayEvents.length - 1 : prev - 1;
    });
    setProgress(0);
  }

  function goToNext() {
    var displayEvents = events.length > 0 ? events : defaultBanners;
    setCurrentIndex(function(prev) {
      return (prev + 1) % displayEvents.length;
    });
    setProgress(0);
  }

  var displayEvents = events.length > 0 ? events : defaultBanners;

  if (loading) {
    return (
      <section className="hero-banner">
        <div className="hero-loading">
          <div className="hero-loading-spinner"></div>
          <span>Loading amazing deals...</span>
        </div>
      </section>
    );
  }

  return (
    <section className="hero-banner">
      <div className="hero-container">
        <div className="hero-badge-wrapper">
          <div className="hero-badge">
            <span className="badge-pulse"></span>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
            </svg>
            <span>Special Offers</span>
          </div>
        </div>

        <div 
          className="hero-slider"
          onMouseEnter={function() { setIsPaused(true); }}
          onMouseLeave={function() { setIsPaused(false); }}
        >
          {displayEvents.map(function(event, index) {
            var isActive = index === currentIndex;
            var isPrev = index === (currentIndex === 0 ? displayEvents.length - 1 : currentIndex - 1);
            var isNext = index === (currentIndex + 1) % displayEvents.length;
            
            var slideClass = 'hero-slide';
            if (isActive) slideClass += ' active';
            if (isPrev) slideClass += ' prev';
            if (isNext) slideClass += ' next';

            return (
              <div key={event.id} className={slideClass}>
                <div className="slide-bg">
                  <div className="slide-bg-image" style={{ backgroundImage: 'url(' + event.imageUrl + ')' }}></div>
                  <div className="slide-bg-overlay"></div>
                  <div className="slide-bg-gradient"></div>
                </div>

                <div className="slide-particles">
                  <span className="particle p1"></span>
                  <span className="particle p2"></span>
                  <span className="particle p3"></span>
                  <span className="particle p4"></span>
                  <span className="particle p5"></span>
                  <span className="particle p6"></span>
                </div>

                <div className="slide-inner">
                  <div className="slide-text">
                    {event.discount && (
                      <div className="offer-badge">
                        <span className="offer-value">{event.discount}</span>
                        <span className="offer-label">OFF</span>
                      </div>
                    )}

                    <h1 className="slide-headline">{event.title}</h1>

                    {event.description && (
                      <p className="slide-subtext">{event.description}</p>
                    )}

                    <div className="slide-actions">
                      <Link to={event.buttonLink || '/products'} className="btn-shop">
                        <span>{event.buttonText || 'Shop Now'}</span>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M5 12h14M12 5l7 7-7 7"/>
                        </svg>
                      </Link>
                      <Link to="/products" className="btn-explore">
                        <span>Explore All</span>
                      </Link>
                    </div>
                  </div>

                  <div className="slide-visual">
                    <div className="visual-glow"></div>
                    <div className="visual-ring ring-1"></div>
                    <div className="visual-ring ring-2"></div>
                    <div className="visual-ring ring-3"></div>
                  </div>
                </div>
              </div>
            );
          })}

          {displayEvents.length > 1 && (
            <div className="hero-nav">
              <button className="nav-btn nav-prev" onClick={goToPrevious} aria-label="Previous slide">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M15 18l-6-6 6-6"/>
                </svg>
              </button>
              <button className="nav-btn nav-next" onClick={goToNext} aria-label="Next slide">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 18l6-6-6-6"/>
                </svg>
              </button>
            </div>
          )}

          {displayEvents.length > 1 && (
            <div className="hero-pagination">
              <div className="pagination-track">
                {displayEvents.map(function(_, index) {
                  var isActive = index === currentIndex;
                  return (
                    <button
                      key={index}
                      className={isActive ? 'pag-item active' : 'pag-item'}
                      onClick={function() { goToSlide(index); }}
                    >
                      <span className="pag-bg"></span>
                      {isActive && (
                        <span className="pag-progress" style={{ width: progress + '%' }}></span>
                      )}
                    </button>
                  );
                })}
              </div>
              <div className="pagination-counter">
                <span className="counter-current">{String(currentIndex + 1).padStart(2, '0')}</span>
                <span className="counter-divider"></span>
                <span className="counter-total">{String(displayEvents.length).padStart(2, '0')}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default EventsBanner;
