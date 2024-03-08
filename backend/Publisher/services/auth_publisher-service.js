const publisherModel = require('../models/auth_publisher-model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const secretKey = 'my_secret_book-review-publish-code-key';
const expirationTimeInMs = 24 * 60 * 60 * 1000; // 24 hours

class RegisterPublisher {
    async register(req, res) {
        const { name, email, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);

        try {
            if (!name || !email || !password) {
                console.log('Please enter all the required details.');
                return res.status(400).json({ message: "Please enter all the required details." });
            }

            const existingPublisher = await publisherModel.findOne({ email: email });
            if (existingPublisher) {
                console.log('Publisher with this email already exists!');
                return res.status(401).json({ message: 'Publisher with this email already exists!' });
            }

            const token = jwt.sign({ email: email }, secretKey, { expiresIn: expirationTimeInMs });
            const tokenWithBearer = `Bearer ${token}`;
            const expiresAt = new Date(Date.now() + expirationTimeInMs);

            const newPublisher = new publisherModel({
                role: 'Publisher',
                name,
                email,
                password: hashedPassword,
                token: {
                    token: tokenWithBearer,
                    expiresAt: expiresAt
                }
            });
            await newPublisher.save();

            console.log(`${newPublisher.name} registered successfully`);
            return res.status(200).json({ message: 'Publisher registered successfully', token: tokenWithBearer });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Internal server error.' });
        }
    }

    async login(req, res) {
        const { email, password } = req.body;
        try {
            const publisher = await publisherModel.findOne({ email: email });
            const adminId = publisher.adminId;
            if (!publisher) {
                console.log('Publisher not found!');
                return res.status(400).json({ message: "Publisher not found!" });
            }

            const passwordMatch = await bcrypt.compare(password, publisher.password);
            if (!passwordMatch) {
                console.log('Invalid email or password');
                return res.status(401).json({ message: "Invalid email or password" });
            }

            const token = jwt.sign({ email: email }, secretKey, { expiresIn: expirationTimeInMs });
            const tokenWithBearer = `Bearer ${token}`;
            const expiresAt = new Date(Date.now() + expirationTimeInMs);

            // Update token details in publisherModel
            publisher.token = {
                token: tokenWithBearer,
                expiresAt: expiresAt
            };
            await publisher.save();

            console.log(`${publisher.email} Logged in successfully!`);
            return res.status(200).json({ message: 'Login Successful!', token: tokenWithBearer, adminId: adminId });
        } catch (error) {
            console.error('Internal server error:', error);
            res.status(500).json({ message: 'Internal server error' });
        }
    }
}

module.exports = new RegisterPublisher();
