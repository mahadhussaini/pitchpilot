import React, { useState } from 'react';
import { 
  SparklesIcon, 
  LightBulbIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';

const SlideEditor = ({ slide, slideIndex, onUpdate, onAnalyze }) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const handleContentUpdate = (field, value) => {
    const updatedSlide = {
      ...slide,
      content: {
        ...slide.content,
        [field]: value
      }
    };
    onUpdate(slideIndex, updatedSlide);
  };

  const handleKeyPointsUpdate = (index, value) => {
    const updatedKeyPoints = [...(slide.content.keyPoints || [])];
    updatedKeyPoints[index] = value;
    handleContentUpdate('keyPoints', updatedKeyPoints);
  };

  const addKeyPoint = () => {
    const updatedKeyPoints = [...(slide.content.keyPoints || []), ''];
    handleContentUpdate('keyPoints', updatedKeyPoints);
  };

  const removeKeyPoint = (index) => {
    const updatedKeyPoints = (slide.content.keyPoints || []).filter((_, i) => i !== index);
    handleContentUpdate('keyPoints', updatedKeyPoints);
  };

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    try {
      await onAnalyze(slideIndex);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getFeedbackColor = (score) => {
    if (score >= 8) return 'text-green-600';
    if (score >= 6) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getFeedbackIcon = (score) => {
    if (score >= 8) return <CheckCircleIcon className="w-4 h-4" />;
    if (score >= 6) return <ExclamationTriangleIcon className="w-4 h-4" />;
    return <ExclamationTriangleIcon className="w-4 h-4" />;
  };

  return (
    <div className="space-y-6">
      {/* Slide Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">{slide.title}</h2>
          <p className="text-sm text-gray-500 capitalize">{slide.type} slide</p>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowSuggestions(!showSuggestions)}
            className="btn-secondary flex items-center text-sm"
          >
            <LightBulbIcon className="w-4 h-4 mr-2" />
            Suggestions
          </button>
          
          <button
            onClick={handleAnalyze}
            disabled={isAnalyzing}
            className="btn-primary flex items-center text-sm"
          >
            <SparklesIcon className="w-4 h-4 mr-2" />
            {isAnalyzing ? 'Analyzing...' : 'Analyze'}
          </button>
        </div>
      </div>

      {/* AI Feedback */}
      {slide.aiFeedback && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="text-sm font-medium text-blue-900 mb-3">AI Feedback</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center space-x-2">
              <span className="text-sm text-blue-700">Clarity:</span>
              <div className={`flex items-center space-x-1 ${getFeedbackColor(slide.aiFeedback.clarity)}`}>
                {getFeedbackIcon(slide.aiFeedback.clarity)}
                <span className="text-sm font-medium">{slide.aiFeedback.clarity}/10</span>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-blue-700">Persuasiveness:</span>
              <div className={`flex items-center space-x-1 ${getFeedbackColor(slide.aiFeedback.persuasiveness)}`}>
                {getFeedbackIcon(slide.aiFeedback.persuasiveness)}
                <span className="text-sm font-medium">{slide.aiFeedback.persuasiveness}/10</span>
              </div>
            </div>
          </div>
          {slide.aiFeedback.suggestions && slide.aiFeedback.suggestions.length > 0 && (
            <div className="mt-3">
              <p className="text-sm text-blue-700 mb-2">Suggestions:</p>
              <ul className="space-y-1">
                {slide.aiFeedback.suggestions.map((suggestion, index) => (
                  <li key={index} className="text-sm text-blue-800 flex items-start space-x-2">
                    <span className="text-blue-600 mt-0.5">•</span>
                    <span>{suggestion}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Content Editor */}
      <div className="space-y-6">
        {/* Headline */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Headline *
          </label>
          <input
            type="text"
            value={slide.content.headline || ''}
            onChange={(e) => handleContentUpdate('headline', e.target.value)}
            className="input-field text-lg font-semibold"
            placeholder="Enter slide headline..."
          />
        </div>

        {/* Key Points */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Key Points
          </label>
          <div className="space-y-2">
            {(slide.content.keyPoints || []).map((point, index) => (
              <div key={index} className="flex items-center space-x-2">
                <input
                  type="text"
                  value={point}
                  onChange={(e) => handleKeyPointsUpdate(index, e.target.value)}
                  className="input-field flex-1"
                  placeholder={`Key point ${index + 1}...`}
                />
                <button
                  type="button"
                  onClick={() => removeKeyPoint(index)}
                  className="text-red-500 hover:text-red-700 p-1"
                >
                  ×
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={addKeyPoint}
              className="btn-secondary text-sm"
            >
              + Add Key Point
            </button>
          </div>
        </div>

        {/* Visual Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Visual Description
          </label>
          <textarea
            value={slide.content.visualDescription || ''}
            onChange={(e) => handleContentUpdate('visualDescription', e.target.value)}
            rows={3}
            className="input-field"
            placeholder="Describe the visual elements for this slide (charts, images, diagrams)..."
          />
        </div>

        {/* Call to Action */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Call to Action
          </label>
          <input
            type="text"
            value={slide.content.callToAction || ''}
            onChange={(e) => handleContentUpdate('callToAction', e.target.value)}
            className="input-field"
            placeholder="What should the audience do next?"
          />
        </div>
      </div>

      {/* AI Suggestions Panel */}
      {showSuggestions && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h3 className="text-sm font-medium text-yellow-900 mb-3">AI Suggestions</h3>
          <div className="space-y-2">
            <p className="text-sm text-yellow-800">
              • Keep your headline concise and impactful
            </p>
            <p className="text-sm text-yellow-800">
              • Use specific numbers and metrics when possible
            </p>
            <p className="text-sm text-yellow-800">
              • Limit key points to 3-5 for better retention
            </p>
            <p className="text-sm text-yellow-800">
              • Include visual elements to support your message
            </p>
            <p className="text-sm text-yellow-800">
              • Make your call to action clear and actionable
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default SlideEditor; 