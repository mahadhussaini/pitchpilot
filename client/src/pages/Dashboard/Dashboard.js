import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from 'react-query';
import {
  PlusIcon,
  EyeIcon,
  ClockIcon,
  ChartBarIcon,
  DocumentTextIcon,
  UserGroupIcon,
  ArrowUpIcon,
  ArrowDownIcon,
} from '@heroicons/react/24/outline';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const Dashboard = () => {
  // Mock data - in real app, this would come from API
  const { data: dashboardData, isLoading } = useQuery('dashboard', async () => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    return {
      stats: {
        totalDecks: 12,
        activeDecks: 8,
        totalViews: 156,
        avgViewTime: 4.2,
      },
      recentDecks: [
        {
          id: 1,
          title: 'Series A Pitch Deck',
          views: 23,
          lastViewed: '2 hours ago',
          status: 'active',
        },
        {
          id: 2,
          title: 'Seed Round Presentation',
          views: 15,
          lastViewed: '1 day ago',
          status: 'draft',
        },
        {
          id: 3,
          title: 'Investor Meeting Deck',
          views: 8,
          lastViewed: '3 days ago',
          status: 'active',
        },
      ],
      analytics: [
        { name: 'Mon', views: 12, engagement: 65 },
        { name: 'Tue', views: 19, engagement: 72 },
        { name: 'Wed', views: 15, engagement: 68 },
        { name: 'Thu', views: 23, engagement: 78 },
        { name: 'Fri', views: 18, engagement: 71 },
        { name: 'Sat', views: 8, engagement: 45 },
        { name: 'Sun', views: 14, engagement: 62 },
      ],
    };
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="spinner h-8 w-8"></div>
      </div>
    );
  }

  const { stats, recentDecks, analytics } = dashboardData;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Welcome back! Here's what's happening with your pitch decks.</p>
        </div>
        <div className="mt-4 sm:mt-0">
          <Link
            to="/deck-builder"
            className="btn-primary inline-flex items-center"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            Create New Deck
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <DocumentTextIcon className="h-8 w-8 text-primary-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Decks</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalDecks}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <EyeIcon className="h-8 w-8 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Views</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalViews}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <ClockIcon className="h-8 w-8 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Avg View Time</p>
              <p className="text-2xl font-bold text-gray-900">{stats.avgViewTime}m</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <UserGroupIcon className="h-8 w-8 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Active Decks</p>
              <p className="text-2xl font-bold text-gray-900">{stats.activeDecks}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Analytics Chart */}
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Deck Analytics</h3>
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-primary-600 rounded-full mr-2"></div>
              <span className="text-sm text-gray-600">Views</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-green-600 rounded-full mr-2"></div>
              <span className="text-sm text-gray-600">Engagement</span>
            </div>
          </div>
        </div>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={analytics}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="views" stroke="#2563eb" strokeWidth={2} />
              <Line type="monotone" dataKey="engagement" stroke="#16a34a" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Decks and Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Decks */}
        <div className="lg:col-span-2">
          <div className="card">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Recent Decks</h3>
              <Link to="/templates" className="text-sm text-primary-600 hover:text-primary-500">
                View all
              </Link>
            </div>
            <div className="space-y-4">
              {recentDecks.map((deck) => (
                <div key={deck.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <DocumentTextIcon className="h-8 w-8 text-gray-400 mr-3" />
                    <div>
                      <h4 className="text-sm font-medium text-gray-900">{deck.title}</h4>
                      <p className="text-xs text-gray-500">{deck.lastViewed}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center text-sm text-gray-500">
                      <EyeIcon className="h-4 w-4 mr-1" />
                      {deck.views} views
                    </div>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      deck.status === 'active' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {deck.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Quick Actions</h3>
          <div className="space-y-4">
            <Link
              to="/deck-builder"
              className="flex items-center p-4 bg-primary-50 rounded-lg hover:bg-primary-100 transition-colors"
            >
              <PlusIcon className="h-6 w-6 text-primary-600 mr-3" />
              <div>
                <h4 className="text-sm font-medium text-gray-900">Create New Deck</h4>
                <p className="text-xs text-gray-500">Start from scratch or template</p>
              </div>
            </Link>

            <Link
              to="/templates"
              className="flex items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <DocumentTextIcon className="h-6 w-6 text-gray-600 mr-3" />
              <div>
                <h4 className="text-sm font-medium text-gray-900">Browse Templates</h4>
                <p className="text-xs text-gray-500">Choose from proven formats</p>
              </div>
            </Link>

            <Link
              to="/analytics"
              className="flex items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <ChartBarIcon className="h-6 w-6 text-gray-600 mr-3" />
              <div>
                <h4 className="text-sm font-medium text-gray-900">View Analytics</h4>
                <p className="text-xs text-gray-500">Track deck performance</p>
              </div>
            </Link>

            <div className="p-4 bg-gradient-to-r from-primary-500 to-primary-600 rounded-lg text-white">
              <h4 className="text-sm font-medium mb-1">Pro Tip</h4>
              <p className="text-xs opacity-90">
                Use AI feedback to improve your pitch deck's clarity and impact.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 