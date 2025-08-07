import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';

const StartupInfoForm = ({ onSubmit, existingStartupInfo = {} }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register, handleSubmit, formState: { errors }, watch } = useForm({
    defaultValues: {
      title: '',
      description: '',
      ...existingStartupInfo,
      stage: existingStartupInfo.stage || 'idea',
      teamSize: existingStartupInfo.teamSize || '',
      foundedYear: existingStartupInfo.foundedYear || new Date().getFullYear(),
      fundingGoal: existingStartupInfo.fundingGoal || '',
      currentFunding: existingStartupInfo.currentFunding || 0,
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
    }
  });

  const [competitor, setCompetitor] = useState('');
  const watchedCompetitors = watch('competitors');

  const addCompetitor = () => {
    if (competitor.trim() && !watchedCompetitors.includes(competitor.trim())) {
      const updatedCompetitors = [...watchedCompetitors, competitor.trim()];
      // Update the form value
      const event = { target: { name: 'competitors', value: updatedCompetitors } };
      register('competitors').onChange(event);
    }
    setCompetitor('');
  };

  const removeCompetitor = (index) => {
    const updatedCompetitors = watchedCompetitors.filter((_, i) => i !== index);
    const event = { target: { name: 'competitors', value: updatedCompetitors } };
    register('competitors').onChange(event);
  };

  const handleFormSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      await onSubmit({
        title: data.title,
        description: data.description,
        startupInfo: {
          name: data.name,
          industry: data.industry,
          stage: data.stage,
          fundingGoal: parseFloat(data.fundingGoal) || 0,
          currentFunding: parseFloat(data.currentFunding) || 0,
          teamSize: parseInt(data.teamSize) || 0,
          foundedYear: parseInt(data.foundedYear) || new Date().getFullYear(),
          problem: data.problem,
          solution: data.solution,
          marketSize: data.marketSize,
          traction: data.traction,
          competitors: data.competitors,
          businessModel: data.businessModel,
          financials: {
            revenue: parseFloat(data.financials.revenue) || 0,
            growth: parseFloat(data.financials.growth) || 0,
            burnRate: parseFloat(data.financials.burnRate) || 0,
            runway: parseFloat(data.financials.runway) || 0
          }
        }
      });
    } catch (error) {
      toast.error('Failed to create deck');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      {/* Basic Information */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Deck Title *
            </label>
            <input
              type="text"
              {...register('title', { required: 'Deck title is required' })}
              className="input-field"
              placeholder="e.g., Series A Pitch Deck"
            />
            {errors.title && (
              <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Startup Name *
            </label>
            <input
              type="text"
              {...register('name', { required: 'Startup name is required' })}
              className="input-field"
              placeholder="Your startup name"
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Industry *
            </label>
            <input
              type="text"
              {...register('industry', { required: 'Industry is required' })}
              className="input-field"
              placeholder="e.g., Fintech, SaaS, Healthcare"
            />
            {errors.industry && (
              <p className="text-red-500 text-sm mt-1">{errors.industry.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Stage *
            </label>
            <select
              {...register('stage', { required: 'Stage is required' })}
              className="input-field"
            >
              <option value="idea">Idea Stage</option>
              <option value="pre-seed">Pre-Seed</option>
              <option value="seed">Seed</option>
              <option value="series-a">Series A</option>
              <option value="series-b">Series B</option>
              <option value="series-c">Series C</option>
            </select>
            {errors.stage && (
              <p className="text-red-500 text-sm mt-1">{errors.stage.message}</p>
            )}
          </div>
        </div>

        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            {...register('description')}
            rows={3}
            className="input-field"
            placeholder="Brief description of your pitch deck"
          />
        </div>
      </div>

      {/* Problem & Solution */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Problem & Solution</h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Problem Statement *
            </label>
            <textarea
              {...register('problem', { required: 'Problem statement is required' })}
              rows={4}
              className="input-field"
              placeholder="Describe the problem you're solving..."
            />
            {errors.problem && (
              <p className="text-red-500 text-sm mt-1">{errors.problem.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Solution *
            </label>
            <textarea
              {...register('solution', { required: 'Solution is required' })}
              rows={4}
              className="input-field"
              placeholder="Describe your solution..."
            />
            {errors.solution && (
              <p className="text-red-500 text-sm mt-1">{errors.solution.message}</p>
            )}
          </div>
        </div>
      </div>

      {/* Market & Traction */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Market & Traction</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Market Size
            </label>
            <input
              type="text"
              {...register('marketSize')}
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
              {...register('businessModel')}
              className="input-field"
              placeholder="e.g., SaaS subscription, Marketplace fees"
            />
          </div>
        </div>

        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Traction
          </label>
          <textarea
            {...register('traction')}
            rows={3}
            className="input-field"
            placeholder="Describe your traction, metrics, and achievements..."
          />
        </div>

        <div className="mt-4">
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
          {watchedCompetitors.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-2">
              {watchedCompetitors.map((comp, index) => (
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

      {/* Team & Funding */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Team & Funding</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Team Size
            </label>
            <input
              type="number"
              {...register('teamSize')}
              className="input-field"
              placeholder="Number of employees"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Founded Year
            </label>
            <input
              type="number"
              {...register('foundedYear')}
              className="input-field"
              placeholder="2023"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Funding Goal ($)
            </label>
            <input
              type="number"
              {...register('fundingGoal')}
              className="input-field"
              placeholder="e.g., 1000000"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Current Funding ($)
            </label>
            <input
              type="number"
              {...register('currentFunding')}
              className="input-field"
              placeholder="e.g., 500000"
            />
          </div>
        </div>
      </div>

      {/* Financials */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Financials</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Monthly Revenue ($)
            </label>
            <input
              type="number"
              {...register('financials.revenue')}
              className="input-field"
              placeholder="e.g., 50000"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Growth Rate (%)
            </label>
            <input
              type="number"
              {...register('financials.growth')}
              className="input-field"
              placeholder="e.g., 20"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Monthly Burn Rate ($)
            </label>
            <input
              type="number"
              {...register('financials.burnRate')}
              className="input-field"
              placeholder="e.g., 30000"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Runway (months)
            </label>
            <input
              type="number"
              {...register('financials.runway')}
              className="input-field"
              placeholder="e.g., 18"
            />
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isSubmitting}
          className="btn-primary px-8 py-3 text-lg"
        >
          {isSubmitting ? 'Creating...' : 'Create Deck'}
        </button>
      </div>
    </form>
  );
};

export default StartupInfoForm; 