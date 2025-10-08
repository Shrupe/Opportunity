const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create a schema
const subscriberSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },
    subscribedAt: {
        type: Date,
        default: Date.now,
    },
});

// Create a model
const Subscriber = mongoose.model('Subscriber', subscriberSchema);
module.exports = Subscriber;