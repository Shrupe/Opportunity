const express = require('express');
const router = express.Router();
const subscriberController = require('../controllers/subController');
const opportunityController = require('../controllers/oppController');

// Subscription route
router.post('/subscribe', subscriberController.addSubscriber);

// Opportunities route
router.get('/opportunities', opportunityController.getOpportunities);

module.exports = router;