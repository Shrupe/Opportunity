const Subscriber = require('../models/Subscriber');

exports.addSubscriber = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({ message: 'Email is required.' });
        }

        const existingSubscriber = await Subscriber.findOne({ email });
        if (existingSubscriber) {
            return res.status(409).json({ message: 'This email is already subscribed.' });
        }

        const newSubscriber = new Subscriber({ email });
        await newSubscriber.save();
        res.status(201).json({ message: 'Subscription successful!' });
        
    } catch (error) {
        res.status(500).json({ message: 'Server error.', error: error.message });
    }
};