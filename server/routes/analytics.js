const express = require('express');
const { body, validationResult } = require('express-validator');
const auth = require('../middleware/auth');
const { ViewEvent, DeckAnalytics, InvestorInteraction } = require('../models/Analytics');
const Deck = require('../models/Deck');

const router = express.Router();

// Track view event
router.post('/track', async (req, res) => {
  try {
    const { deckId, sessionId, viewerId, viewerType, slideViews, duration, userAgent, ipAddress, referrer } = req.body;

    const viewEvent = new ViewEvent({
      deckId,
      sessionId,
      viewerId: viewerId || 'anonymous',
      viewerType: viewerType || 'anonymous',
      slideViews: slideViews || [],
      duration: duration || 0,
      userAgent,
      ipAddress,
      referrer
    });

    await viewEvent.save();

    // Update deck analytics
    await DeckAnalytics.getDeckAnalytics(deckId);

    res.json({ success: true });
  } catch (error) {
    console.error('Error tracking view event:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get analytics for a specific deck
router.get('/deck/:id', auth, async (req, res) => {
  try {
    const deck = await Deck.findOne({ _id: req.params.id, user: req.user.id });
    if (!deck) {
      return res.status(404).json({ message: 'Deck not found' });
    }

    const analytics = await DeckAnalytics.getDeckAnalytics(req.params.id);
    const investorInteractions = await InvestorInteraction.find({ deckId: req.params.id });

    res.json({
      deck: {
        id: deck._id,
        title: deck.title,
        status: deck.status
      },
      analytics: {
        totalViews: analytics.totalViews,
        uniqueViews: analytics.uniqueViews,
        avgViewTime: Math.round(analytics.avgViewTime / 60 * 100) / 100, // Convert to minutes
        slideEngagement: analytics.slideEngagement,
        viewerDemographics: analytics.viewerDemographics,
        engagementMetrics: analytics.engagementMetrics,
        lastViewed: analytics.lastViewed,
        firstViewed: analytics.firstViewed
      },
      investorInteractions: investorInteractions.map(interaction => ({
        id: interaction._id,
        investorName: interaction.investorName,
        investorType: interaction.investorType,
        interestLevel: interaction.interestLevel,
        status: interaction.status,
        lastInteraction: interaction.interactions[interaction.interactions.length - 1]?.timestamp,
        totalInteractions: interaction.interactions.length
      }))
    });
  } catch (error) {
    console.error('Error fetching analytics:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user analytics overview
router.get('/overview', auth, async (req, res) => {
  try {
    const userDecks = await Deck.find({ user: req.user.id }).select('_id title');
    const deckIds = userDecks.map(deck => deck._id);

    const analyticsPromises = deckIds.map(deckId => DeckAnalytics.getDeckAnalytics(deckId));
    const allAnalytics = await Promise.all(analyticsPromises);

    const totalViews = allAnalytics.reduce((sum, analytics) => sum + analytics.totalViews, 0);
    const totalUniqueViews = allAnalytics.reduce((sum, analytics) => sum + analytics.uniqueViews, 0);
    const totalViewTime = allAnalytics.reduce((sum, analytics) => sum + analytics.totalViewTime, 0);
    const avgViewTime = totalViews > 0 ? totalViewTime / totalViews : 0;

    // Get top performing decks
    const topDecks = allAnalytics
      .map((analytics, index) => ({
        deckId: deckIds[index],
        title: userDecks[index].title,
        views: analytics.totalViews,
        uniqueViews: analytics.uniqueViews,
        avgViewTime: Math.round(analytics.avgViewTime / 60 * 100) / 100
      }))
      .sort((a, b) => b.views - a.views)
      .slice(0, 5);

    res.json({
      totalViews,
      totalUniqueViews,
      totalDecks: userDecks.length,
      avgViewTime: Math.round(avgViewTime / 60 * 100) / 100, // Convert to minutes
      topDecks,
      recentActivity: allAnalytics
        .filter(analytics => analytics.lastViewed)
        .sort((a, b) => new Date(b.lastViewed) - new Date(a.lastViewed))
        .slice(0, 10)
        .map((analytics, index) => ({
          deckId: deckIds[index],
          title: userDecks[index].title,
          lastViewed: analytics.lastViewed,
          views: analytics.totalViews
        }))
    });
  } catch (error) {
    console.error('Error fetching analytics overview:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Add investor interaction
router.post('/investor-interaction', auth, [
  body('deckId').isMongoId().withMessage('Valid deck ID is required'),
  body('investorId').notEmpty().withMessage('Investor ID is required'),
  body('investorName').optional().trim(),
  body('investorType').isIn(['vc', 'angel', 'accelerator', 'corporate']).withMessage('Valid investor type is required'),
  body('interactionType').isIn(['view', 'download', 'share', 'contact', 'follow_up']).withMessage('Valid interaction type is required'),
  body('interestLevel').optional().isIn(['high', 'medium', 'low', 'unknown']),
  body('notes').optional().trim()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      deckId,
      investorId,
      investorName,
      investorType,
      interactionType,
      interestLevel,
      notes
    } = req.body;

    // Verify deck belongs to user
    const deck = await Deck.findOne({ _id: deckId, user: req.user.id });
    if (!deck) {
      return res.status(404).json({ message: 'Deck not found' });
    }

    let interaction = await InvestorInteraction.findOne({ deckId, investorId });

    if (!interaction) {
      interaction = new InvestorInteraction({
        deckId,
        investorId,
        investorName,
        investorType,
        interestLevel: interestLevel || 'unknown',
        notes
      });
    }

    interaction.interactions.push({
      type: interactionType,
      timestamp: new Date()
    });

    if (interestLevel) {
      interaction.interestLevel = interestLevel;
    }

    if (notes) {
      interaction.notes = notes;
    }

    await interaction.save();

    res.json({
      success: true,
      interaction: {
        id: interaction._id,
        investorName: interaction.investorName,
        investorType: interaction.investorType,
        interestLevel: interaction.interestLevel,
        status: interaction.status,
        totalInteractions: interaction.interactions.length
      }
    });
  } catch (error) {
    console.error('Error adding investor interaction:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update investor interaction status
router.put('/investor-interaction/:id', auth, [
  body('status').isIn(['pending', 'contacted', 'meeting_scheduled', 'passed', 'invested']).withMessage('Valid status is required'),
  body('interestLevel').optional().isIn(['high', 'medium', 'low', 'unknown']),
  body('notes').optional().trim(),
  body('followUpDate').optional().isISO8601()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { status, interestLevel, notes, followUpDate } = req.body;

    const interaction = await InvestorInteraction.findById(req.params.id);
    if (!interaction) {
      return res.status(404).json({ message: 'Interaction not found' });
    }

    // Verify deck belongs to user
    const deck = await Deck.findOne({ _id: interaction.deckId, user: req.user.id });
    if (!deck) {
      return res.status(403).json({ message: 'Access denied' });
    }

    interaction.status = status;
    if (interestLevel) interaction.interestLevel = interestLevel;
    if (notes) interaction.notes = notes;
    if (followUpDate) interaction.followUpDate = new Date(followUpDate);

    await interaction.save();

    res.json({
      success: true,
      interaction: {
        id: interaction._id,
        investorName: interaction.investorName,
        investorType: interaction.investorType,
        interestLevel: interaction.interestLevel,
        status: interaction.status,
        totalInteractions: interaction.interactions.length
      }
    });
  } catch (error) {
    console.error('Error updating investor interaction:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get slide-level analytics
router.get('/deck/:id/slides', auth, async (req, res) => {
  try {
    const deck = await Deck.findOne({ _id: req.params.id, user: req.user.id });
    if (!deck) {
      return res.status(404).json({ message: 'Deck not found' });
    }

    const analytics = await DeckAnalytics.getDeckAnalytics(req.params.id);
    
    // Map slide engagement to slide titles
    const slideAnalytics = deck.slides.map((slide, index) => {
      const engagement = analytics.slideEngagement.find(eng => eng.slideIndex === index);
      return {
        slideIndex: index,
        title: slide.title,
        type: slide.type,
        views: engagement?.views || 0,
        avgTimeSpent: engagement?.avgTimeSpent || 0,
        dropOffRate: engagement?.dropOffRate || 0,
        interactions: engagement?.interactions || 0
      };
    });

    res.json(slideAnalytics);
  } catch (error) {
    console.error('Error fetching slide analytics:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 