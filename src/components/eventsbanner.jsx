import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getActiveEvents } from '../services/api';
import './eventsbanner.css';

function EventsBanner() {
  var [events, setEvents] = useState([]);
  var [currentIndex, setCurrentIndex] = useState(0);
  var [loading, setLoading] = useState(true);

  useEffect(function() {
    loadEvents();
  }, []);

  useEffect(function() {
    if (events.length <= 1) return;
    
    var interval = setInterval(function() {
      setCurrentIndex(function(prev) {
        return (prev + 1) % events.length;
      });
    }, 5000);

    return function() {
      clearInterval(interval);
    };
  }, [events.length]);

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

  if (loading || events.length === 0) {
    return null;
  }

  return (
    <section className="events-banner-section">
      <div className="events-slider">
        {/* Slides */}
        <div 
          className="slides-container"
          style={{ transform: 'translateX(-' + (currentIndex * 100) + '%)' }}
        >
          {events.map(function(event, index) {
            return (
              <div key={event.id} className="event-slide">
                <div className="slide-image">
                  <img src={event.imageUrl} alt={event.title} />
                  <div className="slide-overlay"></div>
                </div>
                <div className="slide-content">
                  {event.discount && (
                    <span className="event-badge">{event.discount}</span>
                  )}
                  <h2>{event.title}</h2>
                  {event.description && (
                    <p>{event.description}</p>
                  )}
                  <Link to={event.buttonLink || '/products'} className="event-cta-btn">
                    {event.buttonText || 'Shop Now'}
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <line x1="5" y1="12" x2="19" y2="12"/>
                      <polyline points="12 5 19 12 12 19"/>
                    </svg>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        {/* Navigation Arrows */}
        {events.length > 1 && (
          <>
            <button className="slider-nav prev" onClick={goToPrevious} aria-label="Previous">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="15 18 9 12 15 6"/>
              </svg>
            </button>
            <button className="slider-nav next" onClick={goToNext} aria-label="Next">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="9 18 15 12 9 6"/>
              </svg>
            </button>
          </>
        )}

        {/* Dots */}
        {events.length > 1 && (
          <div className="slider-dots">
            {events.map(function(_, index) {
              return (
                <button
                  key={index}
                  className={'dot ' + (index === currentIndex ? 'active' : '')}
                  onClick={function() { goToSlide(index); }}
                  aria-label={'Go to slide ' + (index + 1)}
                />
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}

export default EventsBanner;
