const express = require('express');
const { body, validationResult } = require('express-validator');
const auth = require('../middleware/auth');
const Investor = require('../models/Investor');
const aiService = require('../services/aiService');

const router = express.Router();

// Get all investors for the current user
router.get('/', auth, async (req, res) => {
  try {
    const investors = await Investor.find({ user: req.user.id })
      .sort({ createdAt: -1 });
    
    res.json(investors);
  } catch (error) {
    console.error('Error fetching investors:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get investor templates (pre-defined investor personas)
router.get('/templates', auth, async (req, res) => {
  try {
    const templates = [
      {
        id: 'vc-seed-stage',
        name: 'Seed Stage VC',
        type: 'vc',
        description: 'Early-stage venture capitalists focused on seed rounds',
        investmentCriteria: {
          preferredStages: ['seed', 'series-a'],
          preferredSectors: ['SaaS', 'Fintech', 'Healthtech'],
          minInvestment: 500000,
          maxInvestment: 5000000
        },
        communicationPreferences: {
          preferredFormat: 'pitch_deck',
          preferredLength: 'standard',
          keyFocusAreas: ['traction', 'team', 'market_size', 'unit_economics']
        }
      },
      {
        id: 'angel-investor',
        name: 'Angel Investor',
        type: 'angel',
        description: 'Individual angel investors with diverse interests',
        investmentCriteria: {
          preferredStages: ['idea', 'pre-seed', 'seed'],
          preferredSectors: ['All'],
          minInvestment: 25000,
          maxInvestment: 500000
        },
        communicationPreferences: {
          preferredFormat: 'pitch_deck',
          preferredLength: 'brief',
          keyFocusAreas: ['problem', 'solution', 'team', 'traction']
        }
      },
      {
        id: 'accelerator-program',
        name: 'Accelerator Program',
        type: 'accelerator',
        description: 'Startup accelerators and incubators',
        investmentCriteria: {
          preferredStages: ['idea', 'pre-seed'],
          preferredSectors: ['All'],
          minInvestment: 50000,
          maxInvestment: 150000
        },
        communicationPreferences: {
          preferredFormat: 'pitch_deck',
          preferredLength: 'standard',
          keyFocusAreas: ['problem', 'solution', 'market', 'team']
        }
      },
      {
        id: 'corporate-vc',
        name: 'Corporate VC',
        type: 'corporate',
        description: 'Corporate venture capital arms',
        investmentCriteria: {
          preferredStages: ['seed', 'series-a', 'series-b'],
          preferredSectors: ['Enterprise', 'B2B', 'Deep Tech'],
          minInvestment: 1000000,
          maxInvestment: 10000000
        },
        communicationPreferences: {
          preferredFormat: 'pitch_deck',
          preferredLength: 'detailed',
          keyFocusAreas: ['technology', 'market_fit', 'scalability', 'partnership_potential']
        }
      }
    ];

    res.json(templates);
  } catch (error) {
    console.error('Error fetching investor templates:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get a specific investor
router.get('/:id', auth, async (req, res) => {
  try {
    const investor = await Investor.findOne({ 
      _id: req.params.id, 
      user: req.user.id 
    });
    
    if (!investor) {
      return res.status(404).json({ message: 'Investor not found' });
    }
    
    res.json(investor);
  } catch (error) {
    console.error('Error fetching investor:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create a new investor profile
router.post('/', auth, [
  body('name').notEmpty().withMessage('Name is required'),
  body('type').isIn(['vc', 'angel', 'accelerator', 'corporate', 'family_office'])
    .withMessage('Valid investor type is required'),
  body('email').optional().isEmail().withMessage('Valid email is required'),
  body('firm').optional().trim(),
  body('title').optional().trim(),
  body('bio').optional().trim(),
  body('notes').optional().trim()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      name,
      firm,
      title,
      type,
      email,
      linkedin,
      website,
      location,
      bio,
      investmentCriteria,
      communicationPreferences,
      tags,
      notes
    } = req.body;

    const investor = new Investor({
      user: req.user.id,
      name,
      firm,
      title,
      type,
      email,
      linkedin,
      website,
      location,
      bio,
      investmentCriteria,
      communicationPreferences,
      tags: tags || [],
      notes
    });

    await investor.save();
    res.status(201).json(investor);
  } catch (error) {
    console.error('Error creating investor:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update an investor profile
router.put('/:id', auth, [
  body('name').optional().notEmpty().withMessage('Name cannot be empty'),
  body('type').optional().isIn(['vc', 'angel', 'accelerator', 'corporate', 'family_office'])
    .withMessage('Valid investor type is required'),
  body('email').optional().isEmail().withMessage('Valid email is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const investor = await Investor.findOne({ 
      _id: req.params.id, 
      user: req.user.id 
    });
    
    if (!investor) {
      return res.status(404).json({ message: 'Investor not found' });
    }

    // Update fields
    Object.keys(req.body).forEach(key => {
      if (req.body[key] !== undefined) {
        investor[key] = req.body[key];
      }
    });

    await investor.save();
    res.json(investor);
  } catch (error) {
    console.error('Error updating investor:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete an investor profile
router.delete('/:id', auth, async (req, res) => {
  try {
    const investor = await Investor.findOne({ 
      _id: req.params.id, 
      user: req.user.id 
    });
    
    if (!investor) {
      return res.status(404).json({ message: 'Investor not found' });
    }

    await investor.deleteOne();
    res.json({ message: 'Investor deleted successfully' });
  } catch (error) {
    console.error('Error deleting investor:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Find matching investors based on criteria
router.post('/match', auth, [
  body('stage').optional().isIn(['idea', 'pre-seed', 'seed', 'series-a', 'series-b', 'series-c']),
  body('sector').optional().trim(),
  body('geography').optional().trim(),
  body('fundingAmount').optional().isNumeric(),
  body('investorType').optional().isIn(['vc', 'angel', 'accelerator', 'corporate', 'family_office'])
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { stage, sector, geography, fundingAmount, investorType } = req.body;
    
    const matchingInvestors = await Investor.findMatchingInvestors({
      stage,
      sector,
      geography,
      fundingAmount: fundingAmount ? parseInt(fundingAmount) : null,
      investorType
    });

    res.json(matchingInvestors);
  } catch (error) {
    console.error('Error finding matching investors:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Customize deck content for a specific investor
router.post('/:id/customize-deck', auth, [
  body('deckId').isMongoId().withMessage('Valid deck ID is required'),
  body('customizationType').isIn(['tone', 'content', 'focus_areas', 'full'])
    .withMessage('Valid customization type is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { deckId, customizationType } = req.body;

    // Get investor profile
    const investor = await Investor.findOne({ 
      _id: req.params.id, 
      user: req.user.id 
    });
    
    if (!investor) {
      return res.status(404).json({ message: 'Investor not found' });
    }

    // Get deck content (you'll need to implement this based on your deck structure)
    const deckContent = {
      // This would come from your deck model
      slides: [],
      startupInfo: {}
    };

    // Use AI service to customize content for this investor
    const customizedContent = await aiService.customizeForInvestor(
      deckContent,
      {
        type: investor.type,
        focus: investor.investmentCriteria.preferredSectors,
        stage: investor.investmentCriteria.preferredStages,
        location: investor.location?.country,
        communicationPreferences: investor.communicationPreferences
      }
    );

    res.json({
      investor: investor.getPublicProfile(),
      customizedContent,
      customizationType
    });
  } catch (error) {
    console.error('Error customizing deck for investor:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get investor persona insights
router.get('/:id/insights', auth, async (req, res) => {
  try {
    const investor = await Investor.findOne({ 
      _id: req.params.id, 
      user: req.user.id 
    });
    
    if (!investor) {
      return res.status(404).json({ message: 'Investor not found' });
    }

    // Generate insights based on investor profile
    const insights = {
      keyFocusAreas: investor.communicationPreferences.keyFocusAreas || [],
      dealBreakers: investor.communicationPreferences.dealBreakers || [],
      questionsToPrepare: investor.communicationPreferences.questionsToPrepare || [],
      investmentThesis: investor.investmentCriteria.investmentThesis,
      portfolioCompanies: investor.investmentCriteria.portfolioCompanies || [],
      communicationStyle: {
        preferredFormat: investor.communicationPreferences.preferredFormat,
        preferredLength: investor.communicationPreferences.preferredLength
      },
      matchScore: 0, // This would be calculated based on current startup
      recommendations: [
        `Focus on ${investor.communicationPreferences.keyFocusAreas?.join(', ') || 'traction and team'}`,
        `Prepare for ${investor.communicationPreferences.preferredLength} format`,
        `Highlight ${investor.investmentCriteria.preferredSectors?.join(', ') || 'market opportunity'}`
      ]
    };

    res.json(insights);
  } catch (error) {
    console.error('Error fetching investor insights:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 