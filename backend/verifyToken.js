const jwt = require('jsonwebtoken');
// const Token = require('../backend/Publisher/models/token-model');

const secretKey = 'my_secret_book-review-publish-code-key';

async function authenticateJWT(req, res, next) {
    const token = req.headers.authorization;

    if (!token) {
        return res.status(401).json({ message: 'Missing JWT token' });
    }

    try {

        const tokenParts = token.split(' ');
        const tokenWithoutBearer = tokenParts[1];
        const decoded = jwt.verify(tokenWithoutBearer, secretKey);

        if (decoded.email) {
            req.user = decoded.email;
        } else if (decoded.adminId) {
            req.user = decoded.adminId;
        } else {
            throw new Error('Invalid token content')
        }
        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Expired JWT token' });
        } else if (error.name === 'JsonWebTokenError') {
            return res.status(403).json({ message: 'Invalid JWT token' });
        } else {
            console.error('Error', error);
            return res.status(403).json({ message: 'Invalid JWT token' });
        }
    }
}

module.exports = authenticateJWT;