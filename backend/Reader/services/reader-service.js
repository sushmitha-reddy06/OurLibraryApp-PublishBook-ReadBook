const express = require('express')
const Reader = require('../models/reader-model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')

const secretKey = 'my_secret_book-review-publish-code-key';
const expirationTimeInMs = 24 * 60 * 60 * 1000; //24 hours

class ReaderService {
    async register(req, res) {
        const { name, email, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);

        try {

        if (!name || !email || !password) {
            console.log('Please enter all the details required');
            return res.status(400).json({ message: 'Please enter all the details required'})
        }

        const existingReader = await Reader.findOne({ email: email })
        if (existingReader) {
            console.log('Reader with this email already exist!');
            res.status(401).json({ message: 'Reader with this email already exist!' })
        }

        const token = jwt.sign({ email: email }, secretKey, { expiresIn: expirationTimeInMs })

        const tokenWithBearer = `Bearer ${token}`

        const expiresAt = new Date(Date.now() + expirationTimeInMs)

        const newReader = new Reader({
            role: 'Reader',
            name,
            email,
            password: hashedPassword,
            token: {
                token: tokenWithBearer,
                expiresAt,
            }
        });
        await newReader.save();

        console.log(`${newReader.name} Reader registered successfully.`);
        return res.status(200).json({ message: 'Reader Registration Successfull', token: tokenWithBearer });

        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Internal server error!'})    
        }
    }

    async login(req, res) {
        const { email, password } = req.body;
        try {
            const reader = await Reader.findOne({ email: email });
            if(!reader) {
                console.log('Reader not found!');
                return res.status(400).json({ message: 'Reader not found!'});
            }

            const passwordMatch = await bcrypt.compare(password, reader.password);

            if(!passwordMatch) {
                console.log('Invalid email or password!');
                return res.status(401).json({ message: 'Invalid email or password!'})
            }

            
            const token = jwt.sign({ email: email }, secretKey, { expiresIn: expirationTimeInMs });
            const tokenWithBearer = `Bearer ${token}`;
            const expiresAt = new Date(Date.now() + expirationTimeInMs);

            // Update token details in publisherModel
            reader.token = {
                token: tokenWithBearer,
                expiresAt: expiresAt
            };
            await reader.save();

            console.log(`${reader.email} reader Logged in successfully!`);
            return res.status(200).json({ message: `Reader Logged in successfully!`, email: reader.email, token: tokenWithBearer})
         } catch (error) {
            console.error('Internal server error:', error);
            res.status(500).json({ message: 'Internal server error' })  
        }
    }
}

module.exports = new ReaderService()