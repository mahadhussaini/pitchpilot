import React, { useState } from 'react';
import { useQuery } from 'react-query';
import { Link } from 'react-router-dom';
import axios from 'axios';
import {
  ChartBarIcon,
  EyeIcon,
  ClockIcon,
  UserGroupIcon,
  TrendingUpIcon,
  TrendingDownIcon,
  CalendarIcon,
  GlobeAltIcon,
  DevicePhoneMobileIcon,
  ComputerDesktopIcon
} from '@heroicons/react/24/outline';
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  Legend
} from 'recharts';

const Analytics = () => {
  const [selectedDeck, setSelectedDeck] = useState(null);
  const [timeRange, setTimeRange] = useState('30d');

  // Fetch analytics overview
  const { data: overview, isLoading: overviewLoading } = useQuery(
    ['analytics-overview'],
    async () => {
      const response = await axios.get('/api/analytics/overview');
      return response.data;
    }
  );

  // Fetch specific deck analytics
  const { data: deckAnalytics, isLoading: deckLoading } = useQuery(
    ['deck-analytics', selectedDeck],
    async () => {
      if (!selectedDeck) return null;
      const response = await axios.get(`/api/analytics/deck/${selectedDeck}`);
      return response.data;
    },
    {
      enabled: !!selectedDeck
    }
  );

  // Fetch slide analytics
  const { data: slideAnalytics } = useQuery(
    ['slide-analytics', selectedDeck],
    async () => {
      if (!selectedDeck) return [];
      const response = await axios.get(`/api/analytics/deck/${selectedDeck}/slides`);
      return response.data;
    },
    {
      enabled: !!selectedDeck
    }
  );

  const formatTime = (minutes) => {
    if (minutes < 1) return '< 1 min';
    if (minutes < 60) return `${Math.round(minutes)} min`;
    const hours = Math.floor(minutes / 60);
    const mins = Math.round(minutes % 60);
    return `${hours}h ${mins}m`;
  };

  const getInterestColor = (level) => {
    switch (level) {
      case 'high': return 'text-green-600 bg-green-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'invested': return 'text-green-600 bg-green-100';
      case 'meeting_scheduled': return 'text-blue-600 bg-blue-100';
      case 'contacted': return 'text-purple-600 bg-purple-100';
      case 'passed': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  if (overviewLoading) {
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
          <h1 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h1>
          <p className="text-gray-600">Track your pitch deck performance and investor engagement</p>
        </div>
        <div className="mt-4 sm:mt-0">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="input-field"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
            <option value="1y">Last year</option>
          </select>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <EyeIcon className="h-8 w-8 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Views</p>
              <p className="text-2xl font-bold text-gray-900">{overview?.totalViews || 0}</p>
              <p className="text-xs text-gray-500">
                {overview?.totalUniqueViews || 0} unique viewers
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <ClockIcon className="h-8 w-8 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Avg View Time</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatTime(overview?.avgViewTime || 0)}
              </p>
              <p className="text-xs text-gray-500">per deck view</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <ChartBarIcon className="h-8 w-8 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Active Decks</p>
              <p className="text-2xl font-bold text-gray-900">{overview?.totalDecks || 0}</p>
              <p className="text-xs text-gray-500">published decks</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <UserGroupIcon className="h-8 w-8 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Investor Interactions</p>
              <p className="text-2xl font-bold text-gray-900">
                {deckAnalytics?.investorInteractions?.length || 0}
              </p>
              <p className="text-xs text-gray-500">tracked interactions</p>
            </div>
          </div>
        </div>
      </div>

      {/* Top Performing Decks */}
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Top Performing Decks</h3>
          <Link to="/deck-builder" className="text-sm text-blue-600 hover:text-blue-500">
            View all decks
          </Link>
        </div>
        <div className="space-y-4">
          {overview?.topDecks?.map((deck, index) => (
            <div key={deck.deckId} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                  <span className="text-sm font-medium text-blue-600">{index + 1}</span>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-900">{deck.title}</h4>
                  <p className="text-xs text-gray-500">
                    {deck.views} views • {formatTime(deck.avgViewTime)} avg time
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedDeck(deck.deckId)}
                className="text-sm text-blue-600 hover:text-blue-500"
              >
                View Details
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Deck Analytics Detail */}
      {selectedDeck && deckAnalytics && (
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">
              Analytics: {deckAnalytics.deck.title}
            </h3>
            <button
              onClick={() => setSelectedDeck(null)}
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              Close
            </button>
          </div>

          {/* Deck Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900">{deckAnalytics.analytics.totalViews}</p>
              <p className="text-sm text-gray-500">Total Views</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900">{deckAnalytics.analytics.uniqueViews}</p>
              <p className="text-sm text-gray-500">Unique Viewers</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900">
                {formatTime(deckAnalytics.analytics.avgViewTime)}
              </p>
              <p className="text-sm text-gray-500">Avg View Time</p>
            </div>
          </div>

          {/* Slide Engagement Chart */}
          {slideAnalytics && slideAnalytics.length > 0 && (
            <div className="mb-8">
              <h4 className="text-md font-semibold text-gray-900 mb-4">Slide Engagement</h4>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={slideAnalytics}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="title" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="views" fill="#3B82F6" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {/* Investor Interactions */}
          {deckAnalytics.investorInteractions && deckAnalytics.investorInteractions.length > 0 && (
            <div>
              <h4 className="text-md font-semibold text-gray-900 mb-4">Investor Interactions</h4>
              <div className="space-y-3">
                {deckAnalytics.investorInteractions.map((interaction) => (
                  <div key={interaction.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                        <UserGroupIcon className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <h5 className="text-sm font-medium text-gray-900">
                          {interaction.investorName || 'Unknown Investor'}
                        </h5>
                        <p className="text-xs text-gray-500">
                          {interaction.investorType} • {interaction.totalInteractions} interactions
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 text-xs rounded-full ${getInterestColor(interaction.interestLevel)}`}>
                        {interaction.interestLevel}
                      </span>
                      <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(interaction.status)}`}>
                        {interaction.status.replace('_', ' ')}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Recent Activity */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Recent Activity</h3>
        <div className="space-y-4">
          {overview?.recentActivity?.map((activity) => (
            <div key={activity.deckId} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center">
                <CalendarIcon className="w-5 h-5 text-gray-400 mr-3" />
                <div>
                  <h4 className="text-sm font-medium text-gray-900">{activity.title}</h4>
                  <p className="text-xs text-gray-500">
                    {activity.views} views • {new Date(activity.lastViewed).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedDeck(activity.deckId)}
                className="text-sm text-blue-600 hover:text-blue-500"
              >
                View Analytics
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Engagement Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Viewer Demographics */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Viewer Demographics</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <GlobeAltIcon className="w-5 h-5 text-gray-400 mr-2" />
                <span className="text-sm text-gray-600">Countries</span>
              </div>
              <span className="text-sm font-medium text-gray-900">
                {deckAnalytics?.analytics?.viewerDemographics?.countries?.length || 0}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <ComputerDesktopIcon className="w-5 h-5 text-gray-400 mr-2" />
                <span className="text-sm text-gray-600">Desktop</span>
              </div>
              <span className="text-sm font-medium text-gray-900">
                {deckAnalytics?.analytics?.viewerDemographics?.devices?.find(d => d.type === 'desktop')?.count || 0}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <DevicePhoneMobileIcon className="w-5 h-5 text-gray-400 mr-2" />
                <span className="text-sm text-gray-600">Mobile</span>
              </div>
              <span className="text-sm font-medium text-gray-900">
                {deckAnalytics?.analytics?.viewerDemographics?.devices?.find(d => d.type === 'mobile')?.count || 0}
              </span>
            </div>
          </div>
        </div>

        {/* Engagement Metrics */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Engagement Metrics</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Bounce Rate</span>
              <span className="text-sm font-medium text-gray-900">
                {deckAnalytics?.analytics?.engagementMetrics?.bounceRate || 0}%
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Avg Session Duration</span>
              <span className="text-sm font-medium text-gray-900">
                {formatTime(deckAnalytics?.analytics?.engagementMetrics?.avgSessionDuration || 0)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Pages per Session</span>
              <span className="text-sm font-medium text-gray-900">
                {deckAnalytics?.analytics?.engagementMetrics?.pagesPerSession || 0}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics; 