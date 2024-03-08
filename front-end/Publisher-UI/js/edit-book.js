document.addEventListener('DOMContentLoaded', () => {
    const editBookForm = document.getElementById('editBookForm');
    const messageDiv = document.getElementById('message');

    const urlParams = new URLSearchParams(window.location.search);
    const bookId = urlParams.get('id');

    console.log('editjsbookid',bookId);

    editBookForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        
        const bookTitle = document.getElementById('bookTitle').value;
        const bookAuthor = document.getElementById('bookAuthor').value;
        const genre = document.getElementById('genre').value;
        const description = document.getElementById('description').value;
        const bookImage = document.getElementById('bookImage').files[0];

        console.log('bookTitle, bookAuthor, bookImage', bookTitle, bookAuthor, bookImage);

        // const bookId = localStorage.getItem('bookId');
        const authToken = localStorage.getItem('token');

        try {
            const formData = new FormData();
            formData.append('book_title', bookTitle);
            formData.append('book_author', bookAuthor);
            formData.append('genre', genre);
            formData.append('description', description);
            formData.append('file', bookImage);

            const response = await fetch(`http://localhost:3000/home/edit-book/${bookId}`, {
                method: 'PUT',
                headers: {
                    'Authorization': authToken
                },
                body: formData
            });
            const data = await response.json();
            console.log('data', data);

            if (response.status === 200) {
                messageDiv.textContent = data.message;
            } else if (response.status === 403) {
                messageDiv.textContent = 'You are not authorized to edit this book.';
            } else {
                messageDiv.textContent = data.error;
            }
        } catch (error) {
            console.error('Error:', error);
            messageDiv.textContent = 'Failed to update book details';
        }
    });
});



    // Function to handle deleting a book
    // const handleDeleteBook = async (bookId) => {
    //     // Similar logic as handleEditBook
    //     // Make a DELETE request to delete the book
    // };

    // // Attach event listeners to delete icons
    // const deleteIcons = document.querySelectorAll('.delete-icon');
    // deleteIcons.forEach(deleteIcon => {
    //     deleteIcon.addEventListener('click', (event) => {
    //         const bookId = event.target.dataset.bookId;
    //         const bookAdminId = event.target.dataset.adminId;

    //         if (bookAdminId === adminId) {
    //             // Publisher can delete their own book
    //             handleDeleteBook(bookId);
    //         } else {
    //             // Display warning if trying to delete a book not belonging to them
    //             messageDiv.textContent = 'You are not authorized to delete this book.';
    //         }
    //     });
    // });