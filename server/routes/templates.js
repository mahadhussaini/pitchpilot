const express = require('express');
const auth = require('../middleware/auth');

const router = express.Router();

// Get all templates
router.get('/', auth, async (req, res) => {
  try {
    // TODO: Implement template fetching logic
    res.json([
      {
        id: 'default',
        name: 'Default Template',
        description: 'Standard pitch deck template',
        category: 'general',
        slides: ['problem', 'solution', 'market', 'traction', 'team', 'financials', 'ask']
      },
      {
        id: 'saas',
        name: 'SaaS Template',
        description: 'Optimized for SaaS companies',
        category: 'saas',
        slides: ['problem', 'solution', 'market', 'traction', 'business-model', 'team', 'financials', 'ask']
      },
      {
        id: 'fintech',
        name: 'Fintech Template',
        description: 'Designed for fintech startups',
        category: 'fintech',
        slides: ['problem', 'solution', 'market', 'traction', 'business-model', 'team', 'financials', 'ask']
      }
    ]);
  } catch (error) {
    console.error('Error fetching templates:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get template by ID
router.get('/:id', auth, async (req, res) => {
  try {
    // TODO: Implement template fetching logic
    res.json({
      id: req.params.id,
      name: 'Template',
      description: 'Template description',
      category: 'general',
      slides: ['problem', 'solution', 'market', 'traction', 'team', 'financials', 'ask']
    });
  } catch (error) {
    console.error('Error fetching template:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 