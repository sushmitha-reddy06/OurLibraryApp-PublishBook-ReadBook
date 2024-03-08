const express = require('express');
const router = express.Router();
const readerService = require('../services/reader-service')

const authenticateJWT = require('../../verifyToken')

const prefix = '/authReader'

router.post(`${prefix}/register`, async(req, res) => {
    try {
    await readerService.register(req, res);
    } catch (error) {
        console.error('Registration Failed!');
        res.status(500).json({error: 'Registration Failed!'})
    }
});

router.post(`${prefix}/login`, async(req, res) => {
    try {
        await readerService.login(req, res);
    } catch (error) {
        console.error('Login Failed!');
        res.status(500).json({ error: 'Registration Failed!'})
    }
});


module.exports = router