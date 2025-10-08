const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create a schema
const newSchema = new Schema({
    title: {
        type: String, 
        required: true
    },
    link: {
        type: String, 
        required: true, 
        unique: true 
    },
    summary: {
        type: String, 
        required: true 
    },
    source: {
        type: String, 
        required: true
    },
    createdAt: {
        type: Date, 
        default: Date.now
    },
});

// Create a model
const New = mongoose.model('Opportunity', newSchema);
module.exports = New;