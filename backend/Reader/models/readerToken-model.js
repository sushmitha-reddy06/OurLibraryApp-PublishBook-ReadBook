const mongoose = require('mongoose')

const readerTokenSchema = new mongoose.Schema({
    token: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        ref: 'Reader',
        required: true,
    },
    expiresAt: {
        type: Date,
        required: true,
    },
});

module.exports = mongoose.model('Reader-Token', readerTokenSchema, 'Reader-Tokens');
