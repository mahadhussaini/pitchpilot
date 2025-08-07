import React from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';

const FindMatchesModal = ({ isOpen, onClose, onSubmit, criteria, setCriteria }) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(criteria);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75" onClick={onClose} />
        
        <div className="relative w-full max-w-md bg-white rounded-lg shadow-xl">
          <div className="flex items-center justify-between p-6 border-b">
            <h2 className="text-xl font-semibold">Find Matching Investors</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Stage</label>
              <select
                value={criteria.stage}
                onChange={(e) => setCriteria({ ...criteria, stage: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500"
              >
                <option value="">Any stage</option>
                <option value="idea">Idea</option>
                <option value="pre-seed">Pre-seed</option>
                <option value="seed">Seed</option>
                <option value="series-a">Series A</option>
                <option value="series-b">Series B</option>
                <option value="series-c">Series C</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Sector</label>
              <input
                type="text"
                value={criteria.sector}
                onChange={(e) => setCriteria({ ...criteria, sector: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500"
                placeholder="e.g., SaaS, Fintech"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Geography</label>
              <input
                type="text"
                value={criteria.geography}
                onChange={(e) => setCriteria({ ...criteria, geography: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500"
                placeholder="e.g., San Francisco, NYC"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Funding Amount ($)</label>
              <input
                type="number"
                value={criteria.fundingAmount}
                onChange={(e) => setCriteria({ ...criteria, fundingAmount: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500"
                placeholder="e.g., 500000"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Investor Type</label>
              <select
                value={criteria.investorType}
                onChange={(e) => setCriteria({ ...criteria, investorType: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500"
              >
                <option value="">Any type</option>
                <option value="vc">Venture Capital</option>
                <option value="angel">Angel Investor</option>
                <option value="accelerator">Accelerator</option>
                <option value="corporate">Corporate VC</option>
                <option value="family_office">Family Office</option>
              </select>
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm font-medium text-white bg-primary-600 border border-transparent rounded-md hover:bg-primary-700"
              >
                Find Matches
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default FindMatchesModal; 