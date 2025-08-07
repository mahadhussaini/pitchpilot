const express = require('express');
const { body, validationResult } = require('express-validator');
const Deck = require('../models/Deck');
const auth = require('../middleware/auth');
const aiService = require('../services/aiService');

const router = express.Router();

// Get all decks for the authenticated user
router.get('/', auth, async (req, res) => {
  try {
    const decks = await Deck.find({ user: req.user.id })
      .select('title description status createdAt updatedAt slideCount analytics')
      .sort({ updatedAt: -1 });

    res.json(decks);
  } catch (error) {
    console.error('Error fetching decks:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get a specific deck by ID
router.get('/:id', auth, async (req, res) => {
  try {
    // Validate ObjectId
    if (!req.params.id || req.params.id === 'undefined' || req.params.id === 'new') {
      return res.status(400).json({ message: 'Invalid deck ID' });
    }

    const deck = await Deck.findOne({ _id: req.params.id, user: req.user.id });
    
    if (!deck) {
      return res.status(404).json({ message: 'Deck not found' });
    }

    res.json(deck.getEditData());
  } catch (error) {
    console.error('Error fetching deck:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create a new deck
router.post('/', auth, [
  body('title').trim().isLength({ min: 1 }).withMessage('Title is required'),
  body('description').optional().trim(),
  body('startupInfo').optional().isObject(),
  body('targetInvestors').optional().isArray(),
  body('tags').optional().isArray()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, description, startupInfo, targetInvestors, tags } = req.body;

    const deck = new Deck({
      user: req.user.id,
      title,
      description,
      startupInfo: startupInfo || {},
      targetInvestors: targetInvestors || [],
      tags: tags || [],
      slides: []
    });

    await deck.save();
    res.status(201).json(deck.getEditData());
  } catch (error) {
    console.error('Error creating deck:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Generate AI-powered deck content
router.post('/:id/generate', auth, [
  body('startupInfo').isObject().withMessage('Startup info is required'),
  body('targetInvestors').optional().isArray()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Validate ObjectId
    if (!req.params.id || req.params.id === 'undefined' || req.params.id === 'new') {
      return res.status(400).json({ message: 'Invalid deck ID' });
    }

    const deck = await Deck.findOne({ _id: req.params.id, user: req.user.id });
    if (!deck) {
      return res.status(404).json({ message: 'Deck not found' });
    }

    const { startupInfo, targetInvestors } = req.body;

    // Generate AI content
    const generatedSlides = await aiService.generatePitchDeck(startupInfo, targetInvestors);

    // Update deck with generated content
    deck.startupInfo = startupInfo;
    deck.slides = generatedSlides;
    deck.targetInvestors = targetInvestors || [];
    deck.aiGenerated = true;
    deck.aiPrompt = `Generated deck for ${startupInfo.name} in ${startupInfo.industry}`;

    await deck.save();

    res.json({
      message: 'Deck generated successfully',
      deck: deck.getEditData()
    });
  } catch (error) {
    console.error('Error generating deck:', error);
    res.status(500).json({ 
      message: 'Failed to generate deck content',
      error: error.message 
    });
  }
});

// Update deck content
router.put('/:id', auth, [
  body('title').optional().trim().isLength({ min: 1 }),
  body('description').optional().trim(),
  body('startupInfo').optional().isObject(),
  body('slides').optional().isArray(),
  body('theme').optional().isObject(),
  body('status').optional().isIn(['draft', 'review', 'published', 'archived']),
  body('targetInvestors').optional().isArray(),
  body('tags').optional().isArray()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Validate ObjectId
    if (!req.params.id || req.params.id === 'undefined' || req.params.id === 'new') {
      return res.status(400).json({ message: 'Invalid deck ID' });
    }

    const deck = await Deck.findOne({ _id: req.params.id, user: req.user.id });
    if (!deck) {
      return res.status(404).json({ message: 'Deck not found' });
    }

    // Update allowed fields
    const updateFields = ['title', 'description', 'startupInfo', 'slides', 'theme', 'status', 'targetInvestors', 'tags'];
    updateFields.forEach(field => {
      if (req.body[field] !== undefined) {
        deck[field] = req.body[field];
      }
    });

    await deck.save();
    res.json(deck.getEditData());
  } catch (error) {
    console.error('Error updating deck:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Analyze slide content
router.post('/:id/slides/:slideIndex/analyze', auth, async (req, res) => {
  try {
    // Validate ObjectId
    if (!req.params.id || req.params.id === 'undefined' || req.params.id === 'new') {
      return res.status(400).json({ message: 'Invalid deck ID' });
    }

    const deck = await Deck.findOne({ _id: req.params.id, user: req.user.id });
    if (!deck) {
      return res.status(404).json({ message: 'Deck not found' });
    }

    const slideIndex = parseInt(req.params.slideIndex);
    if (slideIndex < 0 || slideIndex >= deck.slides.length) {
      return res.status(400).json({ message: 'Invalid slide index' });
    }

    const slide = deck.slides[slideIndex];
    const feedback = await aiService.analyzeSlide(slide.content, slide.type);

    // Update slide with AI feedback
    deck.slides[slideIndex].aiFeedback = feedback;
    await deck.save();

    res.json({
      slideIndex,
      feedback,
      slide: deck.slides[slideIndex]
    });
  } catch (error) {
    console.error('Error analyzing slide:', error);
    res.status(500).json({ message: 'Failed to analyze slide' });
  }
});

// Get slide improvement suggestions
router.post('/:id/slides/:slideIndex/suggestions', auth, async (req, res) => {
  try {
    // Validate ObjectId
    if (!req.params.id || req.params.id === 'undefined' || req.params.id === 'new') {
      return res.status(400).json({ message: 'Invalid deck ID' });
    }

    const deck = await Deck.findOne({ _id: req.params.id, user: req.user.id });
    if (!deck) {
      return res.status(404).json({ message: 'Deck not found' });
    }

    const slideIndex = parseInt(req.params.slideIndex);
    if (slideIndex < 0 || slideIndex >= deck.slides.length) {
      return res.status(400).json({ message: 'Invalid slide index' });
    }

    const slide = deck.slides[slideIndex];
    const targetInvestor = req.body.targetInvestor || null;
    
    const suggestions = await aiService.suggestImprovements(
      slide.content, 
      slide.type, 
      targetInvestor
    );

    res.json({
      slideIndex,
      suggestions
    });
  } catch (error) {
    console.error('Error getting suggestions:', error);
    res.status(500).json({ message: 'Failed to get suggestions' });
  }
});

// Customize deck for specific investor
router.post('/:id/customize', auth, [
  body('investorProfile').isObject().withMessage('Investor profile is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Validate ObjectId
    if (!req.params.id || req.params.id === 'undefined' || req.params.id === 'new') {
      return res.status(400).json({ message: 'Invalid deck ID' });
    }

    const deck = await Deck.findOne({ _id: req.params.id, user: req.user.id });
    if (!deck) {
      return res.status(404).json({ message: 'Deck not found' });
    }

    const { investorProfile } = req.body;

    // Customize each slide for the investor
    const customizedSlides = [];
    for (let i = 0; i < deck.slides.length; i++) {
      const slide = deck.slides[i];
      const customizedContent = await aiService.customizeForInvestor(slide.content, investorProfile);
      
      customizedSlides.push({
        ...slide.toObject(),
        content: customizedContent,
        customizations: {
          ...slide.customizations,
          [investorProfile.type]: customizedContent
        }
      });
    }

    deck.slides = customizedSlides;
    deck.targetInvestors = [investorProfile];
    await deck.save();

    res.json({
      message: 'Deck customized successfully',
      deck: deck.getEditData()
    });
  } catch (error) {
    console.error('Error customizing deck:', error);
    res.status(500).json({ message: 'Failed to customize deck' });
  }
});

// Share deck (generate share token)
router.post('/:id/share', auth, async (req, res) => {
  try {
    // Validate ObjectId
    if (!req.params.id || req.params.id === 'undefined' || req.params.id === 'new') {
      return res.status(400).json({ message: 'Invalid deck ID' });
    }

    const deck = await Deck.findOne({ _id: req.params.id, user: req.user.id });
    if (!deck) {
      return res.status(404).json({ message: 'Deck not found' });
    }

    const shareToken = deck.generateShareToken();
    deck.isPublic = true;
    await deck.save();

    res.json({
      shareToken,
      shareUrl: `${process.env.CLIENT_URL || 'http://localhost:3000'}/deck/${shareToken}`
    });
  } catch (error) {
    console.error('Error sharing deck:', error);
    res.status(500).json({ message: 'Failed to share deck' });
  }
});

// Get shared deck (public access)
router.get('/shared/:token', async (req, res) => {
  try {
    const deck = await Deck.findOne({ shareToken: req.params.token, isPublic: true });
    if (!deck) {
      return res.status(404).json({ message: 'Deck not found or not shared' });
    }

    // Track view analytics
    deck.analytics.views += 1;
    deck.analytics.lastViewed = new Date();
    await deck.save();

    res.json(deck.getPublicData());
  } catch (error) {
    console.error('Error fetching shared deck:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete deck
router.delete('/:id', auth, async (req, res) => {
  try {
    // Validate ObjectId
    if (!req.params.id || req.params.id === 'undefined' || req.params.id === 'new') {
      return res.status(400).json({ message: 'Invalid deck ID' });
    }

    const deck = await Deck.findOne({ _id: req.params.id, user: req.user.id });
    if (!deck) {
      return res.status(404).json({ message: 'Deck not found' });
    }

    await deck.deleteOne();
    res.json({ message: 'Deck deleted successfully' });
  } catch (error) {
    console.error('Error deleting deck:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Duplicate deck
router.post('/:id/duplicate', auth, async (req, res) => {
  try {
    // Validate ObjectId
    if (!req.params.id || req.params.id === 'undefined' || req.params.id === 'new') {
      return res.status(400).json({ message: 'Invalid deck ID' });
    }

    const originalDeck = await Deck.findOne({ _id: req.params.id, user: req.user.id });
    if (!originalDeck) {
      return res.status(404).json({ message: 'Deck not found' });
    }

    const duplicatedDeck = new Deck({
      user: req.user.id,
      title: `${originalDeck.title} (Copy)`,
      description: originalDeck.description,
      startupInfo: originalDeck.startupInfo,
      slides: originalDeck.slides,
      template: originalDeck.template,
      theme: originalDeck.theme,
      targetInvestors: originalDeck.targetInvestors,
      tags: originalDeck.tags,
      status: 'draft'
    });

    await duplicatedDeck.save();
    res.status(201).json(duplicatedDeck.getEditData());
  } catch (error) {
    console.error('Error duplicating deck:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 