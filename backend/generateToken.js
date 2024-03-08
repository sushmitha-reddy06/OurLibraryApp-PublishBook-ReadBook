const jwt = require('jsonwebtoken');
const secretKey = 'my_secret_book-review-publish-code-key';

function generateToken(req, res, next) {
    const { email } = req.body;
    const payload = {
        // userId: userId,
        email: email
    }
    return jwt.sign(
        payload,
        secretKey,
        { expiresIn: '24h'},
        (err, token) => {
            if (err) {
                console.error('Error generating token:', err);
                return res.status(500).json({ error: "Token generation failed" })
            }
            req.token = token;
            // console.log('token',  token);
            next();
        }
    )
}

module.exports = generateToken;