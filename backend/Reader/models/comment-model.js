const mongoose = require('mongoose');

const commentSchema = mongoose.Schema({
    email: {
        type: String,
        ref: 'Reader',
    },
    bookId: {
        type: String,
    },
    comment: {
        type: String,
    },
    rating: {
        type: String
    },
    commentId: {
        type: Number,
        unique: true,
    }
});

commentSchema.pre('save', async function(next) {
    if (!this.isNew) {
        return next(); // If document is not new, proceed
    }

    try {
        // Find the maximum bookId in the collection and increment it
        const maxComment = await mongoose.model('Comment').findOne().sort({ commentId: -1 });
        this.commentId = (maxComment && maxComment.commentId) ? maxComment.commentId + 1 : 1;
        next();
    } catch (error) {
        next(error);
    }
});

module.exports = mongoose.model('Comment', commentSchema, 'Comments')