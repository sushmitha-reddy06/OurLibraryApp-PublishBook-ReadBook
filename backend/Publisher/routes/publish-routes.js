const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const router = express.Router();
const os = require('os')
const publishService = require('../services/publish-service');
const authenticateJWT = require('../../verifyToken');
const prefix = '/home'

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = path.join(__dirname, 'uploads');
        const tempPath = path.join('C:', 'Windows', 'Temp', 'mytempfolder');


        if(!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath);
        }

        if (!fs.existsSync(tempPath)) {
            fs.mkdirSync(tempPath, { recursive: true });
        }

        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
});
const upload = multer({ storage });

// Custom middleware to save the file to the temporary folder after it's been uploaded
const saveToTempFolder = (req, res, next) => {
    const tempPath = path.join('C:', 'Windows', 'Temp',  'mytempfolder');
    const file = req.file;
    const tempFilePath = path.join(tempPath, file.originalname);

    // Copy the uploaded file to the temporary folder
    fs.copyFile(file.path, tempFilePath, (err) => {
        if (err) {
            console.error('Error copying file to temporary folder:', err);
            return res.status(500).json({ error: 'Failed to save file to temporary folder' });
        }
        req.tempFilePath = tempFilePath; // Store the temporary file path in request object
        next();
    });
};

router.post(`${prefix}/publish`, authenticateJWT, upload.single('file'), saveToTempFolder, async (req, res) => {
    try {
        await publishService.publishBook(req, res);
    } catch (error) {
        console.error('Failed to publish the book:', error);
        res.status(500).json({ error: 'Failed to publish the book' });
    }
});

router.get(`${prefix}/AdminPublished-books/:adminId`, authenticateJWT, async(req, res) => {
    try {
        await publishService.getAdminPublishedBooks(req, res);
    } catch (error) {
        console.error('Error getting the book details', error);
        res.status(500).json({ error: 'Failed to get the details of the books'})
    }
})

router.get(`${prefix}/published-books`, async(req, res) => {
    try {
        await publishService.getpublishedBooks(req, res);
    } catch (error) {
        console.error('Error getting the book details', error);
        res.status(500).json({ error: 'Failed to get the details of the books'})
    }
})

// router.get(`${prefix}/edit/:bookId`, authenticateJWT, async (req, res) => {
//     try {
//         await publishService.getBookDetailsForEdit(req, res);
//     } catch (error) {
//         console.error('Error getting the book details for editing:', error);
//         res.status(500).json({ error: 'Failed to get the book details for editing' });        
//     }
// });

router.put(`${prefix}/edit-book/:bookId`, authenticateJWT, upload.single('file'), async (req, res) => {
    // console.log('req', req);
    try {
        await publishService.editBookDetails(req, res);
    } catch (error) {
        console.error('Error editing book details:', error);
        res.status(500).json({ error: 'Failed to edit book details' });        
    }
});

router.delete(`${prefix}/delete-book/:bookId`, authenticateJWT, async(req, res) => {
   try {
    await publishService.deleteBookDetails(req, res)
   } catch (error) {
    console.error('Error deleting the book');
    return res.status(500).json({error: 'Failed to delete the book'})
   }
});

router.get(`${prefix}/search`, async (req, res) => {
    try {
        await publishService.searchBook(req, res) 
    } catch (error) {
        console.error('Error searching the book!');
        return res.status(500).json({ error: 'Internal Server Error!'})
    }
})

// // Route to delete a book
// router.delete('/books/:bookId', authenticateUser, async (req, res) => {
//     try {
//         const book = await Book.findById(req.params.bookIdd);

//         // Verify that the authenticated user is the publisher of the book
//         if (String(book.publisher) !== String(req.user._id)) {
//             return res.status(403).json({ message: 'You are not authorized to delete this book' });
//         }

//         // Delete the book
//         await book.remove();

//         res.json({ message: 'Book deleted successfully' });
//     } catch (error) {
//         console.error('Error deleting book:', error);
//         res.status(500).json({ error: 'Internal server error' });
//     }
// });


module.exports = router;
