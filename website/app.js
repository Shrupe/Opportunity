require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cron = require('node-cron');
const fs = require('fs/promises');
const path = require('path');

const apiRoutes = require('./routes/api');
const Opportunity = require('./models/Opportunity');
const Subscriber = require('./models/Subscriber');
const { sendOpportunitiesEmail } = require('./services/emailService');

const app = express();

// --- MIDDLEWARE ---
app.use(express.json()); // To parse JSON bodies
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'views'))); // Serve static files like HTML, CSS

// --- DATABASE CONNECTION ---
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected successfully.'))
    .catch(err => console.error('MongoDB connection error:', err));

// --- API ROUTES ---
app.use('/api', apiRoutes);

// --- FRONTEND ROUTES ---
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'index.html'));
});
app.get('/news', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'news.html'));
});


// --- SCHEDULED TASK ---
// This task runs every day at 8:00 AM
cron.schedule('0 8 * * *', async () => {
    console.log('Running daily task: Fetching opportunities and sending emails...');
    try {
        // 1. Read data from the Python scraper's JSON file
        const dataPath = path.join(__dirname, 'data', 'opportunities.json');
        const fileContent = await fs.readFile(dataPath, 'utf-8');
        const opportunities = JSON.parse(fileContent);

        if (!opportunities || opportunities.length === 0) {
            console.log("No new opportunities found in JSON file.");
            return;
        }

        // 2. Save new opportunities to the database
        for (const op of opportunities) {
            // Mongoose's findOneAndUpdate with 'upsert' will create if it doesn't exist
            // based on the unique link, preventing duplicates.
            await Opportunity.findOneAndUpdate(
                { link: op.link },
                op,
                { upsert: true }
            );
        }
        console.log("Database updated with new opportunities.");

        // 3. Get all subscribers
        const subscribers = await Subscriber.find({});
        if (subscribers.length === 0) {
            console.log("No subscribers to email.");
            return;
        }

        // 4. Send emails
        console.log(`Sending emails to ${subscribers.length} subscribers...`);
        for (const subscriber of subscribers) {
            await sendOpportunitiesEmail(subscriber.email, opportunities);
        }
        console.log("Daily email task completed.");

    } catch (error) {
        console.error('Error during scheduled task:', error);
    }
});


// --- START SERVER ---
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));