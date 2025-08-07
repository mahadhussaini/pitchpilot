import React, { useState, useRef, useEffect } from 'react';
import { 
  XMarkIcon, 
  ChevronLeftIcon, 
  ChevronRightIcon,
  PlayIcon,
  PauseIcon
} from '@heroicons/react/24/outline';
import AnalyticsTracker from '../../../components/Analytics/AnalyticsTracker';

const DeckPreview = ({ deck, isOpen, onClose }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPresenting, setIsPresenting] = useState(false);
  const analyticsRef = useRef(null);
  const slideStartTime = useRef(Date.now());

  const nextSlide = () => {
    if (currentSlide < deck.slides.length - 1) {
      // Track time spent on current slide
      if (analyticsRef.current) {
        const timeSpent = Math.floor((Date.now() - slideStartTime.current) / 1000);
        analyticsRef.current.trackSlideView(currentSlide, timeSpent);
      }
      
      setCurrentSlide(currentSlide + 1);
      slideStartTime.current = Date.now();
    }
  };

  const prevSlide = () => {
    if (currentSlide > 0) {
      // Track time spent on current slide
      if (analyticsRef.current) {
        const timeSpent = Math.floor((Date.now() - slideStartTime.current) / 1000);
        analyticsRef.current.trackSlideView(currentSlide, timeSpent);
      }
      
      setCurrentSlide(currentSlide - 1);
      slideStartTime.current = Date.now();
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'ArrowRight' || e.key === ' ') {
      e.preventDefault();
      nextSlide();
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      prevSlide();
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  // Track slide view when component mounts or slide changes
  useEffect(() => {
    if (analyticsRef.current) {
      analyticsRef.current.trackSlideView(currentSlide, 0);
    }
    slideStartTime.current = Date.now();
  }, [currentSlide]);

  const renderSlide = (slide) => {
    const { content } = slide;
    
    return (
      <div className="h-full flex flex-col justify-center items-center text-center p-8">
        {/* Slide Title */}
        <h1 className="text-4xl font-bold text-gray-900 mb-8">
          {slide.title}
        </h1>

        {/* Headline */}
        {content.headline && (
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">
            {content.headline}
          </h2>
        )}

        {/* Key Points */}
        {content.keyPoints && content.keyPoints.length > 0 && (
          <div className="mb-8">
            <ul className="space-y-3 text-left max-w-2xl">
              {content.keyPoints.map((point, index) => (
                <li key={index} className="flex items-start space-x-3">
                  <span className="text-blue-600 font-bold text-lg">•</span>
                  <span className="text-lg text-gray-700">{point}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Visual Description */}
        {content.visualDescription && (
          <div className="mb-6 p-4 bg-gray-100 rounded-lg max-w-2xl">
            <p className="text-sm text-gray-600 italic">
              Visual: {content.visualDescription}
            </p>
          </div>
        )}

        {/* Call to Action */}
        {content.callToAction && (
          <div className="mt-auto">
            <p className="text-xl font-medium text-blue-600">
              {content.callToAction}
            </p>
          </div>
        )}
      </div>
    );
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
      onKeyDown={handleKeyPress}
      tabIndex={0}
    >
      {/* Analytics Tracker */}
      <AnalyticsTracker
        ref={analyticsRef}
        deckId={deck.id}
        viewerId="preview-user"
        viewerType="user"
      />
      <div className="relative w-full h-full max-w-6xl max-h-[90vh] bg-white rounded-lg shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="absolute top-0 left-0 right-0 z-10 bg-white bg-opacity-95 backdrop-blur-sm border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">
                  {deck.title}
                </h2>
                <p className="text-sm text-gray-500">
                  Slide {currentSlide + 1} of {deck.slides.length}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => setIsPresenting(!isPresenting)}
                className="btn-secondary flex items-center text-sm"
              >
                {isPresenting ? (
                  <>
                    <PauseIcon className="w-4 h-4 mr-2" />
                    Pause
                  </>
                ) : (
                  <>
                    <PlayIcon className="w-4 h-4 mr-2" />
                    Present
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Slide Navigation */}
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-10">
          <div className="flex items-center space-x-4 bg-white bg-opacity-95 backdrop-blur-sm rounded-full px-4 py-2 shadow-lg">
            <button
              onClick={prevSlide}
              disabled={currentSlide === 0}
              className="p-2 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeftIcon className="w-5 h-5" />
            </button>
            
            <span className="text-sm text-gray-600 font-medium">
              {currentSlide + 1} / {deck.slides.length}
            </span>
            
            <button
              onClick={nextSlide}
              disabled={currentSlide === deck.slides.length - 1}
              className="p-2 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronRightIcon className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Slide Content */}
        <div className="h-full pt-20 pb-24">
          {deck.slides.length > 0 ? (
            renderSlide(deck.slides[currentSlide])
          ) : (
            <div className="h-full flex items-center justify-center">
              <div className="text-center">
                <h3 className="text-xl font-medium text-gray-900 mb-2">No slides to preview</h3>
                <p className="text-gray-500">Add some slides to your deck first</p>
              </div>
            </div>
          )}
        </div>

        {/* Slide Thumbnails */}
        <div className="absolute bottom-0 left-0 right-0 bg-white bg-opacity-95 backdrop-blur-sm border-t border-gray-200 p-4">
          <div className="flex space-x-2 overflow-x-auto">
            {deck.slides.map((slide, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`flex-shrink-0 w-16 h-12 rounded border-2 text-xs font-medium flex items-center justify-center transition-colors ${
                  currentSlide === index
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-200 bg-gray-50 text-gray-600 hover:border-gray-300'
                }`}
              >
                {index + 1}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeckPreview; 