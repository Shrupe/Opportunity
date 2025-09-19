const news = require('../models/Opportunity');

exports.getOpportunities = async (req, res) => {
    try {
        // Get the latest 10 opportunities, sorted by creation date
        const opportunities = await Opportunity.find().sort({ createdAt: -1 }).limit(10);
        res.status(200).json(opportunities);
    } catch (error) {
        res.status(500).json({ message: 'Server error.', error: error.message });
    }
};