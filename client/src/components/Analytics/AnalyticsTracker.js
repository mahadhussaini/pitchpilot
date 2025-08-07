import React, { useEffect, useRef } from 'react';
import axios from 'axios';

const AnalyticsTracker = ({ deckId, sessionId, viewerId, viewerType = 'anonymous' }) => {
  const startTime = useRef(Date.now());
  const slideViews = useRef([]);
  const interactions = useRef([]);
  const isTracking = useRef(false);

  // Generate session ID if not provided
  const sessionIdRef = useRef(sessionId || `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`);

  // Track slide view
  const trackSlideView = (slideIndex, timeSpent = 0) => {
    const existingSlide = slideViews.current.find(s => s.slideIndex === slideIndex);
    
    if (existingSlide) {
      existingSlide.timeSpent += timeSpent;
    } else {
      slideViews.current.push({
        slideIndex,
        timeSpent,
        interactions: []
      });
    }
  };

  // Track interaction
  const trackInteraction = (slideIndex, type, element) => {
    const slide = slideViews.current.find(s => s.slideIndex === slideIndex);
    if (slide) {
      slide.interactions.push({
        type,
        timestamp: new Date(),
        element
      });
    }

    interactions.current.push({
      slideIndex,
      type,
      timestamp: new Date(),
      element
    });
  };

  // Send analytics data
  const sendAnalytics = async () => {
    if (!isTracking.current) return;

    const duration = Math.floor((Date.now() - startTime.current) / 1000);
    
    try {
      await axios.post('/api/analytics/track', {
        deckId,
        sessionId: sessionIdRef.current,
        viewerId,
        viewerType,
        slideViews: slideViews.current,
        duration,
        userAgent: navigator.userAgent,
        referrer: document.referrer
      });
    } catch (error) {
      console.error('Failed to send analytics:', error);
    }
  };

  // Start tracking
  useEffect(() => {
    isTracking.current = true;
    startTime.current = Date.now();

    // Track page visibility changes
    const handleVisibilityChange = () => {
      if (document.hidden) {
        // Page hidden, calculate time spent on current slide
        const currentSlide = slideViews.current[slideViews.current.length - 1];
        if (currentSlide) {
          const timeSpent = Math.floor((Date.now() - startTime.current) / 1000);
          currentSlide.timeSpent += timeSpent;
        }
      } else {
        // Page visible again, reset start time
        startTime.current = Date.now();
      }
    };

    // Track before unload
    const handleBeforeUnload = () => {
      sendAnalytics();
    };

    // Track page focus/blur
    const handleFocus = () => {
      startTime.current = Date.now();
    };

    const handleBlur = () => {
      const currentSlide = slideViews.current[slideViews.current.length - 1];
      if (currentSlide) {
        const timeSpent = Math.floor((Date.now() - startTime.current) / 1000);
        currentSlide.timeSpent += timeSpent;
      }
    };

    // Add event listeners
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('beforeunload', handleBeforeUnload);
    window.addEventListener('focus', handleFocus);
    window.addEventListener('blur', handleBlur);

    // Cleanup
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('blur', handleBlur);
      
      sendAnalytics();
    };
  }, [deckId]);

  // Expose tracking methods
  React.useImperativeHandle(React.useRef(), () => ({
    trackSlideView,
    trackInteraction
  }));

  return null; // This component doesn't render anything
};

export default AnalyticsTracker; 