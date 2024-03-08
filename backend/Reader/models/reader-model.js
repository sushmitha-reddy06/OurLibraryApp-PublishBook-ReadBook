const mongoose = require('mongoose');

const readerSchema = mongoose.Schema({
    role: {
        type: String
    },
    name: {
        type: String
    },
    email: {
        type: String
    },
    password: {
        type: String
    },
    userId: {
        type: String,
        default: generateUserId,
        required: true,
        unique: true

    },
    token: {
        token: {
            type: String,
        },
        expiresAt: {
            type: String,
        }

    }
});

function generateUserId() {
    const randomNumbers = Array.from({ length: 4 }, () => Math.floor(Math.random() * 20))

    const userId = randomNumbers.join('');

    return userId;
}

module.exports = mongoose.model('Reader', readerSchema, 'Readers')