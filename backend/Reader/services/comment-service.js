const Comment = require('../models/comment-model');
const Reader = require('../models/reader-model');
const Books = require('../../Publisher/models/publish-model');

class CommentService { // Capitalized class name convention
    async postComment(req, res) {
        try {
            const bookId = req.params.bookId;
            const { comment, rating } = req.body;
            const email = req.user;

            if (!comment || !rating) {
                console.log('Please write a comment and give your ratings!');
                return res.status(400).json({ message: 'Please write a comment and give your ratings!' });
            }

            const commentedBook = await Books.findOne({ bookId: bookId });
            if (!commentedBook) {
                console.log('Unable to find the book!');
                return res.status(404).json({ error: 'Unable to find the book!' }); // Correct HTTP status code
            }

            const commenter = await Reader.findOne({ email: email });
            if (!commenter) {
                console.log('Unable to find the commenter');
                return res.status(404).json({ error: 'Unable to find the commenter!' }); // Correct HTTP status code
            }

            const newComment = new Comment({
                email,
                bookId,
                comment,
                rating,
            });
 
            await newComment.save();

            console.log('Your comment posted successfully.');
            return res.status(200).json({ message: 'Your comment posted successfully.', bookId: bookId, email: email});

        } catch (error) {
            console.log('Error posting the comment');
            return res.status(500).json({ error: 'Error posting the comment!' });
        }
    }

    async getBookbyBookId(req, res) {
        try {
            const bookId = req.params.bookId;

            const book = await Books.findOne({ bookId: bookId });

            if (!book) {
                console.log(`Unable find the book with the bookId: ${bookId}`);
                return res.status(400).json({ error: `Unable find the book with the bookId: ${bookId}`});
            }

            return res.status(200).json(book);
        } catch (error) {
            console.error('Error fetching the book by bookId');
            return res.status(500).json({ error: 'Internal server error!'})
        }
    }

    async recentComments(req, res) {
        try {
            const bookId = req.params.bookId;
            const comments = await Comment.find({ bookId: bookId }).sort({ _id: -1 }).limit(3);
            return res.status(200).json(comments);
        } catch (error) {
            console.error('Error fetching recent comments:', error);
            return res.status(500).json({ error: 'Internal server error' })
        }
    }
}

module.exports = new CommentService();
