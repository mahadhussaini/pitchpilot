import React from 'react';
import { Link } from 'react-router-dom';
import { 
  RocketLaunchIcon, 
  ChartBarIcon, 
  UserGroupIcon, 
  SparklesIcon,
  CheckCircleIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline';

const LandingPage = () => {
  const features = [
    {
      icon: RocketLaunchIcon,
      title: 'AI-Powered Deck Builder',
      description: 'Generate investor-ready slides in minutes with our advanced AI that understands your business and target audience.'
    },
    {
      icon: ChartBarIcon,
      title: 'Investor Analytics',
      description: 'Track engagement, view times, and investor interactions with your shared pitch decks in real-time.'
    },
    {
      icon: UserGroupIcon,
      title: 'Investor Targeting',
      description: 'Customize your pitch for specific investor types, sectors, and funding stages automatically.'
    },
    {
      icon: SparklesIcon,
      title: 'Smart Feedback',
      description: 'Get AI-powered suggestions to improve clarity, design, and storytelling in your presentations.'
    }
  ];

  const benefits = [
    'Generate complete pitch decks in under 10 minutes',
    'Customize for different investor personas automatically',
    'Track investor engagement and interactions',
    'Access library of winning pitch deck templates',
    'Collaborate with team members in real-time',
    'Get AI-powered feedback and improvements'
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50">
      {/* Navigation */}
      <nav className="relative z-10 px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <RocketLaunchIcon className="h-8 w-8 text-primary-600" />
            <span className="text-2xl font-bold text-gray-900">PitchPilot</span>
          </div>
          <div className="flex items-center space-x-4">
            <Link to="/login" className="text-gray-600 hover:text-gray-900 transition-colors">
              Sign In
            </Link>
            <Link to="/register" className="btn-primary">
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative px-6 py-20">
        <div className="max-w-7xl mx-auto text-center">
          <div className="animate-fade-in">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              AI-Powered
              <span className="text-primary-600"> Pitch Decks</span>
              <br />
              That Win Investors
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Create compelling pitch decks tailored to specific investors in minutes. 
              Track engagement, get AI feedback, and close more funding rounds.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/register" className="btn-primary text-lg px-8 py-4 inline-flex items-center">
                Start Building Free
                <ArrowRightIcon className="ml-2 h-5 w-5" />
              </Link>
              <button className="btn-secondary text-lg px-8 py-4">
                Watch Demo
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-6 py-20 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Everything You Need to Win Investors
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              From AI-powered content generation to investor analytics, 
              PitchPilot gives you the tools to create winning pitch decks.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="card text-center hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="h-6 w-6 text-primary-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="px-6 py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                Why Founders Choose PitchPilot
              </h2>
              <p className="text-xl text-gray-600 mb-8">
                Join thousands of successful founders who have raised millions 
                using our AI-powered pitch deck platform.
              </p>
              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <CheckCircleIcon className="h-6 w-6 text-green-500 flex-shrink-0" />
                    <span className="text-gray-700">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="card p-8">
                <div className="bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg p-6 text-white mb-6">
                  <h3 className="text-2xl font-bold mb-2">Start Free Today</h3>
                  <p className="text-primary-100">
                    No credit card required. Create your first pitch deck in minutes.
                  </p>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">AI Deck Builder</span>
                    <span className="text-green-600 font-semibold">✓ Included</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Investor Analytics</span>
                    <span className="text-green-600 font-semibold">✓ Included</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Template Library</span>
                    <span className="text-green-600 font-semibold">✓ Included</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">AI Feedback</span>
                    <span className="text-green-600 font-semibold">✓ Included</span>
                  </div>
                </div>
                <Link to="/register" className="btn-primary w-full mt-6">
                  Get Started Free
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-6 py-20 bg-primary-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-4">
            Ready to Create Your Winning Pitch Deck?
          </h2>
          <p className="text-xl text-primary-100 mb-8">
            Join thousands of founders who have raised millions with PitchPilot.
          </p>
          <Link to="/register" className="bg-white text-primary-600 hover:bg-gray-50 font-semibold py-3 px-8 rounded-lg text-lg transition-colors inline-flex items-center">
            Start Building Now
            <ArrowRightIcon className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-12 bg-gray-900">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <RocketLaunchIcon className="h-6 w-6 text-primary-400" />
              <span className="text-xl font-bold text-white">PitchPilot</span>
            </div>
            <div className="text-gray-400">
              © 2024 PitchPilot. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage; 