const express = require('express');
const router = express.Router();
const subController = require('../controllers/subController');
const newsController = require('../controllers/newsController');

// Subscription route
router.post('/subscribe', subController.addSub);

// Opportunities route
router.get('/news', newsController.getNews);

module.exports = router;