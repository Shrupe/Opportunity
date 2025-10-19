const News = require('../models/News');

exports.getNews = async (req, res) => {
    try {
        // Get the latest 10 opportunities, sorted by creation date
        const news = await News.find().sort({ createdAt: -1 }).limit(10);
        res.status(200).json(news);
    } catch (error) {
        res.status(500).json({ 
            message: 'Server error.',
            error: error.message 
        });
    }
};