import React, { useState } from 'react';
import { useQuery, useMutation } from 'react-query';
import axios from 'axios';
import {
  UserGroupIcon,
  SparklesIcon,
  EyeIcon,
  ChartBarIcon,
  GlobeAltIcon
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

const InvestorCustomization = ({ deckId, onCustomizationApplied }) => {
  const [selectedInvestor, setSelectedInvestor] = useState(null);
  const [customizationType, setCustomizationType] = useState('full');

  // Fetch user's investors
  const { data: investors, isLoading } = useQuery(
    ['investors'],
    async () => {
      const response = await axios.get('/api/investors');
      return response.data;
    }
  );

  // Customize deck mutation
  const customizeDeck = useMutation(
    async ({ investorId, customizationType }) => {
      const response = await axios.post(`/api/investors/${investorId}/customize-deck`, {
        deckId,
        customizationType
      });
      return response.data;
    },
    {
      onSuccess: (data) => {
        toast.success('Deck customized successfully for investor');
        onCustomizationApplied(data.customizedContent);
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || 'Failed to customize deck');
      }
    }
  );

  const handleCustomize = () => {
    if (!selectedInvestor) {
      toast.error('Please select an investor');
      return;
    }
    customizeDeck.mutate({ investorId: selectedInvestor, customizationType });
  };

  const getInvestorTypeColor = (type) => {
    switch (type) {
      case 'vc': return 'bg-blue-100 text-blue-800';
      case 'angel': return 'bg-green-100 text-green-800';
      case 'accelerator': return 'bg-purple-100 text-purple-800';
      case 'corporate': return 'bg-orange-100 text-orange-800';
      case 'family_office': return 'bg-indigo-100 text-indigo-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-32">
        <div className="spinner h-6 w-6"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2 mb-4">
        <UserGroupIcon className="w-5 h-5 text-blue-600" />
        <h3 className="text-lg font-semibold text-gray-900">Investor Customization</h3>
      </div>

      {/* Investor Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Select Investor Profile
        </label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {investors?.map((investor) => (
            <div
              key={investor._id}
              className={`border rounded-lg p-3 cursor-pointer transition-colors ${
                selectedInvestor === investor._id
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => setSelectedInvestor(investor._id)}
            >
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-gray-900">{investor.name}</h4>
                <span className={`px-2 py-1 text-xs rounded-full ${getInvestorTypeColor(investor.type)}`}>
                  {investor.type.toUpperCase()}
                </span>
              </div>
              <p className="text-sm text-gray-600">{investor.firm}</p>
              {investor.investmentCriteria?.preferredSectors?.length > 0 && (
                <p className="text-xs text-gray-500 mt-1">
                  Focus: {investor.investmentCriteria.preferredSectors.slice(0, 2).join(', ')}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Customization Type */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Customization Type
        </label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div
            className={`border rounded-lg p-3 cursor-pointer transition-colors ${
              customizationType === 'tone'
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
            onClick={() => setCustomizationType('tone')}
          >
            <div className="flex items-center space-x-2">
              <SparklesIcon className="w-4 h-4 text-blue-600" />
              <span className="font-medium">Tone & Style</span>
            </div>
            <p className="text-xs text-gray-600 mt-1">Adjust communication style and tone</p>
          </div>

          <div
            className={`border rounded-lg p-3 cursor-pointer transition-colors ${
              customizationType === 'content'
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
            onClick={() => setCustomizationType('content')}
          >
            <div className="flex items-center space-x-2">
              <ChartBarIcon className="w-4 h-4 text-green-600" />
              <span className="font-medium">Content Focus</span>
            </div>
            <p className="text-xs text-gray-600 mt-1">Emphasize specific content areas</p>
          </div>

          <div
            className={`border rounded-lg p-3 cursor-pointer transition-colors ${
              customizationType === 'focus_areas'
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
            onClick={() => setCustomizationType('focus_areas')}
          >
            <div className="flex items-center space-x-2">
              <EyeIcon className="w-4 h-4 text-purple-600" />
              <span className="font-medium">Focus Areas</span>
            </div>
            <p className="text-xs text-gray-600 mt-1">Highlight key focus areas for this investor</p>
          </div>

          <div
            className={`border rounded-lg p-3 cursor-pointer transition-colors ${
              customizationType === 'full'
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
            onClick={() => setCustomizationType('full')}
          >
            <div className="flex items-center space-x-2">
              <GlobeAltIcon className="w-4 h-4 text-orange-600" />
              <span className="font-medium">Full Customization</span>
            </div>
            <p className="text-xs text-gray-600 mt-1">Complete deck customization</p>
          </div>
        </div>
      </div>

      {/* Customization Button */}
      <div className="flex justify-end">
        <button
          onClick={handleCustomize}
          disabled={!selectedInvestor || customizeDeck.isLoading}
          className="btn-primary flex items-center"
        >
          <SparklesIcon className="w-4 h-4 mr-2" />
          {customizeDeck.isLoading ? 'Customizing...' : 'Customize for Investor'}
        </button>
      </div>

      {/* Investor Insights */}
      {selectedInvestor && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-medium text-blue-900 mb-2">Investor Insights</h4>
          <div className="space-y-2 text-sm">
            {investors?.find(inv => inv._id === selectedInvestor)?.communicationPreferences?.keyFocusAreas?.length > 0 && (
              <p className="text-blue-800">
                <span className="font-medium">Key Focus Areas:</span>{' '}
                {investors.find(inv => inv._id === selectedInvestor).communicationPreferences.keyFocusAreas.join(', ')}
              </p>
            )}
            {investors?.find(inv => inv._id === selectedInvestor)?.communicationPreferences?.preferredLength && (
              <p className="text-blue-800">
                <span className="font-medium">Preferred Format:</span>{' '}
                {investors.find(inv => inv._id === selectedInvestor).communicationPreferences.preferredLength}
              </p>
            )}
            {investors?.find(inv => inv._id === selectedInvestor)?.investmentCriteria?.preferredSectors?.length > 0 && (
              <p className="text-blue-800">
                <span className="font-medium">Sectors of Interest:</span>{' '}
                {investors.find(inv => inv._id === selectedInvestor).investmentCriteria.preferredSectors.join(', ')}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default InvestorCustomization; 