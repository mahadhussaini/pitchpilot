import React, { useState } from 'react';
import { XMarkIcon, UserGroupIcon } from '@heroicons/react/24/outline';
import axios from 'axios';
import toast from 'react-hot-toast';

const InvestorInteractionModal = ({ isOpen, onClose, deckId, onInteractionAdded }) => {
  const [formData, setFormData] = useState({
    investorId: '',
    investorName: '',
    investorType: 'vc',
    interactionType: 'view',
    interestLevel: 'unknown',
    notes: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await axios.post('/api/analytics/investor-interaction', {
        deckId,
        ...formData
      });

      toast.success('Investor interaction recorded successfully');
      onInteractionAdded(response.data.interaction);
      onClose();
      
      // Reset form
      setFormData({
        investorId: '',
        investorName: '',
        investorType: 'vc',
        interactionType: 'view',
        interestLevel: 'unknown',
        notes: ''
      });
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to record interaction');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <UserGroupIcon className="w-6 h-6 text-blue-600" />
            <h2 className="text-xl font-semibold text-gray-900">Record Investor Interaction</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Investor ID *
            </label>
            <input
              type="text"
              value={formData.investorId}
              onChange={(e) => handleInputChange('investorId', e.target.value)}
              className="input-field"
              placeholder="e.g., investor@firm.com or LinkedIn ID"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Investor Name
            </label>
            <input
              type="text"
              value={formData.investorName}
              onChange={(e) => handleInputChange('investorName', e.target.value)}
              className="input-field"
              placeholder="Full name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Investor Type *
            </label>
            <select
              value={formData.investorType}
              onChange={(e) => handleInputChange('investorType', e.target.value)}
              className="input-field"
              required
            >
              <option value="vc">VC</option>
              <option value="angel">Angel Investor</option>
              <option value="accelerator">Accelerator</option>
              <option value="corporate">Corporate</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Interaction Type *
            </label>
            <select
              value={formData.interactionType}
              onChange={(e) => handleInputChange('interactionType', e.target.value)}
              className="input-field"
              required
            >
              <option value="view">Viewed Deck</option>
              <option value="download">Downloaded Deck</option>
              <option value="share">Shared Deck</option>
              <option value="contact">Contacted</option>
              <option value="follow_up">Follow-up</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Interest Level
            </label>
            <select
              value={formData.interestLevel}
              onChange={(e) => handleInputChange('interestLevel', e.target.value)}
              className="input-field"
            >
              <option value="unknown">Unknown</option>
              <option value="high">High Interest</option>
              <option value="medium">Medium Interest</option>
              <option value="low">Low Interest</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Notes
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => handleInputChange('notes', e.target.value)}
              rows={3}
              className="input-field"
              placeholder="Additional notes about this interaction..."
            />
          </div>

          {/* Submit Button */}
          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary"
            >
              {isSubmitting ? 'Recording...' : 'Record Interaction'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default InvestorInteractionModal; 