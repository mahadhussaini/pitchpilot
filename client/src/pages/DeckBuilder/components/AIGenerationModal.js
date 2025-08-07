import React, { useState } from 'react';
import { XMarkIcon, SparklesIcon } from '@heroicons/react/24/outline';

const AIGenerationModal = ({ isOpen, onClose, onSubmit, existingStartupInfo = {} }) => {
  const [startupInfo, setStartupInfo] = useState({
    name: existingStartupInfo.name || '',
    industry: existingStartupInfo.industry || '',
    stage: existingStartupInfo.stage || 'idea',
    fundingGoal: existingStartupInfo.fundingGoal || '',
    currentFunding: existingStartupInfo.currentFunding || 0,
    teamSize: existingStartupInfo.teamSize || '',
    foundedYear: existingStartupInfo.foundedYear || new Date().getFullYear(),
    problem: existingStartupInfo.problem || '',
    solution: existingStartupInfo.solution || '',
    marketSize: existingStartupInfo.marketSize || '',
    traction: existingStartupInfo.traction || '',
    competitors: existingStartupInfo.competitors || [],
    businessModel: existingStartupInfo.businessModel || '',
    financials: {
      revenue: existingStartupInfo.financials?.revenue || 0,
      growth: existingStartupInfo.financials?.growth || 0,
      burnRate: existingStartupInfo.financials?.burnRate || 0,
      runway: existingStartupInfo.financials?.runway || 0
    }
  });

  const [targetInvestors, setTargetInvestors] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [competitor, setCompetitor] = useState('');

  const handleInputChange = (field, value) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setStartupInfo(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setStartupInfo(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const addCompetitor = () => {
    if (competitor.trim() && !startupInfo.competitors.includes(competitor.trim())) {
      setStartupInfo(prev => ({
        ...prev,
        competitors: [...prev.competitors, competitor.trim()]
      }));
      setCompetitor('');
    }
  };

  const removeCompetitor = (index) => {
    setStartupInfo(prev => ({
      ...prev,
      competitors: prev.competitors.filter((_, i) => i !== index)
    }));
  };

  const addTargetInvestor = () => {
    const newInvestor = {
      type: 'vc',
      focus: [],
      stage: [],
      location: ''
    };
    setTargetInvestors(prev => [...prev, newInvestor]);
  };

  const updateTargetInvestor = (index, field, value) => {
    setTargetInvestors(prev => prev.map((investor, i) => 
      i === index ? { ...investor, [field]: value } : investor
    ));
  };

  const removeTargetInvestor = (index) => {
    setTargetInvestors(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsGenerating(true);
    
    try {
      await onSubmit(startupInfo, targetInvestors);
    } catch (error) {
      console.error('Generation failed:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto m-4">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <SparklesIcon className="w-6 h-6 text-blue-600" />
            <h2 className="text-xl font-semibold text-gray-900">Generate AI-Powered Deck</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Startup Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Startup Name *
                </label>
                <input
                  type="text"
                  value={startupInfo.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className="input-field"
                  placeholder="Your startup name"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Industry *
                </label>
                <input
                  type="text"
                  value={startupInfo.industry}
                  onChange={(e) => handleInputChange('industry', e.target.value)}
                  className="input-field"
                  placeholder="e.g., Fintech, SaaS, Healthcare"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Stage *
                </label>
                <select
                  value={startupInfo.stage}
                  onChange={(e) => handleInputChange('stage', e.target.value)}
                  className="input-field"
                  required
                >
                  <option value="idea">Idea Stage</option>
                  <option value="pre-seed">Pre-Seed</option>
                  <option value="seed">Seed</option>
                  <option value="series-a">Series A</option>
                  <option value="series-b">Series B</option>
                  <option value="series-c">Series C</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Funding Goal ($)
                </label>
                <input
                  type="number"
                  value={startupInfo.fundingGoal}
                  onChange={(e) => handleInputChange('fundingGoal', e.target.value)}
                  className="input-field"
                  placeholder="e.g., 1000000"
                />
              </div>
            </div>
          </div>

          {/* Problem & Solution */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Problem & Solution</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Problem Statement *
                </label>
                <textarea
                  value={startupInfo.problem}
                  onChange={(e) => handleInputChange('problem', e.target.value)}
                  rows={3}
                  className="input-field"
                  placeholder="Describe the problem you're solving..."
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Solution *
                </label>
                <textarea
                  value={startupInfo.solution}
                  onChange={(e) => handleInputChange('solution', e.target.value)}
                  rows={3}
                  className="input-field"
                  placeholder="Describe your solution..."
                  required
                />
              </div>
            </div>
          </div>

          {/* Market & Traction */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Market & Traction</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Market Size
                </label>
                <input
                  type="text"
                  value={startupInfo.marketSize}
                  onChange={(e) => handleInputChange('marketSize', e.target.value)}
                  className="input-field"
                  placeholder="e.g., $50B TAM, 100M users"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Business Model
                </label>
                <input
                  type="text"
                  value={startupInfo.businessModel}
                  onChange={(e) => handleInputChange('businessModel', e.target.value)}
                  className="input-field"
                  placeholder="e.g., SaaS subscription, Marketplace fees"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Traction
              </label>
              <textarea
                value={startupInfo.traction}
                onChange={(e) => handleInputChange('traction', e.target.value)}
                rows={3}
                className="input-field"
                placeholder="Describe your traction, metrics, and achievements..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Competitors
              </label>
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={competitor}
                  onChange={(e) => setCompetitor(e.target.value)}
                  className="input-field flex-1"
                  placeholder="Add competitor name"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addCompetitor())}
                />
                <button
                  type="button"
                  onClick={addCompetitor}
                  className="btn-secondary"
                >
                  Add
                </button>
              </div>
              {startupInfo.competitors.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {startupInfo.competitors.map((comp, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                    >
                      {comp}
                      <button
                        type="button"
                        onClick={() => removeCompetitor(index)}
                        className="ml-1 text-blue-600 hover:text-blue-800"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Target Investors */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900">Target Investors (Optional)</h3>
              <button
                type="button"
                onClick={addTargetInvestor}
                className="btn-secondary text-sm"
              >
                + Add Investor
              </button>
            </div>
            
            {targetInvestors.map((investor, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-gray-900">Investor {index + 1}</h4>
                  <button
                    type="button"
                    onClick={() => removeTargetInvestor(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    Remove
                  </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Type
                    </label>
                    <select
                      value={investor.type}
                      onChange={(e) => updateTargetInvestor(index, 'type', e.target.value)}
                      className="input-field"
                    >
                      <option value="vc">VC</option>
                      <option value="angel">Angel</option>
                      <option value="accelerator">Accelerator</option>
                      <option value="corporate">Corporate</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Location
                    </label>
                    <input
                      type="text"
                      value={investor.location}
                      onChange={(e) => updateTargetInvestor(index, 'location', e.target.value)}
                      className="input-field"
                      placeholder="e.g., San Francisco, NYC"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Submit Button */}
          <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isGenerating}
              className="btn-primary flex items-center"
            >
              <SparklesIcon className="w-4 h-4 mr-2" />
              {isGenerating ? 'Generating...' : 'Generate Deck'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AIGenerationModal; 