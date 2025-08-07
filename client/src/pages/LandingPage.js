import React from 'react';
import { Link } from 'react-router-dom';
import { 
  RocketLaunchIcon, 
  ChartBarIcon, 
  UserGroupIcon, 
  SparklesIcon,
  CheckCircleIcon,
  ArrowRightIcon,
  PlayIcon,
  StarIcon,
  ShieldCheckIcon,
  BoltIcon
} from '@heroicons/react/24/outline';

const LandingPage = () => {
  const features = [
    {
      icon: RocketLaunchIcon,
      title: 'AI-Powered Deck Builder',
      description: 'Generate investor-ready slides in minutes with our advanced AI that understands your business and target audience.',
      gradient: 'from-blue-500 to-purple-600'
    },
    {
      icon: ChartBarIcon,
      title: 'Investor Analytics',
      description: 'Track engagement, view times, and investor interactions with your shared pitch decks in real-time.',
      gradient: 'from-green-500 to-teal-600'
    },
    {
      icon: UserGroupIcon,
      title: 'Investor Targeting',
      description: 'Customize your pitch for specific investor types, sectors, and funding stages automatically.',
      gradient: 'from-orange-500 to-red-600'
    },
    {
      icon: SparklesIcon,
      title: 'Smart Feedback',
      description: 'Get AI-powered suggestions to improve clarity, design, and storytelling in your presentations.',
      gradient: 'from-purple-500 to-pink-600'
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

  const testimonials = [
    {
      name: 'Sarah Chen',
      role: 'CEO, TechFlow',
      content: 'PitchPilot helped us raise $2M in just 3 weeks. The AI suggestions were spot-on!',
      rating: 5
    },
    {
      name: 'Marcus Rodriguez',
      role: 'Founder, GreenTech',
      content: 'The investor analytics feature gave us insights we never had before. Game changer!',
      rating: 5
    },
    {
      name: 'Emily Watson',
      role: 'CTO, DataViz',
      content: 'From idea to investor-ready deck in 30 minutes. Absolutely incredible platform.',
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Navigation */}
      <nav className="relative z-10 px-6 py-6 backdrop-blur-sm bg-white/80 border-b border-gray-200/50">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <RocketLaunchIcon className="h-8 w-8 text-blue-600" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              PitchPilot
            </span>
          </div>
          <div className="flex items-center space-x-6">
            <Link to="/login" className="text-gray-600 hover:text-gray-900 transition-colors font-medium">
              Sign In
            </Link>
            <Link to="/register" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-2 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl">
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative px-6 py-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10"></div>
        <div className="absolute top-0 left-0 w-72 h-72 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute top-0 right-0 w-72 h-72 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-400 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
        
        <div className="relative max-w-7xl mx-auto text-center">
          <div className="animate-fade-in">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-100 text-blue-800 text-sm font-medium mb-8">
              <BoltIcon className="h-4 w-4 mr-2" />
              AI-Powered Pitch Decks
            </div>
            <h1 className="text-6xl md:text-7xl font-bold text-gray-900 mb-8 leading-tight">
              Create
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> Winning</span>
              <br />
              Pitch Decks
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-4xl mx-auto leading-relaxed">
              Generate compelling pitch decks tailored to specific investors in minutes. 
              Track engagement, get AI feedback, and close more funding rounds.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-12">
              <Link to="/register" className="group bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white text-lg px-8 py-4 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl inline-flex items-center">
                Start Building Free
                <ArrowRightIcon className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <button className="group flex items-center text-lg px-8 py-4 border-2 border-gray-300 hover:border-gray-400 rounded-xl font-semibold transition-all duration-200 hover:bg-gray-50">
                <PlayIcon className="h-5 w-5 mr-2" />
                Watch Demo
              </button>
            </div>
            
            {/* Social Proof */}
            <div className="flex items-center justify-center space-x-8 text-gray-500">
              <div className="flex items-center space-x-2">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 border-2 border-white"></div>
                  ))}
                </div>
                <span className="text-sm">500+ founders trust us</span>
              </div>
              <div className="flex items-center space-x-1">
                {[1, 2, 3, 4, 5].map((i) => (
                  <StarIcon key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                ))}
                <span className="text-sm ml-1">4.9/5 rating</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-6 py-24 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-green-100 text-green-800 text-sm font-medium mb-6">
              <SparklesIcon className="h-4 w-4 mr-2" />
              Powerful Features
            </div>
            <h2 className="text-5xl font-bold text-gray-900 mb-6">
              Everything You Need to
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> Win Investors</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              From AI-powered content generation to investor analytics, 
              PitchPilot gives you the tools to create winning pitch decks.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="group relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl blur opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                <div className="relative bg-white rounded-2xl p-8 border border-gray-200 hover:border-gray-300 transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                  <div className={`w-14 h-14 bg-gradient-to-r ${feature.gradient} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <feature.icon className="h-7 w-7 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="px-6 py-24 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Trusted by Successful Founders
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              See what founders are saying about their experience with PitchPilot
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <StarIcon key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 mb-6 leading-relaxed">
                  "{testimonial.content}"
                </p>
                <div>
                  <div className="font-semibold text-gray-900">{testimonial.name}</div>
                  <div className="text-gray-600">{testimonial.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="px-6 py-24 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-100 text-blue-800 text-sm font-medium mb-6">
                <CheckCircleIcon className="h-4 w-4 mr-2" />
                Why Choose PitchPilot
              </div>
              <h2 className="text-5xl font-bold text-gray-900 mb-8 leading-tight">
                Join Thousands of
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> Successful Founders</span>
              </h2>
              <p className="text-xl text-gray-600 mb-10 leading-relaxed">
                Join thousands of successful founders who have raised millions 
                using our AI-powered pitch deck platform.
              </p>
              <div className="space-y-6">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-start space-x-4 group">
                    <div className="w-6 h-6 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1 group-hover:scale-110 transition-transform duration-200">
                      <CheckCircleIcon className="h-4 w-4 text-white" />
                    </div>
                    <span className="text-gray-700 text-lg">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl blur opacity-20"></div>
              <div className="relative bg-white rounded-3xl p-8 shadow-2xl border border-gray-200">
                <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl p-8 text-white mb-8">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-2xl font-bold">Start Free Today</h3>
                    <ShieldCheckIcon className="h-8 w-8 text-blue-200" />
                  </div>
                  <p className="text-blue-100 text-lg">
                    No credit card required. Create your first pitch deck in minutes.
                  </p>
                </div>
                <div className="space-y-6">
                  {[
                    'AI Deck Builder',
                    'Investor Analytics', 
                    'Template Library',
                    'AI Feedback',
                    'Team Collaboration',
                    'Priority Support'
                  ].map((feature, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-gray-700 font-medium">{feature}</span>
                      <span className="text-green-600 font-semibold flex items-center">
                        <CheckCircleIcon className="h-5 w-5 mr-1" />
                        Included
                      </span>
                    </div>
                  ))}
                </div>
                <Link to="/register" className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-4 rounded-xl font-semibold text-lg transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl inline-flex items-center justify-center mt-8">
                  Get Started Free
                  <ArrowRightIcon className="ml-2 h-5 w-5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-6 py-24 bg-gradient-to-r from-blue-600 to-purple-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute top-0 left-0 w-96 h-96 bg-white/10 rounded-full mix-blend-multiply filter blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/10 rounded-full mix-blend-multiply filter blur-3xl"></div>
        
        <div className="relative max-w-4xl mx-auto text-center">
          <h2 className="text-5xl font-bold text-white mb-6">
            Ready to Create Your
            <br />
            <span className="bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
              Winning Pitch Deck?
            </span>
          </h2>
          <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto">
            Join thousands of founders who have raised millions with PitchPilot.
            Start building your investor-ready pitch deck today.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Link to="/register" className="group bg-white text-blue-600 hover:bg-gray-50 font-bold py-4 px-8 rounded-xl text-lg transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl inline-flex items-center">
              Start Building Now
              <ArrowRightIcon className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <button className="group text-white border-2 border-white/30 hover:border-white/50 px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-200 hover:bg-white/10">
              Schedule Demo
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-16 bg-gray-900">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-3 mb-6 md:mb-0">
              <RocketLaunchIcon className="h-6 w-6 text-blue-400" />
              <span className="text-xl font-bold text-white">PitchPilot</span>
            </div>
            <div className="flex items-center space-x-8 text-gray-400">
              <span>© 2024 PitchPilot. All rights reserved.</span>
              <div className="flex items-center space-x-4">
                <span>Privacy Policy</span>
                <span>Terms of Service</span>
                <span>Contact</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage; 