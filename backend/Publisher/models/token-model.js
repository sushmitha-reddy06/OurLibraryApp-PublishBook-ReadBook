const mongoose = require('mongoose')

const tokenSchema = new mongoose.Schema({
    token: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        ref: 'Publisher',
        required: true,
    },
    expiresAt: {
        type: Date,
        required: true,
    },
});

module.exports = mongoose.model('Publisher-Token', tokenSchema, 'Publisher-Tokens');
