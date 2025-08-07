const mongoose = require('mongoose');

const slideSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['problem', 'solution', 'market', 'traction', 'team', 'financials', 'ask', 'custom'],
    required: true
  },
  title: {
    type: String,
    required: true
  },
  content: {
    type: mongoose.Schema.Types.Mixed, // Can store text, images, charts, etc.
    default: {}
  },
  order: {
    type: Number,
    required: true
  },
  aiFeedback: {
    clarity: { type: Number, min: 1, max: 10 },
    persuasiveness: { type: Number, min: 1, max: 10 },
    suggestions: [String],
    tone: String
  },
  customizations: {
    type: Map,
    of: mongoose.Schema.Types.Mixed
  }
}, { timestamps: true });

const deckSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  startupInfo: {
    name: String,
    industry: String,
    stage: {
      type: String,
      enum: ['idea', 'pre-seed', 'seed', 'series-a', 'series-b', 'series-c']
    },
    fundingGoal: Number,
    currentFunding: Number,
    teamSize: Number,
    foundedYear: Number,
    problem: String,
    solution: String,
    marketSize: String,
    traction: String,
    competitors: [String],
    businessModel: String,
    financials: {
      revenue: Number,
      growth: Number,
      burnRate: Number,
      runway: Number
    }
  },
  slides: [slideSchema],
  template: {
    type: String,
    default: 'default'
  },
  theme: {
    primaryColor: { type: String, default: '#3B82F6' },
    secondaryColor: { type: String, default: '#1F2937' },
    fontFamily: { type: String, default: 'Inter' }
  },
  status: {
    type: String,
    enum: ['draft', 'review', 'published', 'archived'],
    default: 'draft'
  },
  isPublic: {
    type: Boolean,
    default: false
  },
  shareToken: {
    type: String,
    unique: true,
    sparse: true
  },
  analytics: {
    views: { type: Number, default: 0 },
    uniqueViews: { type: Number, default: 0 },
    avgViewTime: { type: Number, default: 0 },
    lastViewed: Date
  },
  aiGenerated: {
    type: Boolean,
    default: false
  },
  aiPrompt: String,
  targetInvestors: [{
    type: {
      type: String,
      enum: ['vc', 'angel', 'accelerator', 'corporate']
    },
    focus: [String],
    stage: [String],
    location: String
  }],
  tags: [String],
  collaborators: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    role: { type: String, enum: ['viewer', 'editor', 'admin'] },
    addedAt: { type: Date, default: Date.now }
  }]
}, {
  timestamps: true
});

// Indexes for better query performance
deckSchema.index({ user: 1, createdAt: -1 });
deckSchema.index({ status: 1 });
deckSchema.index({ shareToken: 1 });
deckSchema.index({ tags: 1 });

// Virtual for slide count
deckSchema.virtual('slideCount').get(function() {
  return this.slides.length;
});

// Method to generate share token
deckSchema.methods.generateShareToken = function() {
  const crypto = require('crypto');
  this.shareToken = crypto.randomBytes(32).toString('hex');
  return this.shareToken;
};

// Method to get public deck data (without sensitive info)
deckSchema.methods.getPublicData = function() {
  return {
    id: this._id,
    title: this.title,
    description: this.description,
    startupInfo: {
      name: this.startupInfo.name,
      industry: this.startupInfo.industry,
      stage: this.startupInfo.stage
    },
    slideCount: this.slideCount,
    theme: this.theme,
    analytics: this.analytics,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt
  };
};

// Method to get deck for editing
deckSchema.methods.getEditData = function() {
  return {
    id: this._id,
    title: this.title,
    description: this.description,
    startupInfo: this.startupInfo,
    slides: this.slides,
    template: this.template,
    theme: this.theme,
    status: this.status,
    targetInvestors: this.targetInvestors,
    tags: this.tags,
    aiGenerated: this.aiGenerated,
    aiPrompt: this.aiPrompt
  };
};

module.exports = mongoose.model('Deck', deckSchema); 