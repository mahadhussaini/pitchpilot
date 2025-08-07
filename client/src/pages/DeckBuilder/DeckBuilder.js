import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import axios from 'axios';
import toast from 'react-hot-toast';
import {
  PlusIcon,
  SparklesIcon, 
  EyeIcon, 
  ShareIcon,
  DocumentDuplicateIcon,
  TrashIcon,
  ArrowLeftIcon
} from '@heroicons/react/24/outline';

import StartupInfoForm from './components/StartupInfoForm';
import SlideEditor from './components/SlideEditor';
import AIGenerationModal from './components/AIGenerationModal';
import DeckPreview from './components/DeckPreview';
import LoadingSpinner from '../../components/UI/LoadingSpinner';

const DeckBuilder = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [activeSlide, setActiveSlide] = useState(0);
  const [showAIModal, setShowAIModal] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // Fetch deck data
  const { data: deck, isLoading, error } = useQuery(
    ['deck', id],
    async () => {
      if (!id || id === 'new') return null;
      const response = await axios.get(`/api/decks/${id}`);
      return response.data;
    },
    {
      enabled: !!id && id !== 'new',
      retry: 1,
      onError: (error) => {
        console.error('Error fetching deck:', error);
      }
    }
  );

  // Create new deck mutation
  const createDeckMutation = useMutation(
    async (deckData) => {
      const response = await axios.post('/api/decks', deckData);
      return response.data;
    },
    {
      onSuccess: (data) => {
        toast.success('Deck created successfully');
        navigate(`/deck-builder/${data.id}`);
        queryClient.invalidateQueries(['decks']);
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || 'Failed to create deck');
      }
    }
  );

  // Update deck mutation
  const updateDeckMutation = useMutation(
    async (deckData) => {
      const response = await axios.put(`/api/decks/${id}`, deckData);
      return response.data;
    },
    {
      onSuccess: () => {
        toast.success('Deck updated successfully');
        queryClient.invalidateQueries(['deck', id]);
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || 'Failed to update deck');
      }
    }
  );

  // Delete deck mutation
  const deleteDeckMutation = useMutation(
    async () => {
      await axios.delete(`/api/decks/${id}`);
    },
    {
      onSuccess: () => {
        toast.success('Deck deleted successfully');
        navigate('/dashboard');
        queryClient.invalidateQueries(['decks']);
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || 'Failed to delete deck');
      }
    }
  );

  // Duplicate deck mutation
  const duplicateDeckMutation = useMutation(
    async () => {
      if (!id || id === 'new' || id === 'undefined') {
        throw new Error('Invalid deck ID for duplication');
      }
      const response = await axios.post(`/api/decks/${id}/duplicate`);
      return response.data;
    },
    {
      onSuccess: (data) => {
        toast.success('Deck duplicated successfully');
        navigate(`/deck-builder/${data.id}`);
        queryClient.invalidateQueries(['decks']);
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || 'Failed to duplicate deck');
      }
    }
  );

  // Handle creating new deck
  const handleCreateDeck = async (deckData) => {
    await createDeckMutation.mutateAsync(deckData);
  };

  // Handle deck updates
  const handleUpdateDeck = async (updates) => {
    if (!id || id === 'new') {
      toast.error('Cannot update a new deck. Please save the deck first.');
      return;
    }
    await updateDeckMutation.mutateAsync(updates);
  };

  // Handle slide updates
  const handleSlideUpdate = (slideIndex, updatedSlide) => {
    if (!deck || !id || id === 'new') return;

    const updatedSlides = [...deck.slides];
    updatedSlides[slideIndex] = updatedSlide;

    handleUpdateDeck({
      slides: updatedSlides
    });
  };

  // Handle adding new slide
  const handleAddSlide = () => {
    if (!deck || !id || id === 'new') return;
    
    const newSlide = {
      type: 'custom',
      title: 'New Slide',
      content: {
        headline: 'Add your content here',
        keyPoints: [],
        visualDescription: '',
        callToAction: ''
      },
      order: deck.slides.length + 1,
      aiFeedback: {
        clarity: 5,
        persuasiveness: 5,
        suggestions: [],
        tone: 'professional'
      }
    };

    const updatedSlides = [...deck.slides, newSlide];
    handleUpdateDeck({
      slides: updatedSlides
    });
    setActiveSlide(updatedSlides.length - 1);
  };

  // Handle slide deletion
  const handleDeleteSlide = (slideIndex) => {
    if (!deck || !id || id === 'new' || deck.slides.length <= 1) return;

    const updatedSlides = deck.slides.filter((_, index) => index !== slideIndex);
    handleUpdateDeck({
      slides: updatedSlides
    });
    
    if (activeSlide >= slideIndex) {
      setActiveSlide(Math.max(0, activeSlide - 1));
    }
  };

  // Handle AI generation
  const handleAIGeneration = async (startupInfo, targetInvestors) => {
    try {
      if (!id || id === 'new') {
        // Create new deck first, then generate
        const createResponse = await axios.post('/api/decks', {
          title: startupInfo.companyName || 'New Pitch Deck',
          description: startupInfo.description || '',
          startupInfo,
          targetInvestors
        });
        
        const newDeckId = createResponse.data.id;
        
        // Now generate the deck content
        const response = await axios.post(`/api/decks/${newDeckId}/generate`, {
          startupInfo,
          targetInvestors
        });
        
        toast.success('AI deck generated successfully');
        navigate(`/deck-builder/${newDeckId}`);
        queryClient.invalidateQueries(['decks']);
        setShowAIModal(false);
      } else {
        const response = await axios.post(`/api/decks/${id}/generate`, {
          startupInfo,
          targetInvestors
        });
        
        toast.success('AI deck generated successfully');
        queryClient.invalidateQueries(['deck', id]);
        setShowAIModal(false);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to generate deck');
    }
  };

  // Handle deck actions
  const handleDeleteDeck = () => {
    if (window.confirm('Are you sure you want to delete this deck? This action cannot be undone.')) {
      deleteDeckMutation.mutate();
    }
  };

  const handleDuplicateDeck = () => {
    if (!id || id === 'new' || id === 'undefined') {
      toast.error('Cannot duplicate a new deck. Please save the deck first.');
      return;
    }
    duplicateDeckMutation.mutate();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Error Loading Deck</h2>
          <p className="text-gray-600 mb-4">{error.message}</p>
          <button
            onClick={() => navigate('/dashboard')}
            className="btn-primary"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  // New deck creation
  if (!id || id === 'new') {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto py-8 px-4">
          <div className="mb-8">
            <button
              onClick={() => navigate('/dashboard')}
              className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
            >
              <ArrowLeftIcon className="w-5 h-5 mr-2" />
              Back to Dashboard
            </button>
            <h1 className="text-3xl font-bold text-gray-900">Create New Pitch Deck</h1>
            <p className="text-gray-600 mt-2">Start by providing your startup information</p>
          </div>

          <StartupInfoForm onSubmit={handleCreateDeck} />
        </div>
      </div>
    );
  }

  // Deck editing
  if (!deck) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Deck Not Found</h2>
          <p className="text-gray-600 mb-4">The deck you're looking for doesn't exist or you don't have permission to view it.</p>
          <button
            onClick={() => navigate('/dashboard')}
            className="btn-primary"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/dashboard')}
                className="flex items-center text-gray-600 hover:text-gray-900"
              >
                <ArrowLeftIcon className="w-5 h-5 mr-2" />
                Back
              </button>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">
                  {deck.title || 'Untitled Deck'}
                </h1>
                <p className="text-sm text-gray-500">
                  {deck.slides?.length || 0} slides
                </p>
              </div>
          </div>
          
            <div className="flex items-center space-x-2">
            <button
                onClick={() => setShowPreview(true)}
                className="btn-secondary flex items-center"
            >
                <EyeIcon className="w-4 h-4 mr-2" />
                Preview
            </button>
            
            <button
                onClick={() => setShowAIModal(true)}
                className="btn-primary flex items-center"
                disabled={!deck.slides?.length}
              >
                <SparklesIcon className="w-4 h-4 mr-2" />
                AI Generate
            </button>
            
            <button
                onClick={handleDuplicateDeck}
                className="btn-secondary flex items-center"
            >
                <DocumentDuplicateIcon className="w-4 h-4 mr-2" />
                Duplicate
            </button>
            
            <button
                onClick={handleDeleteDeck}
                className="btn-secondary text-red-600 hover:text-red-700 flex items-center"
            >
                <TrashIcon className="w-4 h-4 mr-2" />
                Delete
            </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Slide Navigation */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Slides</h3>
              <button
                  onClick={handleAddSlide}
                  className="btn-primary flex items-center text-sm"
              >
                  <PlusIcon className="w-4 h-4 mr-1" />
                  Add Slide
              </button>
            </div>
            
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {deck.slides?.map((slide, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveSlide(index)}
                    className={`w-full text-left p-3 rounded-lg border transition-colors ${
                      activeSlide === index
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                >
                  <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900">{slide.title}</p>
                        <p className="text-sm text-gray-500 capitalize">{slide.type}</p>
                    </div>
                      {deck.slides.length > 1 && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                            handleDeleteSlide(index);
                        }}
                          className="text-red-500 hover:text-red-700"
                      >
                          <TrashIcon className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                  </button>
              ))}
            </div>
          </div>
        </div>

          {/* Slide Editor */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              {deck.slides?.length > 0 ? (
                <SlideEditor
                  slide={deck.slides[activeSlide]}
                  slideIndex={activeSlide}
                  onUpdate={handleSlideUpdate}
                  onAnalyze={async (slideIndex) => {
                    try {
                      const response = await axios.post(`/api/decks/${id}/slides/${slideIndex}/analyze`);
                      toast.success('Slide analyzed successfully');
                      queryClient.invalidateQueries(['deck', id]);
                    } catch (error) {
                      toast.error('Failed to analyze slide');
                    }
                  }}
                />
              ) : (
                <div className="text-center py-12">
                  <SparklesIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No slides yet</h3>
                  <p className="text-gray-500 mb-4">
                    Start by generating your pitch deck with AI or add slides manually
                  </p>
                      <button
                    onClick={() => setShowAIModal(true)}
                    className="btn-primary"
                  >
                    Generate with AI
                    </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      {showAIModal && (
        <AIGenerationModal
          isOpen={showAIModal}
          onClose={() => setShowAIModal(false)}
          onSubmit={handleAIGeneration}
          existingStartupInfo={deck?.startupInfo}
        />
      )}

      {showPreview && (
        <DeckPreview
          deck={deck}
          isOpen={showPreview}
          onClose={() => setShowPreview(false)}
        />
      )}
    </div>
  );
};

export default DeckBuilder; 