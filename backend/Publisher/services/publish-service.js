const express = require('express')
const bookModel = require('../models/publish-model')
const Publisher = require('../models/auth_publisher-model')
const path = require('path');
const fs = require('fs');


class publishService {
    async publishBook(req, res) {
        const { book_title, book_author, genre, description } = req.body;

        try {
            if (!book_title || !book_author || !genre || !description) {
                console.log("Please enter the book title and the book author");
                return res.status(400).json({ message: "Please enter the book title and the book author" });
            }

        const fileSizeInMB = (req.file.size / (1024 * 1024)).toFixed(2) + 'MB';

        const email = req.user;


            const publisher = await Publisher.findOne({ email: email }).exec();

            const existingBook = await bookModel.findOne({ book_title })
            if (existingBook) {
                return res.status(401).json({ message: "The book is already Published!" })
            }

            const ISBN_code = generateISBNCode()

            const relativeFilePath = path.join('uploads', req.file.filename).replace(/\\/g, '/');


            const newBook = new bookModel({
                adminId: publisher.adminId,
                book_title,
                book_author,
                genre,
                description,
                ISBN_code: ISBN_code,
                imageDetails: {
                    fileName: req.file.originalname,
                    path: relativeFilePath,
                    sizeMB: fileSizeInMB
                }
            });
            await newBook.save();

            return res.status(201).json({
                message: "Book published successfully:)",
                ISBN_code: ISBN_code,
                bookId: newBook.bookId,
                adminId: publisher.adminId
            });
        } catch (error) {
            console.log(error);
            return res.status(500).json({ message: 'Internal Server error' })
        }

        function generateISBNCode() {
            const randomNumbers = Array.from({ length: 4 }, () => Math.floor(Math.random() * 10));

            const ISBN_code = randomNumbers.join('');

            return ISBN_code;
        }
    }

    async getpublishedBooks(req, res) {
        try {
            const publishedBooks = await bookModel.find();
            return res.status(200).json({books: publishedBooks});
        } catch (error) {
            console.error('Error fetching published books:', error);
            return res.status(500).json({ messsage: 'Failed to fetch published books' });
        }
    }

    // async getBookDetailsForEdit(req, res) {
    //     try {
    //         const book = await bookModel.findOne(req.params.bookId);
    //         // Check if the book exists
    //         if (!book) {
    //             return res.status(404).json({ message: 'Book not found' });
    //         }

    //         // Check if the current user is authorized to edit the book
    //         if (String(book.adminId) !== String(req.user.adminId)) {
    //             return res.status(403).json({ message: 'You are not authorized to edit this book' });
    //         }

    //         res.json({ book });
    //     } catch (error) {
    //         console.error('Error getting book details for editing:', error);
    //         res.status(500).json({ error: 'Internal server error' });
    //     }
    // }

    async getAdminPublishedBooks(req, res) {
        try {
            const adminId = req.params.adminId;

            const publisher = await Publisher.findOne({ adminId: adminId });
            
            if (!publisher) {
                return res.status(404).json({ error: 'Publisher not found' });
            }

            const publishedBooks = await bookModel.find({ adminId: adminId })

            res.status(201).json({ publishedBooks, adminId: adminId })
        } catch (error) {
            console.error('Error Fetchingpublished books:', error);
            res.status(500).json({ error: 'Internal Server error' })
        }
    }

    async editBookDetails(req, res) {
        const email = req.user;
        try {
            const { book_title, book_author, genre, description } = req.body;

            const fileSizeInMB = (req.file.size / (1024 * 1024)).toFixed(2) + 'MB';
            const relativeFilePath = path.join('uploads', req.file.filename).replace(/\\/g, '/');

            let imageDetails;
            if (req.file) {
                // Update imageDetails with new filename, size, and path
                imageDetails = { filename: req.file.originalname, sizeMB: fileSizeInMB, path: relativeFilePath };
                
                // Delete the previous image file if it exists
                if (req.body.previousImagePath) {
                    fs.unlinkSync(req.body.previousImagePath);
                }
            }
    
            const book = await bookModel.findOne({ bookId: req.params.bookId });
    
            if (!book) {
                return res.status(404).json({ message: 'Book not found' });
            }
    
            const publisher = await Publisher.findOne({ email: email });
    
            // Check if the current user is authorized to edit the book
            if (String(book.adminId) !== String(publisher.adminId)) {
                return res.status(403).json({ message: 'You are not authorized to edit this book' });
            }
    
            // Update book details
            book.book_title = book_title;
            book.book_author = book_author;
            book.genre = genre;
            book.description = description;
            if (imageDetails) {
                book.imageDetails = imageDetails;
            }
    
            // Save the updated book
            await book.save();
    
            res.json({ message: 'Book details updated successfully', updatedBook: book, bookId: req.params.bookId });
        } catch (error) {
            console.error('Error editing book details:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }

    async deleteBookDetails(req, res) {
        const bookId = req.params.bookId;
        const email = req.user;
        try {
            const book = await bookModel.findOne({ bookId: bookId });
            if(!book) {
                console.log('book does not found!');
                return res.status(400).json({ message: 'Book does not found!' });
            }
            const publisher = await Publisher.findOne({ email: email })
            
            if(String(book.adminId) !== (publisher.adminId)) {
                console.log('You are not authorized to delete this book');
                return res.status(403).json({ message: 'You are not authorized to delete this book'});
            }
            await book.deleteOne();

            res.status(200).json({ message: 'Book deleted successfully' });
        } catch (error) {
            console.error('Error deleting book:', error);
            res.status(500).json({error: 'Internal server error'});
        }
    }

    async searchBook(req, res) {
        console.log('reqbody', req.body);
        try {
            const { query }  = req.query;
            console.log('req.query', req.query);

            if(!query) {
                console.error('Please provide a search query');
                return res.status(400).json({ error: 'Please provide a search query' })
            }

            const results = await bookModel.find({
                $or: [
                    { book_title: { $regex: new RegExp(query, 'i') } },
                    { book_author: { $regex: new RegExp(query, 'i') } },
                    { genre: { $regex: new RegExp(query, 'i') } },
                ]
            });
            console.log('results', results);
            
            res.json(results);
        } catch (error) {
            console.error('Error searching book:', error);
            res.status(500).json({ error: 'Internal Server Error!'})
        }
    }
}

module.exports = new publishService();