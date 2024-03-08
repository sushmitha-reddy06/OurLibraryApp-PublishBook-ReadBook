const bookModel = require('./models/publish-model')

async function getNextBookId() {
    try {
        const sequence = await bookModel.findOneAndUpdate(
            { bookId: 'bookId' },
            { $inc: { value: 1 }},
            { new: true, upsert: true }
        );
        console.log('sequence', sequence);
    } catch (error) {
        console.error('Error:', error.message);
        throw new Error('Interenal server error');
    }
}

module.exports = getNextBookId;