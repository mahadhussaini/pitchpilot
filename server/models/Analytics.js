const mongoose = require('mongoose');

const viewEventSchema = new mongoose.Schema({
  deckId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Deck',
    required: true
  },
  viewerId: {
    type: String, // Can be anonymous or user ID
    required: true
  },
  viewerType: {
    type: String,
    enum: ['anonymous', 'user', 'investor'],
    default: 'anonymous'
  },
  sessionId: {
    type: String,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  duration: {
    type: Number, // in seconds
    default: 0
  },
  slideViews: [{
    slideIndex: Number,
    timeSpent: Number, // in seconds
    interactions: [{
      type: String, // 'click', 'scroll', 'hover'
      timestamp: Date,
      element: String // element identifier
    }]
  }],
  userAgent: String,
  ipAddress: String,
  referrer: String,
  location: {
    country: String,
    city: String,
    timezone: String
  }
}, { timestamps: true });

const deckAnalyticsSchema = new mongoose.Schema({
  deckId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Deck',
    required: true,
    unique: true
  },
  totalViews: {
    type: Number,
    default: 0
  },
  uniqueViews: {
    type: Number,
    default: 0
  },
  totalViewTime: {
    type: Number, // in seconds
    default: 0
  },
  avgViewTime: {
    type: Number, // in seconds
    default: 0
  },
  slideEngagement: [{
    slideIndex: Number,
    views: Number,
    avgTimeSpent: Number,
    dropOffRate: Number, // percentage of viewers who left after this slide
    interactions: Number
  }],
  viewerDemographics: {
    countries: [{
      country: String,
      count: Number
    }],
    devices: [{
      type: String, // 'desktop', 'mobile', 'tablet'
      count: Number
    }],
    browsers: [{
      name: String,
      count: Number
    }]
  },
  engagementMetrics: {
    bounceRate: Number, // percentage of single-page sessions
    avgSessionDuration: Number,
    pagesPerSession: Number,
    returnVisitors: Number
  },
  lastViewed: Date,
  firstViewed: Date
}, { timestamps: true });

const investorInteractionSchema = new mongoose.Schema({
  deckId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Deck',
    required: true
  },
  investorId: {
    type: String,
    required: true
  },
  investorName: String,
  investorType: {
    type: String,
    enum: ['vc', 'angel', 'accelerator', 'corporate'],
    required: true
  },
  interactions: [{
    type: {
      type: String,
      enum: ['view', 'download', 'share', 'contact', 'follow_up'],
      required: true
    },
    timestamp: {
      type: Date,
      default: Date.now
    },
    metadata: mongoose.Schema.Types.Mixed
  }],
  interestLevel: {
    type: String,
    enum: ['high', 'medium', 'low', 'unknown'],
    default: 'unknown'
  },
  notes: String,
  followUpDate: Date,
  status: {
    type: String,
    enum: ['pending', 'contacted', 'meeting_scheduled', 'passed', 'invested'],
    default: 'pending'
  }
}, { timestamps: true });

// Indexes for better query performance
viewEventSchema.index({ deckId: 1, timestamp: -1 });
viewEventSchema.index({ sessionId: 1 });
viewEventSchema.index({ viewerId: 1 });

deckAnalyticsSchema.index({ deckId: 1 });
deckAnalyticsSchema.index({ totalViews: -1 });

investorInteractionSchema.index({ deckId: 1, investorId: 1 });
investorInteractionSchema.index({ status: 1 });

// Methods for analytics calculations
deckAnalyticsSchema.methods.updateMetrics = async function() {
  const ViewEvent = mongoose.model('ViewEvent');
  
  // Get all view events for this deck
  const viewEvents = await ViewEvent.find({ deckId: this.deckId });
  
  // Calculate metrics
  this.totalViews = viewEvents.length;
  this.uniqueViews = new Set(viewEvents.map(v => v.viewerId)).size;
  this.totalViewTime = viewEvents.reduce((sum, v) => sum + v.duration, 0);
  this.avgViewTime = this.totalViews > 0 ? this.totalViewTime / this.totalViews : 0;
  
  // Calculate slide engagement
  const slideStats = {};
  viewEvents.forEach(event => {
    event.slideViews.forEach(slideView => {
      if (!slideStats[slideView.slideIndex]) {
        slideStats[slideView.slideIndex] = {
          views: 0,
          totalTime: 0,
          interactions: 0
        };
      }
      slideStats[slideView.slideIndex].views++;
      slideStats[slideView.slideIndex].totalTime += slideView.timeSpent;
      slideStats[slideView.slideIndex].interactions += slideView.interactions.length;
    });
  });
  
  this.slideEngagement = Object.entries(slideStats).map(([index, stats]) => ({
    slideIndex: parseInt(index),
    views: stats.views,
    avgTimeSpent: stats.views > 0 ? stats.totalTime / stats.views : 0,
    dropOffRate: 0, // Calculate based on slide order
    interactions: stats.interactions
  }));
  
  // Update timestamps
  if (viewEvents.length > 0) {
    this.lastViewed = Math.max(...viewEvents.map(v => v.timestamp));
    this.firstViewed = Math.min(...viewEvents.map(v => v.timestamp));
  }
  
  await this.save();
};

// Static method to get analytics for a deck
deckAnalyticsSchema.statics.getDeckAnalytics = async function(deckId) {
  let analytics = await this.findOne({ deckId });
  
  if (!analytics) {
    analytics = new this({ deckId });
    await analytics.save();
  }
  
  await analytics.updateMetrics();
  return analytics;
};

module.exports = {
  ViewEvent: mongoose.model('ViewEvent', viewEventSchema),
  DeckAnalytics: mongoose.model('DeckAnalytics', deckAnalyticsSchema),
  InvestorInteraction: mongoose.model('InvestorInteraction', investorInteractionSchema)
}; 