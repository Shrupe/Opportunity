const mongoose = require('mongoose');

const opportunitySchema = new mongoose.Schema({
    title: { type: String, required: true },
    link: { type: String, required: true, unique: true }, // unique link prevents duplicates
    summary: { type: String, required: true },
    source: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Opportunity', opportunitySchema);