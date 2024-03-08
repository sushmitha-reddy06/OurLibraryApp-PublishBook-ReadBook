// fetch('http://localhost:3000/home/published-books')
//     .then(response => response.json())
//     .then(data => {
//         const publishedBooksList = document.getElementById('publishedBooks');

//         data.forEach(book => {
//             const listItem = document.createElement('li');
//             listItem.textContent = `Title: ${book.book_title}, Author: ${book.book_author}, ISBN: ${book.ISBN_code}`;
//             publishedBooksList.appendChild(listItem);
//         });
//     })

//     .catch(error => console.error('Error fetching published books:', error))

// fetch('http://localhost:3000/home/published-books')
//     .then(response => response.json())
//     .then(data => {
//         const publishedBooksList = document.getElementById('publishedBooks');

//         data.forEach(book => {
//             const listItem = document.createElement('li');
//             const editIcon = document.createElement('span');
//             const deleteIcon = document.createElement('span');

//             // Add edit icon
//             editIcon.innerHTML = '&#9998;'; // Unicode for edit icon
//             editIcon.style.cursor = 'pointer';
//             editIcon.addEventListener('click', () => editBook(book));

//             // Add delete icon
//             deleteIcon.innerHTML = '&#10060;'; // Unicode for delete icon
//             deleteIcon.style.cursor = 'pointer';
//             deleteIcon.addEventListener('click', () => deleteBook(book));

//             listItem.textContent = `Title: ${book.book_title}, Author: ${book.book_author}, ISBN: ${book.ISBN_code}`;
//             listItem.appendChild(editIcon);
//             listItem.appendChild(deleteIcon);

//             publishedBooksList.appendChild(listItem);
//         });
//     })
//     .catch(error => console.error('Error fetching published books:', error));


function editBook(bookId) {
    window.location.href = `edit.html?bookId=${bookId}`;
}

function deleteBook(bookId) {
  if (confirm('Are you sure you want to delete this Book?')) {
    fetch(`http://localhost:3000/delete/${bookId}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'bookId': bookId
        }
    })
    .then(response => {
        if (response.status == 200) {
            window.location.reload();
        } else {
            throw new Error('Failed to delte book')
        }
    })
    .catch(error => console.error('Error deleting book:', error));
  }
}

fetch('http://localhost:3000/home/published-books')
    .then(response => response.json())
    .then(data => {
        const publishedBooksList = document.getElementById('publishedBooks');

        data.forEach(book => {
            const listItem = document.createElement('li');
            const editIcon = document.createElement('span');
            const deleteIcon = document.createElement('span');

            // Add edit icon
            editIcon.innerHTML = '&#9998;'; // Unicode for edit icon
            editIcon.style.cursor = 'pointer';
            editIcon.addEventListener('click', () => editBook(book.bookId)); // Pass bookId to editBook function

            // Add delete icon
            deleteIcon.innerHTML = '&#10060;'; // Unicode for delete icon
            deleteIcon.style.cursor = 'pointer';
            deleteIcon.addEventListener('click', () => deleteBook(book.bookId)); // Pass bookId to deleteBook function

            listItem.textContent = `Title: ${book.book_title}, Author: ${book.book_author}, ISBN: ${book.ISBN_code}`;
            listItem.appendChild(editIcon);
            listItem.appendChild(deleteIcon);

            publishedBooksList.appendChild(listItem);
        });
    })
    .catch(error => console.error('Error fetching published books:', error));