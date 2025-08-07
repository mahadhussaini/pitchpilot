import React from 'react';
import { XMarkIcon, GlobeAltIcon, EnvelopeIcon, BuildingOfficeIcon } from '@heroicons/react/24/outline';

const InvestorDetailsModal = ({ investor, isOpen, onClose }) => {
  if (!isOpen || !investor) return null;

  const getInvestorTypeColor = (type) => {
    const colors = {
      vc: 'bg-blue-100 text-blue-800',
      angel: 'bg-green-100 text-green-800',
      accelerator: 'bg-purple-100 text-purple-800',
      corporate: 'bg-orange-100 text-orange-800',
      family_office: 'bg-gray-100 text-gray-800'
    };
    return colors[type] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75" onClick={onClose} />
        
        <div className="relative w-full max-w-2xl bg-white rounded-lg shadow-xl">
          <div className="flex items-center justify-between p-6 border-b">
            <h2 className="text-xl font-semibold">Investor Details</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>

          <div className="p-6 space-y-6">
            {/* Basic Info */}
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{investor.name}</h3>
                {investor.firm && (
                  <p className="text-sm text-gray-600 mt-1">{investor.firm}</p>
                )}
                {investor.title && (
                  <p className="text-sm text-gray-600">{investor.title}</p>
                )}
              </div>
              <span className={`px-3 py-1 text-xs font-medium rounded-full ${getInvestorTypeColor(investor.type)}`}>
                {investor.type.toUpperCase()}
              </span>
            </div>

            {/* Contact Info */}
            <div className="space-y-3">
              <h4 className="text-sm font-medium text-gray-900">Contact Information</h4>
              <div className="space-y-2">
                {investor.email && (
                  <div className="flex items-center text-sm text-gray-600">
                    <EnvelopeIcon className="h-4 w-4 mr-2" />
                    {investor.email}
                  </div>
                )}
                {investor.linkedin && (
                  <div className="flex items-center text-sm text-gray-600">
                    <GlobeAltIcon className="h-4 w-4 mr-2" />
                    <a href={investor.linkedin} target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:text-primary-700">
                      LinkedIn Profile
                    </a>
                  </div>
                )}
                {investor.website && (
                  <div className="flex items-center text-sm text-gray-600">
                    <GlobeAltIcon className="h-4 w-4 mr-2" />
                    <a href={investor.website} target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:text-primary-700">
                      Website
                    </a>
                  </div>
                )}
                {investor.location && (investor.location.city || investor.location.country) && (
                  <div className="flex items-center text-sm text-gray-600">
                    <BuildingOfficeIcon className="h-4 w-4 mr-2" />
                    {[investor.location.city, investor.location.country].filter(Boolean).join(', ')}
                  </div>
                )}
              </div>
            </div>

            {/* Bio */}
            {investor.bio && (
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-2">Bio</h4>
                <p className="text-sm text-gray-600">{investor.bio}</p>
              </div>
            )}

            {/* Investment Criteria */}
            {investor.investmentCriteria && (
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-3">Investment Criteria</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {investor.investmentCriteria.preferredStages && investor.investmentCriteria.preferredStages.length > 0 && (
                    <div>
                      <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Preferred Stages</p>
                      <p className="text-sm text-gray-900 mt-1">
                        {investor.investmentCriteria.preferredStages.map(stage => stage.replace('-', ' ')).join(', ')}
                      </p>
                    </div>
                  )}
                  
                  {investor.investmentCriteria.preferredSectors && investor.investmentCriteria.preferredSectors.length > 0 && (
                    <div>
                      <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Preferred Sectors</p>
                      <p className="text-sm text-gray-900 mt-1">
                        {investor.investmentCriteria.preferredSectors.join(', ')}
                      </p>
                    </div>
                  )}

                  {investor.investmentCriteria.minInvestment && investor.investmentCriteria.maxInvestment && (
                    <div>
                      <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Investment Range</p>
                      <p className="text-sm text-gray-900 mt-1">
                        ${parseInt(investor.investmentCriteria.minInvestment).toLocaleString()} - ${parseInt(investor.investmentCriteria.maxInvestment).toLocaleString()}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Communication Preferences */}
            {investor.communicationPreferences && (
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-3">Communication Preferences</h4>
                <div className="space-y-2">
                  {investor.communicationPreferences.preferredFormat && (
                    <div>
                      <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Preferred Format</p>
                      <p className="text-sm text-gray-900 mt-1 capitalize">
                        {investor.communicationPreferences.preferredFormat.replace('_', ' ')}
                      </p>
                    </div>
                  )}
                  
                  {investor.communicationPreferences.preferredLength && (
                    <div>
                      <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Preferred Length</p>
                      <p className="text-sm text-gray-900 mt-1 capitalize">
                        {investor.communicationPreferences.preferredLength}
                      </p>
                    </div>
                  )}

                  {investor.communicationPreferences.keyFocusAreas && investor.communicationPreferences.keyFocusAreas.length > 0 && (
                    <div>
                      <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Key Focus Areas</p>
                      <p className="text-sm text-gray-900 mt-1">
                        {investor.communicationPreferences.keyFocusAreas.map(area => area.replace('_', ' ')).join(', ')}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Notes */}
            {investor.notes && (
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-2">Notes</h4>
                <p className="text-sm text-gray-600">{investor.notes}</p>
              </div>
            )}

            {/* Tags */}
            {investor.tags && investor.tags.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-2">Tags</h4>
                <div className="flex flex-wrap gap-2">
                  {investor.tags.map((tag, index) => (
                    <span key={index} className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded-full">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvestorDetailsModal; 