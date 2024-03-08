const mongoose = require('mongoose');

const BookSchema = new mongoose.Schema({
    adminId: {
        type: String,
        required: true
    },
    bookId: {
        type: Number,
        unique: true,
        // required: true,
    },
    // book_coverImg: {
    //     type: String,
    //     required: true
    // },
    book_title: {
        type: String,
    },
    book_author: {
        type: String,
    },
    genre: {
        type: String,
    },
    description: {
        type: String,
    },
    ISBN_code: {
        type: String,
        unique: true,
    },
    publishedAt: {
        type: Date, 
        default: Date.now,
    },
    imageDetails: {
        fileName: String,
        path: String,
        sizeMB: String,
    } 
});
// BookSchema.pre('save', function(next) {
//     this.publishedAt = new Date();
//     next();
// });
BookSchema.pre('save', async function(next) {
    if (!this.isNew) {
        return next(); // If document is not new, proceed
    }

    try {
        // Find the maximum bookId in the collection and increment it
        const maxBook = await mongoose.model('Book').findOne().sort({ bookId: -1 });
        this.bookId = (maxBook && maxBook.bookId) ? maxBook.bookId + 1 : 1;
        next();
    } catch (error) {
        next(error);
    }
});

module.exports = mongoose.model("Book", BookSchema, 'Books')