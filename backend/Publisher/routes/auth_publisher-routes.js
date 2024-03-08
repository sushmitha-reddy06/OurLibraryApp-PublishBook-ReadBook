const express = require('express');
const router = express.Router();
const generateToken = require('../../generateToken')
const authenticateJWT = require('../../verifyToken')
const RegisterPublisher = require('../services/auth_publisher-service');
const prefix = '/auth';

router.post(`${prefix}/register`, async (req, res) => {
    try {
        await RegisterPublisher.register(req, res);
    } catch (error) {
        console.error('Registration failed');
        res.status(500).json({ error: 'Registration failed' });
    }
});

router.post(`${prefix}/login`, async (req, res) => {
    try {
        await RegisterPublisher.login(req, res);
    } catch (error) {
        console.error('Login failed');
        res.status(500).json({ error: 'Login failed' });
    }
});

module.exports = router;