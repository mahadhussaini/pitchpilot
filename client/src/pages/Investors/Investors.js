import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import axios from 'axios';
import {
  UserGroupIcon,
  MagnifyingGlassIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  SparklesIcon,
  ChartBarIcon,
  GlobeAltIcon,
  CurrencyDollarIcon
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';
import AddInvestorModal from '../../components/Investors/AddInvestorModal';
import FindMatchesModal from '../../components/Investors/FindMatchesModal';
import InvestorDetailsModal from '../../components/Investors/InvestorDetailsModal';

const Investors = () => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showMatchModal, setShowMatchModal] = useState(false);
  const [selectedInvestor, setSelectedInvestor] = useState(null);
  const [matchCriteria, setMatchCriteria] = useState({
    stage: '',
    sector: '',
    geography: '',
    fundingAmount: '',
    investorType: ''
  });

  const queryClient = useQueryClient();

  // Fetch investors
  const { data: investors, isLoading } = useQuery(
    ['investors'],
    async () => {
      const response = await axios.get('/api/investors');
      return response.data;
    }
  );

  // Fetch investor templates
  const { data: templates } = useQuery(
    ['investor-templates'],
    async () => {
      const response = await axios.get('/api/investors/templates');
      return response.data;
    }
  );

  // Create investor mutation
  const createInvestor = useMutation(
    async (investorData) => {
      const response = await axios.post('/api/investors', investorData);
      return response.data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['investors']);
        toast.success('Investor profile created successfully');
        setShowAddModal(false);
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || 'Failed to create investor');
      }
    }
  );

  // Delete investor mutation
  const deleteInvestor = useMutation(
    async (investorId) => {
      await axios.delete(`/api/investors/${investorId}`);
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['investors']);
        toast.success('Investor profile deleted successfully');
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || 'Failed to delete investor');
      }
    }
  );

  // Find matching investors
  const findMatches = useMutation(
    async (criteria) => {
      const response = await axios.post('/api/investors/match', criteria);
      return response.data;
    },
    {
      onSuccess: (data) => {
        setSelectedInvestor(data[0]); // Show first match
        setShowMatchModal(false);
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || 'Failed to find matches');
      }
    }
  );

  const handleCreateInvestor = (formData) => {
    createInvestor.mutate(formData);
  };

  const handleDeleteInvestor = (investorId) => {
    if (window.confirm('Are you sure you want to delete this investor profile?')) {
      deleteInvestor.mutate(investorId);
    }
  };

  const handleFindMatches = () => {
    const criteria = {};
    Object.keys(matchCriteria).forEach(key => {
      if (matchCriteria[key]) {
        criteria[key] = matchCriteria[key];
      }
    });
    findMatches.mutate(criteria);
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

  const getMatchScoreColor = (score) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="spinner h-8 w-8"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Investor Personas</h1>
          <p className="text-gray-600">Manage investor profiles and find perfect matches</p>
        </div>
        <div className="mt-4 sm:mt-0 flex space-x-3">
          <button
            onClick={() => setShowMatchModal(true)}
            className="btn-secondary flex items-center"
          >
            <MagnifyingGlassIcon className="w-4 h-4 mr-2" />
            Find Matches
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="btn-primary flex items-center"
          >
            <PlusIcon className="w-4 h-4 mr-2" />
            Add Investor
          </button>
        </div>
      </div>

      {/* Investor Profiles */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {investors?.map((investor) => (
          <div key={investor._id} className="card">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <UserGroupIcon className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{investor.name}</h3>
                  <p className="text-sm text-gray-500">{investor.firm}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setSelectedInvestor(investor)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <EyeIcon className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDeleteInvestor(investor._id)}
                  className="text-red-400 hover:text-red-600"
                >
                  <TrashIcon className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Type</span>
                <span className={`px-2 py-1 text-xs rounded-full ${getInvestorTypeColor(investor.type)}`}>
                  {investor.type.toUpperCase()}
                </span>
              </div>

              {investor.investmentCriteria?.preferredStages?.length > 0 && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Stages</span>
                  <span className="text-sm text-gray-900">
                    {investor.investmentCriteria.preferredStages.join(', ')}
                  </span>
                </div>
              )}

              {investor.investmentCriteria?.preferredSectors?.length > 0 && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Sectors</span>
                  <span className="text-sm text-gray-900">
                    {investor.investmentCriteria.preferredSectors.slice(0, 2).join(', ')}
                    {investor.investmentCriteria.preferredSectors.length > 2 && '...'}
                  </span>
                </div>
              )}

              {investor.location?.city && (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Location</span>
                  <span className="text-sm text-gray-900">
                    {investor.location.city}, {investor.location.country}
                  </span>
                </div>
              )}

              {investor.tags?.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {investor.tags.slice(0, 3).map((tag, index) => (
                    <span key={index} className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded">
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Investor Templates */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Investor Templates</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {templates?.map((template) => (
            <div key={template.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-gray-900">{template.name}</h4>
                <span className={`px-2 py-1 text-xs rounded-full ${getInvestorTypeColor(template.type)}`}>
                  {template.type.toUpperCase()}
                </span>
              </div>
              <p className="text-sm text-gray-600 mb-3">{template.description}</p>
              
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-gray-500">Investment Range</span>
                  <span className="text-gray-900">
                    ${template.investmentCriteria.minInvestment?.toLocaleString()} - ${template.investmentCriteria.maxInvestment?.toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-500">Focus Areas</span>
                  <span className="text-gray-900">
                    {template.communicationPreferences.keyFocusAreas?.join(', ')}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modals */}
      <AddInvestorModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSubmit={handleCreateInvestor}
        templates={templates}
      />

      <FindMatchesModal
        isOpen={showMatchModal}
        onClose={() => setShowMatchModal(false)}
        onSubmit={handleFindMatches}
        criteria={matchCriteria}
        setCriteria={setMatchCriteria}
      />

      <InvestorDetailsModal
        investor={selectedInvestor}
        isOpen={!!selectedInvestor}
        onClose={() => setSelectedInvestor(null)}
      />
    </div>
  );
};

export default Investors; 