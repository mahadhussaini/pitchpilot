const mongoose = require('mongoose');

const investmentCriteriaSchema = new mongoose.Schema({
  minInvestment: Number,
  maxInvestment: Number,
  preferredStages: [{
    type: String,
    enum: ['idea', 'pre-seed', 'seed', 'series-a', 'series-b', 'series-c']
  }],
  preferredSectors: [String],
  preferredGeographies: [String],
  investmentThesis: String,
  portfolioCompanies: [String],
  exitPreferences: [String] // IPO, M&A, etc.
});

const communicationPreferencesSchema = new mongoose.Schema({
  preferredFormat: {
    type: String,
    enum: ['pitch_deck', 'executive_summary', 'video_pitch', 'live_demo'],
    default: 'pitch_deck'
  },
  preferredLength: {
    type: String,
    enum: ['brief', 'standard', 'detailed'],
    default: 'standard'
  },
  keyFocusAreas: [String], // e.g., ['traction', 'team', 'market_size', 'unit_economics']
  dealBreakers: [String],
  questionsToPrepare: [String]
});

const investorProfileSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  firm: {
    type: String,
    trim: true
  },
  title: String,
  type: {
    type: String,
    enum: ['vc', 'angel', 'accelerator', 'corporate', 'family_office'],
    required: true
  },
  email: {
    type: String,
    trim: true,
    lowercase: true
  },
  linkedin: String,
  website: String,
  location: {
    country: String,
    city: String,
    timezone: String
  },
  bio: String,
  investmentCriteria: investmentCriteriaSchema,
  communicationPreferences: communicationPreferencesSchema,
  tags: [String], // For categorization and search
  status: {
    type: String,
    enum: ['active', 'inactive', 'archived'],
    default: 'active'
  },
  notes: String,
  lastContact: Date,
  nextFollowUp: Date
}, {
  timestamps: true
});

// Indexes for better query performance
investorProfileSchema.index({ user: 1, type: 1 });
investorProfileSchema.index({ 'investmentCriteria.preferredSectors': 1 });
investorProfileSchema.index({ 'investmentCriteria.preferredStages': 1 });
investorProfileSchema.index({ tags: 1 });
investorProfileSchema.index({ status: 1 });

// Virtual for full name
investorProfileSchema.virtual('fullName').get(function() {
  return `${this.name}${this.firm ? ` (${this.firm})` : ''}`;
});

// Method to get public profile (without sensitive info)
investorProfileSchema.methods.getPublicProfile = function() {
  return {
    id: this._id,
    name: this.name,
    firm: this.firm,
    title: this.title,
    type: this.type,
    location: this.location,
    bio: this.bio,
    investmentCriteria: {
      preferredStages: this.investmentCriteria.preferredStages,
      preferredSectors: this.investmentCriteria.preferredSectors,
      preferredGeographies: this.investmentCriteria.preferredGeographies,
      investmentThesis: this.investmentCriteria.investmentThesis
    },
    communicationPreferences: {
      preferredFormat: this.communicationPreferences.preferredFormat,
      preferredLength: this.communicationPreferences.preferredLength,
      keyFocusAreas: this.communicationPreferences.keyFocusAreas
    },
    tags: this.tags
  };
};

// Static method to find matching investors
investorProfileSchema.statics.findMatchingInvestors = async function(criteria) {
  const {
    stage,
    sector,
    geography,
    fundingAmount,
    investorType
  } = criteria;

  let query = { status: 'active' };

  // Filter by investor type if specified
  if (investorType) {
    query.type = investorType;
  }

  // Filter by stage preference
  if (stage) {
    query['investmentCriteria.preferredStages'] = stage;
  }

  // Filter by sector preference
  if (sector) {
    query['investmentCriteria.preferredSectors'] = { $in: [sector] };
  }

  // Filter by geography preference
  if (geography) {
    query['investmentCriteria.preferredGeographies'] = { $in: [geography] };
  }

  // Filter by investment amount range
  if (fundingAmount) {
    query['investmentCriteria.minInvestment'] = { $lte: fundingAmount };
    query['investmentCriteria.maxInvestment'] = { $gte: fundingAmount };
  }

  const investors = await this.find(query);
  
  // Calculate match score for each investor
  const scoredInvestors = investors.map(investor => {
    let score = 0;
    
    // Stage match
    if (stage && investor.investmentCriteria.preferredStages.includes(stage)) {
      score += 30;
    }
    
    // Sector match
    if (sector && investor.investmentCriteria.preferredSectors.includes(sector)) {
      score += 25;
    }
    
    // Geography match
    if (geography && investor.investmentCriteria.preferredGeographies.includes(geography)) {
      score += 20;
    }
    
    // Investment amount match
    if (fundingAmount) {
      const { minInvestment, maxInvestment } = investor.investmentCriteria;
      if (minInvestment && maxInvestment && 
          fundingAmount >= minInvestment && fundingAmount <= maxInvestment) {
        score += 25;
      }
    }
    
    return {
      ...investor.toObject(),
      matchScore: score
    };
  });

  // Sort by match score (descending)
  return scoredInvestors.sort((a, b) => b.matchScore - a.matchScore);
};

module.exports = mongoose.model('Investor', investorProfileSchema); 