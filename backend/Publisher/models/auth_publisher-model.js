const mongoose = require('mongoose');

const publisherSchema = new mongoose.Schema({
    role: {
        type: String,
    },
    name: {
        type: String,
    },
    email: {
        type: String,
    },
    password: {
        type: String,
    },
    adminId:  {
        type:  String,
        default: generateAdminId,
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

function generateAdminId() {
    const randomNumbers = Array.from({ length: 4 }, () => Math.floor(Math.random() * 20))

    const adminId = randomNumbers.join('');

    return adminId;
}

module.exports = mongoose.model('Publisher', publisherSchema, 'Publishers');
