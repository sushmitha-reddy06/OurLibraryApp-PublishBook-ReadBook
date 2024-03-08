const express = require('express');
const router = express.Router();
const CommentService = require('../services/comment-service'); // Capitalized class name convention
const authenticateJWT = require('../../verifyToken');
const prefix = '/ratings';

router.post(`${prefix}/comment/:bookId`, authenticateJWT, async (req, res) => {
    try {
        await CommentService.postComment(req, res); 
    } catch (error) {
        console.error('Failed to post the comment!');
        return res.status(500).json({ error: 'Internal server error!' });
    }
});

router.get(`${prefix}/getBooks/:bookId`, async(req, res) => {
    try {
        await CommentService.getBookbyBookId(req, res);
    } catch (error) {
        console.error('Failed to fetch books by bookId');
        return res.status(500).json({ error: 'Internal server Error!'})
    }
})

router.get(`${prefix}/recent-comments/:bookId`, async (req, res) => {
    try {
        await CommentService.recentComments(req, res);
    } catch (error) {
        console.error('Error fetching recent comments:', error);
        return res.status(500).json({ error: 'Internal Server error'});      
    }
})
module.exports = router;
